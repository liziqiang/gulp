(function() {
    // Object.create
    if ( typeof Object.create !== 'function' ) {
        Object.create = function( o, props ) {
            function F() {}

            F.prototype = o;
            if ( typeof props === 'object' ) {
                for ( var prop in props ) {
                    if ( props.hasOwnProperty( prop ) ) {
                        F[ prop ] = props[ prop ];
                    }
                }
            }
            return new F();
        }
    }
})();