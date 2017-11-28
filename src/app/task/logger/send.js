/*
 * Send log chunk
 * returns a function that takes data and sends it to the server after appending any meta data
 * @Todo: pass in the settings (drop global settings, pass them through the sink).
 */
import _ from 'lodash';
import settingsGetter from '../settings';
import post from './post';

export default send;

function send(data){
    var settings = settingsGetter();
    var url = _.get(settings, 'logger.url');

    if (!url) return Promise.resolve();

    // build post data
    data = _.assign({
        json: JSON.stringify(data) || ''
    }, settings.metaData);

    data = serialize(data);

    // lets post our data
    return post(url,data)
        .catch(function retry(){
            return post(url, data);
        })
        .catch(_.get(settings, 'logger.error'));
}

function serialize(data){
    var key, r = [];
    for (key in data) r.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]));
    return r.join('&').replace(/%20/g, '+');
}
