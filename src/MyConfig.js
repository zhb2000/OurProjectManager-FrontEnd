const baseURL = 'http://47.96.23.180:8080';
// const baseURL = 'http://localhost:8080';

const routerMode = 'hash';
// const routerMode = 'history';

function projectUrlPrefix() {
    const base = 'http://47.96.23.180';
    // const base = 'http://localhost';
    return (routerMode === 'hash')
        ? `${base}/#/projects/`
        : `${base}/projects/`;
}

export { baseURL, routerMode, projectUrlPrefix };
