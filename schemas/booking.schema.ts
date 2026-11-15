import { z } from 'zod';

export const bookingSchema = z.object({
  firstname: z.string(),
  lastname: z.string(),
  totalprice: z.number(),
  depositpaid: z.boolean(),
  bookingdates: z.object({
    checkin: z.iso.date(),
    checkout: z.iso.date(),
  }),
  additionalneeds: z.string().optional(),
});

/** TypeScript type derived from the schema, so payloads and responses can never drift apart. */
export type Booking = z.infer<typeof bookingSchema>;

/** Response of POST /booking: the booking is nested next to its generated id. */
export const createBookingResponseSchema = z.object({
  bookingid: z.number(),
  booking: bookingSchema,
});

/** Response of POST /auth on success. On bad credentials the API returns `{ reason }` instead. */
export const authResponseSchema = z.object({
  token: z.string(),
});
