# Sokoni Kenya — Design System Reference

This documents the visual language already in use across the app, plus the
token layer added to back the shadcn/Radix UI primitives in `src/components/ui/*`.
Nothing here changes business logic, APIs, or data — it's a reference for
staying consistent as new screens are built.

## Color tokens

Defined as HSL CSS variables in `src/app/globals.css` (light in `:root`, dark in `.dark`),
consumed via Tailwind in `tailwind.config.ts` (`bg-primary`, `bg-card`, `border-border`, etc).

| Token | Light | Dark | Use |
|---|---|---|---|
| `--primary` | `24 95% 53%` (brand orange, `#f97316`) | same | CTAs, links, active states |
| `--background` / `--foreground` | white / near-black | near-black / near-white | page background, base text |
| `--card` / `--card-foreground` | white | dark slate | card surfaces |
| `--secondary` / `--muted` | light gray | dark gray | secondary surfaces, subdued text |
| `--accent` | tinted orange | tinted orange | hover/active backgrounds |
| `--destructive` | red | red | delete/error actions |
| `--border` / `--input` | light gray | dark gray | hairlines, form borders |
| `--ring` | brand orange | brand orange | focus rings |

These were previously referenced by `button.tsx`, `card.tsx`, `switch.tsx`, etc.
but never defined — those components rendered without real color. Fixed in
this pass without touching the components themselves.

Outside the shadcn primitives, most of the app uses raw Tailwind utilities
directly (`bg-orange-500`, `text-gray-900 dark:text-white`, etc.) rather than
the token layer. That's fine — both systems share the same brand orange — but
new shared components should prefer the token classes (`bg-primary`,
`text-muted-foreground`) so they automatically pick up future theme tweaks.

## Typography

No custom type scale — uses Tailwind defaults. Observed hierarchy in practice:

| Role | Classes |
|---|---|
| Page hero | `text-5xl lg:text-6xl font-black` |
| Section heading | `text-2xl font-black` |
| Card title | `text-sm font-bold` |
| Body | `text-sm` / `text-xs` for secondary |
| Price | `font-black text-orange-500` |

## Spacing & layout

- Page container: `container mx-auto px-4 max-w-7xl`
- Section rhythm: `space-y-8` between homepage sections
- Card padding: `p-3` (grid), `p-4`–`p-6` (larger panels)
- Border radius: `--radius: 0.75rem` → `rounded-xl` is the default card/button radius; `rounded-2xl`/`rounded-3xl` for larger hero/CTA panels

## Shadows

Tailwind defaults only: `shadow-sm` at rest, `shadow-md` on hover for cards.
No custom shadow scale needed yet — flag if a denser dashboard UI later needs one.

## Components

- **ProductCard** (`src/components/product-card.tsx`) — single source of truth
  for listing cards. Supports `grid` | `list` | `compact` views via the `view`
  prop. Used by `/listings`; should be reused for any future featured rails,
  related-listings sections, or seller storefronts rather than re-implementing
  the card markup.
- **shadcn/Radix primitives** (`src/components/ui/*`) — button, card, dialog,
  dropdown-menu, select, tabs, toast, etc. Now correctly themed via the token
  layer above.

## Known inconsistencies (not fixed in this pass, flagged for later)

- The WhatsApp support number (`254701059192`) is hardcoded in ~9 files
  (footer, navbar, support, admin, seller, buyer pages). Centralized as
  `SUPPORT_WHATSAPP_NUMBER` in `src/lib/constants.ts` for new code; existing
  call sites left untouched to keep this change additive.
- No listing detail page exists yet — `ProductCard` intentionally doesn't link
  anywhere until that ships, to avoid shipping dead links.
