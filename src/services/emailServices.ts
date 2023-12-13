import nodemailer from 'nodemailer'
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: 'sda.ecommerce.bootcamp@gmail.com',
    pass: `${process.env.email_password}`,
  },
})
export const sendEmail = async (to: string, subject: string, html: string) => {
  try {
    await new Promise((resolve, reject) => {
      // verify connection configuration
      transporter.verify(function (error, success) {
          if (error) {
              console.log(error);
              reject(error);
          } else {
              console.log("Server is ready to take our messages");
              resolve(success);
          }
      });
    });
    const mailData = {
      from: 'sda.ecommerce.bootcamp@gmail.com',
      to: to,
      subject: subject,
      html: html,
    }
    const info =await new Promise((resolve, reject) => {
      // send mail
      transporter.sendMail(mailData, (err, info) => {
          if (err) {
              console.error(err);
              reject(err);
          } else {
              console.log(info);
              resolve(info);
          }
      });
    });
    return info
  } catch (error) {
    console.error('Error sending email:', error)
    throw error
  }
}






