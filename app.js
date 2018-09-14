/**
 * Created by Administrator on 2018/9/11.
 */
const Koa = require('koa');
const render = require('koa-art-template');
const path = require('path');
const static = require('koa-static');
// 路由引入
const router = require('./routes/user_router');
const musicRouter = require('./routes/music_router');

const bodyParser = require('koa-bodyparser');
const session = require('koa-session');
const CONFIG = require('./config');
const formidable = require('koa-formidable');

let app = new Koa();


// 设置模板引擎
render(app, {
   root: path.join(__dirname, 'views'),
    extname: '.html',
    debug: process.env.NODE_ENV !== 'production'
});

// 处理静态文件的url，防止public下文件暴露出去
app.use(async (ctx, next)=>{
    if(ctx.request.url.startsWith('/public')){
        ctx.request.url = ctx.request.url.replace('/public','');
    }
    await next();
});


app.use(static(path.resolve('./public'))); // 设置静态文件目录

// 登录拦截
app.use(async (ctx, next) => {
    // 设计将不需要拦截的url前统一加上/user路径，问题：加上后不需要拦截的页面的静态资源加载路径有问题
    // ctx.request.url中含有/user则不需要拦截，其他都要拦截
    // let re_test = /^\/user/;
    // let isNoCheck = re_test.test(ctx.request.url);
    if(ctx.request.url == '/' || ctx.request.url == '/login' || ctx.request.url == '/register' || ctx.request.url == '/checkName'
        || ctx.request.url == '/doRegister' || ctx.request.url == '/doLogin' || ctx.request.url == '/getSession'
        || ctx.request.url == '/getPic' || ctx.request.url == '/logout'){
        return await next();
    }

    if(!ctx.session.user){
        return ctx.body = `<div><a href="/login">请先登录</a></div>`
    }
    await next();
});

// session存储
app.keys = ['shhhhh']; // 保证传递的cookies数据不被串改，多发一个cookie就是另一个cookie的数字签名
let store = {
    storage: {},
    set: function(key, sess){
        this.storage[key] = sess;
    },
    get: function(key){
        return this.storage[key];
    },
    destroy: function(key){
        delete this.storage[key];
    }
}

app.use(session(store, app));

// 登录拦截和挂在session处理之后操作，将session值都挂载到art-template视图中
app.use(async (ctx, next)=>{
    // 存储登录后视图页面需要的信息字段
   ctx.state.user = ctx.session.user;
   await next();
});

// app.use(bodyParser()); // 处理数据(formidable也是处理数据的，还可以处理文件数据。)
app.use(formidable({
    uploadDir: CONFIG.uploadDir,
    keepExtensions: true
}));

app.use(router.routes());
app.use(musicRouter.routes());
app.use(router.allowedMethods());
app.use(musicRouter.allowedMethods());

app.listen(8888, ()=>{
    console.log('服务起来了');
})
