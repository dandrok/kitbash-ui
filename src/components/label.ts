import { defineComponent } from '@ktbsh/sdk';

/**
 * Field label (styled).
 *
 * Shadow DOM note: native `for` does not associate across shadow roots.
 * We still set `for` for consistency and **click-to-focus** the target by id.
 * Preferred patterns:
 * 1. Wrap: `<label>Text <kitbash-input></kitbash-input></label>` (native), or
 * 2. `kitbash-label for="id"` + matching control `id` (click focuses; set
 *    `aria-labelledby` on the control for stronger AT linkage when needed).
 */
export default defineComponent({
  tag: 'kitbash-label',
  props: {
    for: { type: String, default: '' },
    required: { type: Boolean, default: false },
  },
  styles: `
    :host {
      display: inline-flex;
      align-items: baseline;
      gap: var(--kb-space-2xs);
      font-family: var(--kb-font-family-sans);
      font-size: var(--kb-font-size-sm);
      font-weight: var(--kb-font-weight-medium);
      color: var(--kb-color-fg-default);
      line-height: var(--kb-line-height-normal);
    }
    .root {
      display: inline-flex;
      align-items: baseline;
      gap: var(--kb-space-2xs);
      cursor: pointer;
    }
    .req {
      color: var(--kb-color-danger-default);
      font-weight: var(--kb-font-weight-semibold);
    }
  `,
  events: {
    // Native label[for] cannot reach light-DOM controls from shadow; focus by id.
    'click .root'(_e: Event, { props }) {
      const id = typeof props.for === 'string' ? props.for : '';
      if (!id || typeof document === 'undefined') return;
      const el = document.getElementById(id) as HTMLElement | null;
      if (!el) return;
      if (
        typeof (el as HTMLElement & { focus?: () => void }).focus === 'function'
      ) {
        el.focus();
      }
    },
  },
  render({ props, html }) {
    const forId =
      typeof props.for === 'string' && props.for.length > 0 ? props.for : null;

    return html`
      <span part="label-root" class="root" data-for=${forId}>
        <slot></slot>
        ${
          props.required
            ? html`<span class="req" aria-hidden="true">*</span>`
            : null
        }
      </span>
    `;
  },
});
