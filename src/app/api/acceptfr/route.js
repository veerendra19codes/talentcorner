import models from "@/lib/models" 
const Company = models.Company;
const User = models.User;
import { connectToDB } from "@/lib/connectToDB"; 
import { NextResponse } from "next/server";

export async function PUT(req) {
    try {
        const updatedFields = await req.json(); 
        // console.log("updatedFields", updatedFields);

        //check if companyId is provided from frontend
        const companyId = updatedFields.companyId;
        if (!companyId) {
            // console.log("company id not given:",companyId);
            return NextResponse.json({error: "Company ID not provided"}, {status: 400})
        }

        //check if userId is provided from frontend
        const userId = updatedFields.userId;
        if (!userId) {
            // console.log("useriD not given:",userId)
            return NextResponse.json({error: "User ID not provided"}, {status: 400})
        }

        await connectToDB();

        //check if company exists in models with the companyId provided from frontend
        const company = await Company.findById(companyId);
        if (!company) {
            // console.log("company doest not exist:",company);
            return NextResponse.json({error: "Company not found"}, {status: 400})
        }

        //check if user exists in models with the userId provided from frontend
        const user = await User.findById(userId);
        if (!user) {
            // console.log("user does not exist:",user);
            return NextResponse.json({error: "User not found"}, {status: 400})
        }

        const updatedCompany = await Company.updateOne(
            { _id: companyId }, 
            {
                $set: { 
                    status: updatedFields.status
                },
            }
        );
        // console.log("updated Company:",updatedCompany);

        const updatedUser = await User.updateOne(
            { _id: userId }, 
            {
                $push: {
                    companiesAccepted: updatedFields.companiesAccepted,
                    companiesAcceptedName: updatedFields.companiesAcceptedName,
                }
            }
        );

        // console.log("updatedCompany:", updatedCompany);
        // console.log("updatedUser:", updatedUser);
        const upuser = await User.findById(userId);
        // console.log("upuser:",upuser);

        // const allupdatedusers = await User.find({}, {password:0});
        // console.log("allupdatedusers:",allupdatedusers);

        return NextResponse.json({ success: true, upuser});
            
    } catch (error) {
        // console.error("Error updating company:", error);
        return NextResponse.json({ error: "Internal server error" }, {status: 500});
    }
}
