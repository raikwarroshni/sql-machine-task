module.exports.resetPassword = function (otp, email, userName) {
    let resetPass = `
    <!doctype html>
    <html lang="en-US">  
    <body>
           <p>Hello ${userName}, Your reset-password otp is ${otp}, Your email id is ${email} <p/>                                                                    
    </body>
    </html>`

    return resetPass
}



