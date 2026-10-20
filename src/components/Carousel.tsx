import { Children, useCallback, useEffect, useRef, useState, type ReactNode } from 'react';

// Carrossel com rolagem nativa (arrastar no celular, setas e indicadores no computador).
// Sem rolagem automática, para não atrapalhar a leitura. Quando tudo cabe na tela, as setas somem
// e os cartões ficam centralizados.

type Props = { label: string; children: ReactNode };

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function Carousel({ label, children }: Props) {
  const slides = Children.toArray(children);
  const count = slides.length;
  const track = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ index: 0, positions: 1, atStart: true, atEnd: true });

  const slideEls = () => Array.from(track.current?.children ?? []) as HTMLElement[];

  const update = useCallback(() => {
    const el = track.current;
    const items = slideEls();
    if (!el || items.length === 0) return;
    const step = items.length > 1 ? items[1].offsetLeft - items[0].offsetLeft : el.clientWidth;
    const visible = Math.max(1, Math.floor((el.clientWidth + 1) / step));
    const max = el.scrollWidth - el.clientWidth;
    const positions = max > 2 ? Math.max(1, items.length - visible + 1) : 1;
    const atEnd = el.scrollLeft >= max - 2;
    const index = atEnd ? positions - 1 : Math.min(positions - 1, Math.round(el.scrollLeft / step));
    setPos({ index, positions, atStart: el.scrollLeft <= 2, atEnd });
  }, []);

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    el.addEventListener('scroll', update, { passive: true });
    return () => {
      ro.disconnect();
      el.removeEventListener('scroll', update);
    };
  }, [update, count]);

  const goTo = (i: number) => {
    const el = track.current;
    const items = slideEls();
    const target = items[Math.max(0, Math.min(i, items.length - 1))];
    if (!el || !target) return;
    el.scrollTo({ left: target.offsetLeft - items[0].offsetLeft, behavior: reducedMotion() ? 'auto' : 'smooth' });
  };

  return (
    <div className={pos.positions > 1 ? 'carousel' : 'carousel carousel--fit'} role="region" aria-roledescription="carrossel" aria-label={label}>
      <div className="carousel__track" ref={track} tabIndex={0} aria-label={`${label} — use as setas do teclado para rolar`}>
        {slides.map((slide, i) => (
          <div key={i} className="carousel__slide" role="group" aria-roledescription="slide" aria-label={`${i + 1} de ${count}`}>
            {slide}
          </div>
        ))}
      </div>
      {pos.positions > 1 && (
        <div className="carousel__controls">
          <button className="carousel__arrow" type="button" aria-label="Anterior" disabled={pos.atStart} onClick={() => goTo(pos.index - 1)}>
            <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M15 5l-7 7 7 7" /></svg>
          </button>
          <div className="carousel__dots">
            {Array.from({ length: pos.positions }, (_, i) => (
              <button
                key={i}
                className="carousel__dot"
                type="button"
                aria-label={`Ir para a posição ${i + 1} de ${pos.positions}`}
                aria-current={i === pos.index ? 'true' : undefined}
                onClick={() => goTo(i)}
              />
            ))}
          </div>
          <button className="carousel__arrow" type="button" aria-label="Próximo" disabled={pos.atEnd} onClick={() => goTo(pos.index + 1)}>
            <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>
      )}
    </div>
  );
}
