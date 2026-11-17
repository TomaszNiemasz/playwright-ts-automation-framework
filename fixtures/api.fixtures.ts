import { test as base, expect } from "@playwright/test";
import { BookingClient } from "../clients/BookingClient";
import { env } from "../config/env";
import { authResponseSchema } from "../schemas/booking.schema";

type ApiFixtures = {
  /** API client with automatic cleanup of the bookings created during the test. */
  bookingClient: BookingClient;
};

type ApiWorkerFixtures = {
  /** Auth token, fetched once per worker and shared by all tests running in that worker. */
  authToken: string;
};

export const test = base.extend<ApiFixtures, ApiWorkerFixtures>({
  authToken: [
    async ({ playwright }, use) => {
      const context = await playwright.request.newContext({
        baseURL: env.apiBaseUrl,
      });
      const response = await context.post("/auth", {
        data: {
          username: env.apiUser.username,
          password: env.apiUser.password,
        },
      });
      expect(response.status(), "POST /auth should succeed").toBe(200);
      // On bad credentials the API answers 200 with `{ reason }`, so the schema check is what catches it.
      const { token } = authResponseSchema.parse(await response.json());
      await context.dispose();
      await use(token);
    },
    { scope: "worker" },
  ],

  bookingClient: async ({ request, authToken }, use) => {
    const client = new BookingClient(request, authToken);
    await use(client);
    await client.cleanup();
  },
});

export { expect };
