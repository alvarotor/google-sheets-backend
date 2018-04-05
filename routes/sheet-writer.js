let google = require('googleapis');
let authentication = require("./authentication");
const spreadsheetId = '1mf8Ln1VYyjeNsMFyP0Tcra5RBJL4WMYo5cAv0WIyoaQ';

module.exports = {
    writeDataArray: function (property, range, values, cb) {
        var data = [];
        data.push({ range, values });
        const body = { data, valueInputOption: "USER_ENTERED" };
        // console.log(body)
        // console.log(values)
        authentication.authenticate().then((auth) => {
            google.sheets('v4').spreadsheets.values.batchUpdate({
                // auth: authentication.auth(),
                auth: auth,
                spreadsheetId,
                resource: body
            }, (err, response) => {
                if (err) {
                    console.log(err);
                    cb(err);
                } else {
                    console.log('%d cells updated.', response.data.totalUpdatedCells);
                    cb(null);
                }
            });
        });
    },
    writeData: function (value, col, row, property, cb) {
        authentication.authenticate().then((auth) => {
            var body = {
                values: [[value]]
            };
            var colLetter = '';
            switch (col) {
                case 3:
                    colLetter = 'C';
                    break;
                case 4:
                    colLetter = 'D';
                    break;
                case 5:
                    colLetter = 'E';
                    break;
                case 6:
                    colLetter = 'F';
                    break;
                case 7:
                    colLetter = 'G';
                    break;
                default:
                    break;
            }

            google.sheets('v4').spreadsheets.values.update({
                // auth: authentication.auth(),
                auth: auth,
                spreadsheetId,
                range: property + '!' + colLetter + row,
                valueInputOption: "USER_ENTERED",
                resource: body
            }, (err, response) => {
                if (err) {
                    console.log(err);
                    cb(err);
                } else {
                    console.log('%d cells updated.', response.updatedCells);
                    cb(null);
                }
            });
        });
    }
}
