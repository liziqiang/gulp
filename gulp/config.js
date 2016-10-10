var source     = './mview',
    static     = './build/static',
    template   = './build/template';
module.exports = {
    html       : {
        src      : source + '/**/*.html',
        dest     : template,
        settings : {}
    },
    less       : {
        src      : source + '/**/*.less',
        dest     : static + '/css',
        settings : {}
    },
    javascript : {
        src      : source + '/**/*.js',
        dest     : static + '/js',
        settings : {}
    }
};