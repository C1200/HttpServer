const {createServer} = require("net");
const fs = require("fs");
const pathJoin = require("path").join;
const pathExt = require("path").extname;
const {parseRequest} = require("./reqparser");
const {makeResponse} = require("./resmaker");

const WWW = pathJoin(process.cwd(), "www");
const PUBLIC_DIR = pathJoin(WWW, "public");
const ERRORS_DIR = pathJoin(WWW, "errors");

const extensions = require("./setupmimes")
    .setupMimes(require(pathJoin(WWW, "mimes.json")));

const server = createServer(socket => {
    socket.setEncoding("utf8");
    
    socket.on("data", data => {
        var req = parseRequest(data);
        var res = makeResponse();

        if (pathJoin(PUBLIC_DIR, req.url.pathname).indexOf(PUBLIC_DIR) !== 0) {
            res.setStatus(403);
            res.headers.set("Content-Type", "text/html");
            res.body = fs.readFileSync(pathJoin(ERRORS_DIR, "403.html")).toString();

            socket.end(res.toString());
        } else {
            fs.lstat(pathJoin(PUBLIC_DIR, req.url.pathname), (err, requested) => {
                if (!err && requested.isFile()) {
                    res.setStatus(200);
                    res.headers.set(
                        "Content-Type",
                        extensions[pathExt(req.url.pathname).substr(1)] || "application/octet-stream"
                    );
                    res.body = fs.readFileSync(pathJoin(PUBLIC_DIR, req.url.pathname)).toString();
                    
                    socket.end(res.toString());
                } else if (!err && requested.isDirectory()) {
                    for (var ext of ["htm", "html", "shtml"]) {
                        if (fs.existsSync(pathJoin(PUBLIC_DIR, req.url.pathname, "index." + ext))) {
                            res.setStatus(200);
                            res.headers.set(
                                "Content-Type",
                                extensions[ext] || "application/octet-stream"
                            );
                            res.body = fs.readFileSync(pathJoin(PUBLIC_DIR, req.url.pathname, "index." + ext)).toString();
                    
                            socket.end(res.toString());

                            break;
                        }
                    }
                } else {
                    res.setStatus(404);
                    res.headers.set("Content-Type", "text/html");
                    res.body = fs.readFileSync(pathJoin(ERRORS_DIR, "404.html")).toString();
    
                    socket.end(res.toString());
                }
            });
        }
    });
});

server.listen(80, "0.0.0.0", () => {
    console.log("Listening on port 80");
});
