var express = require('express');
var router = express.Router();
var reader = require('./sheet-reader');
var writer = require('./sheet-writer');
// const sgMail = require('@sendgrid/mail');

router.get('/:property', function (req, res, next) {
  var property = req.params.property;

  reader.getData(property, 'A1:F30', 6, function (err, rows) {
    if (err) {
      res.render('sheet', { property: 'Error reading' });
    }
    else {
      res.render('sheet', { property: property, rows, title: 'Dashboard ' + property });
    }
  });
});

router.post('/:property', function (req, res, next) {
  var property = req.params.property;
  var value = req.body.value;
  var row = req.body.row;
  var col = req.body.col;
  var colName = '';

  writer.writeData(value, col, row, property, function (err) {
    if (err)
      return res.status(500).send({ 'success': false, error: err });
    sgMail.setApiKey(process.env.SendGridKey);
    switch (col) {
      case 3:
        colName = 'Room';
        break;
      case 4:
        colName = 'CCTV';
        break;
      case 5:
        colName = 'Kill Switch';
        break;
      case 6:
        colName = 'OpenLive';
        break;
      default:
        break;
    }

    var emails = [];
    if (process.env.NODE_ENV == 'production')
      emails = ['michael@email.co.uk', 'tom@email.co.uk'];
    else
      emails = ['alvaro@email.co.uk', 'alvaro@email.co.uk'];

    sgMail.sendMultiple({
      to: emails,
      from: 'no-reply@email.co.uk',
      subject: 'Room updated in ' + property,
      text: `${colName} has been updated to ${value}.`,
      html: `<strong>${colName}</strong> has been updated to ${value}.`
    })
      .then(() => {
        return res.send({ 'success': true });
      })
      .catch(err => {
        return res.status(500).send({ 'success': false, error: err });
      });
  });
});

module.exports = router;
