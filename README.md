# Clerk Custom Auth Component — README

This repository contains a small Next.js + TypeScript example of custom authentication flows built on top of Clerk. It is intentionally componentized so you can modify and replace the hooks and UI to create your own sign-in and sign-up experiences.

This README explains the project layout, describes the hooks and components you can extend, gives small implementation contracts and examples, and lists recommended tests and quality gates.

## Quick start

Prerequisites: Node.js (>=22), pnpm, and a Clerk account with API keys configured for your app.

1. Install dependencies:

```bash
pnpm install
```

2. Run the app in development:

```bash
pnpm dev
```

3. Open http://localhost:3000 and use the sign-in / sign-up pages.

Note: This repo is a UI wrapper around Clerk flows — you must configure Clerk environment variables as you would in any Next.js app (see your Clerk dashboard). If you don't have keys set, the UI will still compile but authentication calls will fail.

## Checklist (requirements extracted)
- Provide a detailed README explaining how to modify / create hooks and components for sign-in / sign-up. — Done
- Describe hook and component contracts (inputs/outputs). — Done
- Provide examples, edge cases, tests and run instructions. — Done

If any of the above items need more detail, tell me which part you'd like expanded and I'll update this file.

## Project structure (where to look)

- `src/components/` — UI and composite components.
  - `sign-in/` — `signin-form.tsx`, `reset-password-form.tsx`
  - `sign-up/` — `signup-form.tsx`
  - `ui/` — small primitive components: `button.tsx`, `input.tsx`, `label.tsx`, `card.tsx`, `password-input.tsx`, `dropdown-menu.tsx`
  - `oauth-button.tsx`, `navbar.tsx`, `theme-*` and helpers
- `src/hooks/` — logic hooks you should extend or replace.
  - `sign-in/` — `use-sign-in.ts`, `use-reset-password.ts`
  - `sign-up/` — `use-signup-flow.ts`
  - `use-error-message.ts` — shared error parsing and messaging

Treat `components` as presentation and `hooks` as behavior/state. You can safely replace any file with your own implementation as long as you keep its public contract.

## Hook contracts (recommended)

Below are simple contracts you can follow when implementing or swapping hooks. Keep the shape consistent so the existing components keep working.

- useSignIn (file: `src/hooks/sign-in/use-sign-in.ts`)
  - Inputs: none (or a small options object { redirectUrl?: string })
  - Returns: {
    - signIn: (credentials: { email?: string; password?: string; otp?: string }) => Promise<void>
    - isLoading: boolean
    - error: Error | null
    - clearError: () => void
  }
  - Behavior: signIn should call Clerk sign-in APIs, set isLoading, capture errors and present them in `error` using `use-error-message`.

- useResetPassword (file: `src/hooks/sign-in/use-reset-password.ts`)
  - Inputs: none
  - Returns: {
    - reset: (email: string) => Promise<void>
    - isLoading: boolean
    - success: boolean
    - error: Error | null
  }

- useSignupFlow (file: `src/hooks/sign-up/use-signup-flow.ts`)
  - Inputs: none
  - Returns: {
    - signup: (data: { email?: string; password?: string; firstName?: string; lastName?: string }) => Promise<void>
    - isLoading: boolean
    - error: Error | null
  }

These are recommended shapes — if you change them, update the components in `src/components/sign-in` and `src/components/sign-up` accordingly.

## How to create or modify a hook

1. Pick a file in `src/hooks/` and open it.
2. Keep side effects (API calls to Clerk) inside the hook. Components should call hook functions and only render state.
3. Use the contract above. If you need different data, pass an options object to the hook and document it.
4. Reuse `use-error-message.ts` to normalize error text shown in the UI.

Example skeleton for a new hook (`src/hooks/sign-in/use-sign-in.custom.ts`):

```ts
// ...existing code...
import { useState } from 'react'

export function useSignInCustom() {
  const [isLoading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  async function signIn({ email, password }: { email?: string; password?: string }) {
    setLoading(true)
    setError(null)
    try {
      // call Clerk SDK / your auth API here
      // await clerkClient.signIn({ email, password })
    } catch (err) {
      setError(err as Error)
    } finally {
      setLoading(false)
    }
  }

  return { signIn, isLoading, error, clearError: () => setError(null) }
}

// ...existing code...
```

Drop this file in `src/hooks/sign-in/` and update the component that imports the original hook to import your custom hook instead.

## How to modify or create components

- UI primitives live in `src/components/ui/`. Prefer to modify these if you want a global theme change.
- Higher-level forms live in `src/components/sign-in` and `src/components/sign-up`. They import hooks from `src/hooks`.

To replace a form component, edit `signin-form.tsx` or create your own `my-signin-form.tsx` and wire up the hook:

```tsx
// ...existing code...
import { useSignIn } from '@/hooks/sign-in/use-sign-in'

export default function MySignInForm() {
  const { signIn, isLoading, error } = useSignIn()

  // render inputs and call signIn on submit
}

// ...existing code...
```

If you change a hook's return shape, update the component imports accordingly.

## Error handling and UX

- Centralize error parsing in `src/hooks/use-error-message.ts`. It should convert Clerk errors into human-friendly messages.
- Show loading states on submit buttons.
- Show success/confirmation screens for actions like password reset.

## Tests and quality gates

Recommended quick checks before merging changes:

- Type-check: `pnpm -w -s tsc --noEmit` or `pnpm build`
- Linting: `pnpm lint` (if you have ESLint set up)
- Manual smoke: run `pnpm dev`, navigate to sign-in and sign-up flows and exercise success and error paths.

Suggested unit tests (examples):

- Hooks: test that `signIn` sets `isLoading` and returns expected `error` on failure. Mock Clerk SDK.
- Components: render `signin-form` with a mocked hook to ensure form calls `signIn` with correct payload.

If you add or change public hook exports, update tests to import the new names.

## Edge cases & guidance

- Empty input: validate client-side and prevent API calls when fields are empty.
- Network failures: surfacing a friendly message (use `use-error-message`).
- Rate-limits: map 429 responses to a throttled UI state.
- Accessibility: ensure form labels are associated with inputs, buttons have aria attributes, and keyboard navigation works.

## Example: add social OAuth button

1. Add a small component in `src/components` (e.g., `my-oauth.tsx`) that calls Clerk's OAuth start endpoint.
2. Reuse `src/components/oauth-button.tsx` styles or import the UI primitives.

## Recommended next steps (small, low-risk improvements)

- Add unit tests for `use-signup-flow.ts` and `use-sign-in.ts`.
- Add storybook stories for the form components to visually test form states.
- Add a CONTRIBUTING.md that documents commit and branch rules for this repo.

## Where to get help

- If you use Clerk, their docs and examples are an excellent reference.
- If you want, I can generate example test files, a storybook setup, or specific hook implementations (e.g., OTP flow). Tell me which piece you want next.

---

If you want this README tailored further (shorter, more code examples, or a template to copy/paste for new hooks), say which format you prefer and I'll update it.
This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
