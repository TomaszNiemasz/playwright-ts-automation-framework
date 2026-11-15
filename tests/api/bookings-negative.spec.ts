import type { APIResponse } from '@playwright/test';
import type { BookingClient } from '../../clients/BookingClient';
import { test, expect } from '../../fixtures/api.fixtures';
import { buildBooking } from '../../test-data/booking';

type NoAuth = { auth: false };

/** Operations that require a valid token, each one sent WITHOUT it. */
const protectedOperations: {
  method: string;
  send: (client: BookingClient, id: number, options: NoAuth) => Promise<APIResponse>;
}[] = [
  { method: 'PUT', send: (client, id, options) => client.update(id, buildBooking(), options) },
  { method: 'PATCH', send: (client, id, options) => client.partialUpdate(id, { firstname: 'Hacker' }, options) },
  { method: 'DELETE', send: (client, id, options) => client.remove(id, options) },
];

test.describe('Bookings API - negative scenarios', () => {
  for (const { method, send } of protectedOperations) {
    test(`${method} /booking/:id without a token is forbidden`, async ({ bookingClient }) => {
      const { id } = await bookingClient.createBooking(buildBooking());

      const response = await send(bookingClient, id, { auth: false });

      expect(response.status()).toBe(403);
    });
  }

  test('PUT /booking/:id with an invalid token is forbidden', async ({ bookingClient }) => {
    const { id } = await bookingClient.createBooking(buildBooking());

    const response = await bookingClient.update(id, buildBooking(), { token: 'invalid-token' });

    expect(response.status()).toBe(403);
  });

  test('GET /booking/:id for a non-existent id returns 404', async ({ bookingClient }) => {
    const response = await bookingClient.get(999_999_999);

    expect(response.status()).toBe(404);
  });

  test('POST /booking with missing required fields is rejected', async ({ bookingClient }) => {
    const response = await bookingClient.create({ firstname: 'Jan' });

    // Restful-Booker answers with 500 here, while a well-behaved API would answer 400.
    // The assertion stays tolerant on purpose: what matters is that invalid data is not accepted.
    expect(response.ok()).toBe(false);
  });

  test('POST /auth with wrong credentials does not return a token', async ({ request }) => {
    const response = await request.post('/auth', {
      data: { username: 'admin', password: 'wrong-password' },
    });

    // Restful-Booker answers 200 with a "reason" instead of 401 (another quirk of this demo API).
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.token).toBeUndefined();
    expect(body.reason).toBe('Bad credentials');
  });
});
