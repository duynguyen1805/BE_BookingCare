require('dotenv').config();
import nodemailer from 'nodemailer';

let sendEmail = async (dataSend) => {
    // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_APP_ACC, // generated ethereal user
      pass: process.env.EMAIL_APP_PASSWORD, // generated ethereal password
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"BookingCare" <duynguyenqwert@gmail.com>', // sender address
    to: dataSend.receiverEmail, // list of receivers
    subject: "Thông báo đặt lịch khám bệnh ✔", // Subject line
    text: "Hello world?", // plain text body
    html: getHTMLEmail(dataSend),
  });
}

let getHTMLEmail = (dataSend) => {
    let result =''
    if(dataSend.language === 'vi'){
        result = 
        `
        <h3>Xin chào ${dataSend.patientname}</h3>
        <p>Đây là Email thông báo đặt lịch khám bệnh online từ BookingCare</p>
        <h3>Thông tin đặt lịch khám:</h3>
        <div><em>Thời gian: ${dataSend.time}</em></div>
        <div><em>Bác sỹ thăm khám: ${dataSend.doctorname}</em></div>
        <p>Nếu thông tin chính xác, vui lòng ấn vào link bên dưới để xác nhận và hoàn thành việc đặt lịch.</p>
        <div>
            <a href=${dataSend.redirectLink} target="_blank" >Xác nhận lịch hẹn</a>
        </div>
        
        `
    }
    if(dataSend.language === 'en'){
        result = 
        `
        <h3>Dear ${dataSend.patientname}</h3>
        <p>This is the email notifying you to book an online medical appointment from BookingCare</p>
        <h3>Information to book an appointment:</h3>
        <div><em>Time: ${dataSend.time}</em></div>
        <div><em>Doctor: ${dataSend.doctorname}</em></div>
        <p>If the information is correct, please click on the link below to confirm and complete the booking.</p>
        <div>
            <a href=${dataSend.redirectLink} target="_blank" >Appointment confirmation</a>
        </div>
        
        `
    }

    return result
  }

module.exports = {
    sendEmail: sendEmail,
    getHTMLEmail: getHTMLEmail
}