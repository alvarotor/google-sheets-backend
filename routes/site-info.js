var express = require('express');
var router = express.Router();
var reader = require('./sheet-reader');
var writer = require('./sheet-writer');

router.get('/:property', function (req, res, next) {
  const property = req.params.property;

  reader.getData(property, 'Q3:Q10', 1, function (err, rows) {
    if (err) {
      res.render('site-info', { title: 'Error reading' });
    }
    else {
      res.render('site-info', { property: req.params.property, title: 'Site Info ' + property, rows });
    }
  });
});

router.post('/:property/save', function (req, res, next) {
  const property = req.params.property;

  const address = req.body.address;
  const name1 = req.body.name1;
  const tel1 = req.body.tel1;
  const name2 = req.body.name2;
  const tel2 = req.body.tel2;
  const date_of_last_pat_testing = req.body.date_of_last_pat_testing;
  const locker_type = req.body.locker_type;
  const log_a_maintenance_issue = req.body.log_a_maintenance_issue;

  const values = [[address], [name1], [tel1], [name2], [tel2], [date_of_last_pat_testing], [locker_type], [log_a_maintenance_issue]];
  const range = 'Q3:Q10';

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
      subject: 'Site Info updated in ' + property,
      text: `${property} site info has been updated.`,
      html: `<strong>${property}</strong> site info has been updated.`
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