const http = require("http");
const fs = require("fs");
const path = require("path");
const { randomUUID, timingSafeEqual, scryptSync } = require("crypto");

const PORT = Number(process.env.PORT) || 3000;
const PUBLIC_DIR = path.join(__dirname, "public");
const PRODUCTS = JSON.parse(
  fs.readFileSync(path.join(__dirname, "data", "products.json"), "utf8")
);

const DEMO_PASSWORD = "Trailhead!23";
const users = [
  {
    id: "usr_standard",
    email: "standard@kestrel.test",
    name: "Mara Ellison",
    password: DEMO_PASSWORD,
    locked: false,
  },
  {
    id: "usr_locked",
    email: "locked@kestrel.test",
    name: "Reed Halden",
    password: DEMO_PASSWORD,
    locked: true,
  },
];

const sessions = new Map();
const orders = [];
const messages = [];

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
};

function parseCookies(header) {
  const out = {};
  if (!header) return out;
  for (const part of header.split(";")) {
    const idx = part.indexOf("=");
    if (idx === -1) continue;
    const key = part.slice(0, idx).trim();
    const value = decodeURIComponent(part.slice(idx + 1).trim());
    out[key] = value;
  }
  return out;
}

function sendJson(res, status, body, extraHeaders = {}) {
  const payload = JSON.stringify(body);
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    ...extraHeaders,
  });
  res.end(payload);
}

function sendError(res, status, message) {
  sendJson(res, status, { message });
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (chunk) => chunks.push(chunk));
    req.on("end", () => {
      const raw = Buffer.concat(chunks).toString("utf8");
      if (!raw) {
        resolve({});
        return;
      }
      try {
        resolve(JSON.parse(raw));
      } catch {
        reject(new Error("Invalid JSON"));
      }
    });
    req.on("error", reject);
  });
}

function cookieHeader(name, value, extras = "") {
  return `${name}=${encodeURIComponent(value)}; Path=/; SameSite=Lax${extras}`;
}

function ensureSession(req, res) {
  const cookies = parseCookies(req.headers.cookie);
  let sid = cookies.kestrel_sid;
  if (!sid || !sessions.has(sid)) {
    sid = randomUUID();
    sessions.set(sid, { id: sid, userId: null, cart: [] });
    res.setHeader("Set-Cookie", cookieHeader("kestrel_sid", sid, "; HttpOnly"));
  }
  return sessions.get(sid);
}

function publicUser(user) {
  if (!user) return null;
  return { id: user.id, email: user.email, name: user.name };
}

function sessionUser(session) {
  return users.find((u) => u.id === session.userId) || null;
}

function cartPayload(session) {
  const items = session.cart.map((line) => {
    const product = PRODUCTS.find((p) => p.id === line.productId);
    return {
      productId: line.productId,
      name: product ? product.name : "Unknown item",
      price: product ? product.price : 0,
      image: product ? product.image : "",
      quantity: line.quantity,
      lineTotal: product ? product.price * line.quantity : 0,
    };
  });
  const subtotal = items.reduce((sum, item) => sum + item.lineTotal, 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  return { items, subtotal, itemCount };
}

function filterProducts(url) {
  const q = (url.searchParams.get("q") || "").trim().toLowerCase();
  const category = (url.searchParams.get("category") || "").trim();
  const sort = url.searchParams.get("sort") || "featured";
  let list = PRODUCTS.slice();
  if (q) {
    list = list.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.blurb.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
    );
  }
  if (category && category !== "All") {
    list = list.filter((p) => p.category === category);
  }
  if (sort === "price-asc") list.sort((a, b) => a.price - b.price);
  else if (sort === "price-desc") list.sort((a, b) => b.price - a.price);
  else if (sort === "name") list.sort((a, b) => a.name.localeCompare(b.name));
  else list.sort((a, b) => Number(b.featured) - Number(a.featured));
  return list;
}

function safeEqual(a, b) {
  const left = Buffer.from(String(a));
  const right = Buffer.from(String(b));
  if (left.length !== right.length) {
    timingSafeEqual(scryptSync("x", "y", 16), scryptSync("x", "y", 16));
    return false;
  }
  return timingSafeEqual(left, right);
}

function serveStatic(req, res, url) {
  let pathname = decodeURIComponent(url.pathname);
  if (pathname === "/") pathname = "/index.html";
  const filePath = path.normalize(path.join(PUBLIC_DIR, pathname));
  if (!filePath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }
  fs.readFile(filePath, (err, data) => {
    if (err) {
      const fallback = path.join(PUBLIC_DIR, "index.html");
      if (pathname.endsWith(".html")) {
        res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
        res.end("<h1>Not found</h1>");
        return;
      }
      fs.readFile(fallback, (fallbackErr, html) => {
        if (fallbackErr) {
          res.writeHead(404);
          res.end("Not found");
          return;
        }
        res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
        res.end(html);
      });
      return;
    }
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, { "Content-Type": MIME[ext] || "application/octet-stream" });
    res.end(data);
  });
}

async function handleApi(req, res, url) {
  const session = ensureSession(req, res);
  const route = `${req.method} ${url.pathname}`;

  if (route === "GET /api/health") {
    sendJson(res, 200, { ok: true, service: "kestrel-outfitters" });
    return;
  }

  if (route === "GET /api/products") {
    sendJson(res, 200, { products: filterProducts(url) });
    return;
  }

  if (req.method === "GET" && url.pathname.startsWith("/api/products/")) {
    const id = url.pathname.split("/").pop();
    const product = PRODUCTS.find((p) => p.id === id);
    if (!product) {
      sendError(res, 404, "Product not found.");
      return;
    }
    sendJson(res, 200, { product });
    return;
  }

  if (route === "GET /api/categories") {
    const categories = [...new Set(PRODUCTS.map((p) => p.category))];
    sendJson(res, 200, { categories });
    return;
  }

  if (route === "POST /api/auth/login") {
    const body = await readBody(req);
    const email = String(body.email || "").trim().toLowerCase();
    const password = String(body.password || "");
    const user = users.find((u) => u.email === email);
    if (!user || !safeEqual(user.password, password)) {
      sendError(res, 401, "Email or password is incorrect.");
      return;
    }
    if (user.locked) {
      sendError(res, 403, "This account is locked. Visit a trailhead shop with ID.");
      return;
    }
    session.userId = user.id;
    sendJson(res, 200, { user: publicUser(user) });
    return;
  }

  if (route === "POST /api/auth/register") {
    const body = await readBody(req);
    const email = String(body.email || "").trim().toLowerCase();
    const name = String(body.name || "").trim();
    const password = String(body.password || "");
    if (!email || !name || password.length < 8) {
      sendError(res, 400, "Name, email, and an 8+ character password are required.");
      return;
    }
    if (users.some((u) => u.email === email)) {
      sendError(res, 409, "An account with that email already exists.");
      return;
    }
    const user = {
      id: `usr_${randomUUID().slice(0, 8)}`,
      email,
      name,
      password,
      locked: false,
    };
    users.push(user);
    session.userId = user.id;
    sendJson(res, 201, { user: publicUser(user) });
    return;
  }

  if (route === "POST /api/auth/logout") {
    session.userId = null;
    sendJson(res, 200, { ok: true });
    return;
  }

  if (route === "GET /api/auth/me") {
    sendJson(res, 200, { user: publicUser(sessionUser(session)) });
    return;
  }

  if (route === "GET /api/cart") {
    sendJson(res, 200, cartPayload(session));
    return;
  }

  if (route === "POST /api/cart/items") {
    const body = await readBody(req);
    const productId = String(body.productId || "");
    const quantity = Number(body.quantity || 1);
    const product = PRODUCTS.find((p) => p.id === productId);
    if (!product) {
      sendError(res, 404, "Product not found.");
      return;
    }
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 9) {
      sendError(res, 400, "Quantity must be between 1 and 9.");
      return;
    }
    const existing = session.cart.find((line) => line.productId === productId);
    if (existing) existing.quantity = Math.min(9, existing.quantity + quantity);
    else session.cart.push({ productId, quantity });
    sendJson(res, 200, cartPayload(session));
    return;
  }

  if (req.method === "DELETE" && url.pathname.startsWith("/api/cart/items/")) {
    const productId = url.pathname.split("/").pop();
    session.cart = session.cart.filter((line) => line.productId !== productId);
    sendJson(res, 200, cartPayload(session));
    return;
  }

  if (route === "POST /api/cart/clear") {
    session.cart = [];
    sendJson(res, 200, cartPayload(session));
    return;
  }

  if (route === "POST /api/checkout") {
    const user = sessionUser(session);
    if (!user) {
      sendError(res, 401, "Sign in to complete checkout.");
      return;
    }
    const cart = cartPayload(session);
    if (cart.items.length === 0) {
      sendError(res, 400, "Your cart is empty.");
      return;
    }
    const body = await readBody(req);
    const name = String(body.name || "").trim();
    const email = String(body.email || "").trim();
    const address = String(body.address || "").trim();
    const city = String(body.city || "").trim();
    const region = String(body.region || "").trim();
    const postal = String(body.postal || "").trim();
    if (!name || !email || !address || !city || !region || !postal) {
      sendError(res, 400, "All shipping fields are required.");
      return;
    }
    const order = {
      id: `KES-${String(orders.length + 1042).padStart(5, "0")}`,
      userId: user.id,
      items: cart.items,
      total: cart.subtotal,
      shipping: { name, email, address, city, region, postal },
      createdAt: new Date().toISOString(),
    };
    orders.push(order);
    session.cart = [];
    sendJson(res, 201, { order });
    return;
  }

  if (route === "POST /api/contact") {
    const body = await readBody(req);
    const name = String(body.name || "").trim();
    const email = String(body.email || "").trim();
    const topic = String(body.topic || "General").trim();
    const message = String(body.message || "").trim();
    if (!name || !email || !message) {
      sendError(res, 400, "Name, email, and a message are required.");
      return;
    }
    const entry = {
      id: randomUUID(),
      name,
      email,
      topic,
      message,
      createdAt: new Date().toISOString(),
    };
    messages.push(entry);
    sendJson(res, 201, {
      ok: true,
      reference: `NOTE-${messages.length + 220}`,
    });
    return;
  }

  sendError(res, 404, "Not found.");
}

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://${req.headers.host}`);
    if (url.pathname.startsWith("/api/")) {
      await handleApi(req, res, url);
      return;
    }
    serveStatic(req, res, url);
  } catch (err) {
    if (err.message === "Invalid JSON") {
      sendError(res, 400, "Request body must be JSON.");
      return;
    }
    console.error(err);
    sendError(res, 500, "Something went wrong.");
  }
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Kestrel Outfitters listening on http://127.0.0.1:${PORT}`);
});
