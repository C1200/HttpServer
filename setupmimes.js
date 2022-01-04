function setupMimes(rawMimes) {
    var extensions = {};
    
    Object.keys(rawMimes).forEach((mimeType) => {
        var exts = rawMimes[mimeType].extensions;

        for (var i = 0; i < exts.length; i++) {
            var ext = exts[i];

            extensions[ext] = mimeType;
        }
    });

    return extensions;
}

module.exports = {
    setupMimes
}