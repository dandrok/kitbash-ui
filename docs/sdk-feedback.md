# Feedback for `@ktbsh/sdk` (from kitbash-ui)

Living notes from building the design system as a **real consumer**.  
When something is painful, missing, or workaround-heavy, capture it here so SDK work can be prioritized.

**How to use**

- Add rows under the right priority when we hit a new issue.
- Prefer: short title, what we needed, what we did instead, suggested SDK direction.
- Do **not** put secrets or private repo paths unrelated to SDK APIs.

**Related:** kitbash-sdk [SUPPORTED.md](file:///home/dandrok/git/kitbash-sdk/docs/SUPPORTED.md), [AGENTS.md](file:///home/dandrok/git/kitbash-sdk/docs/AGENTS.md), [TODO.md](file:///home/dandrok/git/kitbash-sdk/docs/TODO.md).

---

## Priority legend

| P | Meaning |
|---|---------|
| **P0** | Blocks correct a11y/forms for production DS components |
| **P1** | Forces awkward workarounds or fragile code in every app |
| **P2** | DX friction / nice API improvements |
| **P3** | Future / optional |

---

## P0 — correctness / a11y / forms

### 1. No component lifecycle hooks

**Need:** Run logic after open/render (modal focus trap, focus first control, mount `MutationObserver` cleanly, measure layout).

**Today:** Only `render` + `events`. No `connected` / `disconnected` / `updated` / `onPropChange` in the authoring config.

**Workaround:** Host click/key handlers; `MutationObserver` stuck on first `slotchange`; document “app must focus modal panel”.

**SDK idea:** Optional hooks that are **not** stringified (or are generated as real methods on the class), e.g.:

```ts
defineComponent({
  connected(host) { … },
  disconnected(host) { … },
  updated(host, { props, prevProps }) { … },
})
```

---

### 2. Form-associated `setFormValue` ignores checkbox/switch checked state

**Need:** Unchecked checkbox/switch must not submit `value` (or should submit `null`).

**Today:** Validity / form value path is effectively value-centric (`required && !value`). Checkbox `value` defaults to `"on"` so it stays “filled” when unchecked.

**Workaround:** Documented limitation; apps trust `kitbash-change` / `checked` prop.

**SDK idea:** For boolean controls, `setFormValue(checked ? value : null)` (or a `formValue` callback / `getFormValue(props, state)`).

---

### 3. Event map key format is easy to get wrong

**Need:** Reliable declarative events.

**Today:** Keys are `'eventName selector'` (`split(' ')` → first token event, rest selector). Authors often write `'button click'` by mistake.

**Workaround:** Dual review + comments in components.

**SDK idea:**

- Typed helper: `on('click', 'button', handler)` or object `{ type: 'click', selector: 'button', handle }`
- Or compile-time / runtime warning when `eventName` is a tag name (`button`, `input`, `select`)

---

### 4. `render` / `events` cannot share module helpers (serialization)

**Need:** DRY helpers (`normalizePage`, `resolveVariant`) used in both `render` and handlers.

**Today:** Functions are `.toString()`’d into generated output — outer imports/closures break at runtime.

**Workaround:** Duplicate small conditionals in every site.

**SDK idea:**

- Allow a `utils` bag that is bundled (not stringified) into the class, or  
- AST-based emit that can resolve pure functions from the same file, or  
- Generate from TS source with a real bundler step instead of `toString()`

---

## P1 — workarounds we repeat

### 5. Static Build-Time State Serialization (Stale/Shared State Initializers)

**Need:** Dynamically initialize component state on instance creation (e.g. generating unique IDs using `Math.random()` or matching timestamps for accessibility attributes like `aria-describedby` or `aria-controls`).

**Today:** The compiler executes `JSON.stringify(config.state || {})` at build-time. Any dynamic expression in `state` is evaluated on the build machine. Consequently, every runtime instance of the component shares the exact same hardcoded value.

**Workaround:** Avoid state-level dynamic properties and force consumers to assign unique `id`s manually to nested elements.

**SDK idea:** Allow `state` to be initialized via a function context executed in the constructor:
```ts
state(host) {
  return {
    id: `kb-input-${Math.random().toString(36).substr(2, 9)}`
  };
}
```

---

### 6. Hardcoded Validation Logic in Form Association

**Need:** Custom validation rules (e.g. validating email patterns, minimum/maximum lengths, matching passwords) and localized error messages.

**Today:** The compiler injects a hardcoded `syncFormState()` method that checks only `this._props.invalid` and `this._props.required`. There is no extension point to provide custom validity constraints.

**Workaround:** Validation must be bypassed or run manually outside the SDK's `formAssociated` system.

**SDK idea:** Expose a `validate` callback in the config that runs inside the component's validity check loop:
```ts
defineComponent({
  validate(ctx) {
    if (ctx.props.type === 'email' && !validateEmail(ctx.props.value)) {
      return { valid: false, message: 'Invalid email address format.' };
    }
    return { valid: true };
  }
})
```

---

### 7. Native form controls + Shadow DOM gaps

| Control | Issue | UI workaround |
|---------|--------|----------------|
| **Radio group** | Same `name` does not group across shadow roots | Manual uncheck peers (walk light + shadow), same `form` only |
| **Label `for`** | Does not associate into another CE’s shadow input | Click-to-focus + docs; or native wrap |
| **`<select>` + slotted `<option>`** | Unreliable (esp. WebKit) | Clone options into shadow `<select>` + `MutationObserver` |
| **`type="submit"` button in shadow** | Inner shadow button is not a submitter of the light-DOM form | Resolve **host** (light DOM), then `host.closest('form')?.requestSubmit()` / `reset()` — *not* `button.closest('form')` (stops at shadow boundary) |

**SDK ideas:**

- First-class **radio group** helper or context  
- Documented patterns or primitives for label association  
- Select options API (`options: { value, label }[]`) as alternative to light-DOM children  
- `formAssociated` button submit/reset behavior built-in

---

### 8. Handler context has no explicit `host` / `shadowRoot`

**Need:** Clean access to host element in events without `getRootNode().host` gymnastics.

**Today:** Only `props`, `state`, `commit`, `setProps`, `setState` (+ `html` in render).

**Workaround:** Event handlers must run `(e.currentTarget.getRootNode() as ShadowRoot).host`.

**SDK idea:** Extend context:

```ts
{ props, state, commit, host, shadowRoot, internals? }
```

---

### 9. Build picks up `*.test.ts` under `components/`

**Need:** Co-located unit tests next to components.

**Today:** `kitbash build` imports all component files; tests explode (`describe` outside runner).

**Workaround:** Keep tests outside `src/components/` (e.g. `src/*.test.ts`).

**SDK idea:** Ignore `**/*.{test,spec}.*` (and maybe `**/__tests__/**`) when discovering components.

---

### 10. Controlled re-render + native inputs

**Need:** Clear contract for `.value` / `.checked` property binding vs attribute vs form state.

**Today:** Works for text inputs with `.value=${}`; external property sets don’t emit `kitbash-change` (good). Edge cases around radio/select still need care.

**Workaround:** Document standard best practices.

**SDK idea:** Short authoring guide section + runtime assert in dev for common footguns.

---

## P2 — DX improvements

### 11. React Wrapper TypeScript Union Type Loss

**Need:** Public TypeScript unions (e.g., `variant: 'primary' | 'secondary' | 'ghost' | 'danger'` or `size: 'sm' | 'md' | 'lg'`) reflected in React components for full autocomplete and safety.

**Today:** React codegen outputs raw primitive types (`string`, `boolean`, `number`) for all wrapper props based on primitive constructor mappings.

**Workaround:** Manually document unions in shared types files and ignore wrapper autocompletion issues.

**SDK idea:** Support literal union mappings in configuration props metadata or allow typing overrides for wrappers in the config:
```ts
props: {
  variant: { type: String, default: 'primary', typeOverride: 'KitbashButtonVariant' }
}
```

---

### 12. Full Event Rebinding on Every Update Loop

**Need:** Optimize event handling for performance and prevent race conditions or dropped event frames during rapid renders (e.g., text area typing).

**Today:** The runtime's `update()` method calls `this.cleanupEvents()` followed by `this.bindEvents()` on every single DOM update. This completely detaches and re-attaches all event listeners on each render.

**Workaround:** Avoid heavy interactions or rapid state commits inside component events, keeping render cycles as lightweight as possible.

**SDK idea:** Implement event delegation at the Shadow Root level (binding a single listener per event type to the shadow host) instead of calling `querySelectorAll` and adding individual element listeners.

---

### 13. Dev ESM Transitive Import Caching

**Need:** Fast rebuilds in `kitbash dev` that recognize changes to nested utility files.

**Today:** `kitbash dev` cache-busts entries (`?t=`), but files imported *by* the component are cached by the browser/runtime, making changes to utility code invisible without forcing an entrypoint file edit.

**Workaround:** Save/touch the component file to trigger cache busting.

**SDK idea:** Track a complete dependency graph during watch mode and invalidate all parent components when an imported utility changes.

---

### 14. React wrapper naming / events

**Need:** Stable exported names and form events.

**Today:** React wrappers generated per file; `onKitbashChange` is the bridge. Fine for now.

**SDK idea:** Configurable export name; optional `onChange` alias for form controls.

---

### 15. Svelte / Vue

**Need:** First-class wrappers or types.

**Today:** Use vanilla CE (documented).

**SDK idea:** Optional Svelte action helpers or `custom-elements.json` enrichment only (keep CE as Svelte path).

---

### 16. Tokens pipeline

**Need:** Multi-brand / DTCG JSON → CSS vars → kitbash inject.

**Today:** DS owns `semantic.ts` → generate CSS + `tokens.json`; kitbash flattens JSON to `:host` vars.

**Workaround:** Rely on custom build scripts.

**SDK idea:** Document token JSON shape; optional nested → CSS var naming guarantee; support `tokens` as ESM export of a map.

---

## P3 — future

- HMR / `kitbash dev` with a small preview server  
- Object/array props (if ever) with non-attribute reflection  
- Built-in focus trap utility for dialogs  
- Dev-mode warnings for reverse event keys, missing `part`, empty `role=status`  
- Source maps for compiled vanilla output  
- Strip intermediate `*.src.js` files from final publish directory

---

## What already works well (keep)

| Strength | Why it matters for the DS |
|----------|---------------------------|
| Single `defineComponent` → vanilla + React + CEM | True multi-framework delivery |
| `commit` one render + one `kitbash-change` | Controlled forms without double updates |
| External prop set without change event | Parent-driven state |
| Constructable stylesheets + uhtml pin | Performance / stability |
| CSS variables inherit into shadow | Theming without piercing |
| `delegatesFocus` / `formAssociated` hooks | Platform-native form path |
| Bun-native authoring | Fast TS load without separate transpile |

---

## How kitbash-ui should treat this list

1. Prefer **workarounds in UI** that stay KISS until SDK ships a fix.  
2. When a workaround is large (select clone, radio group walk), leave a **short comment** in the component + a row here.  
3. When opening SDK PRs, link this file (`docs/sdk-feedback.md`) or copy the relevant P0/P1 item.

---

## Changelog of notes

| Date | Note |
|------|------|
| 2026-07-19 | Extended list covering static state initializers, validity constraints, React union types, and event rebinding loops. |
| 2026-07-19 | Initial list from primitives → navigation waves in kitbash-ui |
