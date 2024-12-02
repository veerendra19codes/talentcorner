

"use server";

import nodemailer from "nodemailer"
import { NextResponse } from "next/server";

export const sendEmail = async (emails,spreadsheet) => {
  try {
    console.log("spreadsheet in sendEmail in mailer:",spreadsheet)
    console.log("email:",emails);
     const emailContent = `
      <!DOCTYPE html>
      <html>
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
              body {
                  font-family: Arial, sans-serif;
              }
              .container {
                  width: 100%;
                  max-width: 600px;
                  margin: 0 auto;
                  padding: 20px;
                  border: 1px solid #ddd;
                  border-radius: 10px;
                  background-color: #f9f9f9;
              }
              .header {
                  text-align: center;
              }
              .header img {
                  max-width: 100px;
              }
              .content {
                  margin: 20px 0;
                  text-align: center;
              }
              .button {
                  display: inline-block;
                  padding: 10px 20px;
                  margin: 20px 0;
                  color: white;
                  background-color: #007BFF;
                  text-decoration: none;
                  border-radius: 5px;
              }
              .footer {
                  margin-top: 20px;
                  text-align: center;
              }
              .footer a {
                  color: #007BFF;
                  text-decoration: none;
              }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="header">
                  <img src="https://talentcorner.in/wp-content/uploads/2017/06/tchr-logo-100px.png" alt="Talent Corner Logo">
              </div>
              <div class="content">
                  <h1>Kindly update your spreadsheet and keep it updated</h1>
                  <a href="${spreadsheet}" style="color:white;" class="button">Update Spreadsheet</a>
              </div>
              <div class="footer">
                  <p>
                      <a href="https://talentcorner.in/">Talent Corner</a>
                  </p>
              </div>
          </div>
      </body>
      </html>
    `;

    var transport = nodemailer.createTransport({
      host: "bulk.smtp.mailtrap.io",
      port: 587,
      auth: {
        user: "api",
                pass: process.env.MAILTRAP_PASSWORD,
            }
          });

          const info = await transport.sendMail({
            from: 'info@talentcornertaskmanager.com',
            to: "me@gmail.com",
            bcc: emails,
            subject: "Reminder to update your spreadsheet",
            text: "Kindly update your spreadsheet",
            html: emailContent,
            // html: emailContent
        });

        console.log("Message sent: %s", info);
        console.log("accepted:",info.accepted.map((m) => m));
        return NextResponse.json({success:"successfully sent email"}, {status: 201})
    } catch (error) {
        // console.error("Error sending email:", error);
        if (error.code === 'ETIMEDOUT') {
            // Handle timeout error, e.g., retry after a delay
            // console.error("SMTP Connection Timeout:", error.message);
            return NextResponse.json({message:"Connection Timed Out , Please try again later sometime"}, {status:501})
        }
    }
}




export const sendEmailAll = async (emails) => {
    try {
        console.log("emails in sendEmail fn:", emails); 
    //     const emailContent = `
    //   <html>
    //     <head>
    //       <style>
    //         /* Add your CSS styles here */
    //       </style>
    //     </head>
    //     <body>
    //       <h1>Hello Active Franchises!</h1>
    //       <p>This is a test email message to check the email sending functionality.</p>
    //       <ul>
    //         ${emails.map(email => `<li>${email}</li>`).join('')}
    //       </ul>
    //     </body>
    //   </html>
    // `;

    const emailContent = `
      <!DOCTYPE html>
      <html>
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
              body {
                  font-family: Arial, sans-serif;
              }
              .container {
                  width: 100%;
                  max-width: 600px;
                  margin: 0 auto;
                  padding: 20px;
                  border: 1px solid #ddd;
                  border-radius: 10px;
                  background-color: #f9f9f9;
              }
              .header {
                  text-align: center;
              }
              .header img {
                  max-width: 100px;
              }
              .content {
                  margin: 20px 0;
                  text-align: center;
              }
              .button {
                  display: inline-block;
                  padding: 10px 20px;
                  margin: 20px 0;
                  color: white;
                  background-color: #007BFF;
                  text-decoration: none;
                  border-radius: 5px;
              }
              .footer {
                  margin-top: 20px;
                  text-align: center;
              }
              .footer a {
                  color: #007BFF;
                  text-decoration: none;
              }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="header">
                  <img src="https://talentcorner.in/wp-content/uploads/2017/06/tchr-logo-100px.png" alt="Talent Corner Logo">
              </div>
              <div class="content">
                  <h1>Kindly update your spreadsheet and keep it updated</h1>
                  <a href="https://www.google.com/sheets/about/" style="color:white;" class="button">Update Spreadsheet</a>
              </div>
              <div class="footer">
                  <p>
                      <a href="https://talentcorner.in/">Talent Corner</a>
                  </p>
              </div>
          </div>
      </body>
      </html>
    `;

//     const emailContent = `
//     <html dir="ltr" lang="en">

//   <head>
//     <meta content="text/html; charset=UTF-8" http-equiv="Content-Type" />
//     <meta name="x-apple-disable-message-reformatting" />
//   </head>
//   <div style="display:none;overflow:hidden;line-height:1px;opacity:0;max-height:0;max-width:0">Reminder to update your spreadsheet<div> ‌​</div>
//   </div>

//   <body style="background-color:#ffffff;font-family:-apple-system,BlinkMacSystemFont,&quot;Segoe UI&quot;,Roboto,Oxygen-Sans,Ubuntu,Cantarell,&quot;Helvetica Neue&quot;,sans-serif">
//     <table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation" style="max-width:560px;margin:0 auto;padding:20px 0 48px">
//       <tbody>
//         <tr style="width:100%">
//           <td><img alt="Talent Corner logo" height="42" src="/tclogo.png" style="display:block;outline:none;border:none;text-decoration:none;border-radius:21px;width:42px;height:42px" width="42" />
//             <h1 style="font-size:24px;letter-spacing:-0.5px;line-height:1.3;font-weight:400;color:#484848;padding:17px 0 0">Kindly update your spreadsheet and keep the data updated!</h1>
//             <table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation" style="padding:27px 0 27px">
//               <tbody>
//                 <tr>
//                   <td><a href="https://talentcorner.in/" style="line-height:100%;text-decoration:none;display:block;max-width:100%;background-color:#5e6ad2;border-radius:3px;font-weight:600;color:#fff;font-size:15px;text-align:center;padding:11px 23px 11px 23px" target="_blank"><span><!--[if mso]><i style="letter-spacing: 23px;mso-font-width:-100%;mso-text-raise:16.5" hidden>&nbsp;</i><![endif]--></span><span style="max-width:100%;display:inline-block;line-height:120%;mso-padding-alt:0px;mso-text-raise:8.25px">Kindly update your spreadsheet!</span><span><!--[if mso]><i style="letter-spacing: 23px;mso-font-width:-100%" hidden>&nbsp;</i><![endif]--></span></a></td>
//                 </tr>
//               </tbody>
//             </table>
//             <p style="font-size:15px;line-height:1.4;margin:0 0 15px;color:#3c4149">This message is from Talent Corner</p>
//             <hr style="width:100%;border:none;border-top:1px solid #eaeaea;border-color:#dfe1e4;margin:42px 0 26px" /><a href="https://talentcorner.in/" style="color:#b4becc;text-decoration:none;font-size:14px" target="_blank">Talent Corner</a>
//           </td>
//         </tr>
//       </tbody>
//     </table>
//   </body>

// </html>
//     `
        var transport = nodemailer.createTransport({
            host: "bulk.smtp.mailtrap.io",
            port: 587,
            auth: {
              user: "api",
                pass: process.env.MAILTRAP_PASSWORD,
            }
          });

          const info = await transport.sendMail({
            from: 'info@talentcornertaskmanager.com',
            to: "me@gmail.com",
            bcc: ["veerendragumate@gmail.com", "veerendrafordev@gmail.com"],
            subject: "Reminder to update your spreadsheet",
            text: "Kindly update your spreadsheet",
            html: emailContent,
            // html: emailContent
        });

        console.log("Message sent: %s", info);
        console.log("accepted:",info.accepted.map((m) => m));

        return NextResponse.json({success:"successfully sent email"}, {status: 201})
    } catch (error) {
      if (error.code === 'ETIMEDOUT') {
          return { ok: false, message: "Connection Timed Out, Please try again later" };
      }
      return { ok: false, message: "Error sending email" };
  }
}