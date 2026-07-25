/* ==========================================================
   Y-CARD — main.js
   يحوي: (1) تفعيل Ripple/Bounce على كل عناصر التفاعل في كل صفحة،
         (2) Staggered Intro Animation لصفحات البطاقة (ar/en)،
         (3) منطق الانتقال المتأخر الخاص بصفحة اختيار اللغة.
   ========================================================== */

const NAVIGATION_DELAY_MS = 420; // يطابق مدة scale (fast) + fade (medium)
const INTRO_STAGGER_MS = 45; // بين 40~50ms كما تنص المواصفة

/* ---------- Staggered Intro Animation (صفحات البطاقة) ---------- */
function initIntroAnimation() {
  const card = document.querySelector('.card');
  if (!card) return; // هذه الوظيفة خاصة بصفحات ar.html/en.html فقط

  // الترتيب الحرفي المطلوب في المواصفة:
  // الصورة ← الاسم ← المسمى الوظيفي ← الإيميل ← Add to Contacts ← Call ← كل البطاقات
  const introItems = [
    document.querySelector('.profile-image-wrapper'),
    document.querySelector('.name'),
    document.querySelector('.job-title'),
    document.querySelector('.email-link'),
    document.querySelector('.btn--add-contact'),
    ...document.querySelectorAll('.contact-card'), // Call هي أول بطاقة هنا
    document.querySelector('.lang-btn'),
  ].filter(Boolean);

  introItems.forEach((el) => el.classList.add('intro-item'));

  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  // بعد انتهاء حركة الظهور، نزيل الأصناف المؤقتة فورًا حتى لا يبقى
  // تعريف transition الخاص بالمقدمة مسيطرًا على تعريف transition
  // الخاص بحركات Hover المعرّفة لاحقًا لنفس العناصر (.contact-card/.btn/.lang-btn)
  function cleanupAfterReveal(el) {
    el.addEventListener(
      'transitionend',
      function handler(event) {
        if (event.propertyName === 'opacity') {
          el.classList.remove('intro-item', 'intro-visible');
          el.removeEventListener('transitionend', handler);
        }
      }
    );
  }

  if (prefersReducedMotion) {
    introItems.forEach((el) => {
      cleanupAfterReveal(el);
      el.classList.add('intro-visible');
    });
    return;
  }

  // انتظار إطارين قبل البدء لضمان أن حالة opacity:0 قد رُسمت فعليًا
  // (وإلا قد لا يُشغّل المتصفح الـ transition عند أول عنصر)
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      introItems.forEach((el, index) => {
        setTimeout(() => {
          cleanupAfterReveal(el);
          el.classList.add('intro-visible');
        }, index * INTRO_STAGGER_MS);
      });
    });
  });
}

/* ---------- Delayed Navigation (Ripple/Fade Out → then navigate) ----------
   عام لكل روابط التنقل بين صفحات المشروع:
   - .lang-option في index.html (اختيار اللغة)
   - .lang-btn في ar.html/en.html (تبديل اللغة)
   ========================================================== */
function initDelayedNavigation(selector) {
  const elements = document.querySelectorAll(selector);
  if (elements.length === 0) return;

  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  elements.forEach((el) => {
    el.addEventListener('click', (event) => {
      const destination = el.getAttribute('href');
      if (!destination) return;

      event.preventDefault();

      if (prefersReducedMotion) {
        window.location.href = destination;
        return;
      }

      el.classList.add('is-leaving');

      // تعتيم الزر الشقيق في صفحة اللغة فقط (لا وجود له في زر تبديل اللغة)
      const siblingGroup = el.closest('.language-select__options');
      if (siblingGroup) {
        siblingGroup.classList.add('is-transitioning');
      }

      setTimeout(() => {
        window.location.href = destination;
      }, NAVIGATION_DELAY_MS);
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initIntroAnimation();

  // تفاعلات فورية عامة: تعمل في كل الصفحات (بطاقات التواصل + الأزرار)
  const interactiveSelector = '.contact-card, .btn, .lang-btn';
  if (document.querySelector(interactiveSelector)) {
    initRipple(interactiveSelector);
    initBounce(interactiveSelector);
  }

  // انتقال متأخر (Ripple/Fade → Navigate) بين كل صفحات المشروع
  initRipple('.lang-option');
  initDelayedNavigation('.lang-option'); // index.html → ar.html/en.html
  initDelayedNavigation('.lang-btn');    // ar.html ↔ en.html
});
