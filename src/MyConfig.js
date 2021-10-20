const baseURL = 'http://47.96.23.180:8080';
// const baseURL = 'http://localhost:8080';

const routerMode = 'hash';
// const routerMode = 'history';

function projectUrlPrefix() {
    return (routerMode === 'hash')
        ? `${baseURL}/#/projects/`
        : `${baseURL}/projects/`;
}

export { baseURL, routerMode, projectUrlPrefix };
