import type { APIRequestContext, APIResponse } from '@playwright/test';
import { createBookingResponseSchema, type Booking } from '../schemas/booking.schema';

type RequestOptions = {
  /** Set to false to send the request without any auth token (for negative tests). */
  auth?: boolean;
  /** Use a different token than the valid one (for negative tests). */
  token?: string;
};

/**
 * Thin wrapper around the Restful-Booker /booking endpoints.
 *
 * Rules of this class:
 *  - it only sends requests and returns the raw response; assertions stay in the tests,
 *  - it remembers every booking it creates and deletes them in `cleanup()`,
 *    so tests leave no garbage behind on the shared public API.
 */
export class BookingClient {
  private readonly createdIds: number[] = [];

  constructor(
    private readonly request: APIRequestContext,
    private readonly token: string,
  ) {}

  // Builds headers, by default sends a token that can be replaced in negative tests
  private headers(options: RequestOptions = {}): Record<string, string> {
    const headers: Record<string, string> = { Accept: 'application/json' };
    if (options.auth !== false) {
      headers.Cookie = `token=${options.token ?? this.token}`;
    }
    return headers;
  }

  // Creates a booking, intentionally accepts an object so that incomplete data can be provided in a negative test
  async create(payload: object): Promise<APIResponse> {
    const response = await this.request.post('/booking', { data: payload });
    if (response.ok()) {
      const body = await response.json().catch(() => undefined);
      if (typeof body?.bookingid === 'number') {
        this.createdIds.push(body.bookingid);
      }
    }
    return response;
  }

  /** Arrange-step helper: creates a booking and returns its id. Throws if the setup fails. */
  async createBooking(payload: Booking): Promise<{ id: number; booking: Booking }> {
    const response = await this.create(payload);
    if (!response.ok()) {
      throw new Error(`Test setup failed: POST /booking returned ${response.status()}`);
    }
    const body = createBookingResponseSchema.parse(await response.json());
    return { id: body.bookingid, booking: body.booking };
  }

  get(id: number): Promise<APIResponse> {
    return this.request.get(`/booking/${id}`);
  }

  update(id: number, payload: Booking, options?: RequestOptions): Promise<APIResponse> {
    return this.request.put(`/booking/${id}`, {
      data: payload,
      headers: this.headers(options),
    });
  }

  partialUpdate(
    id: number,
    payload: Partial<Booking>,
    options?: RequestOptions,
  ): Promise<APIResponse> {
    return this.request.patch(`/booking/${id}`, {
      data: payload,
      headers: this.headers(options),
    });
  }

  // After deletion removes the ID from the saved list
  async remove(id: number, options?: RequestOptions): Promise<APIResponse> {
    const response = await this.request.delete(`/booking/${id}`, {
      headers: this.headers(options),
    });
    if (response.ok()) {
      const index = this.createdIds.indexOf(id);
      if (index !== -1) this.createdIds.splice(index, 1);
    }
    return response;
  }

  /** Deletes everything this client created and has not deleted yet. Never throws. */
  async cleanup(): Promise<void> {
    for (const id of [...this.createdIds]) {
      await this.remove(id).catch(() => undefined);
    }
  }
}
