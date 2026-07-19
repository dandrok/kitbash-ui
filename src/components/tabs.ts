import { defineComponent } from '@ktbsh/sdk';

/**
 * Tab list container (`role="tablist"`).
 * Place `kitbash-tab` children in the default slot. Arrow keys move focus/selection.
 */
export default defineComponent({
  tag: 'kitbash-tabs',
  props: {
    label: { type: String, default: 'Tabs' },
  },
  styles: `
    :host {
      display: block;
      font-family: var(--kb-font-family-sans);
    }
    .list {
      display: flex;
      flex-wrap: wrap;
      gap: var(--kb-space-2xs);
      border-bottom: 1px solid var(--kb-color-border-default);
      margin: 0;
      padding: 0;
    }
  `,
  events: {
    keydown(e: Event) {
      const ke = e as KeyboardEvent;
      if (
        ke.key !== 'ArrowRight' &&
        ke.key !== 'ArrowLeft' &&
        ke.key !== 'Home' &&
        ke.key !== 'End'
      ) {
        return;
      }
      const host = e.currentTarget as HTMLElement;
      const tabs = Array.from(host.querySelectorAll('kitbash-tab')) as Array<
        HTMLElement & {
          disabled?: boolean;
          checked?: boolean;
          selected?: boolean;
        }
      >;
      // Support both selected prop name - we use selected on kitbash-tab
      const enabled = tabs.filter(
        (t) => !(t as HTMLElement & { disabled?: boolean }).disabled,
      );
      if (enabled.length === 0) return;
      const current =
        enabled.find((t) => document.activeElement === t) ||
        enabled.find(
          (t) => (t as HTMLElement & { selected?: boolean }).selected,
        ) ||
        enabled[0];
      let idx = enabled.indexOf(current);
      if (ke.key === 'ArrowRight') idx = (idx + 1) % enabled.length;
      else if (ke.key === 'ArrowLeft')
        idx = (idx - 1 + enabled.length) % enabled.length;
      else if (ke.key === 'Home') idx = 0;
      else if (ke.key === 'End') idx = enabled.length - 1;
      ke.preventDefault();
      const next = enabled[idx] as HTMLElement;
      // Activate inner button so kitbash-tab 'click button' selection runs
      next.focus?.();
      const btn = next.shadowRoot?.querySelector('button');
      if (btn) btn.click();
      else next.click();
    },
  },
  render({ props, html }) {
    const label =
      typeof props.label === 'string' && props.label.length > 0
        ? props.label
        : 'Tabs';
    return html`
      <div part="tabs-root" class="list" role="tablist" aria-label=${label}>
        <slot></slot>
      </div>
    `;
  },
});
