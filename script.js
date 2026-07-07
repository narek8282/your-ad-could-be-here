const copy = {
  ru: {
    navIdea: "Идея",
    navSlots: "Слоты",
    navMotion: "Опыт",
    navContact: "Заявка",
    heroMicro: "Вирусный антифильм армянского автора",
    heroText: "Фильм, где реклама не прерывает историю. Реклама становится историей.",
    heroCta: "Запросить слот",
    heroAlt: "Понять концепт",
    signalOneLabel: "Формат",
    signalOneValue: "Anti-film / stunt",
    signalTwoLabel: "Фокус",
    signalTwoValue: "Diaspora first",
    signalThreeLabel: "Старт",
    signalThreeValue: "Early slots open",
    ideaMicro: "The movie about being sold to",
    ideaTitle: "Если внимание стало рынком, фильм тоже может стать рынком.",
    ideaText:
      "Проект собирается из брендов, платных сообщений, пустых рекламных экранов, титров, пикселей и абсурдных интеграций. Каждый участник покупает не баннер, а место в культурном эксперименте.",
    mOneTitle: "No normal plot",
    mOneText: "Сюжет появляется из того, кто купил место, что он сказал и как это врезалось в кадр.",
    mTwoTitle: "No fake seriousness",
    mTwoText: "Это честно абсурдный проект о том, как реклама съедает любую поверхность.",
    mThreeTitle: "No paid hosting needed",
    mThreeText: "MVP живет бесплатно на GitHub Pages. Деньги лучше тратить на первые слоты и PR.",
    slotsMicro: "Available surfaces",
    slotsTitle: "Каждый слот выглядит как часть фильма, а не как обычная реклама.",
    slotOneTitle: "Scene placement",
    slotOneText: "Бренд появляется как объект, экран, фраза или короткая визуальная вставка.",
    slotTwoTitle: "Pixel wall",
    slotTwoText: "Место в сетке экранов, где маленький бренд может стать заметной частью большого кадра.",
    slotThreeTitle: "Ticker message",
    slotThreeText: "Короткое платное сообщение, бегущая строка, титр или warning внутри фильма.",
    motionMicro: "Designed for cold outreach",
    motionTitle: "Сайт должен быстро объяснять идею без звонка.",
    motionText:
      "Человек открывает ссылку, за 15 секунд понимает: это странно, визуально сильно и можно стать одним из первых участников до выхода проекта шире в США.",
    motionOne: "RU/EN переключатель для Армении, диаспоры и США.",
    motionTwo: "Заявка через email или Telegram, без платного backend.",
    motionThree: "Визуал держится на концепте: реклама как сюжет.",
    contactMicro: "Early participant request",
    contactTitle: "Want your ad here?",
    contactText: "Напишите коротко бренд, ссылку и какой формат интересен. Сейчас открыты только первые ранние слоты.",
    emailCta: "Email заявка",
    telegramCta: "Telegram",
    contactNote: "Без звонка. Сначала отправляем concept.",
    footerText: "Attention is the plot."
  },
  en: {
    navIdea: "Idea",
    navSlots: "Slots",
    navMotion: "Experience",
    navContact: "Request",
    heroMicro: "A viral anti-film by an Armenian creator",
    heroText: "A film where ads do not interrupt the story. Advertising becomes the story.",
    heroCta: "Request a slot",
    heroAlt: "Understand the concept",
    signalOneLabel: "Format",
    signalOneValue: "Anti-film / stunt",
    signalTwoLabel: "Focus",
    signalTwoValue: "Diaspora first",
    signalThreeLabel: "Launch",
    signalThreeValue: "Early slots open",
    ideaMicro: "The movie about being sold to",
    ideaTitle: "If attention became a market, the film can become a market too.",
    ideaText:
      "The project is built from brands, paid messages, empty ad screens, credits, pixels, and absurd integrations. Each participant is not buying a banner. They are buying a place inside a cultural experiment.",
    mOneTitle: "No normal plot",
    mOneText: "The plot appears from who bought a place, what they said, and how it cuts into the frame.",
    mTwoTitle: "No fake seriousness",
    mTwoText: "It is honestly absurd: a project about advertising eating every available surface.",
    mThreeTitle: "No paid hosting needed",
    mThreeText: "The MVP runs free on GitHub Pages. Money is better spent on first slots and PR.",
    slotsMicro: "Available surfaces",
    slotsTitle: "Every slot feels like part of the film, not a normal ad.",
    slotOneTitle: "Scene placement",
    slotOneText: "A brand appears as an object, screen, phrase, or short visual insert.",
    slotTwoTitle: "Pixel wall",
    slotTwoText: "A place in the screen grid where a small brand can become part of a big frame.",
    slotThreeTitle: "Ticker message",
    slotThreeText: "A short paid message, ticker, title card, or warning inside the film.",
    motionMicro: "Designed for cold outreach",
    motionTitle: "The site needs to explain the idea without a call.",
    motionText:
      "Someone opens the link and understands in 15 seconds: it is strange, visually strong, and they can become one of the first participants before the project opens wider in the US.",
    motionOne: "RU/EN switching for Armenia, diaspora, and the US.",
    motionTwo: "Requests through email or Telegram, with no paid backend.",
    motionThree: "The visual system stays on concept: advertising as the story.",
    contactMicro: "Early participant request",
    contactTitle: "Want your ad here?",
    contactText: "Send your brand, link, and the format you are interested in. Only the first early slots are open now.",
    emailCta: "Email request",
    telegramCta: "Telegram",
    contactNote: "No call needed. Send the concept first.",
    footerText: "Attention is the plot."
  }
};

const languageButtons = document.querySelectorAll("[data-lang]");
const translatableNodes = document.querySelectorAll("[data-i18n]");

function setLanguage(language) {
  const dictionary = copy[language] || copy.ru;

  translatableNodes.forEach((node) => {
    const key = node.dataset.i18n;
    if (dictionary[key]) {
      node.textContent = dictionary[key];
    }
  });

  languageButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.lang === language);
  });

  document.documentElement.lang = language;
  localStorage.setItem("yacbh-language", language);
}

languageButtons.forEach((button) => {
  button.addEventListener("click", () => setLanguage(button.dataset.lang));
});

setLanguage(localStorage.getItem("yacbh-language") || "ru");

const canvas = document.querySelector(".signal-canvas");
const context = canvas.getContext("2d");
const dots = [];

function resizeCanvas() {
  const ratio = window.devicePixelRatio || 1;
  canvas.width = Math.floor(window.innerWidth * ratio);
  canvas.height = Math.floor(window.innerHeight * ratio);
  canvas.style.width = `${window.innerWidth}px`;
  canvas.style.height = `${window.innerHeight}px`;
  context.setTransform(ratio, 0, 0, ratio, 0, 0);
}

function seedDots() {
  dots.length = 0;
  const count = Math.min(90, Math.max(36, Math.floor(window.innerWidth / 18)));

  for (let index = 0; index < count; index += 1) {
    dots.push({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      speed: 0.18 + Math.random() * 0.42,
      size: 1 + Math.random() * 2.2,
      glow: Math.random() > 0.82
    });
  }
}

function drawSignals() {
  context.clearRect(0, 0, window.innerWidth, window.innerHeight);

  dots.forEach((dot, index) => {
    dot.y += dot.speed;
    if (dot.y > window.innerHeight + 10) {
      dot.y = -10;
      dot.x = Math.random() * window.innerWidth;
    }

    context.fillStyle = dot.glow ? "rgba(240, 68, 68, 0.72)" : "rgba(84, 196, 230, 0.34)";
    context.fillRect(dot.x, dot.y, dot.size, dot.size);

    const next = dots[index + 1];
    if (next && Math.abs(next.x - dot.x) < 110 && Math.abs(next.y - dot.y) < 90) {
      context.strokeStyle = "rgba(255, 255, 255, 0.04)";
      context.beginPath();
      context.moveTo(dot.x, dot.y);
      context.lineTo(next.x, next.y);
      context.stroke();
    }
  });

  requestAnimationFrame(drawSignals);
}

resizeCanvas();
seedDots();
drawSignals();

window.addEventListener("resize", () => {
  resizeCanvas();
  seedDots();
});
