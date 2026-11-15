import * as dotenv from 'dotenv';

dotenv.config({ quiet: true });

/**
 * Single source of truth for environment-specific values.
 *
 * Defaults point at the public demo apps used in this framework
 * (SauceDemo and Restful-Booker) whose credentials are publicly documented,
 * so the suite runs with zero configuration. Override them via a local `.env`
 * file or via CI environment variables.
 *
 * `||` is used instead of `??` on purpose: an empty string coming from CI
 * should also fall back to the default.
 */
export const env = {
  uiBaseUrl: process.env.UI_BASE_URL || 'https://www.saucedemo.com',
  apiBaseUrl: process.env.API_BASE_URL || 'https://restful-booker.herokuapp.com',

  uiUser: {
    username: process.env.UI_USERNAME || 'standard_user',
    password: process.env.UI_PASSWORD || 'secret_sauce',
  },
  apiUser: {
    username: process.env.API_USERNAME || 'admin',
    password: process.env.API_PASSWORD || 'password123',
  },

  /** Slows every browser action down (ms). Handy for watching a test locally; keep at 0 on CI. */
  slowMo: Number(process.env.SLOWMO) || 0,
};
