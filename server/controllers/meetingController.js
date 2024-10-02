const db = require('../config/db')

const handleMeetingSubmit = (req,resp) => {
    const { date, userId, description, participants, eventInput,eventLink } = req.body
    const query = 'insert into meetingsDetails(userId,mTitle,mLink,mDescription,Participants,mDate) values(?,?,?,?,?,?)'
    db.query(query,[userId,eventInput,eventLink,description,participants,date],(err,result) => {
        if(err) {
            console.log(err)
            resp.status(400).json({message:"Database error",err:err})
        }
        else {
            resp.status(200).json({message:"successfully inserted meetingDetails",result:result})
        }
    })
}


module.exports = {handleMeetingSubmit}