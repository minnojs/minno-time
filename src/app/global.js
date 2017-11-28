export default global;

// initiate piGloabl
var glob = window.piGlobal || (window.piGlobal = {});

function global(){
    return glob;
}

