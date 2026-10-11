This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

The realtime server (`party/index.ts`) is a [PartyServer](https://github.com/cloudflare/partykit/tree/main/packages/partyserver) Durable Object on Cloudflare Workers, configured in `wrangler.jsonc`.

Run the realtime server and the Next.js app in two terminals:

```bash
pnpm party:dev   # wrangler dev --port 1999
pnpm dev         # next dev
```

The app connects to `NEXT_PUBLIC_PARTYKIT_HOST` (default `127.0.0.1:1999`). Open [http://localhost:3000](http://localhost:3000).

## Deploy

- Realtime server: `pnpm party:deploy` (`wrangler deploy`, needs `wrangler login`). It deploys the `kahuhu` Worker to `https://kahuhu.word-chain.workers.dev`.
- Front end: Vercel. Set `NEXT_PUBLIC_PARTYKIT_HOST` to the Worker host (no protocol), `kahuhu.word-chain.workers.dev`.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
