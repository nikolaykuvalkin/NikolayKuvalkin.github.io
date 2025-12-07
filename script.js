document.addEventListener('DOMContentLoaded', () => {

  // =========================
  // Мобильное меню
  // =========================
  const menuBtn = document.getElementById('menuBtn');
  const nav = document.getElementById('nav');

  menuBtn?.addEventListener('click', () => {
    nav.style.display = nav.style.display === 'flex' ? 'none' : 'flex';
  });

  // =========================
  // Тёмная / светлая тема
  // =========================
  const themeToggle = document.getElementById('themeToggle');

  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    document.body.classList.toggle('light');

    localStorage.setItem(
      'theme',
      document.body.classList.contains('dark') ? 'dark' : 'light'
    );
  });

  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) document.body.className = savedTheme;



  // =========================
  // Модальное окно «Подробнее»
  // =========================
  const modal = document.getElementById('modal');
  const modalTitle = document.getElementById('modalTitle');
  const modalBody = document.getElementById('modalBody');

  document.querySelectorAll('.details-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const card = e.target.closest('.card');

      modalTitle.textContent = card.querySelector('h3').textContent;
      modalBody.innerHTML =
        card.querySelector('ul').outerHTML +
        '<p class="muted">Для уточнения стоимости — используйте калькулятор.</p>';

      modal.setAttribute('aria-hidden', 'false');
    });
  });

  document.querySelector('.modal-close').addEventListener('click', () => {
    modal.setAttribute('aria-hidden', 'true');
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.setAttribute('aria-hidden', 'true');
  });



  // =========================
  // Калькулятор стоимости
  // =========================
  const priceMap = {
    os: 1000,
    drivers: 500,
    apps: 500,
    virus: 500,
    data: 800
  };

  const calcTotal = document.getElementById('calcTotal');

  document.getElementById('calcCompute').addEventListener('click', () => {
    let total = 0;

    document
      .querySelectorAll('#calcForm input[name="opt"]:checked')
      .forEach(i => total += priceMap[i.value] || 0);

    total += Number(document.getElementById('visit').value || 0);

    calcTotal.textContent = total + ' ₽';
  });

  document.getElementById('calcBook').addEventListener('click', () => {
    const service = document.getElementById('calcService').value;
    document.getElementById('bookingService').value = service;

    location.hash = '#booking';
    window.scrollTo({
      top: document.getElementById('booking').offsetTop - 60,
      behavior: 'smooth'
    });
  });



  // =========================
  // ОНЛАЙН-ЗАПИСЬ (ТЕПЕРЬ РЕАЛЬНАЯ)
  // =========================

  const bookingForm = document.getElementById('bookingForm');
  const bookingMsg = document.getElementById('bookingMsg');
  const successModal = document.getElementById('successModal');
  const sendSound = document.getElementById('sendSound');

  // ❗ УДАЛЁН старый демо-обработчик !!

  // ===== TELEGRAM CONFIG =====
  const TG_TOKEN = "8436855252:AAGVXYykV1MOvafwJl3LVcryoHOb3DQTRBY"; 
  const TG_CHAT_ID = "769577305";


  async function sendToTelegram(data) {
    const text =
      `🆕 Новая заявка\n` +
      `Имя: ${data.name || "-"}\n` +
      `Контакт: ${data.contact || "-"}\n` +
      `Услуга: ${data.service || "-"}\n` +
      `Дата: ${data.date || "-"}\n` +
      `Комментарий: ${data.notes || "-"}`;

    return fetch(`https://api.telegram.org/bot${TG_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: TG_CHAT_ID,
        text: text
      })
    });
  }


  bookingForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(bookingForm);

    const data = {
      name: formData.get("name"),
      contact: formData.get("contact"),
      service: formData.get("service"),
      date: formData.get("date"),
      notes: formData.get("notes")
    };

    console.log("Данные которые отправляем:", data);

    await sendToTelegram(data);

    try { sendSound.currentTime = 0; sendSound.play(); } catch(e){}

    bookingMsg.textContent = "Заявка отправлена!";
    bookingMsg.style.color = "green";
    bookingMsg.classList.add("visible");

    successModal.setAttribute("aria-hidden", "false");

    bookingForm.reset();

    setTimeout(() => bookingMsg.classList.remove("visible"), 4000);
  });



  // =========================
  // Модалка «заявка отправлена»
  // =========================

  document.getElementById("openChatBtn").addEventListener("click", () => {
    window.open("https://t.me/plusstopitsot", "_blank");
  });

  document.getElementById("closeSuccessBtn").addEventListener("click", () => {
    successModal.setAttribute("aria-hidden", "true");
  });



  // =========================
  // WhatsApp
  // =========================

  document.getElementById("bookWhatsapp").addEventListener("click", () => {
    const vals = Object.fromEntries(new FormData(bookingForm).entries());

    const text = encodeURIComponent(
      `Запись:\nИмя: ${vals.name}\nКонтакт: ${vals.contact}\nУслуга: ${vals.service}\nДата: ${vals.date}\nКомментарий: ${vals.notes}`
    );

    window.open("https://wa.me/79000000000?text=" + text, "_blank");
  });



  // =========================
  // Галерея
  // =========================

  document.getElementById('galleryGrid').addEventListener('click', (e) => {
    if (e.target.tagName !== 'IMG') return;

    const src = e.target.src;

    const light = document.createElement('div');
    light.className = 'modal';
    light.style.display = 'flex';

    light.innerHTML = `
      <div class="modal-content">
        <button class="modal-close">✕</button>
        <img src="${src}" style="max-width:100%;border-radius:8px;">
      </div>
    `;

    document.body.appendChild(light);

    light.querySelector('.modal-close').addEventListener('click', () => {
      document.body.removeChild(light);
    });

    light.addEventListener('click', (ev) => {
      if (ev.target === light) document.body.removeChild(light);
    });
  });



  // =========================
  // Анимации
  // =========================

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) e.target.classList.add('in-view');
      });
    },
    { threshold: 0.15 }
  );

  document.querySelectorAll('[data-animate]').forEach((el) => observer.observe(el));


  // =========================
  // Год в футере
  // =========================

  document.getElementById('year').textContent = new Date().getFullYear();

});
// Плавный скролл с учётом высоты хедера
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener("click", function(e) {
    const targetId = this.getAttribute("href");

    if (targetId === "#" || targetId.length < 2) return;

    const el = document.querySelector(targetId);
    if (!el) return;

    e.preventDefault();

    const headerHeight = document.querySelector('.site-header').offsetHeight;

    window.scrollTo({
      top: el.offsetTop - headerHeight,
      behavior: "smooth"
    });
  });
});

