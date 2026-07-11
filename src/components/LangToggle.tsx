import { useEffect, useState } from 'react';

type Lang = 'en' | 'ru';
const STORAGE_KEY = 'naghdyan-lang';

/**
 * EN / RU switch. The whole document is bilingual (both languages are in the
 * DOM); flipping `html[data-lang]` is all that toggles visibility via CSS.
 * The choice is remembered in localStorage and applied pre-paint by the inline
 * script in Base.astro, so this island only mirrors and updates that state.
 */
export default function LangToggle() {
  const [lang, setLang] = useState<Lang>('en');

  useEffect(() => {
    const current = document.documentElement.getAttribute('data-lang');
    if (current === 'ru' || current === 'en') setLang(current);
  }, []);

  function choose(next: Lang) {
    setLang(next);
    document.documentElement.setAttribute('data-lang', next);
    document.documentElement.setAttribute('lang', next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* private mode — ignore */
    }
  }

  return (
    <div className="lang" role="group" aria-label="Language">
      <button
        type="button"
        className={lang === 'en' ? 'active' : ''}
        aria-pressed={lang === 'en'}
        onClick={() => choose('en')}
      >
        EN
      </button>
      <button
        type="button"
        className={lang === 'ru' ? 'active' : ''}
        aria-pressed={lang === 'ru'}
        onClick={() => choose('ru')}
      >
        RU
      </button>
    </div>
  );
}
