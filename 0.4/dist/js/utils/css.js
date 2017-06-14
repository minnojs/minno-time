define(function(){
    return css;

    function css(el, obj){
        var style = el.style;

        if (!obj) return;

        for (var key in obj) style[camelCase(key)] = obj[key];

        function camelCase(str){ 
            return  str.replace(/-([a-z])/g, function (g) { return g[1].toUpperCase(); }); 
        }
    }
});
