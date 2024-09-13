const mysql = require('mysql2')

const db = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'123456',
    database:'teamsconnect'
})

db.connect((err) => {
    if(err)
        console.log('error: ',err)
    else
        console.log('connected')
})

module.exports = db;