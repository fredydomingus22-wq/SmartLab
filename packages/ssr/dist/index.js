const { createClient } = require("@supabase/supabase-js");

function createBrowserClient(url, anonKey, options) {
  return createClient(url, anonKey, options);
}

function createServerClient(url, anonKey, options) {
  return createClient(url, anonKey, options);
}

module.exports = { createBrowserClient, createServerClient };
