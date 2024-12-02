import { NextResponse } from "next/server"
import nodemailer from "nodemailer"

export async function GET() {

  try {

    const res = await fetch(`${process.env.NEXTAUTH_URL}/api/user`, {cache:"no-store"})
    // console.log("res:",res);

    if(res.ok) {
      const users = await res.json();
      // console.log("all users:", users);
      const allfranchisee = users?.filter((user) => user.role === "fr");

      const franchiseEmails = allfranchisee.map((f) => f.email);
      franchiseEmails.push("veerendragumate@gmail.com")
      franchiseEmails.push("yashkalia4215@gmail.com")

      const emailContent = `
            <html>
              <head>
                <style>
                  /* Add your CSS styles here */
                </style>
              </head>
              <body>
                <h1>Hello!</h1>
                <p>Kindly update you spreadsheet.</p>
                <ul>
                  ${franchiseEmails.map(email => `<li>${email}</li>`).join('')}
                </ul>
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
        bcc: ["veerendragumate@gmail.com","yashkalia4215@gmail.com"],
        subject: "Reminder to update spreadsheet",
        text: "Kindly update your spreadsheet",
        html: emailContent
      });

      // console.log("Message sent: %s", info.messageId);
      return NextResponse.json({success:"successfully sent email"}, {status: 201})


    }
    else {
      return NextResponse.json({error:"error in getting all users"})
    }
  } catch (error) {
    // console.error('Error sending emails:', error);
    return NextResponse.json({error:"error in sending mail via cron"})
  }
};
