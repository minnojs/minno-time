import _ from 'lodash';
import globalGetter from '../../global';
import buildUrl from './buildUrl';

export default nextTrial;

function nextTrial(db, settings, goto){
    var destination = goto[0], properties = goto[1];
    var sequence = db.currentSequence;
    var global = globalGetter();
    var context = {global: global, current: global.current};
    var source;

    sequence.go(destination, properties, context);
    source = sequence.current(context, {skip:['layout','stimuli']});
    source = _.clone(source);

    if (!source) return {done:true};

    source.stimuli = _.map(source.stimuli || [], buildStim.bind(context));
    source.layout = _.map(source.layout || [], buildStim.bind(context));

    context.trialData = null;

    return {value:source};

    function buildMedia(stim, prop, context){
        var val = stim[prop];

        if (_.isUndefined(val)) return false;
        if (_.isString(val)) val = {word: val};

        val = db.inflate('media', val, context);

        // note that the base url is added to the media object during the sequence preload
        // if needed, build url
        if (val.image) val.$image = buildUrl(settings.base_url, val.image, 'image');

        if (val.template){
            // @TODO: remove dependency on requirejs
            val.inlineTemplate = requirejs('text!' + buildUrl(settings.base_url, val.template, 'template'));
            val.inlineTemplate = _.template(val.inlineTemplate)(context);
        }

        stim[prop] = val;

        context.mediaData = null;
        context.mediaMeta = null;
    }

    function buildStim(stim){
        var context = this;

        stim = db.inflate('stimulus', stim, context, {skip:['media','touchMedia']});
        stim = _.clone(stim);
        buildMedia(stim, 'media', context);
        buildMedia(stim, 'touchMedia', context);
        context.stimulusData = null;
        context.stimulusMeta = null;
        return stim;
    }
}
