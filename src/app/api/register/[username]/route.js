import { connectToDB } from "@/lib/connectToDB";
import { NextResponse } from "next/server";
import models from "@/lib/models"
const User = models.User;

export const dynamic = "force-dynamic";

export async function DELETE(req, {params}) {
    const {username} = params;
    // console.log("username to be deleted in route.js:", username);

    try {
        await connectToDB();

        const result = await User.findOneAndDelete({username});
        // console.log("result:", result);

        const allusers = await User.find({}, {password:0});

        return NextResponse.json({message:"user deleted successfully", allusers},{status: 201});
    } catch(err) {
        // console.log("error in deleting user from db in");
        return NextResponse.json({message: "Error in deleting user in db:"}, {status: 501})
    }
}