const { profit } = require('../controllers');
const { router } = require('../services/imports');

router.get('/profit', profit.getProfit);
module.exports = router;
