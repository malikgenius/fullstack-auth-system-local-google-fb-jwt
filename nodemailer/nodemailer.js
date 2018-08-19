const nodemailer = require('nodemailer');
const emailUser = require('../config/Keys').emailUser;
const emailPass = require('../config/Keys').emailPass;

// create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: emailUser,
    pass: emailPass
  }
});
tls: {
  ciphers: 'SSLv3';
}

// setup email data with unicode symbols
// let mailOptions = {
//   from: '"ZEELIST" <linuxgen2016@gmail.com>', // sender address
//   to: email, // list of receivers
//   subject: 'Verify Your Account', // Subject line
//   text: `Hello ${name}`, // plain text body
//   html: `<b/>
//     Thank you for registring!
//     <b/><b/>
//     Please verify your email,  copy following access token:
//     <b/>
//     Token: <b>${accessToken}</b>
//     <b/>
//     now click on the link below and paste this access token in verification page where asked.
//     <a href:"https://localhost:3000/verifytoken">click here to open verification link</a>

//     `
// };

// send mail with defined transport object
module.exports = transporter.senfdMail(mailOptions, (error, info) => {
  if (error) {
    return console.log(error);
  }
  console.log('Message sent: %s', info.messageId);
  // Preview only available when sending through an Ethereal account
  console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
});

// var transporter = nodemailer.createTransport({
//   host: "smtp.office365.com", // Office 365 server
//   port: 587, // secure SMTP
//   requireTLS: true,
//   secure: false, // false for TLS - as a boolean not string - but the default is false so just remove this completely
//   auth: {
//     user: username,
//     pass: password
//   },
//   tls: {
//     ciphers: "SSLv3"
//   }
// });
