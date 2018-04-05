var express = require('express');
var router = express.Router();

router.get('/:property', function (req, res, next) {
  res.render('property', { property: req.params.property, title: 'Dashboard ' + req.params.property });
});

module.exports = router;
