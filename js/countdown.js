const urlParams = new URLSearchParams(window.location.search);
const product = urlParams.get('product') || '';
const pkg = urlParams.get('package') || '';
let downloadUrl = '';
let countdown = CONFIG.settings.countdownSeconds || 15;
const radius = 70;
const circumference = 2 * Math.PI * radius;

function init() {
    document.getElementById('countdown').textContent = countdown;
    if (product === 'rcgram' && CONFIG.products.rcgram) {
        const data = CONFIG.products.rcgram;
        downloadUrl = data.download;
        document.getElementById('productName').textContent = data.name;
        document.getElementById('productVersion').textContent = 'Version ' + data.version;
    } else if (product === 'rcwhatsapp' && CONFIG.products.rcwhatsapp) {
        const rcwa = CONFIG.products.rcwhatsapp;
        if (pkg && rcwa.packages[pkg]) {
            const packageData = rcwa.packages[pkg];
            downloadUrl = packageData.download;
            document.getElementById('productName').textContent = rcwa.name + ' - ' + packageData.name;
            document.getElementById('productVersion').textContent = 'Version ' + rcwa.version + ' • ' + packageData.title;
        } else {
            const firstKey = Object.keys(rcwa.packages)[0];
            const firstPkg = rcwa.packages[firstKey];
            downloadUrl = firstPkg.download;
            document.getElementById('productName').textContent = rcwa.name;
            document.getElementById('productVersion').textContent = 'Version ' + rcwa.version;
        }
    }
    document.getElementById('skipBtn').href = downloadUrl || 'index.html';
    if (downloadUrl) {
        startCountdown();
    } else {
        document.getElementById('productName').textContent = 'Product not found';
        document.getElementById('productVersion').textContent = 'Please go back and try again';
    }
}

function startCountdown() {
    const progressEl = document.querySelector('.timer-progress');
    const numberEl = document.getElementById('countdown');
    const skipBtn = document.getElementById('skipBtn');
    const totalSeconds = countdown;
    progressEl.style.strokeDasharray = circumference;
    progressEl.style.strokeDashoffset = 0;

    const interval = setInterval(() => {
        countdown--;
        numberEl.textContent = countdown;
        const offset = circumference * (1 - countdown / totalSeconds);
        progressEl.style.strokeDashoffset = offset;
        if (countdown <= 0) {
            clearInterval(interval);
            skipBtn.classList.add('show');
            window.location.href = downloadUrl;
        }
    }, 1000);
}

init();
