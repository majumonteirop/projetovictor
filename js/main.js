// Menu mobile, carrossel e formulário de contato.

// --- Efeito: revelar ao rolar ---
// Só ativa com JavaScript ligado. Sem JS, todo o conteúdo continua visível.
document.documentElement.classList.add('js');

const revelar = document.querySelectorAll(
  '.section-head, .card, .steps li, blockquote, .about-img, .contact > div, .newsletter > div, .trust-bar'
);

revelar.forEach((el) => el.classList.add('reveal'));

if ('IntersectionObserver' in window) {
  const observador = new IntersectionObserver((entradas) => {
    entradas.forEach((entrada) => {
      if (entrada.isIntersecting) {
        entrada.target.classList.add('is-visible');
        observador.unobserve(entrada.target);
      }
    });
  }, { threshold: 0.12 });

  revelar.forEach((el) => observador.observe(el));
} else {
  revelar.forEach((el) => el.classList.add('is-visible'));
}

// --- Menu mobile ---
const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.main-nav');

if (toggle && nav) {
  toggle.addEventListener('click', () => {
    const aberto = nav.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(aberto));
  });

  // Fecha o menu ao clicar em um link (no celular)
  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      nav.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
}

// --- Carrossel ---
const slider = document.querySelector('[data-slider]');

if (slider) {
  const slides = Array.from(slider.querySelectorAll('.slide'));
  const dotsBox = slider.querySelector('.dots');
  const prev = slider.querySelector('.slider-btn.prev');
  const next = slider.querySelector('.slider-btn.next');
  let atual = 0;
  let timer;

  // Cria as bolinhas de navegação
  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.setAttribute('aria-label', `Ir para o slide ${i + 1}`);
    dot.addEventListener('click', () => mostrar(i, true));
    dotsBox.appendChild(dot);
  });
  const dots = Array.from(dotsBox.children);

  function mostrar(indice, pausar) {
    slides[atual].classList.remove('is-active');
    dots[atual].classList.remove('is-active');

    atual = (indice + slides.length) % slides.length;

    slides[atual].classList.add('is-active');
    dots[atual].classList.add('is-active');

    if (pausar) reiniciar();
  }

  function reiniciar() {
    clearInterval(timer);
    timer = setInterval(() => mostrar(atual + 1, false), 6000);
  }

  prev.addEventListener('click', () => mostrar(atual - 1, true));
  next.addEventListener('click', () => mostrar(atual + 1, true));

  // Pausa quando o mouse está sobre o carrossel
  slider.addEventListener('mouseenter', () => clearInterval(timer));
  slider.addEventListener('mouseleave', reiniciar);

  // Respeita quem prefere menos movimento
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    reiniciar();
  }

  mostrar(0, false);
}

// --- Newsletter ---
const formNews = document.getElementById('form-newsletter');

if (formNews) {
  formNews.addEventListener('submit', (e) => {
    e.preventDefault();
    formNews.querySelector('.form-feedback').textContent = 'Cadastro feito! Obrigado.';
    formNews.reset();
  });
}

// --- Galeria do produto ---
const fotoProduto = document.getElementById('produto-foto');
const miniaturas = document.querySelectorAll('.thumb');

miniaturas.forEach((botao) => {
  botao.addEventListener('click', () => {
    fotoProduto.src = botao.dataset.src;
    miniaturas.forEach((b) => b.classList.toggle('is-active', b === botao));
  });
});

// --- Formulário de contato ---
// Monta a mensagem, abre o WhatsApp da Pajem e copia o texto para colar lá.
const WHATSAPP_URL = 'https://wa.link/ppvkbi';
const form = document.getElementById('form-contato');

if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const dados = new FormData(form);
    const feedback = form.querySelector('.form-feedback');

    const texto =
      `Olá! Meu nome é ${dados.get('nome')}.\n` +
      `Meu WhatsApp: ${dados.get('contato')}\n` +
      `O que eu preciso: ${dados.get('mensagem')}`;

    // Abre o WhatsApp logo no clique, para o navegador não bloquear
    window.open(WHATSAPP_URL, '_blank', 'noopener');

    navigator.clipboard.writeText(texto)
      .then(() => {
        feedback.textContent = 'Mensagem copiada! Cole no WhatsApp que acabou de abrir.';
      })
      .catch(() => {
        feedback.textContent = 'Abrimos o WhatsApp. Envie a sua mensagem por lá.';
      });

    form.reset();
  });
}