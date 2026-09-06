import { test, expect } from "@playwright/test";

test.describe("Store API", () => {
  test("health endpoint is up", async ({ request }) => {
    const res = await request.get("/api/health");
    expect(res.ok()).toBeTruthy();
    await expect(res.json()).resolves.toMatchObject({ ok: true });
  });

  test("rejects a locked account without creating a session user", async ({ request }) => {
    const res = await request.post("/api/auth/login", {
      data: { email: "locked@kestrel.test", password: "Trailhead!23" },
    });
    expect(res.status()).toBe(403);
    await expect(res.json()).resolves.toMatchObject({ message: expect.stringMatching(/locked/i) });
  });
});
