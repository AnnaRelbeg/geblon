/* =========================================================
   GEBLON · script.js
   Moduły: menu mobilne, wideo w nagłówku, filtr produktów,
   pokaz slajdów, kreator graweru, formularze.
   ========================================================= */

/* ---------------------------------------------------------
   KONFIGURACJA
   FORM_ENDPOINT: adres formularza (np. Formspree:
   https://formspree.io/f/XXXXXXXX). Plan Formspree z obsługą
   załączników jest potrzebny, aby przesyłać pliki z kreatora.
   Gdy pole jest puste, formularze otwierają program pocztowy
   z gotową treścią (bez załączników).
   --------------------------------------------------------- */
const FORM_ENDPOINT = 'https://formspree.io/f/xkoqkaea';
const CONTACT_EMAIL = 'grzegorz@geblon.pl';

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- Menu mobilne ---------- */
(() => {
  const btn = document.querySelector('.nav__toggle');
  const menu = document.getElementById('menu');
  if (!btn || !menu) return;
  btn.addEventListener('click', () => {
    const open = menu.classList.toggle('is-open');
    btn.setAttribute('aria-expanded', String(open));
    btn.setAttribute('aria-label', open ? 'Zamknij menu' : 'Otwórz menu');
  });
  menu.addEventListener('click', (e) => {
    if (e.target.closest('a')) {
      menu.classList.remove('is-open');
      btn.setAttribute('aria-expanded', 'false');
    }
  });
})();

/* ---------- Wideo w nagłówku ----------
   Ładowane tylko na większych ekranach, bez trybu oszczędzania
   danych i bez ograniczonego ruchu. Na telefonach zostaje plakat. */
(() => {
  const video = document.querySelector('.hero__video');
  if (!video) return;
  const saveData = navigator.connection && navigator.connection.saveData;
  const wide = window.matchMedia('(min-width: 768px)').matches;
  if (reduceMotion || saveData || !wide) return;

  [['webm', 'video/webm'], ['mp4', 'video/mp4']].forEach(([key, type]) => {
    const src = video.dataset['src' + key.charAt(0).toUpperCase() + key.slice(1)];
    if (!src) return;
    const s = document.createElement('source');
    s.src = src;
    s.type = type;
    video.appendChild(s);
  });
  video.muted = true;
  video.load();
  video.addEventListener('loadeddata', () => { video.playbackRate = 0.8; });
  const p = video.play();
  if (p && p.catch) p.catch(() => {});

  // Pauza, gdy nagłówek nie jest widoczny (oszczędność baterii)
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { const q = video.play(); if (q && q.catch) q.catch(() => {}); }
      else video.pause();
    }).observe(video);
  }
})();

/* ---------- Filtr produktów ---------- */
(() => {
  const chips = document.querySelectorAll('.filters .chip');
  const cards = document.querySelectorAll('#lista-produktow .pcard');
  chips.forEach((chip) => {
    chip.addEventListener('click', () => {
      const f = chip.dataset.filter;
      chips.forEach((c) => {
        const on = c === chip;
        c.classList.toggle('is-on', on);
        c.setAttribute('aria-pressed', String(on));
      });
      cards.forEach((card) => { card.hidden = !(f === 'all' || card.dataset.cat === f); });
    });
  });
})();

/* ---------- Pokaz slajdów (Realizacje) ---------- */
(() => {
  const root = document.querySelector('.show');
  if (!root) return;
  const slides = Array.from(root.querySelectorAll('.show__slide'));
  const tag = root.querySelector('.show__tag');
  const title = root.querySelector('.show__title');
  const count = root.querySelector('.show__count');
  const bar = root.querySelector('.show__bar span');
  const thumbs = root.querySelector('.show__thumbs');
  const n = slides.length;
  let i = 0;
  let timer = null;
  const pad = (x) => String(x).padStart(2, '0');

  // Miniatury budowane z obrazów slajdów
  slides.forEach((slide, idx) => {
    const img = slide.querySelector('img');
    const b = document.createElement('button');
    b.type = 'button';
    b.setAttribute('aria-label', slide.querySelector('figcaption').textContent);
    const t = document.createElement('img');
    t.src = img.getAttribute('src');
    t.alt = '';
    t.loading = 'lazy';
    b.appendChild(t);
    b.addEventListener('click', () => { go(idx); restart(); });
    thumbs.appendChild(b);
  });
  const thumbBtns = Array.from(thumbs.children);

  function go(next) {
    i = (next + n) % n;
    slides.forEach((s, idx) => {
      const on = idx === i;
      s.classList.toggle('is-on', on);
      s.setAttribute('aria-hidden', String(!on));
      if (on) { const im = s.querySelector('img'); im.loading = 'eager'; }
    });
    thumbBtns.forEach((b, idx) => b.setAttribute('aria-current', String(idx === i)));
    tag.textContent = slides[i].dataset.tag;
    title.textContent = slides[i].querySelector('figcaption').textContent;
    count.textContent = pad(i + 1) + ' / ' + pad(n);
    bar.style.width = ((i + 1) / n * 100) + '%';
  }
  function start() { if (!reduceMotion && !timer) timer = setInterval(() => go(i + 1), 5500); }
  function stop() { clearInterval(timer); timer = null; }
  function restart() { stop(); start(); }

  root.querySelectorAll('.round').forEach((b) => b.addEventListener('click', () => { go(i + Number(b.dataset.dir)); restart(); }));
  root.addEventListener('mouseenter', stop);
  root.addEventListener('mouseleave', start);
  root.addEventListener('focusin', stop);
  root.addEventListener('focusout', start);
  root.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') { go(i - 1); }
    if (e.key === 'ArrowRight') { go(i + 1); }
  });
  document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));

  go(0);
  start();
})();

/* ---------- Kreator graweru ---------- */
(() => {
  const form = document.getElementById('kreator-form');
  if (!form) return;
  const sizes = document.getElementById('rozmiary');
  const surfaces = Array.from(form.querySelectorAll('.surface'));

  function kind() {
    const r = form.querySelector('input[name="produkt"]:checked');
    return r ? r.dataset.kind : 'box';
  }

  // Zmiana produktu: tytuły pól (wieczko / wizytówka), podpowiedzi, rozmiary
  function applyKind() {
    const k = kind();
    const isLight = form.querySelector('input[name="produkt"]:checked').value === 'Pudełko jasne';
    sizes.hidden = !isLight;
    surfaces.forEach((s) => {
      const t = s.querySelector('.surface__title');
      t.textContent = t.dataset[k];
      const ta = s.querySelector('textarea');
      ta.placeholder = ta.dataset[k];
    });
  }

  // Tryb pola: plik / tekst + motyw / bez graweru
  function applyMode(s) {
    const n = s.dataset.surface;
    const r = s.querySelector(`input[name="s${n}_tryb"]:checked`);
    s.dataset.mode = r ? r.value : 'brak';
  }

  // Podgląd wgranych plików
  function renderPreview(s) {
    const box = s.querySelector('.preview');
    box.innerHTML = '';
    const inputs = s.querySelectorAll('input[type="file"]');
    let any = false;
    inputs.forEach((inp) => {
      const f = inp.files && inp.files[0];
      if (!f) return;
      const visible = inp.closest('.mode') && getComputedStyle(inp.closest('.mode')).display !== 'none';
      if (!visible) return;
      any = true;
      const row = document.createElement('div');
      row.className = 'preview__item';
      if (f.type.startsWith('image/')) {
        const img = document.createElement('img');
        img.alt = '';
        img.src = URL.createObjectURL(f);
        row.appendChild(img);
      }
      const name = document.createElement('span');
      name.textContent = f.name;
      row.appendChild(name);
      const del = document.createElement('button');
      del.type = 'button';
      del.textContent = 'Usuń';
      del.setAttribute('aria-label', 'Usuń plik ' + f.name);
      del.addEventListener('click', () => { inp.value = ''; renderPreview(s); });
      row.appendChild(del);
      box.appendChild(row);
    });
    box.hidden = !any;
  }

  form.addEventListener('change', (e) => {
    const t = e.target;
    if (t.name === 'produkt') applyKind();
    const s = t.closest('.surface');
    if (s) { applyMode(s); renderPreview(s); }
  });

  applyKind();
  surfaces.forEach((s) => { applyMode(s); renderPreview(s); });
})();

/* ---------- Wysyłka formularzy ---------- */
function summarise(form) {
  const lines = [];
  const fd = new FormData(form);
  for (const [key, val] of fd.entries()) {
    if (key.startsWith('_')) continue;
    if (val instanceof File) { if (val.name) lines.push(`${key}: plik ${val.name} (dołącz do wiadomości)`); continue; }
    if (String(val).trim()) lines.push(`${key}: ${val}`);
  }
  return lines.join('\n');
}

function wireForm(id, okText) {
  const form = document.getElementById(id);
  if (!form) return;
  const status = form.querySelector('.form-status');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    status.className = 'form-status';
    if (!form.checkValidity()) {
      status.textContent = 'Uzupełnij imię i poprawny adres e-mail.';
      status.classList.add('is-err');
      form.reportValidity();
      return;
    }
    // Pola wyłączone (tryb "bez graweru") nie są wysyłane
    if (id === 'kreator-form') {
      form.querySelectorAll('.surface').forEach((s) => {
        s.querySelectorAll('.mode').forEach((m) => {
          const hidden = getComputedStyle(m).display === 'none';
          m.querySelectorAll('input, textarea').forEach((el) => { el.disabled = hidden; });
        });
      });
    }

    if (!FORM_ENDPOINT) {
      const subject = form.querySelector('input[name="_subject"]').value;
      window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(summarise(form))}`;
      status.textContent = 'Otworzyliśmy Twój program pocztowy. Dołącz pliki i wyślij wiadomość.';
      status.classList.add('is-ok');
      form.querySelectorAll(':disabled').forEach((el) => { el.disabled = false; });
      return;
    }

    status.textContent = 'Wysyłanie…';
    try {
      // Collect files before disabling inputs, then disable them so Formspree
      // (free plan) doesn't reject the submission due to file uploads.
      const uploadedFiles = Array.from(form.querySelectorAll('input[type="file"]'))
        .filter(inp => !inp.disabled && inp.files && inp.files[0])
        .map(inp => inp.files[0]);
      form.querySelectorAll('input[type="file"]').forEach(inp => { inp.disabled = true; });

      const res = await fetch(FORM_ENDPOINT, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } });
      if (!res.ok) throw new Error(String(res.status));
      form.reset();
      form.querySelectorAll('input[type="radio"]:checked').forEach((r) => r.dispatchEvent(new Event('change', { bubbles: true })));

      if (uploadedFiles.length) {
        const email = form.querySelector('[name="email"]');
        const imie = form.querySelector('[name="imie"]');
        const subject = encodeURIComponent(`Pliki projektu – ${imie ? imie.value : ''}`);
        const body = encodeURIComponent(`Cześć, przesyłam pliki do zlecenia złożonego przez kreator.\n\nImię: ${imie ? imie.value : ''}\nPliki: ${uploadedFiles.map(f => f.name).join(', ')}`);
        const mailHref = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
        status.innerHTML = `${okText}<br><br>Masz plik projektu? <a href="${mailHref}">Wyślij go e-mailem</a> (kliknij link, dołącz plik i wyślij).`;
      } else {
        status.textContent = okText;
      }
      status.classList.add('is-ok');
    } catch (err) {
      status.textContent = `Nie udało się wysłać. Napisz do nas na ${CONTACT_EMAIL}.`;
      status.classList.add('is-err');
    } finally {
      form.querySelectorAll(':disabled').forEach((el) => { el.disabled = false; });
    }
  });
}

wireForm('kreator-form', 'Dziękujemy! Projekt trafił do Geblon. Teraz kup produkt na Allegro i podaj w wiadomości ten sam e-mail.');
wireForm('kontakt-form', 'Dziękujemy! Odpowiemy najszybciej, jak to możliwe.');

/* ---------- Rok w stopce ---------- */
document.getElementById('rok').textContent = new Date().getFullYear();
