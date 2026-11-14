import { z } from 'zod';

// Podstawowy schemat rezerwacji
export const bookingSchema = z.object({
  firstname: z.string(),
  lastname: z.string(),
  totalprice: z.number(),
  depositpaid: z.boolean(),
  bookingdates: z.object({
    checkin: z.string(),
    checkout: z.string(),
  }),
  additionalneeds: z.string().optional(),
});

// Schemat odpowiedzi z tworzenia rezerwacji (zagnieżdżony)
export const createBookingResponseSchema = z.object({
  bookingid: z.number(),
  booking: bookingSchema,
});
