#!/usr/bin/env bash
# Builds the Next.js app via OpenNext, then re-bundles its Workers-style
# worker.js (which has unresolved relative imports across several files)
# into a single self-contained script using Wrangler's own esbuild step,
# and places it as _worker.js inside the OpenNext assets directory so
# Cloudflare Pages (Advanced Mode) picks it up as the SSR handler.
#
# Why this two-step dance: @opennextjs/cloudflare's documented target is
# Cloudflare Workers (main + [assets] binding config), not Pages. Pages
# expects a single bundled _worker.js sitting inside the static output
# directory. A naive file copy doesn't work because worker.js imports
# several sibling files by relative path that live outside that directory.
set -euo pipefail

echo "==> Building Next.js app via OpenNext..."
npx @opennextjs/cloudflare build

echo "==> Bundling worker.js into a single self-contained script..."
BUNDLE_DIR=".open-next/.pages-bundle"
rm -rf "$BUNDLE_DIR"
npx wrangler deploy --config wrangler.bundle.toml --dry-run --outdir="$BUNDLE_DIR" > /dev/null

echo "==> Installing bundled worker as _worker.js for Cloudflare Pages..."
cp "$BUNDLE_DIR/worker.js" .open-next/assets/_worker.js
rm -rf "$BUNDLE_DIR"

echo "==> Generating _routes.json so static files bypass the worker..."
node -e "
const fs = require('fs');
const path = require('path');
const dir = '.open-next/assets';
const exclude = ['/_next/static/*'];
for (const entry of fs.readdirSync(dir)) {
  if (entry === '_worker.js' || entry === '_next' || entry === 'BUILD_ID') continue;
  const full = path.join(dir, entry);
  exclude.push(fs.statSync(full).isDirectory() ? \`/\${entry}/*\` : \`/\${entry}\`);
}
fs.writeFileSync(path.join(dir, '_routes.json'), JSON.stringify({ version: 1, include: ['/*'], exclude }, null, 2));
console.log('_routes.json exclude rules:', exclude);
"

echo "==> Build ready for Cloudflare Pages: .open-next/assets"
