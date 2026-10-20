import { Link } from 'react-router-dom';
import { contato, INSTAGRAM_URL, RAZAO_SOCIAL } from '../content/site';
import { Logo } from './Logo';

const year = new Date().getFullYear();

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container site-footer__inner">
        <div className="site-footer__cols">
          <div className="site-footer__col">
            <Logo className="site-footer__logo" title={RAZAO_SOCIAL} />
            <span>Responsável técnico: <span className="ph-d">[Nome — OAB/UF 000.000]</span></span>
            <span>{contato.horario}</span>
            <span>{contato.telefones.map((t) => t.label).join(' · ')}</span>
          </div>
          <nav className="site-footer__col site-footer__links" aria-label="Links do rodapé">
            <span className="site-footer__heading">Navegação</span>
            <a href="#escritorio">O Escritório</a>
            <a href="#areas">Áreas de Atuação</a>
            <a href="#equipe">Equipe</a>
            <Link to="/blog">Blog</Link>
            <a href="#contato">Contato</a>
            <a href="#privacidade">Política de privacidade</a>
            <a href={INSTAGRAM_URL} target="_blank" rel="noopener">Instagram</a>
          </nav>
          <div id="privacidade" className="site-footer__col">
            <span className="site-footer__heading">Aviso de privacidade</span>
            <p>
              Os dados enviados por este site (nome, contato e mensagem) são utilizados exclusivamente para responder à
              sua solicitação, em conformidade com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018). Não
              compartilhamos essas informações com terceiros.
            </p>
            <p>
              Para solicitar acesso, correção ou exclusão dos seus dados:{' '}
              <a className="site-footer__mail" href={`mailto:${contato.email}`}>{contato.email}</a>.
            </p>
          </div>
        </div>
        <div className="site-footer__bottom">
          <span>© {year} MF Escritório Jurídico. Todos os direitos reservados.</span>
          <span>
            Conteúdo de caráter exclusivamente informativo, em observância ao Provimento nº 205/2021 do Conselho Federal
            da OAB.
          </span>
        </div>
      </div>
    </footer>
  );
}

export function MiniFooter() {
  return (
    <footer className="mini-footer">
      <div className="container mini-footer__inner">
        <span>
          © {year} MF Escritório Jurídico · <a href={INSTAGRAM_URL} target="_blank" rel="noopener">Instagram</a> ·{' '}
          <a href="/#privacidade">Política de privacidade</a>
        </span>
        <span>Conteúdo informativo, em observância ao Provimento nº 205/2021 do CFOAB.</span>
      </div>
    </footer>
  );
}
