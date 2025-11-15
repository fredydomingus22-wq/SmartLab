#!/usr/bin/env bash
# Usage: source ./scripts/npm-reset-proxy.sh

if [[ "${BASH_SOURCE[0]}" == "$0" ]]; then
  echo "[warn] This script must be sourced so proxy variables are cleared in your current shell." >&2
fi

npm config delete proxy >/dev/null 2>&1 || true
npm config delete https-proxy >/dev/null 2>&1 || true
npm config delete http-proxy >/dev/null 2>&1 || true
npm config delete strict-ssl >/dev/null 2>&1 || true

unset HTTP_PROXY HTTPS_PROXY NO_PROXY http_proxy https_proxy no_proxy \
  npm_config_proxy npm_config_https_proxy npm_config_http_proxy

npm config set registry https://registry.npmjs.org/ >/dev/null

npm config get registry
npm config get proxy
npm config get https-proxy
