# PinFashion AI

Production-ready Pinterest fashion automation SaaS built with Next.js 15, TypeScript, Tailwind CSS, shadcn-style UI, Framer Motion-ready structure, NextAuth, Prisma, MySQL, OpenAI, Replicate, Cloudinary, BullMQ, Redis, and Pinterest API.

## Features

- Product link scraper for Amazon, Flipkart, Myntra, and EarnKaro.
- AI Pinterest titles, descriptions, tags, hashtags, and board suggestions.
- Faceless 1000x1500 image generation prompts for flat lays, cropped outfits, hidden-face mirror selfies, and editorial collages.
- AI outfit builder for pants, shoes, accessories, watches, and aesthetics.
- Bulk CSV generation via BullMQ and Redis.
- Pinterest OAuth, board sync, immediate publish, scheduling, retries.
- Analytics data model for clicks, saves, impressions, outbound clicks, and CTR.
- MySQL-only Prisma schema and `schema.sql` mirror.

## Folder Structure

```txt
app/                 Next.js App Router pages and API routes
components/          SaaS shell, workflow components, shadcn-style UI
config/              Product and site constants
hooks/               Client hooks
lib/                 Auth, Prisma, security, queues, providers, validators
prisma/              MySQL Prisma schema
prompts/             AI prompt builders
scripts/             Worker and zip export scripts
services/            Scraper, AI, image, Pinterest, Cloudinary, outfit services
types/               Shared TypeScript types
utils/               CSV helpers
workers/             BullMQ processors
docs/                Architecture documentation
```

## Local Setup

```bash
npm install
cp .env.example .env
npm run prisma:migrate
npm run dev
```

Run workers in another terminal:

```bash
npm run worker
```

## CSV Format

```csv
url,affiliateUrl
https://www.amazon.in/example,https://ekaro.in/example
https://www.flipkart.com/example,
```

## Zip Export

```bash
npm run zip
```

The zip file is written to `pinfashion-ai.zip`.
