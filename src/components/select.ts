import { defineComponent } from '@ktbsh/sdk';

/**
 * Native select (form-associated).
 *
 * Options are light-DOM `<option>` / `<optgroup>` children of the host.
 * They are **cloned into** the shadow `<select>` (not projected as a slot
 * inside `<select>`) so browsers populate the dropdown reliably.
 *
 * @example
 * ```html
 * <kitbash-select name="country" value="pl">
 *   <option value="">Choose…</option>
 *   <option value="pl">Poland</option>
 * </kitbash-select>
 * ```
 */
export default defineComponent({
  tag: 'kitbash-select',
  formAssociated: true,
  delegatesFocus: true,
  props: {
    name: { type: String, default: '' },
    value: { type: String, default: '' },
    disabled: { type: Boolean, default: false },
    required: { type: Boolean, default: false },
    invalid: { type: Boolean, default: false },
    size: { type: String, default: 'md' },
  },
  styles: `
    :host {
      display: inline-block;
      width: 100%;
      font-family: var(--kb-font-family-sans);
    }
    select {
      appearance: none;
      -webkit-appearance: none;
      box-sizing: border-box;
      width: 100%;
      min-height: 2.25rem;
      padding: var(--kb-space-sm) 2.5rem var(--kb-space-sm) var(--kb-space-md);
      border: 1px solid var(--kb-color-border-default);
      border-radius: var(--kb-radius-sm);
      background-color: var(--kb-color-bg-canvas);
      /* Custom chevron (token-colored) */
      background-image:
        linear-gradient(
          45deg,
          transparent 50%,
          var(--kb-color-accent-default) 50%
        ),
        linear-gradient(
          135deg,
          var(--kb-color-accent-default) 50%,
          transparent 50%
        ),
        linear-gradient(
          to right,
          transparent,
          transparent
        );
      background-position:
        calc(100% - 1.15rem) calc(50% - 0.1rem),
        calc(100% - 0.8rem) calc(50% - 0.1rem),
        100% 0;
      background-size:
        0.35rem 0.35rem,
        0.35rem 0.35rem,
        2.25rem 100%;
      background-repeat: no-repeat;
      color: var(--kb-color-fg-default);
      font-size: var(--kb-font-size-md);
      font-family: inherit;
      line-height: var(--kb-line-height-normal);
      cursor: pointer;
      outline: none;
      /* Tint native popup / OS chrome where supported */
      accent-color: var(--kb-color-accent-default);
      color-scheme: light dark;
      transition:
        border-color 0.12s ease,
        box-shadow 0.12s ease;
    }
    select:hover:not(:disabled) {
      border-color: var(--kb-color-accent-default);
    }
    :host([size="sm"]) select {
      min-height: 2rem;
      font-size: var(--kb-font-size-sm);
      padding: var(--kb-space-xs) 2.25rem var(--kb-space-xs) var(--kb-space-sm);
    }
    :host([size="lg"]) select {
      min-height: 2.75rem;
      font-size: var(--kb-font-size-lg);
    }
    select:focus {
      border-color: var(--kb-color-border-focus);
      box-shadow: var(--kb-focus-ring);
    }
    select:disabled {
      opacity: 0.55;
      cursor: not-allowed;
    }
    select[aria-invalid="true"] {
      border-color: var(--kb-color-danger-default);
    }
    /*
     * Option list: browsers only partially honor these (esp. hover).
     * Colors + flat radius still help terminal/default cohesion where applied.
     */
    option,
    optgroup {
      background-color: var(--kb-color-bg-canvas);
      color: var(--kb-color-fg-default);
      font-family: inherit;
    }
    option:checked,
    option:hover,
    option:focus {
      background-color: var(--kb-color-accent-subtle);
      color: var(--kb-color-accent-default);
    }
    optgroup {
      color: var(--kb-color-fg-muted);
      font-weight: var(--kb-font-weight-semibold);
    }
    /* Light-DOM options are cloned into <select>; keep the source slot out of layout */
    slot {
      display: none;
    }
  `,
  events: {
    'change select'(e: Event, { commit }) {
      const target = e.target as HTMLSelectElement;
      commit({
        props: { value: target.value },
      });
    },
    // Clone light-DOM options into the native select (slot-inside-select is unreliable).
    'slotchange slot'(e: Event) {
      const slot = e.target as HTMLSlotElement;
      const root = slot.getRootNode() as ShadowRoot;
      const select = root.querySelector('select');
      const host = root.host as HTMLElement & {
        value?: unknown;
        __kbSelectObs?: MutationObserver;
        __kbSyncSelect?: () => void;
      };
      if (!select || !host) return;

      const sync = () => {
        while (select.firstChild) {
          select.removeChild(select.firstChild);
        }
        const assigned = slot.assignedNodes({ flatten: true });
        for (const node of assigned) {
          if (node.nodeType !== 1) continue;
          const el = node as Element;
          const tag = el.tagName;
          if (tag === 'OPTION' || tag === 'OPTGROUP') {
            select.appendChild(el.cloneNode(true));
          }
        }
        // Live host value (do not close over event props snapshot)
        const next = typeof host.value === 'string' ? host.value : '';
        const options = select.options;
        let match = false;
        for (let i = 0; i < options.length; i++) {
          if (options[i].value === next) {
            match = true;
            break;
          }
        }
        if (match) {
          select.value = next;
        }
      };

      host.__kbSyncSelect = sync;
      sync();

      if (!host.__kbSelectObs) {
        const obs = new MutationObserver((mutations) => {
          // Ignore host attribute noise (value/disabled/…); watch option children
          const optionMutation = mutations.some(
            (m) => m.target !== host || m.type !== 'attributes',
          );
          if (optionMutation) {
            host.__kbSyncSelect?.();
          }
        });
        obs.observe(host, {
          childList: true,
          subtree: true,
          attributes: true,
          characterData: true,
        });
        host.__kbSelectObs = obs;
      }
    },
  },
  render({ props, html }) {
    return html`
      <select
        part="select-root"
        name=${props.name}
        .value=${props.value}
        ?disabled=${props.disabled}
        ?required=${props.required}
        aria-invalid=${props.invalid ? 'true' : 'false'}
      ></select>
      <slot></slot>
    `;
  },
});
