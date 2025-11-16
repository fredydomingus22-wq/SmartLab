const { Buffer } = require("buffer");

function decodeUserCookie(value) {
  if (!value) return null;
  try {
    const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
    const json = Buffer.from(padded, "base64").toString("utf-8");
    return JSON.parse(json);
  } catch (error) {
    console.warn("Failed to decode Supabase mock cookie", error);
    return null;
  }
}

function readUserFromCookiesAdapter(cookiesAdapter) {
  if (!cookiesAdapter || typeof cookiesAdapter.get !== "function") {
    return null;
  }
  const raw = cookiesAdapter.get("sb-mock-user");
  return decodeUserCookie(raw);
}

function readUserFromDocumentCookies() {
  if (typeof document === "undefined" || !document.cookie) {
    return null;
  }
  const cookie = document.cookie
    .split(";")
    .map((entry) => entry.trim())
    .find((entry) => entry.startsWith("sb-mock-user="));
  if (!cookie) {
    return null;
  }
  const [, value] = cookie.split("=");
  return decodeUserCookie(value);
}

class MockSupabaseAuthApi {
  constructor(context) {
    this.context = context;
  }

  async getSession() {
    const user = this._resolveUser();
    return { data: { session: user ? { user } : null }, error: null };
  }

  async getUser() {
    const user = this._resolveUser();
    return { data: { user }, error: null };
  }

  _resolveUser() {
    if (this.context?.cookiesAdapter) {
      return readUserFromCookiesAdapter(this.context.cookiesAdapter);
    }
    if (typeof window !== "undefined") {
      return readUserFromDocumentCookies();
    }
    return null;
  }
}

class MockSupabaseClient {
  constructor(url, anonKey, options = {}) {
    this.supabaseUrl = url;
    this.anonKey = anonKey;
    this.options = options;
    this.auth = new MockSupabaseAuthApi({
      cookiesAdapter: options.cookies,
    });
  }

  from() {
    throw new Error(
      "The local Supabase mock does not implement data queries. Replace it with the official SDK when network access is available."
    );
  }

  rpc() {
    throw new Error(
      "The local Supabase mock does not implement RPC calls. Replace it with the official SDK when network access is available."
    );
  }
}

function createClient(url, anonKey, options) {
  return new MockSupabaseClient(url, anonKey, options);
}

module.exports = { createClient };
