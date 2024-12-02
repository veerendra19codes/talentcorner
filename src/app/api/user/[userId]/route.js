import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/connectToDB"
import models from "@/lib/models.js"
const User = models.User; 

export const dynamic = "force-dynamic";

export const GET = async (request, {params}) => {
    
    // console.log("params inside route.js:",params);
    const {username}= params;
    // console.log("slug inside route.js",slug);

    try {
        await connectToDB();

        const user = await User.findOne({username}, {password: 0});
        return NextResponse.json(user);
    }
    catch(err) {
        // console.error(err);
        // console.log("failed to get a user from db");
    }
}




export async function PUT(req, {params}) {
    try {
        const {userId} = params;
        // console.log("userId", userId );

        const {message} = await req.json();

        if (message === "update reminder count") {
            await connectToDB();
            const user = await User.findById(userId);
            if (!user) {
                return NextResponse.json({ error: "User not found" }, { status: 404 });
            }
            // user.reminder = user.reminder+1;

            const updatedUser = await User.findByIdAndUpdate(
                userId,
                { $inc: { reminders: 1 } }, // Increment remindercount by 1
                { new: true } // Return the updated document
            );

            // console.log(updatedUser);
            return NextResponse.json({ success: true, user: updatedUser });
        } 
        else {
            

            const updatedFields = await req.json(); 

            // console.log("updatedFields", updatedFields);
            const newCompaniesRejectedName = updatedFields.companyname;
            // console.log(newCompaniesRejectedName);

            if (!userId) {
                return NextResponse.json({error: "user ID not provided"}, {status: 400})
            }


            const result = await User.updateOne(
                { _id: userId }, 
                {
                    $push: { companiesrejectedName: newCompaniesName }, 
                }
            );

            return NextResponse.json({ success: true, company });
        }
    } catch (error) {
        // console.error("Error updating company:", error);
        return NextResponse.json({ error: "Internal server error" }, {status: 500});
    }
}

