define(function(){

    if (window.performance.now) return window.performance.now.bind(window.performance);

    // We aren't using the absoulte time anywhere so we can use raw Date.now as a replacement
    // if we're not on IE9
    return Date.now.bind(Date);

});
