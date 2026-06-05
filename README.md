# 💖 Trisha Exchange™

> The only stock market where friendship is the currency.

A birthday gift web application — a gamified friendship market where friends compete to fulfill Trisha's wishes, earn friendship points, and grow their stock value.

---

## Stack

- **React 18** + **TypeScript** + **Vite**
- **TailwindCSS** — design system & responsive layout
- **Framer Motion** — animations & page transitions
- **Firebase Auth** — Google Sign-In
- **Firebase Firestore** — real-time database
- **React Router v6** — client-side routing
- **Lucide Icons**

---

## Setup

### 1. Clone & Install

```bash
git clone https://github.com/YOUR_USERNAME/trisha-exchange.git
cd trisha-exchange
npm install
```

### 2. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable **Authentication → Google** sign-in
4. Create a **Firestore Database** (start in test mode, then apply rules below)
5. Register a **Web App** and copy the config

### 3. Configure Environment Variables

```bash
cp .env.example .env
```

Fill in `.env`:

```env
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
VITE_ADMIN_EMAIL=trisha@gmail.com
```

### 4. Apply Firestore Security Rules

Open `firestore.rules`, replace `REPLACE_WITH_ADMIN_EMAIL` with Trisha's actual email, then deploy:

```bash
npm install -g firebase-tools
firebase login
firebase init firestore
firebase deploy --only firestore:rules
```

### 5. Run Locally

```bash
npm run dev
```

---

## Deployment (GitHub Pages)

The included workflow (`.github/workflows/deploy.yml`) auto-deploys on every push to `main`.

1. Push to GitHub
2. Go to **Settings → Pages → Source → GitHub Actions**
3. Add Firebase config as **Repository Secrets** (Settings → Secrets → Actions):
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`
   - `VITE_ADMIN_EMAIL`
4. Push to `main` — deploys automatically.

> **Note:** The `base` in `vite.config.ts` is `/trisha-exchange/`. Change it if your GitHub repo name differs.

---

## Firestore Schema

### `users/{uid}`
| Field | Type | Notes |
|-------|------|-------|
| name | string | Google display name |
| email | string | Google email |
| photoURL | string | Google avatar |
| points | number | Starts at 100 |
| stockValue | number | 100 + points |
| joinedAt | timestamp | First login |

### `wishes/{id}`
| Field | Type | Notes |
|-------|------|-------|
| title | string | Wish text |
| description | string | Optional details |
| category | string | Food / Coffee / etc. |
| status | open \| claimed \| fulfilled | State |
| claimedBy / claimedByName | string \| null | Claimer |
| fulfilledBy / fulfilledByName | string \| null | Fulfiller |

### `activities/{id}`
| Field | Type | Notes |
|-------|------|-------|
| type | ActivityType | wish_claimed / wish_fulfilled / etc. |
| userId / userName / userPhotoURL | string | Actor |
| wishId / wishTitle | string \| null | Related wish |
| points | number \| null | Points awarded |
| timestamp | timestamp | When it happened |

---

## Points System

| Action | Points |
|--------|--------|
| Claim a wish | +5 |
| Fulfill a wish | +20 |
| First fulfillment of the day | +10 bonus |
| Birthday gift | +50 |

**Stock formula:** `stockValue = 100 + points`

---

## Roles

- **Admin (Trisha):** Set via `VITE_ADMIN_EMAIL`. Full CRUD on wishes. Admin dashboard.
- **Friends:** Claim open wishes, fulfill claimed wishes, compete on leaderboard.
