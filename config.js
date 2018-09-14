const path = require('path');

var config = {
    db: {
        // mysql配置
        host     : 'localhost',
        user     : 'root',
        password : '',
        database : 'node_music'
    },
    uploadDir: path.join(__dirname, 'public/files')
}

module.exports = config;