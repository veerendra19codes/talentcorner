import models from "@/lib/models";
const Company = models.Company;
import { connectToDB } from "@/lib/connectToDB";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req){
    try {
        await connectToDB();

        const companies = await Company.find();
        return NextResponse.json(companies);
    }
    catch(err) {
        // console.log("error in api/company:",err);
        return NextResponse.json(err);
        // console.log("Error in getting companies in route.js:", err);
    }
}

export async function POST(req) {
    try {
        await connectToDB();

        const { companyname, createdBy } = await req.json();
        // console.log("company name and createdBy:",companyname,createdBy);

        if (!companyname || !createdBy) {
            return NextResponse.json({ message: "Must provide all fields" }, { status: 400 });
        }

        // Find the highest version for the given company name
        const existingCompanies = await Company.find({ companyname: new RegExp(`^${companyname}( \\d+)?$`, 'i') });

        let version = 1;
        if (existingCompanies.length > 0) {
            version = existingCompanies.length + 1;
        }

        const newCompany = new Company({
            companyname: version > 1 ? `${companyname} ${version}` : companyname,
            jobdetails: version > 1 ? `${companyname} ${version}` : companyname,
            createdBy,
            version: `${version}`,
        });

        await newCompany.save();

        return NextResponse.json({ message: "Company added successfully", data: newCompany }, { status: 201 });
    } catch (err) {
        // console.error("Error while sending Company details in route.js", err);
        return NextResponse.json({ message: "Error in Company details in route.js" }, { status: 501 });
    }
}
