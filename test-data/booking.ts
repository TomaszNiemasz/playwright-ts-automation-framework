import type { Booking } from "../schemas/booking.schema";

/** ISO date (YYYY-MM-DD) N days from today, so test data never ends up in the past. */
export function futureDate(daysFromToday: number): string {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() + daysFromToday);
  return date.toISOString().slice(0, 10);
}

/** Valid booking with sensible defaults. Override only what the given test cares about. */
export function buildBooking(overrides: Partial<Booking> = {}): Booking {
  return {
    firstname: "Jan",
    lastname: "Kowalski",
    totalprice: 150,
    depositpaid: true,
    bookingdates: {
      checkin: futureDate(30),
      checkout: futureDate(35),
    },
    additionalneeds: "Breakfast",
    ...overrides,
  };
}
