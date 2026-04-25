class YandexSaver {
    constructor() {
        this.clientId = 'a0731d71573f4d0a8e40b05760f1badb';
        this.redirectUri = 'https://medushenko.github.io/Yandex-Saver/callback.html';
        this.authUrl = 'https://oauth.yandex.ru/authorize';
        this.tokenUrl = 'https://oauth.yandex.ru/token';
        this.diskApiUrl = 'https://cloud-api.yandex.net/v1/disk';
        
        this.selectedFolder = '/MySaver';
        this.links = [];
        this.processing = false;
        
        this.init();
    }

    init() {
        this.bindEvents();
        this.setupMessageListener();
        this.checkAuth();
    }

    // Остальной код с методами авторизации, работы с папками и копированием
    // ...

    async copyFiles() {
        if (!this.processing) {
            this.processing = true;
            const links = this.links.split('\n').filter(link =>
