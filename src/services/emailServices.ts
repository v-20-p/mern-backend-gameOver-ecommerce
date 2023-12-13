import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: 'sda.ecommerce.bootcamp@gmail.com',
    pass: `${process.env.email_password}`,
  },
});

export const sendEmail = (to: string, subject: string, html: string) => {
  return new Promise((resolve, reject) => {
    transporter.sendMail(
      {
        from: 'sda.ecommerce.bootcamp@gmail.com',
        to: to,
        subject: subject,
        html: html,
      },
      (error, info) => {
        if (error) {
          console.error('Error sending email:', error);
          reject(error);
        } else {
          console.log('Email sent:', info.response);
          resolve(info);
        }
      }
    );
  });
};
