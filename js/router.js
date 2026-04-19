const Router = {
    routes: {},
    hooks: {
        beforeEach: []
    },

    add(path, callback) {
        this.routes[path] = callback;
    },

    beforeEach(callback) {
        this.hooks.beforeEach.push(callback);
    },

    navigate(path) {
        window.location.hash = path;
    },

    init() {
        window.addEventListener('hashchange', () => this.handleRoute());
        this.handleRoute(); // Call initially
    },

    async handleRoute() {
        let path = window.location.hash || '#/';
        
        // Strip out query params for route matching, if any (e.g. #/login?type=patient)
        const pathOnly = path.split('?')[0];

        // Run guards
        for (let hook of this.hooks.beforeEach) {
            const redirect = hook(pathOnly);
            if (redirect) {
                this.navigate(redirect);
                return;
            }
        }

        const cb = this.routes[pathOnly];
        const container = document.getElementById('main-content');
        container.innerHTML = '';
        
        if (cb) {
            const content = await cb();
            if (typeof content === 'string') {
                container.innerHTML = content;
            } else if (content instanceof HTMLElement) {
                container.appendChild(content);
            }
        } else {
            container.innerHTML = '<div class="card"><h2>404 - Page Not Found</h2><a href="#/" class="btn btn-primary mt-4">Go Home</a></div>';
        }
        
        // Trigger generic render events if components need to mount things
        const event = new Event('route-rendered');
        document.dispatchEvent(event);
    }
};

window.Router = Router;
