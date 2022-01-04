const METHODS = [
    "GET",
    "HEAD",
    "POST",
    "PUT",
    "DELETE",
    "CONNECT",
    "OPTIONS",
    "TRACE",
    "PATCH"
];

function parseRequest(string) {
    var parsed = {};
    var lines = string.split(/\n|\r\n/);
    
    var elems = lines.shift().split(" ");
    if (METHODS.includes(elems[0].toUpperCase()))
        parsed.method = elems[0].toUpperCase();
    else
       parsed.method = null;
    parsed.url = new URL(elems[1], "http://0.0.0.0");
    parsed.httpVersion = elems[2];
    
    var hb = lines.join("\n").split(/\n\n|\r\n\r\n/);
    parsed.headers = new Map(hb[0].split(/\n|\r\n/).map(header => {
        var colon = header.indexOf(":");
        return [header.substr(0, colon), header.substr(colon+1).trim()]
    }));
    parsed.body = hb[1];

    return parsed;
}

module.exports = {
    constants: {
        METHODS
    },
    parseRequest
}