import nodemailer from 'nodemailer'
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    // TODO: replace `user` and `pass` values from <https://forwardemail.net>
    user: 'sda.ecommerce.bootcamp@gmail.com',
    pass: `${process.env.email_password}`,
  },
})
export const sendEmail = async (to: string, subject: string, html: string) => {
  try {
    const info = await transporter.sendMail({
      from: 'sda.ecommerce.bootcamp@gmail.com',
      to: to,
      subject: subject,
      html: html,
    })

    console.log('Email sent:', info.response)
    return info
  } catch (error) {
    console.error('Error sending email:', error)
    throw error
  }
}
