/**
 * Created by Administrator on 2018/9/11.
 */
const user_db = require('../moduleJS/mysql.js');
const captchapng = require('captchapng2');

exports.checkUsername = async ctx => {
        let {username} = ctx.request.body;

        let users = await user_db.query('select * from users where username=?', [username]);

        if(users.length !==0){
            return ctx.body = {code: '002', msg: '用户名已经存在'};
        }

        ctx.body = {code: '001', msg: '可以注册'};
    }

exports.doRegister = async ctx => {
    let {username, email, password, code} = ctx.request.body;

    if(code !=ctx.session.old_code) return ctx.body={
        code: 002,
        msg: '验证码错误'
    }
    console.log();

    // 查询
    // 查询用户名或者邮箱是否相等
    // users.length == 0 , 可以注册
    // user.length == 1, 判断用户名相等还是邮箱相等
    let users = await user_db.query('select * from users where username=? or email=?', [username, email]);
    if(users.length !== 0){
        if(users.length === 1){
            let user = users[0];
            if(user.username == username) return ctx.body = {code: '002', msg: '用户名已经存在'};
            if(user.email == email) return ctx.body = {code: '002', msg: '邮箱已经存在'};
        }

        if(users.length > 1){
            let user1 = users[0];
            let user2 = users[1];
            if(user1.username == username || user2.username == username ) return ctx.body = {code: '002', msg: '用户名已经存在'};
            if(user1.email == email || user2.email == email) return ctx.body = {code: '002', msg: '邮箱已经存在'};
        }
    }

    await user_db.query('insert into users (username, email, password) Values (?,?,?)', [username, email, password]);
    ctx.body = { code: '001', msg: '注册成功'};
}

exports.doLogin = async ctx => {
    let {username, password, remember} = ctx.request.body;

    let users = await user_db.query('select * from users where username=?', [username]);

    if(users.length === 0) return ctx.body = {code: '002', msg: '用户名或者密码不正确'};

    let user = users[0];
    if(user.password !== password) return ctx.body = {code: '002', msg: '用户名或者密码不正确'};

    // 记住客户端的信息，下次访问也可以拿到
    ctx.session.user = user;
    ctx.body = {code: '001', msg: '登录成功'};
}
// 获取存储的session
exports.getSession = async ctx => {
    ctx.body = ctx.session;
}

// 获取图片验证码
exports.getPic = async ctx => {
    let rand = parseInt(Math.random() * 9000 + 1000);
    let png = new captchapng(80, 30, rand); // width,height, numeric captcha

    ctx.session.old_code=rand;

    ctx.response.set('Content-Type', 'image/png');
    ctx.body = png.getBuffer();
}

// 退出并清除session
exports.logout = async ctx => {
    // 清除session
    ctx.session.user = null;
    // ctx.destroy(ctx.session);

    // 重定向
    ctx.response.redirect('/login');
}
