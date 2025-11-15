# npm install troubleshooting

This project depends on public npm packages (Next.js 14, TailwindCSS 3.4, Supabase helpers, etc.).
If `npm install` fails with HTTP **403** errors when downloading packages (for example `403 Forbidden - GET https://registry.npmjs.org/autoprefixer`), it usually means a proxy or registry override is blocking outbound traffic.

The helper script below removes rogue proxy settings and reverts npm to the public registry. **Source** it so the environment variables are cleared in your current shell session:

```bash
source ./scripts/npm-reset-proxy.sh
npm config get registry  # should print https://registry.npmjs.org/
```

After resetting the proxy configuration, run a clean install:

```bash
rm -rf node_modules package-lock.json
npm install
```

## Checking package versions manually

All runtime dependencies pinned in [`package.json`](../package.json) are published on the public npm registry:

| Package | Expected version |
| ------- | ---------------- |
| `next` | `14.2.4` |
| `react` / `react-dom` | `18.3.1` |
| `react-hook-form` | `^7.51.5` |
| `recharts` | `^2.10.5` |
| `lucide-react` | `^0.395.0` |
| `zod` | `^3.23.8` |
| `tailwindcss` | `^3.4.3` |
| `autoprefixer` | `^10.4.19` |

You can double-check any entry with:

```bash
npm view <package-name> version
```

If the command above still returns a 403 error, confirm that the environment allows outbound HTTPS connections to `registry.npmjs.org` or configure the correct proxy credentials.
