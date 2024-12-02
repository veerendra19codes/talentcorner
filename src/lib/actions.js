"use server"

import { revalidatePath } from "next/cache";
import { connectToDB } from "./connectToDB";
import models from "./models";
const User = models.User;
const Company = models.Company;
import axios from "axios";
import { NextResponse } from "next/server";

export const getAllCompanies = async () => {
    try {
        // connectToDB();

        const url = `${process.env.NEXTAUTH_URL}/api/company`;

        const res = await axios.get(url);
        return res;
    }
    catch (err) {
        // console.log("error in getting companies: ", err);
        return null;
    }
}

export const addCompany = async (prevState, formData) => {
    try {
        const { companyname, createdBy } = Object.fromEntries(formData);

        if (!companyname) {
            return { error: "Must provide all fields" };
        }
        // console.log("been before connection")
        await connectToDB();

        // Find the highest version for the given company name
        const existingCompanies = await Company.find({ companyname: new RegExp(`^${companyname}( \\d+)?$`, 'i') });

        let version = 1;
        if (existingCompanies.length > 0) {
            version = existingCompanies.length + 1;
        }

        const newCompany = new Company({
            companyname: version > 1 ? `${companyname} ${version}` : companyname,
            createdBy,
            status: "in progress",
            version: version
        });

        await newCompany.save();
        // console.log("New Company added");

        // revalidatePath('/api/company');
        return { success: true };
    } catch (err) {
        // console.error(err);
        return { error: "Error adding company: " + err.message };
    }
}

export const getAllUsers = async () => {
    try {
        // console.log("getAllUsers is called");
        connectToDB();
        
        const url= `${process.env.NEXTAUTH_URL}/api/user`;
        const res = await fetch(url, { cache: 'no-store' });
        // console.log("res:",res.json())

        if (!res.ok) {
            return { error: "Error in getting all users" };
        }
        return res.json();
    }
    catch (err) {
        // console.log("error in getting all users in actions.js: ", err);
        return null;
    }
}