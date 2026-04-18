class YandexSaver {
    constructor() {
        this.CLIENT_ID = 'a0731d71573f4d0a8e40b05760f1badb';
        this.accessToken = null;
        this.links = [];
        this.logs = [];

        this.init();
    }

    init() {
        this.bindEvents();
        this.checkAuth();
    }

    bindEvents() {
        document.getElementById('authBtn').addEventListener('click', () => this.authorize());
        document.getElementById('extractBtn').addEventListener('click', () => this.extractLinks());
        document.getElementById('downloadBtn').addEventListener('click', () => this.downloadToYandexDisk());
        document.getElementById('copyLogBtn').addEventListener('click', () => this.copyLogs());
    }

    log(message) {
        const timestamp = new Date().toLocaleTimeString();
        const logEntry = `[${timestamp}] ${message}`;
        this.logs.push(logEntry);
        this.updateStatusFrame();
    }

    updateStatusFrame() {
        const frame = document.getElementById('statusFrame');
        frame.srcdoc = this.logs.join('<br>');
    }

    async checkAuth() {
        try {
            const storedToken = localStorage.getItem('yandexAccessToken');
            if (storedToken) {
                this.accessToken = storedToken;
                this.updateAuthStatus('Авторизован', 'green');
                document.getElementById('extractBtn').disabled = false;
            } else {
                this.updateAuthStatus('Не авторизован', 'red');
            }
        } catch (error) {
            this.log(`Ошибка проверки авторизации: ${error.message}`);
        }
    }

    authorize() {
        const authUrl = `https://oauth.yandex.ru/authorize?response_type=token&client_id=${this.CLIENT_ID}`;
        window.open(authUrl, '_blank');

        window.addEventListener('message', (event) => {
            if (event.origin !== window.location.origin) return;

            const { access_token } = event.data;
            if (access_token) {
                this.accessToken = access_token;
                localStorage.setItem('yandexAccessToken', access_token);
                this.updateAuthStatus('Авторизован', 'green');
                document.getElementById('extractBtn').disabled = false;
                this.log('Успешная авторизация в Яндекс Диске');
            }
        });
    }

    updateAuthStatus(message, color) {
        const statusEl = document.getElementById('authStatus');
        statusEl.textContent = message;
        statusEl.style.color = color;
    }

    extractLinks() {
        const text = document.getElementById('inputText').value;
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        this.links = text.match(urlRegex) || [];

        const linksListEl = document.getElementById('linksList');
        linksListEl.innerHTML = '';

        if (this.links.length === 0) {
            linksListEl.innerHTML = '<p>Ссылки не найдены</p>';
            document.getElementById('downloadBtn').disabled = true;
            return;
        }

        this.links.forEach((link, index) => {
            const linkEl = document.createElement('div');
            linkEl.className = 'link-item';
            linkEl.innerHTML = `
                <input type="checkbox" id="link-${index}" checked>
                <label for="link-${index}">${link}</label>
            `;
            linksListEl.appendChild(linkEl);
        });

        document.getElementById('downloadBtn').disabled = false;
        this.log(`Найдено ${this.links.length} ссылок`);
    }

    async checkDiskSpace(totalSize) {
        try {
            const response = await fetch('https://cloud-api.yandex.net/v1/disk', {
                headers: {
                    'Authorization': `OAuth ${this.accessToken}`
                }
            });

            if (!response.ok) throw new Error('Ошибка получения информации о диске');

            const
