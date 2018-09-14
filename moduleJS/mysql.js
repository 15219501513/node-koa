/**
 * Created by Administrator on 2018/9/11.
 */
// module.exports = function(){
//
// }
const mysql = require('mysql');
const dbConfig = require('../config').db;

// 创建连接池
const pool = mysql.createPool(dbConfig);

let mysqlDB={};

mysqlDB.query= (sql, params)=>{
    return new Promise((resolve, reject)=>{
            // 使用时getConnection
            pool.getConnection(function(err, connection){
                if(err) throw err;
                // params为数组
                connection.query(sql,params, function(error, results, fields){

                    // 释放连接池时release
                    connection.release();

                    if(err) return reject(err);
                    resolve(results);
                });
            });
        });
}

module.exports = mysqlDB;

