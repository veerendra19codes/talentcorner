import models from "@/lib/models" 
const Company = models.Company;
const User = models.User;
import { connectToDB } from "@/lib/connectToDB"; 
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function PUT(req, {params}) {
    try {
        const {companyId} = params;
        const updatedFields = await req.json();
        // console.log("companyId:", companyId );
        // console.log("updatedFields", updatedFields);

        const newRejectedFranchiseName = updatedFields.rejectedFranchiseName;
        // console.log(newRejectedFranchiseName);

        if (!companyId) {
            return NextResponse.json({error: "Company ID not provided"}, {status: 400})
        }

        await connectToDB();

        const company = await Company.findById(companyId);

        if (!company) {
            return NextResponse.json({error: "Company not found"}, {status: 400})
        }

        if( updatedFields.message === "assign tl") {

             const result = await Company.updateOne(
                { _id: companyId }, 
                {
                    $set: { 
                        teamleadername: updatedFields.teamleadername, 
                        teamleader: updatedFields.teamleader 
                    },
                }
            );

            // console.log(result);
            return NextResponse.json({ success: true, company });
        }
        else if( updatedFields.message === "reject fr") {

            const updatedCompany = await Company.updateOne(
                { _id: companyId }, 
                {
                    $set: { 
                        franchise: null,
                        franchisename: updatedFields.franchisename, 
                    },
                    $push: {
                        rejectedFranchise: updatedFields.rejectedFranchise,
                        rejectedFranchiseName:updatedFields.rejectedFranchiseName,
                    }
                }

            );

            const updatedUser = await User.updateOne(
                { _id: updatedFields.franchise }, 
                {
                    $push: { 
                        companiesRejected: updatedFields.companiesRejected,
                        companiesRejectedName:updatedFields.companiesRejectedName,
                    },
                }
            );

            // console.log(updatedCompany);
            return NextResponse.json({ success: true, company });
        }
        else if( updatedFields.message === "assign fr") {

             const result = await Company.updateOne(
                { _id: companyId }, 
                {
                    $set: { 
                        franchisename: updatedFields.franchisename, 
                        franchise: updatedFields.franchise 
                    },
                }
            );

            // console.log(result);
            return NextResponse.json({ success: true, company });
        }
        else {

        const result = await Company.updateOne(
            { _id: companyId }, 
            {
                $set: { 
                    franchisename: updatedFields.franchisename,
                    franchise: updatedFields.franchise,
                    teamleader: updatedFields.teamleader,
                    teamleadername: updatedFields.teamleadername,
                },
                $push: { 
                    rejectedTeamLeadersName: updatedFields.rejectedTeamLeadersName,
                    rejectedTeamLeaders: updatedFields.rejectedTeamLeaders,
                },
            }
        );

        return NextResponse.json({ success: true, company });
        }
        
    } catch (error) {
        // console.error("Error updating company:", error);
        return NextResponse.json({ error: "Internal server error" }, {status: 500});
    }
}


export async function DELETE(req, {params}) {
    try {
        const {companyId} = params;
        console.log("companyId:",companyId);
        const res = await Company.findByIdAndDelete(companyId)
        console.log("res:",res);
        return NextResponse.json({ok:true, res},{status:200})
    } catch (error) {
        console.log("error in deleting company:",error);
        return NextResponse.json({ok: false, error}, {status:500})
    }
}