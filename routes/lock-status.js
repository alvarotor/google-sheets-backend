var express = require('express');
var router = express.Router();
var reader = require('./sheet-reader');
var writer = require('./sheet-writer');

router.get('/:property', function (req, res, next) {
  const property = req.params.property;

  reader.getData(property, 'H3:M3', 6, function (err, row) {
    if (err) {
      res.render('lock-status', { title: 'Error reading' });
    }
    else {
      const r = row[0];
      res.render('lock-status', { property: req.params.property, title: 'Lock Status ' + property, row: r });
    }
  });
});

router.post('/:property/save', function (req, res, next) {
  const property = req.params.property;

  const firmware_version = req.body.firmware_version;
  const firmware_update_date = req.body.firmware_update_date;
  const battery_last_change = req.body.battery_last_change;
  const ks_app_login = req.body.ks_app_login;
  const ks_app_password = req.body.ks_app_password;
  const problem_lock = req.body.problem_lock;

  const values = [[firmware_version, firmware_update_date, battery_last_change, problem_lock, ks_app_login, ks_app_password]];
  const range = 'H3:M3';

  writer.writeDataArray(property, range, values, function (err) {
    if (err)
      return res.status(500).send({ 'success': false, error: err });
    sgMail.setApiKey(process.env.SendGridKey);

    var emails = [];
    if (process.env.NODE_ENV == 'production')
      emails = ['michael@email.co.uk', 'tom@email.co.uk'];
    else
      emails = ['alvaro@email.co.uk', 'alvaro@email.co.uk'];

    sgMail.sendMultiple({
      to: emails,
      from: 'no-reply@email.co.uk',
      subject: 'Lock status updated in ' + property,
      text: `${property} lock status has been updated.`,
      html: `<strong>${property}</strong> lock status has been updated.`
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
