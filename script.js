/* ============================================================
   ИКОНКИ (Solid) для капчи
   ============================================================ */
const ICONS = {
    shield: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#1db954"><path d="M12 2L4 5v6c0 5.55 3.84 10.74 8 11 4.16-.26 8-5.45 8-11V5l-8-3zm-1.4 14.5L7 12.9l1.4-1.4 2.2 2.2 4.6-4.6 1.4 1.4-5.9 6z"/></svg>`,
    lightning: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#bfff00"><path d="M13 2L3 14h7v8l10-12h-7V2z"/></svg>`,
    globe: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#1db954"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>`,
    lock: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#1db954"><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/></svg>`,
    key: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#1db954"><path d="M12.65 10C11.83 7.67 9.61 6 7 6c-3.31 0-6 2.69-6 6s2.69 6 6 6c2.61 0 4.83-1.67 5.65-4H17v4h4v-4h2v-4H12.65zM7 14c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/></svg>`,
    wifi: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#1db954"><path d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.08 2.93 1 9zm8 8l3 3 3-3c-1.65-1.66-4.34-1.66-6 0zm-4-4l2 2c2.76-2.76 7.24-2.76 10 0l2-2C15.14 9.14 8.87 9.14 5 13z" fill="#bfff00"/></svg>`,
    eye: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#1db954"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg>`
};

const NAMES = {
    shield: 'Щит', lightning: 'Молнию', globe: 'Глобус', lock: 'Замок',
    key: 'Ключ', wifi: 'Wi-Fi', eye: 'Глаз'
};

const KEYS = Object.keys(ICONS);

/* ============================================================
   ЛОГИКА КАПЧИ
   ============================================================ */
const grid = document.getElementById('grid');
const targetName = document.getElementById('targetName');
const overlay = document.getElementById('overlay');
const resultCircle = document.getElementById('resultCircle');
const resultText = document.getElementById('resultText');
const restartBtn = document.getElementById('restartBtn');
const dots = document.querySelectorAll('.dot');
const hint = document.getElementById('hint');

let target = null;
let attemptsLeft = 3;
let locked = false;

function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

function initCaptcha() {
    locked = false;
    attemptsLeft = 3;
    overlay.classList.remove('show');
    restartBtn.style.display = 'none';
    hint.textContent = 'У вас 3 попытки';
    hint.classList.remove('error');
    dots.forEach(d => d.classList.remove('used'));
    targetName.style.color = 'var(--text)';

    const shuffledKeys = shuffle(KEYS);
    target = shuffledKeys[0];
    const chosen = shuffledKeys.slice(0, 6);
    const layout = shuffle(chosen);

    targetName.textContent = NAMES[target];

    grid.innerHTML = '';
    layout.forEach(key => {
        const card = document.createElement('div');
        card.className = 'card';
        card.dataset.key = key;
        card.innerHTML = ICONS[key];
        card.addEventListener('click', () => handlePick(card, key));
        grid.appendChild(card);
    });
}

function handlePick(card, key) {
    if (locked) return;
    if (card.classList.contains('correct') || card.classList.contains('wrong')) return;

    if (key === target) {
        locked = true;
        card.classList.add('correct');
        showSuccess();
    } else {
        card.classList.add('wrong');
        attemptsLeft--;
        dots[attemptsLeft].classList.add('used');

        hint.textContent = attemptsLeft > 0
            ? `Неверно. Осталось: ${attemptsLeft}`
            : 'Попытки исчерпаны';
        hint.classList.add('error');

        if (attemptsLeft <= 0) {
            locked = true;
            setTimeout(showFailure, 600);
        }
    }
}

function showSuccess() {
    resultCircle.innerHTML = `
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="44" fill="none" stroke="#1db954" stroke-width="4"/>
            <path class="check-path" d="M30 52 L 44 66 L 72 36"
                fill="none" stroke="#bfff00" stroke-width="6"
                stroke-linecap="round" stroke-linejoin="round"/>
        </svg>`;
    resultText.textContent = 'Проверка пройдена';
    resultText.style.color = '#1db954';
    restartBtn.style.display = 'none';
    overlay.classList.add('show');
    targetName.style.color = '#1db954';

    setTimeout(() => {
        document.getElementById('captcha-screen').classList.remove('active');
        document.getElementById('main-content').classList.add('show');
    }, 1500);
}

function showFailure() {
    resultCircle.innerHTML = `
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="44" fill="none" stroke="#d15468" stroke-width="4"/>
            <path class="cross-path" d="M34 34 L 66 66"
                fill="none" stroke="#d15468" stroke-width="6" stroke-linecap="round"/>
            <path class="cross-path" d="M66 34 L 34 66"
                fill="none" stroke="#d15468" stroke-width="6" stroke-linecap="round"
                style="transition-delay:0.3s"/>
        </svg>`;
    resultText.textContent = 'Доступ закрыт';
    resultText.style.color = '#d15468';
    targetName.style.color = '#d15468';
    restartBtn.style.display = 'inline-block';
    overlay.classList.add('show');
}

restartBtn.addEventListener('click', () => {
    overlay.classList.remove('show');
    setTimeout(initCaptcha, 300);
});


/* ============================================================
   ЛОГИКА САЙТА (ШАГИ)
   ============================================================ */
const SUB_URL = "https://clck.ru/3Wnqdy"; 
let currentApp = '';

const apps = {
    happ: {
        name: 'Happ',
        download: 'https://play.google.com/store/apps/details?id=com.happproxy',
        import: `happ://add/${SUB_URL}`,
        note: ''
    },
    incy: {
        name: 'Incy',
        download: 'https://play.google.com/store/apps/details?id=llc.itdev.incy',
        import: `incy://add/${SUB_URL}`,
        note: ''
    },
    v2rayng: {
        name: 'V2rayNG',
        download: 'https://github.com/2dust/v2rayNG/releases/latest', 
        import: `v2rayng://install-config?url=${SUB_URL}`,
        note: 'Советуем v2rayNG_universal.apk'
    },
    v2raytun: {
        name: 'V2rayTun',
        download: 'https://play.google.com/store/apps/details?id=com.v2raytun.android',
        import: `v2raytun://import/${SUB_URL}`,
        note: ''
    },
    hiddify: {
        name: 'Hiddify',
        download: 'https://play.google.com/store/apps/details?id=app.hiddify.com',
        import: `hiddify://import/${SUB_URL}`,
        note: ''
    }
};

function goToStep(step, app = null) {
    if (app) currentApp = app;
    
    document.querySelectorAll('.step').forEach(el => el.classList.remove('active'));
    const target = document.getElementById(`step-${step}`);
    if (target) target.classList.add('active');

    if (step === 2 && currentApp) {
        const data = apps[currentApp];
        document.getElementById('step-2-title').textContent = `Скачайте ${data.name}`;
        
        const downloadBtn = document.getElementById('download-link');
        
        downloadBtn.removeAttribute('download');
        downloadBtn.href = data.download;
        
        const noteEl = document.getElementById('step-2-note');
        if (data.note) {
            noteEl.textContent = data.note;
            noteEl.style.display = 'block';
        } else {
            noteEl.style.display = 'none';
        }
    }

    if (step === 3 && currentApp) {
        const data = apps[currentApp];
        document.getElementById('step-3-app-name').textContent = data.name;
        document.getElementById('import-link').href = data.import;
        document.getElementById('import-link').textContent = `Импортировать в ${data.name}`;
    }
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function copyLink() {
    const input = document.getElementById('sub-url');
    input.select();
    input.setSelectionRange(0, 99999);
    
    try {
        navigator.clipboard.writeText(input.value).then(() => {
            const btn = document.getElementById('copy-btn');
            const originalText = btn.textContent;
            btn.textContent = '✓ Готово';
            btn.style.color = 'var(--brand-green)';
            setTimeout(() => {
                btn.textContent = originalText;
                btn.style.color = 'var(--brand-green)';
            }, 2000);
        });
    } catch (err) {
        document.execCommand('copy');
        alert('Ссылка скопирована');
    }
}

initCaptcha();
