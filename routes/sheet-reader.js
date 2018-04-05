let google = require('googleapis');
let authentication = require("./authentication");

module.exports.getData = function (property, range, length, cb) {
    authentication.authenticate().then((auth) => {
        var sheets = google.sheets('v4');
        sheets.spreadsheets.values.get({
            // auth: authentication.auth(),
            auth: auth,
            spreadsheetId: '1mf8Ln1VYyjeNsMFyP0Tcra5RBJL4WMYo5cAv0WIyoaQ',
            range: property + '!' + range
        }, (err, response) => {
            if (err) {
                console.log('The API returned an error: ' + err);
                cb(err, null);
            }
            var rows = response.data.values;
            if (!rows || rows.length === 0) {
                console.log('No data found.');
                cb(null, []);
            } else {
                for (var i = 0; i < rows.length; i++) {
                    var row = rows[i];
                    row.length = length;
                    for (let index = 0; index < row.length; index++)
                        if (!row[index]) row[index] = '';
                }
                cb(null, rows);
            }
        });
    });
}
