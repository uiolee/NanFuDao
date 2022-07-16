module.exports = {
    env: {
        browser: true,
        es2021: true,
        node: true,
    },
    extends: 'eslint:recommended',
    parserOptions: {
        ecmaVersion: 'latest',
    },
    rules: {
        indent: ['error', 4],
        'linebreak-style': ['error', 'unix'],
        quotes: ['error', 'single'],
        semi: ['error', 'always'],
        'curly':['warn','all'],
        'eqeqeq': ['warn', 'always'],
        'no-eval': 'error'
    },
    globals: {
        $: true,
        $request: true,
        $response: true,
        $notify: true,
        $notification: true,
        $httpClient: true,
        $task: true,
        $prefs: true,
        $persistentStore: true,
        $done: true,
    },
};
