import { decryptSecret, encryptSecret } from "@/lib/encryption";
import { env } from "@/lib/env";
import { prisma } from "@/lib/prisma";

const api = "https://api.pinterest.com/v5";

export function pinterestAuthUrl(userId: string) {
  const params = new URLSearchParams({
    response_type: "code",
    client_id: env.PINTEREST_CLIENT_ID ?? "",
    redirect_uri: env.PINTEREST_REDIRECT_URI ?? "",
    scope: "boards:read,boards:write,pins:read,pins:write,user_accounts:read",
    state: userId
  });
  return `https://www.pinterest.com/oauth/?${params.toString()}`;
}

export async function exchangePinterestCode(code: string, userId: string) {
  const basic = Buffer.from(`${env.PINTEREST_CLIENT_ID}:${env.PINTEREST_CLIENT_SECRET}`).toString("base64");
  const res = await fetch(`${api}/oauth/token`, {
    method: "POST",
    headers: { Authorization: `Basic ${basic}`, "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ grant_type: "authorization_code", code, redirect_uri: env.PINTEREST_REDIRECT_URI ?? "" })
  });
  if (!res.ok) throw new Error(await res.text());
  const token = await res.json() as { access_token: string; refresh_token?: string; expires_in?: number; scope?: string };
  const me = await fetch(`${api}/user_account`, { headers: { Authorization: `Bearer ${token.access_token}` } }).then((r) => r.json()) as { username?: string; account_type?: string; id?: string };
  return prisma.pinterestAccount.upsert({
    where: { userId_pinterestUserId: { userId, pinterestUserId: me.id ?? me.username ?? userId } },
    update: { encryptedAccess: encryptSecret(token.access_token), encryptedRefresh: token.refresh_token ? encryptSecret(token.refresh_token) : undefined, scopes: token.scope, expiresAt: token.expires_in ? new Date(Date.now() + token.expires_in * 1000) : null, username: me.username },
    create: { userId, pinterestUserId: me.id ?? me.username ?? userId, username: me.username, encryptedAccess: encryptSecret(token.access_token), encryptedRefresh: token.refresh_token ? encryptSecret(token.refresh_token) : undefined, scopes: token.scope, expiresAt: token.expires_in ? new Date(Date.now() + token.expires_in * 1000) : null }
  });
}

export async function syncBoards(accountId: string) {
  const account = await prisma.pinterestAccount.findUniqueOrThrow({ where: { id: accountId } });
  const token = decryptSecret(account.encryptedAccess);
  const res = await fetch(`${api}/boards`, { headers: { Authorization: `Bearer ${token}` } });
  if (!res.ok) throw new Error(await res.text());
  const data = await res.json() as { items?: Array<{ id: string; name: string; description?: string; privacy?: string }> };
  const boards = data.items ?? [];
  for (const board of boards) {
    await prisma.board.upsert({
      where: { pinterestAccountId_pinterestBoardId: { pinterestAccountId: account.id, pinterestBoardId: board.id } },
      update: { name: board.name, description: board.description, privacy: board.privacy ?? "PUBLIC" },
      create: { pinterestAccountId: account.id, pinterestBoardId: board.id, name: board.name, description: board.description, privacy: board.privacy ?? "PUBLIC" }
    });
  }
  return boards;
}

export async function publishPin(pinId: string, accountId: string, boardId: string) {
  const [pin, account, board] = await Promise.all([
    prisma.generatedPin.findUniqueOrThrow({ where: { id: pinId }, include: { images: true } }),
    prisma.pinterestAccount.findUniqueOrThrow({ where: { id: accountId } }),
    prisma.board.findUniqueOrThrow({ where: { id: boardId } })
  ]);
  const image = pin.images[0];
  if (!image) throw new Error("Pin has no generated image");
  const token = decryptSecret(account.encryptedAccess);
  const res = await fetch(`${api}/pins`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ board_id: board.pinterestBoardId, title: pin.title, description: pin.description, link: pin.destinationUrl, media_source: { source_type: "image_url", url: image.cloudinaryUrl } })
  });
  if (!res.ok) throw new Error(await res.text());
  const created = await res.json() as { id: string };
  await prisma.generatedPin.update({ where: { id: pinId }, data: { status: "PUBLISHED", pinterestPinId: created.id, publishedAt: new Date() } });
  return created;
}
