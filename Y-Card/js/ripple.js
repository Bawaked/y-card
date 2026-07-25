/* ==========================================================
   Y-CARD — ripple.js
   تأثير Ripple عام وقابل لإعادة الاستخدام. يُستدعى عبر:
   initRipple('.selector')
   يتطلب أن يكون العنصر المستهدف: position:relative; overflow:hidden;
   ========================================================== */

function initRipple(selector) {
  const elements = document.querySelectorAll(selector);

  elements.forEach((el) => {
    el.addEventListener('click', (event) => {
      const rect = el.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);

      const ripple = document.createElement('span');
      ripple.className = 'ripple';
      ripple.style.width = `${size}px`;
      ripple.style.height = `${size}px`;
      ripple.style.left = `${event.clientX - rect.left - size / 2}px`;
      ripple.style.top = `${event.clientY - rect.top - size / 2}px`;

      el.appendChild(ripple);

      ripple.addEventListener('animationend', () => ripple.remove());
    });
  });
}

/* ==========================================================
   initBounce — تأثير ارتداد بسيط بعد الضغط (Scale 0.96 → 1.03 → 1)
   يُستخدم مع نفس العناصر التي تستخدم initRipple.
   ========================================================== */
function initBounce(selector) {
  const elements = document.querySelectorAll(selector);

  elements.forEach((el) => {
    el.addEventListener('click', () => {
      el.classList.remove('is-bouncing');
      void el.offsetWidth; // إعادة تشغيل الحركة حتى مع نقرات متتالية سريعة
      el.classList.add('is-bouncing');
    });

    el.addEventListener('animationend', (event) => {
      if (event.animationName === 'btn-bounce') {
        el.classList.remove('is-bouncing');
      }
    });
  });
}
