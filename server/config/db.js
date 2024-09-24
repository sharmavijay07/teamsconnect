const mysql = require('mysql2')

const db = mysql.createConnection({
    host:'localhost',
    user:'root',
    // password:'Cosmicrolex@123',
    // password:'123456',
    // password:'123456', 
    // nipun ka password:
    // password:'12345678', 
    
    password:'123456', 
    
    //password:'suravijay'
    password: 'Shantanu@2104',
    database:'teamsconnect'
})

db.connect((err) => {
    if(err)
        console.log('error: ',err)
    else
        console.log('connected')
})

module.exports = db;