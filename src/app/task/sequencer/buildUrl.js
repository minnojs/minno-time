/*
 * build the url for this src (add the generic baseUrl)
 * @Todo: pass in the baseUrl (drop global settings, pass them through the sink).
 */

import _ from 'lodash';

/**
 * @param baseUrl {String|Object} the base url to prepend
 * @param url {String} the url we are dealing with
 * @param type {String} the type of resource we are dealing with (image or tempmlate) in case we have multiple base urls
 *
 * @returns String built url
 **/
export default function buildUrl(baseUrl, url, type){
    // it this is a dataUrl type of image, we don't need to append the baseurl
    if (type == 'image' && /^data:image/.test(url)) return url;

    // the base url setting may be either a string, or an object with the type as a field
    if (_.isObject(baseUrl)) baseUrl = baseUrl[type];

    // make sure base url is set, and add trailing slash if needed
    if (!baseUrl) baseUrl = '';
    else if (baseUrl[baseUrl.length-1] != '/') baseUrl += '/';

    return baseUrl + url;
}
