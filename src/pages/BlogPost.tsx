import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { track } from '../lib/analytics';
import { Newsletter } from '../components/Newsletter';
import { MiniFooter } from '../components/SiteFooter';
import { SiteHeader } from '../components/SiteHeader';
import { usePageTitle } from '../lib/usePageTitle';
import '../styles/blog.css';

export default function BlogPost() {
  usePageTitle('[Título do artigo] | Blog | MF Escritório Jurídico');
  const { slug = '' } = useParams();
  const [copied, setCopied] = useState(false);
  const url = typeof window !== 'undefined' ? window.location.href : '';
  const share = (method: string) => track('share', { method, content_type: 'artigo', item_id: slug });

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      share('copiar_link');
    } catch {
      setCopied(false);
    }
  };

  return (
    <>
      <SiteHeader current="blog" />
      <main>
        <article className="article" aria-labelledby="art-t">
          <div className="article__narrow article__head">
            <Link className="article__back" to="/blog">← Todos os artigos</Link>
            <span className="article__cat"><span className="ph">[Categoria]</span></span>
            <h1 id="art-t">[Título do artigo]</h1>
            <p className="article__dek">[Linha fina: uma frase que resume do que trata o artigo.]</p>
            <div className="byline">
              <span className="byline__author">
                <span className="byline__avatar" aria-hidden="true" />
                <span><strong>[Nome do(a) autor(a)]</strong> · OAB [UF 000.000]</span>
              </span>
              <span>[dd/mm/aaaa] · [X] min de leitura</span>
            </div>
          </div>
          <div className="article__cover">
            <div className="photo-ph" role="img" aria-label="Espaço para imagem de capa do artigo">[Imagem de capa]</div>
          </div>
          <div className="article__narrow prose">
            <p>[Parágrafo de introdução: apresenta o tema e por que ele é relevante para o leitor.]</p>
            <h2>[Subtítulo da seção]</h2>
            <p>[Desenvolvimento do conteúdo, com explicação clara e fundamentação na legislação aplicável.]</p>
            <ul>
              <li>[Ponto importante 1]</li>
              <li>[Ponto importante 2]</li>
              <li>[Ponto importante 3]</li>
            </ul>
            <blockquote>[Trecho de lei ou citação relevante, com a fonte indicada.]</blockquote>
            <p>[Parágrafo de conclusão.]</p>
            <aside className="disclaimer">
              Este conteúdo tem caráter exclusivamente informativo e não substitui a análise individual de cada caso. Em
              caso de dúvidas sobre a sua situação, procure orientação de um(a) advogado(a).
            </aside>
            <div className="share">
              <span>Compartilhar:</span>
              <a className="btn btn--quiet" href={`https://wa.me/?text=${encodeURIComponent(url)}`} target="_blank" rel="noopener" onClick={() => share('whatsapp')}>WhatsApp</a>
              <a className="btn btn--quiet" href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`} target="_blank" rel="noopener" onClick={() => share('linkedin')}>LinkedIn</a>
              <button className="btn btn--quiet" type="button" onClick={copyLink}>{copied ? 'Link copiado' : 'Copiar link'}</button>
            </div>
          </div>
        </article>
        <Newsletter />
      </main>
      <MiniFooter />
    </>
  );
}
