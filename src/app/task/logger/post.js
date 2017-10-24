export default post;

function post(url, data){
    return new Promise(function(resolve, reject){
        var request = new XMLHttpRequest();
        request.open('POST',url, true);
        request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');

        request.onreadystatechange = function() {
            if (this.readyState === 4) {
                if (this.status >= 200 && this.status < 400) resolve(this.responseText);
                else reject(new Error('Failed posting to: ' + url));
            }
        };

        request.send(serialize(data));
    });
}

function serialize(data) {
    if (typeof data == 'string') return data;
    return JSON.stringify(data);
}
