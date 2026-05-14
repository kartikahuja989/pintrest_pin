# Deployment Guide

## Railway

1. Create MySQL and Redis services.
2. Add `DATABASE_URL` and `REDIS_URL` to the app environment.
3. Run `npm run prisma:deploy` during deployment.
4. Run a separate Railway worker process with `npm run worker`.

## Vercel

1. Import the repository.
2. Add all variables from `.env.example`.
3. Set `DATABASE_URL` to Railway MySQL.
4. Set `REDIS_URL` to Railway Redis.
5. Deploy the web app with `npm run build`.

## Pinterest OAuth

Set Pinterest redirect URI to `${NEXTAUTH_URL}/api/pinterest/oauth/callback` and request scopes: `boards:read`, `boards:write`, `pins:read`, `pins:write`, `user_accounts:read`.

## Security Checklist

- Use strong `NEXTAUTH_SECRET` and `APP_ENCRYPTION_KEY`.
- Keep provider keys server-only.
- Enforce HTTPS in production.
- Rotate Pinterest tokens when users reconnect.
- Run workers in a private environment with Redis access.
