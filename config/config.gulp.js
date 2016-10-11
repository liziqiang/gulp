var SOURCE     = './src',
    STATIC     = './build/static',
    TEMPLATE   = './build/template';
module.exports = {
    html   : {
        src      : SOURCE + '/app/*.html',
        dest     : TEMPLATE,
        settings : {}
    },
    css    : {
        src      : SOURCE + '/css/*.{less,css}',
        dest     : STATIC + '/css',
        settings : {}
    },
    images : {
        src      : SOURCE + '/images/**/*',
        dest     : STATIC + '/images',
        settings : {}
    }
};