
const {onRequest} = require("firebase-functions/v2/https");
//const logger = require("firebase-functions/logger");
const pug = require('pug');


exports.test = onRequest((request, response) => {

    let template = pug.compileFile('views/index.pug');
    let markup = template({
        name: request.query.name, 
        major: request.query.major,
        quote: 'Howdy!'});
    response.writeHead(200, {'Content-Type': 'text/html'});
    response.end(markup);
});

exports.about = onRequest((request, response) => {
    let template = pug.compileFile('views/about.pug');
    let markup = template({});
    response.writeHead(200, {'Content-Type': 'text/html'});
    response.end(markup);
});

exports.home = onRequest((request, response) => {
    let template = pug.compileFile('views/home.pug');
    let markup = template({});
    response.writeHead(200, {'Content-Type': 'text/html'});
    response.end(markup);
});

exports.contact = onRequest((request, response) => {
    let template = pug.compileFile('views/contact.pug');
    let markup = template({});
    response.writeHead(200, {'Content-Type': 'text/html'});
    response.end(markup);
});

exports.side = onRequest((request, response) => {
    let template = pug.compileFile('views/side.pug');
    let markup = template({});
    response.writeHead(200, {'Content-Type': 'text/html'});
    response.end(markup);
});