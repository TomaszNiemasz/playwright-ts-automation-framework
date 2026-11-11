import { test, expect } from '@playwright/test';

test.describe('Restful Booker API Tests', () => {

  // 1. Test zapytania GET (Pobranie ID rezerwacji)
  test('should get booking IDs successfully', async ({ request }) => {
    const response = await request.get('https://restful-booker.herokuapp.com/booking');
    
    // Sprawdzamy status HTTP
    expect(response.status()).toBe(200);
    
    // Sprawdzamy, czy odpowiedź to JSON i czy tablica nie jest pusta
    const body = await response.json();
    expect(body.length).toBeGreaterThan(0);
  });

  // 2. Test zapytania POST (Tworzenie nowej rezerwacji)
  test('should create a new booking successfully', async ({ request }) => {
    const response = await request.post('https://restful-booker.herokuapp.com/booking', {
      headers: {
        'Content-Type': 'application/json'
      },
      data: {
        "firstname": "Jan",
        "lastname": "Kowalski",
        "totalprice": 150,
        "depositpaid": true,
        "bookingdates": {
            "checkin": "2026-12-01",
            "checkout": "2026-12-05"
        },
        "additionalneeds": "Breakfast"
      }
    });

    // Sprawdzamy status HTTP
    expect(response.status()).toBe(200);

    // Sprawdzamy, czy odpowiedź zawiera utworzoną rezerwację dla Jana
    const body = await response.json();
    expect(body.booking.firstname).toBe('Jan');
    expect(body.booking.lastname).toBe('Kowalski');
  });

});
