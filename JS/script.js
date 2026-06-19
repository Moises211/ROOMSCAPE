// @ts-check
(function () {
    const app = document.getElementById('app');
    const tutorSwitch = document.getElementById('tutorSwitch');
    const tutorMenu = document.getElementById('tutorMenu');
    const tutorButtons = document.querySelectorAll('[data-tutor-route]');
    if (!app) return;

    const ROUTES = {
        nivel1: { html: 'HTML/nivel1.html', scripts: ['JS/app-nivel1.js'], bodyClass: 'nivel2-body' },
        nivel2: { html: 'HTML/nivel2.html', scripts: ['JS/app-nivel2.js'], bodyClass: 'nivel2-body' },
        nivel3: { html: 'HTML/nivel3.html', scripts: ['JS/app-nivel3.js'], bodyClass: 'nivel3-body' },
        nivel4: { html: 'HTML/nivel4.html', scripts: ['JS/utils/simulador.js', 'JS/app-nivel4.js'], bodyClass: 'nivel3-body' },
        nivel5: { html: 'HTML/nivel5.html', scripts: ['JS/utils/simulador.js', 'JS/app-nivel5.js'], bodyClass: 'nivel3-body' }
    };

    const defaultRoute = 'nivel1';
    const routeScriptId = 'route-loader-script';

    function getRoute() {
        const hash = window.location.hash.slice(1).toLowerCase();
        return ROUTES[hash] ? hash : defaultRoute;
    }

    function updateDocumentTitle(doc) {
        const titleElement = doc.querySelector('title');
        if (titleElement && titleElement.textContent) {
            document.title = titleElement.textContent;
        }
    }

    function removeExistingRouteScripts() {
        const existingScripts = document.querySelectorAll(`script[id^="${routeScriptId}"]`);
        existingScripts.forEach((script) => script.remove());
    }

    function loadRouteScripts(sources) {
        removeExistingRouteScripts();

        if (!sources) return;
        if (!Array.isArray(sources)) sources = [sources];

        sources.forEach((src, index) => {
            if (!src) return;
            const script = document.createElement('script');
            script.id = index === 0 ? routeScriptId : `${routeScriptId}-${index}`;
            script.src = src;
            script.async = false;
            document.body.appendChild(script);
        });
    }

    async function loadRoute() {
        const route = getRoute();
        const config = ROUTES[route];

        if (!config) {
            app.innerHTML = '<div class="alert alert-danger">Ruta no encontrada.</div>';
            return;
        }

        try {
            const response = await fetch(config.html);
            if (!response.ok) {
                throw new Error('No se pudo cargar el contenido del nivel.');
            }

            const htmlText = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(htmlText, 'text/html');

            updateDocumentTitle(doc);

            const bodyContent = doc.body;
            app.innerHTML = '';
            Array.from(bodyContent.childNodes).forEach((node) => {
                if (node.nodeName === 'SCRIPT') return;
                app.appendChild(document.importNode(node, true));
            });

            document.body.className = config.bodyClass || '';
            loadRouteScripts(config.scripts);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (error) {
            app.innerHTML = `<div class="alert alert-danger">Error cargando la ruta: ${error.message}</div>`;
        }
    }

    window.addEventListener('hashchange', loadRoute);
    window.addEventListener('load', () => {
        if (!window.location.hash) {
            window.location.hash = `#${defaultRoute}`;
            loadRoute();
        } else {
            loadRoute();
        }
    });

    function setTutorMode(enabled) {
        if (!tutorMenu) return;
        if (enabled) {
            tutorMenu.classList.remove('d-none');
        } else {
            tutorMenu.classList.add('d-none');
        }
        if (tutorSwitch) {
            tutorSwitch.checked = enabled;
        }
        localStorage.setItem('roomscape_tutor', enabled ? '1' : '0');
    }

    function setupTutorMenu() {
        if (!tutorSwitch || !tutorMenu) return;

        const stored = localStorage.getItem('roomscape_tutor');
        const enabled = stored === '1';
        setTutorMode(enabled);

        tutorSwitch.addEventListener('change', () => {
            setTutorMode(tutorSwitch.checked);
        });

        tutorButtons.forEach((button) => {
            button.addEventListener('click', () => {
                const route = button.getAttribute('data-tutor-route');
                if (route && ROUTES[route]) {
                    window.location.hash = `#${route}`;
                }
            });
        });
    }

    window.AppNavigation = {
        navigate(route) {
            if (ROUTES[route]) {
                window.location.hash = `#${route}`;
            }
        }
    };

    setupTutorMenu();
})();
