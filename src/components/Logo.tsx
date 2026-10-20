import { useId } from 'react';
import { LINE_STROKE, LOGO_VIEWBOX, logoPaths, MARK_VIEWBOX, RING_STROKE } from './logoPaths';

// Logo vetorial (também disponível como arquivo em /logo.svg e /logo-mark.svg).
// `full`: monograma + "Matos Franquilino Advocacia"; `mark`: só o monograma no anel.

type Props = { variant?: 'full' | 'mark'; className?: string; title?: string };

export function Logo({ variant = 'full', className, title = 'Matos Franquilino Advocacia' }: Props) {
  const id = useId().replace(/:/g, '');
  const grad = `logo-grad-${id}`;
  const { w, h } = LOGO_VIEWBOX;
  const viewBox = variant === 'full' ? `0 0 ${w} ${h}` : MARK_VIEWBOX;

  return (
    <svg
      className={className}
      viewBox={viewBox}
      xmlns="http://www.w3.org/2000/svg"
      {...(title ? { role: 'img', 'aria-label': title } : { 'aria-hidden': true })}
    >
      <defs>
        <linearGradient id={grad} gradientUnits="userSpaceOnUse" x1={w / 2 - 120} y1="0" x2={w / 2 + 120} y2={h}>
          <stop offset="0" stopColor="#E2BF8C" />
          <stop offset="0.45" stopColor="#B8844F" />
          <stop offset="1" stopColor="#8B5E3C" />
        </linearGradient>
      </defs>
      <g fill={`url(#${grad})`}>
        <path d={logoPaths.m} />
        <path d={logoPaths.f} />
        {variant === 'full' && <path d={logoPaths.name} />}
        {variant === 'full' && <path d={logoPaths.sub} />}
      </g>
      <g fill="none" stroke={`url(#${grad})`}>
        <path d={logoPaths.ring} strokeWidth={RING_STROKE} strokeLinecap="round" />
        {variant === 'full' && <path d={logoPaths.lines} strokeWidth={LINE_STROKE} />}
      </g>
    </svg>
  );
}
