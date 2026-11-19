# Fit Mom 20

**A simple 20-minute daily plan for busy moms to feel fit again.**

No gym. No equipment. No guilt. Just 20 minutes a day.

## What's Inside

| Feature | Description |
|---------|-------------|
| Landing Page | Clean marketing page with pricing & FAQ |
| Auth | Email + Google sign-in via Firebase |
| Onboarding Quiz | 7 questions → personalized plan |
| Plan Generator | 4-week workout + meal plan based on quiz answers |
| Dashboard | Today's workout, progress tracker, water & weight log |
| Payments | Stripe checkout (test mode) |

> [!NOTE]
> The plan generator uses smart templates. You can later swap it for a Gemini AI API for even more personalization.

---

## How to Run on Your Computer

### Step 1: Install Node.js

1. Go to [https://nodejs.org](https://nodejs.org)
2. Download the **LTS** version (the green button)
3. Install it — just click "Next" through the installer
4. To check it worked, open **Command Prompt** and type:
   ```
   node --version
   ```
   You should see something like `v20.x.x`

### Step 2: Set Up Firebase (Free)

1. Go to [https://console.firebase.google.com](https://console.firebase.google.com)
2. Click **"Create a project"** → name it `fit-mom-20` → click through
3. Once created, click the **web icon** `</>` to add a web app
4. Name it `fit-mom-20` → click **Register app**
5. You'll see a code block with `firebaseConfig` — **copy the values** (apiKey, authDomain, etc.)
6. In the left sidebar, click **Authentication** → **Get started**
   - Enable **Email/Password**
   - Enable **Google** (enter your email as the support email)
7. In the left sidebar, click **Firestore Database** → **Create database**
   - Choose **Start in test mode** → pick a location → click **Create**

### Step 3: Set Up Stripe (Free Test Account)

1. Go to [https://dashboard.stripe.com/register](https://dashboard.stripe.com/register) and create an account
2. Make sure you're in **Test mode** (toggle at the top)
3. Go to **Developers** → **API keys**
   - Copy the **Publishable key** (starts with `pk_test_`)
   - Copy the **Secret key** (starts with `sk_test_`)
4. Go to **Products** → **Add product**
   - Name: `Fit Mom 20 Monthly Plan`
   - Price: `499` INR, **Recurring** (monthly)
   - Click **Save product**
   - Click on the price → copy the **Price ID** (starts with `price_`)

### Step 4: Create Your .env.local File

1. In the `fit-mom-20` folder, copy `.env.local.example` to `.env.local`
2. Open `.env.local` and fill in ALL your keys from Firebase and Stripe:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...your_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=fit-mom-20.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=fit-mom-20
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=fit-mom-20.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef

NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PRICE_ID=price_...
```

### Step 5: Run It!

Open a terminal in the `fit-mom-20` folder and run:

```bash
npm install
npm run dev
```

Then open your browser and go to: **http://localhost:3000**

> [!TIP]
> To test the Stripe payment, use the test card number: `4242 4242 4242 4242`, any future expiry date, any 3-digit CVC, and any ZIP code.

---

## How to Put It Online (Deploy)

The easiest way to deploy is using **Vercel** (the company that makes Next.js). It's free for personal projects.

### Step 1: Push Code to GitHub

1. Go to [https://github.com](https://github.com) and create an account (or sign in)
2. Click **New repository** → name it `fit-mom-20` → make it **Private** → click **Create**
3. Open a terminal in the `fit-mom-20` folder and run:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/fit-mom-20.git
git push -u origin main
```

### Step 2: Deploy on Vercel

1. Go to [https://vercel.com](https://vercel.com) and sign up with your GitHub account
2. Click **"Add New Project"**
3. Find your `fit-mom-20` repository and click **Import**
4. Under **Environment Variables**, add ALL the same variables from your `.env.local` file:
   - `NEXT_PUBLIC_FIREBASE_API_KEY` → your value
   - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` → your value
   - ... (add all of them)
   - `STRIPE_SECRET_KEY` → your value
   - `STRIPE_PRICE_ID` → your value
5. Click **Deploy**
6. Wait 1–2 minutes — Vercel will give you a URL like `fit-mom-20.vercel.app`

### Step 3: Update Firebase for Your Live URL

1. Go to Firebase Console → **Authentication** → **Settings** → **Authorized domains**
2. Add your Vercel URL (e.g., `fit-mom-20.vercel.app`)

### Step 4: (Optional) Connect a Custom Domain

1. Buy a domain like `fitmom20.com` from [Namecheap](https://namecheap.com) or [Google Domains](https://domains.google)
2. In Vercel → your project → **Settings** → **Domains** → add your domain
3. Follow Vercel's instructions to point your domain's DNS to Vercel

> [!IMPORTANT]
> **Before going live with real payments:**
> 1. Switch Stripe from TEST mode to LIVE mode
> 2. Update the Stripe keys in Vercel's environment variables to the LIVE keys
> 3. Create a new LIVE price ID and update that too
> 4. Set up Firestore security rules (see below)

### Firestore Security Rules (for production)

Go to Firebase Console → Firestore → Rules, and replace with:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

This ensures users can only read/write their own data.

---

## Project Structure

```
fit-mom-20/
├── src/
│   ├── app/
│   │   ├── page.tsx              ← Landing page
│   │   ├── layout.tsx            ← Root layout
│   │   ├── globals.css           ← Global styles
│   │   ├── login/page.tsx        ← Login page
│   │   ├── signup/page.tsx       ← Signup page
│   │   ├── onboarding/page.tsx   ← Quiz (7 steps)
│   │   ├── checkout/page.tsx     ← Payment page
│   │   ├── checkout/success/page.tsx ← Payment verification
│   │   ├── dashboard/page.tsx    ← Member dashboard
│   │   └── api/
│   │       ├── create-checkout-session/route.ts
│   │       ├── verify-payment/route.ts
│   │       └── generate-plan/route.ts
│   ├── lib/
│   │   ├── firebase.ts           ← Firebase setup
│   │   ├── stripe.ts             ← Stripe setup
│   │   └── planGenerator.ts      ← Workout & meal generator
│   └── context/
│       └── AuthContext.tsx        ← Auth state management
├── .env.local.example            ← Template for environment variables
├── package.json
├── tailwind.config.ts
└── README.md
```

---

## Tech Stack

- **Next.js 14** — React framework
- **Tailwind CSS** — Styling
- **Firebase** — Auth + Firestore database
- **Stripe** — Payments (test mode)
- **TypeScript** — Type safety

## License

Private project. All rights reserved.
