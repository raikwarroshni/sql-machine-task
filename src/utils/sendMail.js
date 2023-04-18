const nodemailer = require("nodemailer");
const resetPassTemp = require('../templates/resetPassTemp')

module.exports.resetPassMail = async (email , otp, userName) => {
    const smtpEndpoint = process.env.SMTP_HOST;
    const port = process.env.SMTP_PORT;
    const senderAddress = process.env.SMTP_USERNAME;
    var toAddresses = email;

    let welcomeTemp = resetPassTemp.resetPassword(otp,email,userName)

    var ccAddresses = "";
    var bccAddresses = "";

    const smtpUsername = process.env.SMTP_USERNAME;
    const smtpPassword = process.env.SMTP_PASSWORD;

    // The subject line of the email
    var subject = "Reset Password";
    // The email body for recipients with non-HTML email clients.
    var body_text = `Please use the otp to reset your password`;
    
    // The body of the email for recipients whose email clients support HTML contenty.
    //var body_html= emailTem;

    let transporter = nodemailer.createTransport({
        host: smtpEndpoint,
        port: port,
        secure: false, // true for 465, false for other ports
        auth: {
            user: smtpUsername,
            pass: smtpPassword
        }
    });

    // Specify the fields in the email.
    let mailOptions = {
        from: senderAddress,
        to: toAddresses,
        subject: subject,
        cc: ccAddresses,
        bcc: bccAddresses,
        text: body_text,
        html: welcomeTemp,
        // Custom headers for configuration set and message tags.
        headers: {}
    };

    // Send the email.
    let info = await transporter.sendMail(mailOptions)
    console.log("Message sent! Message ID: ", info.messageId);


}