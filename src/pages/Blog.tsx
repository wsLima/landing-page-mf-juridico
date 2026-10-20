import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Newsletter } from '../components/Newsletter';
import { MiniFooter } from '../components/SiteFooter';
import { SiteHeader } from '../components/SiteHeader';
import { posts } from '../content/site';
import { useAreas } from '../lib/content';
import { usePageTitle } from '../lib/usePageTitle';
import '../styles/blog.css';

export default function Blog() {
  usePageTitle('Blog | MF Escritório Jurídico');
  const { items: areas } = useAreas();
  const blogCategories = ['Todos', ...areas.map((a) => a.nome)];
  const [cat, setCat] = useState(0);
  const listed = cat === 0 ? posts : posts.filter((p) => p.cat === blogCategories[cat]);
  const [featured] = posts;

  return (
    <>
      <SiteHeader current="blog" />
      <main>
        <section className="blog-intro" aria-labelledby="blog-t">
          <div className="container blog-intro__inner">
            <div className="blog-intro__head">
              <p className="eyebrow eyebrow--rule">Blog</p>
              <h1 id="blog-t">Direito explicado com clareza.</h1>
              <p className="lead">
                Artigos informativos sobre direitos e temas jurídicos do cotidiano. Os textos têm caráter educativo e não
                substituem uma consulta individual.
              </p>
            </div>
            <div className="chips" role="group" aria-label="Filtrar por categoria">
              {blogCategories.map((label, i) => (
                <button key={label} className="chip" type="button" aria-pressed={cat === i} onClick={() => setCat(i)}>
                  {label}
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="featured" aria-label="Artigo em destaque">
          <div className="container">
            <Link className="post-card" to={`/blog/${featured.slug}`}>
              <div className="photo-ph" role="img" aria-label="Espaço para imagem de capa">[Imagem de capa]</div>
              <div className="featured__copy">
                <span className="featured__label">Em destaque · <span className="ph">[Categoria]</span></span>
                <span className="post-card__title">[Título do artigo em destaque]</span>
                <span className="featured__excerpt">
                  [Resumo do artigo em duas ou três linhas, apresentando o tema de forma objetiva e informativa.]
                </span>
                <span className="post-card__meta">[dd/mm/aaaa] · [X] min de leitura</span>
              </div>
            </Link>
          </div>
        </section>

        <section className="recent" aria-labelledby="todos-t">
          <div className="container recent__inner">
            <h2 id="todos-t">Artigos recentes</h2>
            {listed.length === 0 ? (
              <p className="recent__empty">Nenhum artigo nesta categoria ainda.</p>
            ) : (
              <div className="recent__grid">
                {listed.map((p) => (
                  <Link key={p.slug} className="post-card" to={`/blog/${p.slug}`}>
                    <div className="photo-ph" role="img" aria-label="Espaço para imagem do artigo">[Imagem]</div>
                    <span className="post-card__cat">{p.cat}</span>
                    <span className="post-card__title">{p.title}</span>
                    <span className="post-card__excerpt">[Resumo curto do artigo.]</span>
                    <span className="post-card__meta">[dd/mm/aaaa] · [X] min</span>
                  </Link>
                ))}
              </div>
            )}
            <nav className="pagination" aria-label="Paginação">
              <a className="btn btn--quiet" href="#" aria-current="page">1</a>
              <a className="btn btn--quiet" href="#">2</a>
              <a className="btn btn--quiet" href="#">Próxima →</a>
            </nav>
          </div>
        </section>

        <Newsletter />
      </main>
      <MiniFooter />
    </>
  );
}
