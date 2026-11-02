const SUB_URL = "https://clck.ru/3Wnqdy";

// Simple visual entry check (client-side only; not server-side security).
const CAPTCHA_ICONS = {
  shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
  lightning: '<path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>',
  globe: '<circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20"/>',
  lock: '<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
  key: '<circle cx="8" cy="15" r="5"/><path d="m12 11 9-9m-4 4 3 3m-6 0 3 3"/>',
  wifi: '<path d="M2 8a16 16 0 0 1 20 0M5 12a11 11 0 0 1 14 0m-11 4a6 6 0 0 1 6 0"/><path d="M12 20h.01"/>',
  eye: '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z"/><circle cx="12" cy="12" r="3"/>'
};
const CAPTCHA_NAMES = {shield:"Щит",lightning:"Молнию",globe:"Глобус",lock:"Замок",key:"Ключ",wifi:"Wi-Fi",eye:"Глаз"};
const captchaGrid = document.getElementById("captcha-grid");
const captchaTarget = document.getElementById("captcha-target");
const captchaOverlay = document.getElementById("captcha-overlay");
const captchaHint = document.getElementById("captcha-hint");
const captchaDots = document.querySelectorAll("#captcha-attempts i");
let captchaAnswer = "";
let captchaLeft = 3;
let captchaLocked = false;

function shuffleItems(items) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}
function captchaSvg(key) {
  return '<svg viewBox="0 0 24 24" fill="none" stroke="#b7f36b" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + CAPTCHA_ICONS[key] + '</svg>';
}
function initCaptcha() {
  captchaLeft = 3;
  captchaLocked = false;
  captchaOverlay.classList.remove("show");
  document.getElementById("captcha-restart").hidden = true;
  captchaHint.textContent = "У вас 3 попытки";
  captchaHint.classList.remove("error");
  captchaDots.forEach(dot => dot.classList.remove("used"));
  const keys = shuffleItems(Object.keys(CAPTCHA_ICONS));
  captchaAnswer = keys[0];
  captchaTarget.textContent = CAPTCHA_NAMES[captchaAnswer];
  captchaGrid.innerHTML = "";
  shuffleItems(keys.slice(0, 6)).forEach(key => {
    const tile = document.createElement("button");
    tile.type = "button";
    tile.className = "captcha-tile";
    tile.setAttribute("aria-label", CAPTCHA_NAMES[key] || key);
    tile.innerHTML = captchaSvg(key);
    tile.addEventListener("click", () => pickCaptcha(tile, key));
    captchaGrid.appendChild(tile);
  });
}
function captchaResult(success) {
  captchaLocked = true;
  document.getElementById("captcha-result-icon").innerHTML = success
    ? '<svg viewBox="0 0 60 60" fill="none" stroke="#b7f36b" stroke-width="2.5"><circle cx="30" cy="30" r="25"/><path d="m17 30 9 9 18-20" stroke-linecap="round" stroke-linejoin="round"/></svg>'
    : '<svg viewBox="0 0 60 60" fill="none" stroke="#ef6969" stroke-width="2.5"><circle cx="30" cy="30" r="25"/><path d="m20 20 20 20m0-20L20 40" stroke-linecap="round"/></svg>';
  document.getElementById("captcha-result-text").textContent = success ? "Проверка пройдена" : "Попытки закончились";
  document.getElementById("captcha-restart").hidden = success;
  captchaOverlay.classList.add("show");
  if (success) {
    window.setTimeout(() => {
      document.getElementById("captcha-screen").hidden = true;
      document.getElementById("site-content").hidden = false;
    }, 850);
  }
}
function pickCaptcha(tile, key) {
  if (captchaLocked || tile.classList.contains("wrong")) return;
  if (key === captchaAnswer) {
    tile.classList.add("correct");
    captchaResult(true);
    return;
  }
  tile.classList.add("wrong");
  captchaLeft--;
  captchaDots[captchaLeft].classList.add("used");
  captchaHint.textContent = captchaLeft ? "Неверно. Осталось: " + captchaLeft : "Попытки закончились";
  captchaHint.classList.add("error");
  if (!captchaLeft) window.setTimeout(() => captchaResult(false), 450);
}
document.getElementById("captcha-restart").addEventListener("click", initCaptcha);
initCaptcha();

const apps = {
  happ: {
    name: "Happ",
    icon: "H",
    download: "https://play.google.com/store/apps/details?id=com.happproxy",
    import: "happ://add/" + SUB_URL
  },
  incy: {
    name: "Incy",
    icon: "I",
    download: "https://play.google.com/store/apps/details?id=llc.itdev.incy",
    import: "incy://add/" + SUB_URL
  },
  v2rayng: {
    name: "V2rayNG",
    icon: "V",
    download: "https://github.com/2dust/v2rayNG/releases/latest",
    import: "v2rayng://install-config?url=" + encodeURIComponent(SUB_URL),
    note: "Для большинства Android-устройств подойдёт универсальная APK-версия."
  },
  v2raytun: {
    name: "V2rayTun",
    icon: "T",
    download: "https://play.google.com/store/apps/details?id=com.v2raytun.android",
    import: "v2raytun://import/" + SUB_URL
  },
  hiddify: {
    name: "Hiddify",
    icon: "H",
    download: "https://play.google.com/store/apps/details?id=app.hiddify.com",
    import: "hiddify://import/" + SUB_URL
  }
};

let selectedApp = null;
const steps = Array.from(document.querySelectorAll(".step"));
const counter = document.getElementById("step-counter");
const progress = document.getElementById("progress-fill");

function showStep(number) {
  steps.forEach((step) => step.classList.toggle("active", step.id === "step-" + number));
  counter.innerHTML = "0" + number + ' <i>/ 03</i>';
  progress.style.width = (number / 3 * 100) + "%";
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function selectApp(key) {
  const app = apps[key];
  if (!app) return;
  selectedApp = key;

  document.getElementById("selected-icon").textContent = app.icon;
  document.getElementById("download-title").textContent = "Установите " + app.name;

  const downloadLink = document.getElementById("download-link");
  downloadLink.href = app.download;

  const note = document.getElementById("download-note");
  note.hidden = !app.note;
  note.textContent = app.note || "";

  const importLink = document.getElementById("import-link");
  importLink.href = app.import;
  importLink.innerHTML = "Открыть в " + app.name + ' <span>↗</span>';

  showStep(2);
}

document.querySelectorAll("[data-app]").forEach((button) => {
  button.addEventListener("click", () => selectApp(button.dataset.app));
});

document.querySelectorAll("[data-back]").forEach((button) => {
  button.addEventListener("click", () => showStep(Number(button.dataset.back)));
});

document.querySelectorAll("[data-next]").forEach((button) => {
  button.addEventListener("click", () => {
    if (!selectedApp) return;
    showStep(Number(button.dataset.next));
  });
});

document.getElementById("copy-btn").addEventListener("click", async () => {
  const input = document.getElementById("sub-url");
  const feedback = document.getElementById("copy-feedback");
  const button = document.getElementById("copy-btn");

  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(SUB_URL);
    } else {
      input.focus();
      input.select();
      const copied = document.execCommand("copy");
      if (!copied) throw new Error("Copy command failed");
    }
    button.textContent = "Готово ✓";
    feedback.textContent = "Ссылка скопирована.";
  } catch (error) {
    feedback.textContent = "Не удалось скопировать автоматически — выделите ссылку вручную.";
    input.focus();
    input.select();
  }

  window.setTimeout(() => {
    button.textContent = "Копировать";
  }, 2200);
});

document.getElementById("sub-url").value = SUB_URL;