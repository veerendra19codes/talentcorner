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

        const user = await User.findById(userId);
        if (!user) {
            return NextResponse.json({error: "User not found"}, {status: 400})
        }

        const updatedCompany = await Company.updateOne(
            { _id: companyId }, 
            {
                $set: { 
                    teamleader: updatedFields.teamleader, //set
                    teamleadername: updatedFields.teamleadername, //set
                    franchise: updatedFields.franchise, //set
                    franchisename: updatedFields.franchisename, //set
                },
                $push: {
                    rejectedTeamLeadersName: updatedFields.rejectedTeamLeadersName,
                    rejectedTeamLeaders: updatedFields.rejectedTeamLeaders,
                }
            }
        );

        const updatedUser = await User.updateOne(
            { _id: userId }, 
            {
                $push: {
                    companiesRejected: updatedFields.companiesRejected,
                    companiesRejectedName: updatedFields.companiesRejectedName,
                }
            }
        );

        // console.log("updatedCompany:", updatedCompany);
        // console.log("updatedUser:", updatedUser);
        return NextResponse.json({ success: true, updatedCompany, updatedUser });
            
    } catch (error) {
        // console.error("Error updating company:", error);
        return NextResponse.json({ error: "Internal server error" }, {status: 500});
    }
}
