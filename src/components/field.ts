import { defineComponent } from '@ktbsh/sdk';

/**
 * Form field layout: label + control slot + optional hint/error.
 *
 * Place the control in the default slot (e.g. `kitbash-input`).
 * Wire control `id` + label association yourself, or put a native
 * `<label>` wrapping the control in the slot.
 *
 * When `error` is set, message uses `role="alert"` for assertive AT feedback.
 */
export default defineComponent({
  tag: 'kitbash-field',
  props: {
    label: { type: String, default: '' },
    hint: { type: String, default: '' },
    error: { type: String, default: '' },
    required: { type: Boolean, default: false },
  },
  styles: `
    :host {
      display: block;
      font-family: var(--kb-font-family-sans);
      color: var(--kb-color-fg-default);
    }
    .root {
      display: flex;
      flex-direction: column;
      gap: var(--kb-space-xs);
      width: 100%;
      box-sizing: border-box;
    }
    .label {
      font-size: var(--kb-font-size-sm);
      font-weight: var(--kb-font-weight-medium);
      line-height: var(--kb-line-height-normal);
    }
    .req {
      color: var(--kb-color-danger-default);
      font-weight: var(--kb-font-weight-semibold);
      margin-left: var(--kb-space-2xs);
    }
    .control {
      width: 100%;
    }
    .hint {
      margin: 0;
      font-size: var(--kb-font-size-sm);
      color: var(--kb-color-fg-muted);
      line-height: var(--kb-line-height-normal);
    }
    .error {
      margin: 0;
      font-size: var(--kb-font-size-sm);
      color: var(--kb-color-danger-default);
      line-height: var(--kb-line-height-normal);
      font-weight: var(--kb-font-weight-medium);
    }
    .root[data-invalid] .label {
      color: var(--kb-color-danger-default);
    }
    .label {
      cursor: default;
    }
  `,
  events: {
    // Focus first focusable control in the default slot (may be nested in stack)
    'click .label'(e: Event) {
      const root = (e.currentTarget as HTMLElement).getRootNode() as ShadowRoot;
      const slot = root.querySelector('slot');
      if (!slot) return;
      const assigned = slot.assignedElements({
        flatten: true,
      }) as HTMLElement[];
      const selector =
        'input, select, textarea, button, [tabindex], kitbash-input, kitbash-select, kitbash-textarea, kitbash-checkbox, kitbash-radio, kitbash-switch';
      let target: HTMLElement | undefined;
      for (const el of assigned) {
        if (el.matches?.(selector)) {
          target = el;
          break;
        }
        const nested = el.querySelector?.(selector) as HTMLElement | null;
        if (nested) {
          target = nested;
          break;
        }
      }
      if (target && typeof target.focus === 'function') {
        target.focus();
      }
    },
  },
  render({ props, html }) {
    const label =
      typeof props.label === 'string' && props.label.length > 0
        ? props.label
        : '';
    const hint =
      typeof props.hint === 'string' && props.hint.length > 0 ? props.hint : '';
    const error =
      typeof props.error === 'string' && props.error.length > 0
        ? props.error
        : '';
    const invalid = Boolean(error);

    return html`
      <div
        part="field-root"
        class="root"
        data-invalid=${invalid ? 'true' : null}
      >
        ${
          label
            ? html`
                <div class="label" part="field-label">
                  ${label}${
                    props.required
                      ? html`<span class="req" aria-hidden="true">*</span>`
                      : null
                  }
                </div>
              `
            : null
        }
        <div class="control" part="field-control">
          <slot></slot>
        </div>
        ${
          hint && !error
            ? html`<p class="hint" part="field-hint">${hint}</p>`
            : null
        }
        ${
          error
            ? html`
                <p class="error" part="field-error" role="alert">${error}</p>
              `
            : null
        }
      </div>
    `;
  },
});
