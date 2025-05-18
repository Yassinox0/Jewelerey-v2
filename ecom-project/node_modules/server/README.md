# E-Commerce Server

This is the server component for the e-commerce application.

## Setup

1. Install dependencies:
```
npm install
```

2. Set up your environment variables:
   - Copy the `.env.example` file to create a new `.env` file:
   ```
   cp .env.example .env
   ```
   - Or run the script to generate it:
   ```
   node create-env.js
   ```

3. Edit the `.env` file and replace the placeholder values with your actual credentials:
```
PORT=5000
STRIPE_SECRET_KEY=your_stripe_secret_key
CLIENT_URL=http://localhost:3000
JWT_SECRET=your_jwt_secret_key
```

4. Start the server:
```
npm run dev
```

## Security Notes

### Environment Variables
- **NEVER commit your `.env` file to version control**
- **NEVER expose your Stripe secret key or JWT secret**
- The `.env` file is included in `.gitignore` to prevent accidental commits
- GitHub automatically scans repositories for exposed API keys and secrets

### Stripe Keys
- Use test keys during development (`sk_test_...`)
- Use live keys only in production environments
- Stripe keys that start with `sk_` should always be kept secret
- If you accidentally expose a key, rotate it immediately in the Stripe dashboard

## Stripe Integration

The server integrates with Stripe for payment processing. To use Stripe:

1. Create a Stripe account at [stripe.com](https://stripe.com)
2. Get your API keys from the Stripe dashboard
3. Add your secret key to the `.env` file
4. Test the integration using Stripe's test cards:
   - Card number: 4242 4242 4242 4242
   - Expiry date: Any future date
   - CVC: Any 3 digits
   - ZIP: Any 5 digits 