const nodemailer = require('nodemailer')

const sendEmail =async (option) => {
     // create a transporter 
     const transporter = nodemailer.createTransport({
          host: process.env.EMAIL_HOST,
          port: process.env.EMAIL_PORT,
          auth: {
               user: process.env.EMAIL_USER,
               pass: process.env.EMAIL_PASSWORD
          }
     })

     // defin email options
     const emailOption ={
          from: 'Node Js support<support@nodejs.com>',
          to: option.email,
          subject: option.subject,
          text: option.message,
     }

     await transporter.sendMail(emailOption);
}


module.exports = sendEmail