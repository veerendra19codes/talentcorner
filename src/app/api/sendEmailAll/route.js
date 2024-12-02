

import { sendEmailAll } from "@/lib/mailer";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const { emails } = await req.json();
        // console.log("emails in sendEmail route:", emails);

        const res = await sendEmailAll(emails);
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