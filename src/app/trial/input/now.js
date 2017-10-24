export default window.performance.now
    ? window.performance.now.bind(window.performance)

    // We aren't using the absoulte time anywhere so we can use raw Date.now as a replacement
    // if we're not on IE9
    : Date.now.bind(Date);
