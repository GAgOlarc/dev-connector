const experss = require('express');
const router = experss.Router();

router.get('/test', (req, res) => res.json({msg: "Posts Works"}));

module.exports = router;