import { test, expect } from '@playwright/test';

const API_BASE_URL = 'https://restful-booker.herokuapp.com';

test.describe('Restful-Booker API CRUD Tests', () => {
  let bookingId: number;
  let token: string;

  // Autoryzacja - pobranie tokena przed testami modyfikacji
  test.beforeAll(async ({ request }) => {
    const response = await request.post(`${API_BASE_URL}/auth`, {
      data: {
        username: 'admin',
        password: 'password123'
      }
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    token = body.token;
    expect(token).toBeDefined();
  });

  // CREATE (POST) - Tworzenie nowej rezerwacji
  test('should create a new booking', async ({ request }) => {
    const response = await request.post(`${API_BASE_URL}/booking`, {
      data: {
        firstname: 'Jan',
        lastname: 'Kowalski',
        totalprice: 150,
        depositpaid: true,
        bookingdates: {
          checkin: '2026-06-01',
          checkout: '2026-06-10'
        },
        additionalneeds: 'Breakfast'
      }
    });

    expect(response.status()).toBe(200);
    const body = await response.json();
    
    // Zapisanie ID nowo utworzonej rezerwacji do zmiennej globalnej testu
    bookingId = body.bookingid;
    expect(bookingId).toBeDefined();
    expect(body.booking.firstname).toBe('Jan');
  });

  // READ (GET) - Pobieranie rezerwacji po ID
  test('should get the created booking by id', async ({ request }) => {
    // Upewniamy się, że poprzedni test przekazał ID (lub hardkodujemy fallback do testów niezależnych)
    // W Playwright najlepiej testy pisać niezależnie, więc możemy stworzyć rezerwację wewnątrz testu lub użyć przed chwilą utworzonej.
    // Dla demonstracji zróbmy szybkie utworzenie w teście:
    const createRes = await request.post(`${API_BASE_URL}/booking`, {
      data: {
        firstname: 'Anna',
        lastname: 'Nowak',
        totalprice: 200,
        depositpaid: false,
        bookingdates: {
         checkin: '2026-07-01',
         checkout: '2026-07-05'
        }
      }
    });
    const createBody = await createRes.json();
    const id = createBody.bookingid;

    const response = await request.get(`${API_BASE_URL}/booking/${id}`);
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.firstname).toBe('Anna');
  });

  // DELETE (DELETE) - Usunięcie rezerwacji
  test('should delete a booking', async ({ request }) => {
    // Stworzenie rezerwacji do usunięcia
    const createRes = await request.post(`${API_BASE_URL}/booking`, {
      data: {
        firstname: 'Do',
        lastname: 'Usuniecia',
        totalprice: 100,
        depositpaid: true,
        bookingdates: {
          checkin: '2026-08-01',
          checkout: '2026-08-02'
        }
      }
    });
    const createBody = await createRes.json();
    const id = createBody.bookingid;

    // Usunięcie z użyciem nagłówka Cookie z tokenem autoryzacyjnym
    const deleteRes = await request.delete(`${API_BASE_URL}/booking/${id}`, {
      headers: {
        Cookie: `token=${token}`
      }
    });

    // Restful-Booker zwraca status 201 Created przy udanym usunięciu
    expect(deleteRes.status()).toBe(201);
  });

  // UPDATE (PUT) - Modyfikacja istniejącej rezerwacji
  test('should update an existing booking', async ({ request }) => {
    // Stworzenie rezerwacji do edycji
    const createRes = await request.post(`${API_BASE_URL}/booking`, {
      data: {
        firstname: 'Jan',
        lastname: 'Stary',
        totalprice: 100,
        depositpaid: true,
        bookingdates: {
          checkin: '2026-09-01',
          checkout: '2026-09-05'
        },
        additionalneeds: 'None'
      }
    });
    const createBody = await createRes.json();
    const id = createBody.bookingid;

    // Wysłanie PUT z nowymi danymi (zmiana nazwiska na 'Nowak' i ceny na 300)
    const updateRes = await request.put(`${API_BASE_URL}/booking/${id}`, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Cookie': `token=${token}` // Wymagany token autoryzacyjny uzyskany w beforeAll
      },
      data: {
        firstname: 'Jan',
        lastname: 'Nowak', // Zmienione nazwisko
        totalprice: 300,   // Zmieniona cena
        depositpaid: false,
        bookingdates: { checkin: '2026-09-01', checkout: '2026-09-05' },
        additionalneeds: 'Extra Pillow'
      }
    });

    // Weryfikacja zmian
    expect(updateRes.status()).toBe(200);
    const updatedBody = await updateRes.json();
    expect(updatedBody.lastname).toBe('Nowak');
    expect(updatedBody.totalprice).toBe(300);
    expect(updatedBody.additionalneeds).toBe('Extra Pillow');
  });

});
