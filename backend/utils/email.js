const { Resend } = require("resend");
const { createEmailLog } = require("../database/emailDatabase");
require("dotenv").config();

const resend = new Resend(process.env.RESEND_API_KEY);

async function sendEmail(emailAddress,subject,html){
    const request = {
        from: "no-reply@wisnup.tech",
        to: [emailAddress],
        subject: subject,
        html: html
    }
    console.log(`sending email to ${emailAddress}`)
    const response = await resend.emails.send(request);
    console.log(`resend api response: \n${JSON.stringify(response)}`);


    const requestCopy = {
        from: request["from"],
        to: request["to"],
        subject: request["subject"],
    }
    createEmailLog(requestCopy,response);
    return response;
}

async function forgetPassword(emailAddress,uniqueUrl){
    const html = `
        <div style="font-family: Arial, sans-serif; background-color: #F2F2F2; padding: 10px; margin: 0;">
            
            <!-- Header -->
            <div style="background-color: #ffffff; padding: 20px; text-align: center;">
            <h1 style="margin: 0; color: #00AB6B;">PocketWise</h1>
            <p style="margin: 0; font-size: 16px; color: #787878;">Smart Life, Smart <span color: #00AB6B;><strong>Money</strong><span/></p>
            </div>

            <!-- Body -->
            <div style="background-color: white; padding: 30px; margin: 30px auto; max-width: 600px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.05);">
            <p>Hello,</p>
            <p>You requested a password reset. Click the button below to continue:</p>
            <p style="padding: 5px; background-color: #00AB6B;">
                <a href="${uniqueUrl}" target="_blank" style="color:white; text-decoration: none; font-weight: bold;">${uniqueUrl}</a>
            </p>
            <p>If you did not make this request, you can safely ignore this email.</p>
            <p style="margin-top: 40px;">— The PocketWise Team</p>
            </div>

            <!-- Footer -->
            <div style="background-color: #00AB6B; padding: 20px; text-align: center; color: white; font-size: 12px;">
            <p style="margin: 0;">© ${new Date().getFullYear()} PocketWise. All rights reserved.</p>
            </div>

        </div>
        `;
    const subject = "password reset request"
    const response = await sendEmail(
        emailAddress,
        subject,
        html
    )
    console.log(response)
    return response;
}

module.exports = {
    forgetPassword
}