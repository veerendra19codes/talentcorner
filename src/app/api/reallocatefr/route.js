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
            return NextResponse.json({error: "Company ID not provided"}, {status: 400})
        }

        //check if userId is provided from frontend
        const userId = updatedFields.userId;
        if (!userId) {
            return NextResponse.json({error: "User ID not provided"}, {status: 400})
        }

        await connectToDB();

        //check if company exists in models with the companyId provided from frontend
        const company = await Company.findById(companyId);
        if (!company) {
            return NextResponse.json({error: "Company not found"}, {status: 400})
        }

        //check if user exists in models with the userId provided from frontend
        const user = await User.findById(userId);
        if (!user) {
            return NextResponse.json({error: "User not found"}, {status: 400})
        }

        const updatedCompany = await Company.updateOne(
            { _id: companyId }, 
            {
                $set: { 
                    franchisename: updatedFields.franchisename, 
                    franchise: updatedFields.franchise,
                    status: updatedFields.status,
                },
                $push: {
                    reallocatedFranchiseName: updatedFields.reallocatedFranchiseName,
                    reallocatedFranchise: updatedFields.reallocatedFranchise,
                }
            }
        );

        const updatedUser = await User.updateOne(
            { _id: userId }, 
            {
                $push: {
                    companiesReallocated: updatedFields.companiesReallocated,
                    companiesReallocatedName: updatedFields.companiesReallocatedName,
                }
            }
        );

        // console.log("updatedCompany:",updatedCompany);
        // console.log("updatedUser:",updatedUser);

        const updateduser = await User.findById(userId)
        // console.log("updateduser:",updateduser);

        const updatedcompany = await Company.findById(companyId)
        // console.log("updatedcompany:",updatedcompany);


        // const updatedcompany = await Company.findById(companyId);
        // if (!company) {
        //     return NextResponse.json({error: "Company not found"}, {status: 400})
        // }

        // //check if user exists in models with the userId provided from frontend
        // const updateduser = await User.findById(userId);
        // if (!user) {
        //     return NextResponse.json({error: "User not found"}, {status: 400})
        // }

        // console.log("updatedCompany:", updatedcompany);
        // console.log("updatedUser:", updateduser);
        return NextResponse.json({ success: true,updateduser });
            
    } catch (error) {
        // console.error("Error updating company:", error);
        return NextResponse.json({ error: "Internal server error" }, {status: 500});
    }
}


