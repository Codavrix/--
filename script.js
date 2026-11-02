/* ============================================================
   ИКОНКИ (Unslop style, 1.5px stroke)
   ============================================================ */
const ICONS = {
    shield: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#888888" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
    lightning: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#888888" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>`,
    globe: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#888888" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`,
    lock: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#888888" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`,
    key: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#888888" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/></svg>`,
    wifi: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#888888" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/></svg>`,
    eye: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#888888" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`
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
            <circle cx="50" cy="50" r="44" fill="none" stroke="#22c55e" stroke-width="2"/>
            <path d="M30 52 L 44 66 L 72 36" fill="none" stroke="#22c55e" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>`;
    resultText.textContent = 'Проверка пройдена';
    resultText.style.color = '#22c55e';
    restartBtn.style.display = 'none';
    overlay.classList.add('show');

    setTimeout(() => {
        document.getElementById('captcha-screen').classList.remove('active');
        document.getElementById('main-content').classList.add('show');
    }, 1500);
}

function showFailure() {
    resultCircle.innerHTML = `
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="44" fill="none" stroke="#ef4444" stroke-width="2"/>
            <path d="M34 34 L 66 66M66 34 L 34 66" fill="none" stroke="#ef4444" stroke-width="3" stroke-linecap="round"/>
        </svg>`;
    resultText.textContent = 'Доступ закрыт';
    resultText.style.color = '#ef4444';
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
        note: 'Рекомендуется v2rayNG_universal.apk'
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
            btn.textContent = 'Скопировано';
            setTimeout(() => {
                btn.textContent = originalText;
            }, 2000);
        });
    } catch (err) {
        document.execCommand('copy');
        alert('Ссылка скопирована');
    }
}

initCaptcha();
