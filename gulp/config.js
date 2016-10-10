var source     = './mview',
    static     = './build/static',
    template   = './build/template';
module.exports = {
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