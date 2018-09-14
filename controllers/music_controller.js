/**
 * Created by Administrator on 2018/9/12.
 */
const music_db = require('../moduleJS/mysql');
const path = require('path');

// 音乐列表查询
exports.showMusic= async ctx => {
    let user = ctx.session.user;

    let musicLists = await music_db.query('select * from music where uid=?', [user.id]);
    if(musicLists.length === 0){
        ctx.render('index', {
            code: 0,
            musicMsg: '暂无歌曲，请先添加'
        });
    }else{
        ctx.render('index', {
            code: 1,
            musicLists: musicLists
        });
    }
}

// 添加音乐
exports.addMusic = async ctx => {
    let {title, time, singer} = ctx.request.body;
    let {path: filePath} = ctx.request.files.file;
    let {path: fileLrcPath} = ctx.request.files.fileLrc;

    // 处理获取的绝对路径
    let fileBase = '/public/files/'+path.parse(filePath).base;
    let fileLrcBase = '/public/files/'+path.parse(fileLrcPath).base;

    let uid = ctx.session.user.id;

    let result = await music_db.query('insert into music (title, singer, time, file, fileLrc, uid) values (?,?,?,?,?,?)',[title,singer, time,fileBase,fileLrcBase,uid]);
    ctx.body = {
        code: 001,
        msg: '添加歌曲成功'
    }
}

// 删除音乐
exports.deleteMusic = async ctx => {
    let {uid} = ctx.request.body;
    console.log(uid);
    let result = await music_db.query('delete from music where id=?', [uid]);

    ctx.body = {
        code: 001,
        msg: '删除成功'
    }
}

// 编辑音乐页面信息回写
exports.editMusic = async ctx => {
    let { uid } = ctx.request.query;
    console.log(uid);

    let musicList_id = await music_db.query('select * from music where uid=?', [uid]);

    console.log(musicList_id);
    ctx.render('editMusic', {musicList_id});
}

// 编辑更新音乐
exports.editBGM = async ctx => {
    let {title, time, singer} = ctx.request.body;
    let {path: filePath} = ctx.request.files.file;
    let {path: fileLrcPath} = ctx.request.files.fileLrc;

    // 处理获取的绝对路径
    let fileBase = '/public/files/'+path.parse(filePath).base;
    let fileLrcBase = '/public/files/'+path.parse(fileLrcPath).base;

    let uid = ctx.session.user.id;

    let result = await music_db.query('update music set title=?, singer=?, time=?, file=?, fileLrc=?, uid=?',[title,singer, time,fileBase,fileLrcBase,uid]);
    ctx.body = {
        code: 001,
        msg: '编辑歌曲成功'
    }
}