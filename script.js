class YandexSaver {
    constructor() {
        this.clientId = 'YOUR_CLIENT_ID';
        this.redirectUri = 'https://your-username.github.io/callback.html';
        this.authUrl = 'https://oauth.yandex.ru/authorize';
        this.tokenUrl = 'https://oauth.yandex.ru/token';
        this.diskApiUrl = 'https://cloud-api.yandex.net/v1/disk';
        
        this.selectedFolder = '/saved-materials';
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
