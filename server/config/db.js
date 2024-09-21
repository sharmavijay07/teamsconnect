const mysql = require('mysql2')

const db = mysql.createConnection({
    host:'localhost',
    user:'root',
    // password:'Cosmicrolex@123',
<<<<<<< HEAD
    // // password:'123456',
=======
    password:'123456', 
>>>>>>> 1ebb42830ac2ce194cd4522fd328608a9137b479
    //password:'suravijay'
    // //password: 'Shantanu@2104',
    database:'teamsconnect'
})

db.connect((err) => {
    if(err)
        console.log('error: ',err)
    else
        console.log('connected')
})

module.exports = db;