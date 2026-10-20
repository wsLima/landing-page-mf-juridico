import { useState } from 'react';
import { Link } from 'react-router-dom';
import { WA_HELLO } from '../lib/whatsapp';
import { MenuIcon, WhatsAppIcon } from './Icons';
import { Logo } from './Logo';

type Props = {
  /** On the home page, section links scroll in place; elsewhere they go back to the home page. */
  onHome?: boolean;
  current?: 'blog';
  showWhatsApp?: boolean;
};

const sections = [
  { id: 'inicio', label: 'Início' },
  { id: 'escritorio', label: 'O Escritório' },
  { id: 'areas', label: 'Áreas de Atuação' },
];

export function SiteHeader({ onHome = false, current, showWhatsApp = false }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const href = (id: string) => (onHome ? `#${id}` : `/#${id}`);
  const close = () => setMenuOpen(false);
  const blogCurrent = current === 'blog' ? 'page' : undefined;

  return (
    <header className="site-header">
      <div className="container site-header__bar">
        <a className="brand" href={href('inicio')} aria-label="Matos Franquilino Advocacia — página inicial">
          <Logo variant="mark" className="brand__logo" title="" />
          <span className="brand__text" aria-hidden="true">
            <span className="brand__name">Matos Franquilino</span>
            <span className="brand__tag">Advocacia</span>
          </span>
        </a>
        <nav className="nav" aria-label="Navegação principal">
          {sections.map((s) => (
            <a key={s.id} className="nav-link" href={href(s.id)}>{s.label}</a>
          ))}
          <Link className="nav-link" to="/blog" aria-current={blogCurrent}>Blog</Link>
          <a className="nav-link" href={href('contato')}>Contato</a>
        </nav>
        <div className="site-header__actions">
          {showWhatsApp && (
            <a className="btn btn--outline btn--sm wa-top" href={WA_HELLO} target="_blank" rel="noopener">
              <WhatsAppIcon size={17} />
              WhatsApp
            </a>
          )}
          <button
            className="menu-btn"
            type="button"
            aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            onClick={() => setMenuOpen((o) => !o)}
          >
            <MenuIcon />
          </button>
        </div>
      </div>
      {menuOpen && (
        <nav id="mobile-nav" className="mobile-nav" aria-label="Navegação móvel">
          {sections.map((s) => (
            <a key={s.id} className="nav-link" href={href(s.id)} onClick={close}>{s.label}</a>
          ))}
          <Link className="nav-link" to="/blog" aria-current={blogCurrent} onClick={close}>Blog</Link>
          <a className="nav-link" href={href('contato')} onClick={close}>Contato</a>
          {showWhatsApp && (
            <a className="btn btn--primary btn--block" href={WA_HELLO} target="_blank" rel="noopener">
              Conversar pelo WhatsApp
            </a>
          )}
        </nav>
      )}
    </header>
  );
}
