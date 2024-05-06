
const http = require('http');
const fs = require('fs');
const path = require('path');

const {onRequest} = require("firebase-functions/v2/https");
//const logger = require("firebase-functions/logger");
const firebaseConfig = require("./firebaseConfig");
const admin = require("firebase-admin");
admin.initializeApp(firebaseConfig.firebaseConfig);
const db = admin.firestore();
const pug = require('pug');


exports.imageRef = onRequest((request, response) => {

    var imageKey;
    var secretImageName;

    console.log('Request received for: ', request.url);
    if(request.params['0'] != null){
        console.log('Request received for request.params[0]: ', request.params['0']);
        
        imageKey = request.params['0'];
        //let imgMapping = {1: "kdos3", 2: "owld7"}

        const parcelData = db.collection('njflutter').doc('parcels');
        parcelData.get().then((doc) => {
            if (doc.exists){
                console.log("Getting images Document! ");             
                filtered = doc.data();
                
                // Data format from firestore: {1: "kdos3", 2: "owld7"}        
                let imgVal = filtered[imageKey];        
                if(imgVal == undefined){
                    console.log("No such img!");                
                    secretImageName = '1.jpg';
                }else{
                    secretImageName = filtered[imageKey] + '.jpg';
                }                    
            }
            else{
                console.log("No such img!");                
                secretImageName = '1.jpg';
            }

            const imageName = path.basename(secretImageName);
            const imagePath = path.join(__dirname, 'assets/images', imageName);
            console.log('Image Path: ', imagePath);
            
            const imgData = fs.readFileSync(imagePath, { encoding: 'base64' });

            console.log(imgData);
            const imgTpl = `<img src="data:image/jpg;base64,${imgData}"/>`;
            response.writeHead(200, { 'Content-Type': 'text/html' });
            response.end(imgTpl);
                    
           /*  fs.readFile(imagePath, (err, data) => {
                if (err) {
                    response.writeHead(404);
                    response.end(JSON.stringify(err));
                    return;
                }

                response.writeHead(200, { 'Content-Type': 'image/jpeg; charset=UTF-8' });
                response.end(data);
            });

          });   */
        });

    }});


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

exports.parcels = onRequest((request, response) => {
    let template = pug.compileFile('views/parcels.pug');

    const parcelData = db.collection('njflutter').doc('parcels');
    //console.log("GO --------> ", parcelData);  
    var filtered;

    console.log(".1");

    parcelData.get().then((doc) => {
        if (doc.exists){
            console.log("Getting Document! ");             
            filtered = doc.data();
            console.log('filtered 1:',filtered);
       
           let markup = template({
                   /* cells: [
                   {
                       id: 1,
                       pname: 'Parcel 1',
                       weight: 10
                   },
                   {
                       id: 2,
                       pname: 'Parcel 2',
                       weight: 15
                   },
                   {
                       id: 3,
                       pname: 'Parcel 3',
                       weight: 8
                   }
               ], */
               fParcels: filtered              
           });
                
           response.writeHead(200, {'Content-Type': 'text/html'});
           response.end(markup);

        }
        else{
            console.log("No such Document!");                
            response.send("No such Document, check the logs");
        }
      }).catch((error) => {
        console.log("Error getting document:", error);
        response.send("Error getting document, check the logs");
      });     
});
