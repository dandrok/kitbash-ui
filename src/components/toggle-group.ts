import { defineComponent } from '@ktbsh/sdk';

/**
 * Horizontal group for segmented toggles (blog `.toggle-group`).
 * Marks slotted `kitbash-theme-toggle` / `kitbash-preset-toggle` with
 * `data-group-pos` so borders join (start | mid | end).
 */
export default defineComponent({
  tag: 'kitbash-toggle-group',
  events: {
    'slotchange slot'(e: Event) {
      const slot = e.target as HTMLSlotElement;
      const els = slot
        .assignedElements({ flatten: true })
        .filter((n) => n instanceof HTMLElement) as HTMLElement[];
      const n = els.length;
      els.forEach((el, i) => {
        if (n === 1) {
          el.removeAttribute('data-group-pos');
          return;
        }
        let pos = 'mid';
        if (i === 0) pos = 'start';
        else if (i === n - 1) pos = 'end';
        el.setAttribute('data-group-pos', pos);
      });
    },
  },
  styles: `
    :host {
      display: inline-block;
      font-family: var(--kb-font-family-sans);
    }
    [part='group-root'] {
      display: inline-flex;
      align-items: center;
      flex-wrap: wrap;
    }
    slot {
      display: contents;
    }
  `,
  render({ html }) {
    return html`
      <div part="group-root" role="group" aria-label="Display options">
        <slot></slot>
      </div>
    `;
  },
});
