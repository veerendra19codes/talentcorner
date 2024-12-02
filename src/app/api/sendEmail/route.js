
import { sendEmail } from "@/lib/mailer";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const { emails, spreadsheet } = await req.json();
        // console.log("emails in sendEmail route:", emails);
        // console.log("spreadsheet:",spreadsheet);

        const res = await sendEmail(emails,spreadsheet);
        // const message = await res.json();

        if(res.ok) {
        return NextResponse.json({success:"sent successfully"}, {status: 201})
        }
        else {
        return NextResponse.json({error:"error in sending email"} , {status: 501})
        }
    } catch (err) {
        // console.log("error in sendEmail Route:", err);
        return NextResponse.json({error:"Try again later sometimes"} , {status: 501})
    }
}
