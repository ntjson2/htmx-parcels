
const http = require('http');
const fs = require('fs');
const path = require('path');
const logger = require("firebase-functions/logger");

const { onRequest } = require("firebase-functions/v2/https");
// Firebase Admin SDK
admin.initializeApp(firebaseConfig.firebaseConfig);
const db = admin.firestore();
const parcelDataSet = db.collection('htmlparcels').doc('parcels');
// Email API client
const courier = new CourierClient({ authorizationToken: process.env.COURIER_API_KEY });

exports.home = onRequest({ cors: true }, (request, response) => {
    let template = pug.compileFile('views/home.pug');
    let markup = template({});
    response.writeHead(200, {
        'Content-Type': 'text/html',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'PUT, POST, OPTIONS'
    });
    response.end(markup);
});

exports.sendEmail = onRequest({ cors: true }, async (request, response) => {
    console.log("email Request received for: ", request.url);
    console.log("params Request received for: ", request.params);
    console.log("query Request received for: ", request.query);
    console.log("body Request received for: ", request.body);
    console.log("body Request name for: ", request.body.name);

    try {
        const { messageId } = await courier.send({
            message: {
                to: {
                    data: {
                        name: request.body.name,
                    },
                    email: request.body.email,
                },
                content: {
                    title: "Hello " + request.body.name + ", coming to you from Firebase parcels!",
                    body: "Success delivering API courier message!\n" + request.body.message,
                },
                routing: {
                    method: "single",
                    channels: ["email"],
                },
            },
        });
        console.log(`Message sent with ID: ${messageId}`);
    } catch (err) {
        console.error(`Error sending message: ${err}`);
        logger.error(`Error sending message: ${err}`);
    }

    const resultEmail = `<div><h1 class="font-medium text-4xl">Success!</h1> Email sent</div>`;
    response.writeHead(200, {
        'Content-Type': 'text/html',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'PUT, POST, OPTIONS'
    });
    response.end(resultEmail);
});

exports.imageRef = onRequest({ cors: true }, (request, response) => {
    var imageKey;
    var secretImageName;
    console.log('Request received for: ', request.url);

    if (request.params['0'] != null) {
        console.log('Request received for request.params[0]: ', request.params['0']);
        imageKey = request.params['0'];

        const parcelData = db.collection('njflutter').doc('parcels');
        parcelData.get().then((doc) => {
            if (doc.exists) {
                console.log("Getting images Document! ");
                filtered = doc.data();

                // Data format from firestore: {1: "kdos3", 2: "owld7"}        
                let imgVal = filtered[imageKey];

                if (imgVal == undefined) {
                    console.log("No such img!");
                    secretImageName = '1.jpg';
                } else {
                    secretImageName = filtered[imageKey] + '.jpg';
                }
            } else {
                console.log("No such img!");
                secretImageName = '1.jpg';
                logger.error("No such img!");
            }

            const imageName = path.basename(secretImageName);
            const imagePath = path.join(__dirname, 'assets/images', imageName);
            console.log('Image Path: ', imagePath);

            const imgData = fs.readFileSync(imagePath, { encoding: 'base64' });
            console.log(imgData);
            const imgTpl = `<img src="data:image/jpg;base64,${imgData}"/>`;

            response.writeHead(200, {
                'Content-Type': 'text/html',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'PUT, POST, OPTIONS'
            });
            response.end(imgTpl);
        });
    }
});

exports.contact = onRequest({ cors: true }, (request, response) => {
    let template = pug.compileFile('views/contact.pug');
    let markup = template({});
    response.writeHead(200, {
        'Content-Type': 'text/html',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'PUT, POST, OPTIONS'
    });
    response.end(markup);
});


exports.parcels = onRequest({ cors: true }, (request, response) => {
    let template = pug.compileFile('views/parcels.pug');
    var filtered;

    parcelDataSet.get().then((doc) => {
        if (doc.exists) {
            console.log("Getting Document! ");
            filtered = doc.data();
            console.log('filtered 1:', filtered);

            let markup = template({
                fParcels: filtered
            });

            response.writeHead(200, {
                'Content-Type': 'text/html',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'PUT, POST, OPTIONS'
            });
            response.end(markup);
        } else {
            logger.error("No such Document!");
            console.log("No such Document!");
            response.send("No such Document, check the logs");
        }
    }).catch((error) => {
        logger.error("Error getting document:", error);
        console.log("Error getting document:", error);
        response.send("Error getting document, check the logs: ", error);
    });
});