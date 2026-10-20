import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { Carousel } from '../components/Carousel';
import { ImageIcon, InstagramIcon, WhatsAppIcon } from '../components/Icons';
import { SiteFooter } from '../components/SiteFooter';
import { SiteHeader } from '../components/SiteHeader';
import { contato, INSTAGRAM_HANDLE, INSTAGRAM_URL, valores } from '../content/site';
import { isPlaceholder, useAreas, useEquipe } from '../lib/content';
import { usePageTitle } from '../lib/usePageTitle';
import { WA_HELLO, whatsappLink } from '../lib/whatsapp';
import '../styles/home.css';

export default function Home() {
  usePageTitle('MF Escritório Jurídico | Compromisso, ética e orientação jurídica');

  return (
    <>
      <SiteHeader onHome showWhatsApp />
      <main>
        <Hero />
        <About />
        <Areas />
        <Team />
        <Values />
        <ContentCta />
        <Contact />
      </main>
      <SiteFooter />
    </>
  );
}

function Hero() {
  return (
    <section id="inicio" className="hero" aria-labelledby="hero-title">
      <div className="container split">
        <div className="hero__copy">
          <p className="eyebrow eyebrow--rule">MF Escritório Jurídico</p>
          <h1 id="hero-title" className="display">Compromisso, ética e orientação jurídica.</h1>
          <p className="lead">
            Um atendimento jurídico pautado pela escuta atenta, pela clareza nas orientações e pelo respeito às normas
            da profissão — para que cada pessoa compreenda sua situação e as alternativas disponíveis.
          </p>
          <div className="hero__ctas">
            <a className="btn btn--primary" href="#escritorio">Conheça o escritório</a>
            <a className="btn btn--outline" href="#contato">Entre em contato</a>
          </div>
        </div>
        <figure className="hero__figure">
          <div className="photo-ph hero__photo" role="img" aria-label="Espaço reservado para fotografia do escritório ou da equipe">
            <ImageIcon />
            <span>[Fotografia real do escritório ou da equipe]</span>
          </div>
        </figure>
      </div>
    </section>
  );
}

function About() {
  return (
    <section id="escritorio" className="section section--surface about" aria-labelledby="sobre-title">
      <div className="container split">
        <div className="section-head">
          <p className="eyebrow">O Escritório</p>
          <h2 id="sobre-title" className="h2">Orientação jurídica com responsabilidade e proximidade.</h2>
        </div>
        <div className="about__body">
          <p>
            O MF Escritório Jurídico acompanha cada pessoa com atenção às particularidades do seu caso, buscando
            explicar com clareza os caminhos possíveis, os prazos envolvidos e os cuidados necessários em cada etapa.
          </p>
          <p>
            A atuação do escritório é orientada pela ética profissional, pelo sigilo das informações confiadas e pelo
            cumprimento das normas que regem a advocacia.
          </p>
          <p>
            <span className="ph">[Breve histórico do escritório: ano de fundação, cidade de atuação e formato de atendimento — a confirmar]</span>
          </p>
          <div className="about__meta">
            <span><strong>Responsável técnico:</strong> <span className="ph">[Nome do(a) advogado(a)]</span></span>
            <span><strong>OAB:</strong> <span className="ph">[UF 000.000]</span></span>
          </div>
        </div>
      </div>
    </section>
  );
}

const Txt = ({ v }: { v: string }) => (isPlaceholder(v) ? <span className="ph">{v}</span> : <>{v}</>);

function Team() {
  const { items: equipe, loading } = useEquipe();
  if (!loading && equipe.length === 0) return null;

  return (
    <section id="equipe" className="section section--surface" aria-labelledby="equipe-title" aria-busy={loading}>
      <div className="container team__inner">
        <div className="section-head">
          <p className="eyebrow">Equipe</p>
          <h2 id="equipe-title" className="h2">Quem atende você</h2>
        </div>
        <Carousel label="Equipe do escritório">
          {equipe.map((m) => (
            <article key={m.id} className="member">
              {m.foto_url ? (
                <img className="member__photo" src={m.foto_url} alt={`Foto de ${m.nome}`} loading="lazy" />
              ) : (
                <div className="photo-ph member__photo" role="img" aria-label="Espaço para fotografia">
                  <ImageIcon size={32} />
                  <span>[Foto]</span>
                </div>
              )}
              <div className="member__info">
                <h3><Txt v={m.nome} /></h3>
                <p className="member__role"><Txt v={m.cargo} /></p>
                {m.oab && <p className="member__oab"><Txt v={m.oab} /></p>}
                {m.bio && <p className="member__bio"><Txt v={m.bio} /></p>}
              </div>
            </article>
          ))}
        </Carousel>
      </div>
    </section>
  );
}

function Areas() {
  const { items: areas, loading } = useAreas();
  if (!loading && areas.length === 0) return null;

  return (
    <section id="areas" className="section" aria-labelledby="areas-title" aria-busy={loading}>
      <div className="container areas__inner">
        <div className="areas__head">
          <div className="section-head">
            <p className="eyebrow">Áreas de Atuação</p>
            <h2 id="areas-title" className="h2">Em que o escritório pode orientar você</h2>
          </div>
          <p className="areas__note">
            As informações abaixo têm caráter informativo. A análise de cada situação depende de consulta individual.
          </p>
        </div>
        <div className="areas__grid">
          {areas.map((a, i) => (
            <article key={a.id} className="area-card">
              <span className="area-card__num">{String(i + 1).padStart(2, '0')}</span>
              <h3><Txt v={a.nome} /></h3>
              <p><Txt v={a.descricao} /></p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Values() {
  return (
    <section className="section section--brand values" aria-labelledby="valores-title">
      <div className="container values__inner">
        <div className="section-head">
          <p className="eyebrow eyebrow--light">Valores</p>
          <h2 id="valores-title" className="h2">Princípios que orientam o atendimento</h2>
        </div>
        <div className="values__grid">
          {valores.map((v) => (
            <div key={v.title} className="value">
              <h3>{v.title}</h3>
              <p>{v.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ContentCta() {
  return (
    <section id="conteudos" className="content-cta" aria-labelledby="conteudos-title">
      <div className="container">
        <div className="content-cta__box">
          <div className="content-cta__copy">
            <p className="eyebrow">Conteúdos jurídicos</p>
            <h2 id="conteudos-title" className="h2 h2--sm">Informação jurídica em linguagem acessível</h2>
            <p>
              No blog e no Instagram, o escritório compartilha conteúdos educativos, com explicações sobre direitos e
              temas jurídicos do cotidiano.
            </p>
          </div>
          <div className="content-cta__actions">
            <Link className="btn btn--primary" to="/blog">Ler o blog</Link>
            <a className="btn btn--outline" href={INSTAGRAM_URL} target="_blank" rel="noopener">
              <InstagramIcon />
              {INSTAGRAM_HANDLE}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function Contact() {
  const [nome, setNome] = useState('');
  const [contatoVal, setContatoVal] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [consent, setConsent] = useState(false);

  const canSend = !!(nome.trim() && mensagem.trim() && consent);
  const texto =
    `Olá! Meu nome é ${nome.trim()}.` +
    (contatoVal.trim() ? ` Contato: ${contatoVal.trim()}.` : '') +
    `\n\n${mensagem.trim()}`;

  return (
    <section id="contato" className="section section--sand contact" aria-labelledby="contato-title">
      <div className="container split">
        <div className="contact__info">
          <p className="eyebrow">Contato</p>
          <h2 id="contato-title" className="h2">Fale com o escritório</h2>
          <p>Para informações sobre os serviços e agendamento de atendimento, entre em contato pelos canais abaixo.</p>
          <a className="btn btn--primary" href={WA_HELLO} target="_blank" rel="noopener">
            <WhatsAppIcon />
            Iniciar conversa no WhatsApp
          </a>
          <dl className="contact-list">
            <div>
              <dt>Telefone</dt>
              <dd className="contact-list__multi">
                {contato.telefones.map((t) => <a key={t.tel} href={`tel:${t.tel}`}>{t.label}</a>)}
              </dd>
            </div>
            <div><dt>E-mail</dt><dd><a href={`mailto:${contato.email}`}>{contato.email}</a></dd></div>
            <div><dt>Horário</dt><dd>{contato.horario}</dd></div>
            <div>
              <dt>Atendimento</dt>
              <dd className="contact-list__multi">
                {contato.atendimento.map((a) => <span key={a.title}><strong>{a.title}</strong> — {a.desc.toLowerCase()}</span>)}
              </dd>
            </div>
            <div><dt>Endereço</dt><dd><span className="ph">{contato.endereco}</span></dd></div>
            <div>
              <dt>Instagram</dt>
              <dd><a href={INSTAGRAM_URL} target="_blank" rel="noopener">{INSTAGRAM_HANDLE}</a></dd>
            </div>
          </dl>
        </div>

        <form className="contact-form" aria-labelledby="form-title" onSubmit={(e: FormEvent) => e.preventDefault()}>
          <h3 id="form-title">Envie uma mensagem</h3>
          <div className="field-group">
            <label className="field-label" htmlFor="f-nome">Nome</label>
            <input id="f-nome" className="field" type="text" autoComplete="name" value={nome} onChange={(e) => setNome(e.target.value)} />
          </div>
          <div className="field-group">
            <label className="field-label" htmlFor="f-contato">E-mail ou telefone</label>
            <input id="f-contato" className="field" type="text" autoComplete="email" value={contatoVal} onChange={(e) => setContatoVal(e.target.value)} />
          </div>
          <div className="field-group">
            <label className="field-label" htmlFor="f-msg">Mensagem</label>
            <textarea id="f-msg" className="field" rows={5} value={mensagem} onChange={(e) => setMensagem(e.target.value)} aria-describedby="f-msg-hint" />
            <span id="f-msg-hint" className="field-hint">
              Descreva apenas o assunto de forma geral. Não envie dados sigilosos, documentos ou números de processo por aqui.
            </span>
          </div>
          <label className="check" htmlFor="f-ok">
            <input id="f-ok" type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
            <span>
              Li o <a href="#privacidade">aviso de privacidade</a> e concordo com o uso dos meus dados apenas para retorno
              deste contato.
            </span>
          </label>
          {canSend ? (
            <a className="btn btn--primary btn--block" href={whatsappLink(texto)} target="_blank" rel="noopener">
              Enviar mensagem pelo WhatsApp
            </a>
          ) : (
            <button className="btn btn--disabled btn--block" type="button" disabled>
              Preencha nome, mensagem e o aceite para enviar
            </button>
          )}
        </form>
      </div>
    </section>
  );
}
