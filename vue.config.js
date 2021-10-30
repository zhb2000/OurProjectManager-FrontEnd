module.exports = {
    css: {
        extract: false
    },

    chainWebpack: config => {
        config.plugin('html').tap(args => {
            args[0].title = 'Our Project Manager';
            return args;
        });
    }
};
