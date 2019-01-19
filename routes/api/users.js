const experss = require('express');
const router = experss.Router();

router.get('/test', (req, res) => res.json({msg: "Users Works"}));

module.exports = router;