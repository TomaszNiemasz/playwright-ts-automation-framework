import { test, expect } from '../../fixtures/api.fixtures';
import { bookingSchema, createBookingResponseSchema } from '../../schemas/booking.schema';
import { buildBooking } from '../../test-data/booking';
import { expectToMatchSchema } from '../../utils/assertions';

test.describe('Bookings API - CRUD', () => {
  test('POST /booking creates a booking', { tag: '@smoke' }, async ({ bookingClient }) => {
    const payload = buildBooking();

    const response = await bookingClient.create(payload);

    expect(response.status()).toBe(200);
    const body = await response.json();
    expectToMatchSchema(createBookingResponseSchema, body);
    expect(body.booking).toMatchObject(payload);
  });

  test('GET /booking/:id returns the created booking', async ({ bookingClient }) => {
    const payload = buildBooking({ firstname: 'Anna', lastname: 'Nowak' });
    const { id } = await bookingClient.createBooking(payload);

    const response = await bookingClient.get(id);

    expect(response.status()).toBe(200);
    const body = await response.json();
    expectToMatchSchema(bookingSchema, body);
    expect(body).toMatchObject(payload);
  });

  test('PUT /booking/:id replaces the booking', async ({ bookingClient }) => {
    const { id } = await bookingClient.createBooking(buildBooking());
    const updated = buildBooking({
      lastname: 'Updated',
      totalprice: 300,
      depositpaid: false,
      additionalneeds: 'Extra Pillow',
    });

    const response = await bookingClient.update(id, updated);

    expect(response.status()).toBe(200);
    const body = await response.json();
    expectToMatchSchema(bookingSchema, body);
    expect(body).toMatchObject(updated);

    // The change must be persisted, not only echoed back in the response.
    const persisted = await (await bookingClient.get(id)).json();
    expect(persisted).toMatchObject(updated);
  });

  test('PATCH /booking/:id changes only the given fields', async ({ bookingClient }) => {
    const original = buildBooking();
    const { id } = await bookingClient.createBooking(original);

    const response = await bookingClient.partialUpdate(id, { firstname: 'Anna', lastname: 'Nowak' });

    expect(response.status()).toBe(200);
    const body = await response.json();
    expectToMatchSchema(bookingSchema, body);
    expect(body.firstname).toBe('Anna');
    expect(body.lastname).toBe('Nowak');
    expect(body.totalprice).toBe(original.totalprice);
    expect(body.bookingdates).toEqual(original.bookingdates);
  });

  test('DELETE /booking/:id removes the booking', async ({ bookingClient }) => {
    const { id } = await bookingClient.createBooking(buildBooking());

    const response = await bookingClient.remove(id);

    // Restful-Booker answers 201 Created to a successful DELETE (a quirk of this demo API).
    expect(response.status()).toBe(201);
    const afterDelete = await bookingClient.get(id);
    expect(afterDelete.status()).toBe(404);
  });
});
