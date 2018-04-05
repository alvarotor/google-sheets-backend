let google = require('googleapis');
let privatekey = require("../client_secret.json");

module.exports.auth = function () {

    let jwtClient = new google.auth.JWT(
        privatekey.client_email,
        null,
        privatekey.private_key,
        ['https://www.googleapis.com/auth/spreadsheets']);

    jwtClient.authorize(function (err, tokens) {
        if (err) {
            console.log(err);
            return;
        } else {
            console.log("Successfully connected!");
            return jwtClient;
        }
    });
};
