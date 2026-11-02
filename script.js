const SUB_URL = "https://clck.ru/3Wnqdy";

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