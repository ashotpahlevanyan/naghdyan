import { Fragment, useEffect, useState } from 'react';

export type NavLink = { href: string; en: string; ru: string; hy: string };

/**
 * Hamburger menu for ≤1024px, where `.nav-links` is hidden. The panel repeats the
 * nav links, and — like the rest of the site — ships all three languages into the
 * DOM at once (`data-lang-*`); CSS shows only the active one. The panel is a
 * column flex container so those links blockify even though the language rules
 * only `display:revert` them (which would otherwise leave them inline).
 *
 * Closed state uses `visibility:hidden` rather than `display:none` so the links'
 * per-language `display:revert` can't resurrect them — and so the open/close
 * transition still animates.
 */
export default function MobileMenu({ links }: { links: NavLink[] }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    // Rotating a phone (or resizing) past the breakpoint reveals the desktop
    // nav; leaving the panel open would strand a scroll lock behind it.
    const onResize = () => {
      if (window.innerWidth > 1024) setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    window.addEventListener('resize', onResize);
    document.body.classList.add('menu-open');
    return () => {
      document.removeEventListener('keydown', onKey);
      window.removeEventListener('resize', onResize);
      document.body.classList.remove('menu-open');
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        className={`burger${open ? ' open' : ''}`}
        aria-label="Menu"
        aria-expanded={open}
        aria-controls="mobile-menu"
        onClick={() => setOpen((o) => !o)}
      >
        <span /><span /><span />
      </button>

      <div
        className={`mobile-scrim${open ? ' show' : ''}`}
        aria-hidden="true"
        onClick={() => setOpen(false)}
      />

      <nav id="mobile-menu" className={`mobile-menu${open ? ' show' : ''}`} aria-label="Menu">
        {links.map((l) => (
          <Fragment key={l.href}>
            <a href={l.href} data-lang-en onClick={() => setOpen(false)}>{l.en}</a>
            <a href={l.href} data-lang-ru onClick={() => setOpen(false)}>{l.ru}</a>
            <a href={l.href} data-lang-hy onClick={() => setOpen(false)}>{l.hy}</a>
          </Fragment>
        ))}
      </nav>
    </>
  );
}
