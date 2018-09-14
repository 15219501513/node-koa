/**
 * Created by Administrator on 2018/9/11.
 */
const Router = require('koa-router');
const userRegister = require('../controllers/user_register');

let router = new Router();

router.get('/register', ctx=>{
   ctx.render('register');
})
.get('/', ctx=>{
    ctx.render('login');
})
.get('/login', ctx=>{
   ctx.render('login');
})
.post('/checkName', userRegister.checkUsername) // 用户名判断接口
.post('/doRegister', userRegister.doRegister) // 注册接口
.post('/doLogin', userRegister.doLogin) // 登录接口
.get('/getSession', userRegister.getSession)
.get('/getPic', userRegister.getPic)
.get('/logout', userRegister.logout)



// 测试
// router.get('/', async (ctx, next)=>{
//     let db=require('../moduleJS/mysql');
//     let users = await db.query('SELECT * FROM users where id=?', [1]);
//     console.log(users);
//     ctx.render('index');
// });

module.exports = router;