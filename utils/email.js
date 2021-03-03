
const nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASSWORD
    }
  });
   
const sendEmailText = (emailAdress, subject, text) => {

    var mailOptions = {
        from: process.env.MAIL_USER,
        to: emailAdress,
        subject: subject,
        text: text
    };

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
    }); 
}

module.exports = {
    sendEmailText: sendEmailText
}

