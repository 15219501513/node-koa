/**
 * Created by Administrator on 2018/9/12.
 */
const Router = require('koa-router');
const musicController = require('../controllers/music_controller');

let router = new Router();

router.get('/index', musicController.showMusic)
.get('/addMusic', ctx => {
     ctx.render('addMusic');
})
.post('/addBGM', musicController.addMusic)
.post('/deleteBGM', musicController.deleteMusic)
.get('/editMusic', musicController.editMusic)
.post('/editBGM', musicController.editBGM)

module.exports = router;
