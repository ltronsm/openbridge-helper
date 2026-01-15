# openbridge-helper

A lightweight **DX (Developer Experience) helper** for OpenBridge React projects.

`openbridge-helper` provides a **typed, discoverable, and tree‑shakable import layer** on top of `@oicl/openbridge-webcomponents-react`, solving one very concrete problem:

> Deep import paths make icons and components hard to discover, hard to autocomplete, and tedious to maintain.

This package generates and re‑exports all OpenBridge **icons (`Obi*`)** and **components (`Obc*`)** behind a single, clean entrypoint.

---

## Why this exists

### The problem

Using OpenBridge React today typically looks like this:

```ts
import { ObiApplications } from "@oicl/openbridge-webcomponents-react/icons/icon-applications";
import { ObcNavigationMenu } from "@oicl/openbridge-webcomponents-react/components/navigation-menu/navigation-menu";
```

This has a few drawbacks:

* Deep and inconsistent import paths
* No reliable VS Code autocomplete
* Hard to explore what icons/components actually exist
* Easy to get paths wrong

### The solution

With `openbridge-helper`:

```ts
import { ObiApplications, ObcNavigationMenu } from "./openbridge-helper";
```

Benefits:

* ✅ Full autocomplete in VS Code
* ✅ One import surface
* ✅ No runtime overhead
* ✅ Tree‑shakable
* ✅ Zero re‑implementation of OpenBridge components

---

## What this package is (and is not)

### ✅ What it *is*

* A **thin re‑export layer** on top of OpenBridge React
* Automatically generated exports for:

  * All `Obi*` icons
  * All `Obc*` components
* Pure ESM, no side effects

### ❌ What it is *not*

* Not a wrapper around OpenBridge components
* Not a new design system
* Not a runtime abstraction
* Not opinionated about layout or architecture

---

## Installation

You must already have OpenBridge installed:

```bash
npm install @oicl/openbridge-webcomponents-react
```

Then install the helper:

```bash
npm install openbridge-helper
```

After installation, run to create the export mappings:

```bash
npx openbridge-helper
```

This will generate `src/openbridge-helper/index.ts` and automatically add the directory to your `.gitignore`.

If you update OpenBridge and need to refresh the exports:

```bash
npx openbridge-helper --refresh
```


If you are using JIP or unreleased OpenBridge versions distributed via GitHub Packages,
follow the official OpenBridge installation instructions before using this helper.

## OpenBridge package compatibility

`openbridge-helper` does not bundle OpenBridge itself.

It works with any supported OpenBridge React package installed in your project.
Currently supported:

- `@oicl/openbridge-webcomponents-react` (stable npm releases)
- `@ocean-industries-concept-lab/openbridge-webcomponents-react` (JIP / beta releases via GitHub Packages)

The helper automatically detects which package is installed and generates exports accordingly.

If no supported OpenBridge package is found, the generator will fail with a clear error message.


---

## Usage

### Named imports (recommended)

```ts
import { ObiApplications, ObiSettings } from "./openbridge-helper";
import { ObcNavigationMenu } from "./openbridge-helper";
```

This gives the best tree‑shaking and the clearest intent.

---

### Namespace import

```ts
import * as OB from "./openbridge-helper";

<OB.ObiApplications />
<OB.ObcNavigationMenu />
```

This still tree‑shakes correctly as long as your bundler supports ESM tree‑shaking (Vite, Rollup, Webpack 5+).

> **Note:** If your project uses path aliases (e.g., `@/` for `src/`), you can import from `@/openbridge-helper` instead of `./openbridge-helper`.

---

## Tree‑shaking guarantees

`openbridge-helper` is designed to be safe and efficient by default:

* ESM only
* No default exports
* No dynamic exports
* No side effects

```json
{
  "type": "module",
  "sideEffects": false
}
```

Only the icons and components you actually use will be included in the final bundle.

---

## How it works

The package contains a small generator script that:

1. Scans `@oicl/openbridge-webcomponents-react` recursively
2. Detects all exported symbols starting with:

   * `Obi` → icons
   * `Obc` → components
3. Generates explicit re‑exports

Example generated output:

```ts
export { ObiApplications } from "@oicl/openbridge-webcomponents-react/icons/icon-applications";
export { ObcNavigationMenu } from "@oicl/openbridge-webcomponents-react/components/navigation-menu/navigation-menu";
```

This generated file can then be imported from your local project.

---

## Versioning strategy

`openbridge-helper` follows **semantic versioning** and is intended to track OpenBridge closely.

Typical strategy:

* Patch/minor releases for helper changes
* Updates when OpenBridge adds, removes, or renames exports

Always check the OpenBridge version compatibility in `peerDependencies`.

---

## Roadmap / Pipeline (non‑breaking, optional)

The current scope is intentionally small and focused.

Possible future additions (not implemented):

* CLI utilities for OpenBridge projects
* Code generation helpers (e.g. `App.tsx` scaffolding)
* Project templates

These will only be added if they do **not** compromise the simplicity and safety of the core import helper.

---

## Contributing

Contributions are welcome, especially if:

* OpenBridge changes its internal structure
* New icons or components are not detected correctly
* The generator script can be made more robust

The guiding principle is:

> **Improve developer experience without adding runtime cost.**

---

## License

MIT
