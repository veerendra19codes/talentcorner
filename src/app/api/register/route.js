import { connectToDB } from "@/lib/connectToDB";
import  models  from "@/lib/models";
const User = models.User;
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

export const dynamic = "force-dynamic";
// Inside your API routes
// import useApiState from '@/apiState';

// Update state in POST and PUT functions

export async function POST(req) {
    // const { setAllUsers } = useApiState();
    try {
        await connectToDB();

        const {username, email, password, role, level, teamleadername, companiesCompleted, companiesRejected, companiesWorking, companiesCompletedName, companiesRejectedName, companiesWorkingName, spreadsheet, deployedlink, revenueapi,preference,reminders, status} = await req.json();
        // console.log("new employee:", {username, password, email, role, level, teamleadername, companiesCompleted, companiesRejected, companiesWorking ,companiesCompletedName, companiesRejectedName, companiesWorkingName, spreadsheet,deployedlink, revenueapi, preference,reminders, status});

        const existsWithUsername = await User.findOne({username});
        const existsWithEmail = await User.findOne({email})
        
        if(existsWithEmail || existsWithUsername) {
            // console.log("Username or Email already exists")
            return NextResponse.json({message: "Username or Email already exists"},{status:203});
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        // console.log("hashedPassword:",hashedPassword)

        const user = await User.create({
            username,
            email,
            password: hashedPassword,
            role,
            level, 
            teamleadername,
            companiesCompleted, 
            companiesRejected, 
            companiesWorking,
            companiesCompletedName, companiesRejectedName, companiesWorkingName,
            spreadsheet, deployedlink, revenueapi, preference,reminders, status
        });
        // console.log("user added in db:",user);

        const allusers = await User.find({}, {password: 0});
        // console.log("all users:",allusers.length);
        // setAllUsers(allusers);

        // console.log("user added in db:", user);
        return NextResponse.json({message:"User registered successfully", allusers}, {status: 201});
    }
    catch(err) {
        console.log("Error while registering user in route.js", err);
        return NextResponse.json({message: "Error in registered user in route.js"}, {status: 501});
    }
}



export async function PUT(req) {
    try {
        await connectToDB();

        const {username, email, password, role, level, teamleadername, companiesCompleted, companiesRejected, companiesWorking, companiesCompletedName, companiesRejectedName, companiesWorkingName, spreadsheet, deployedlink, revenueapi,preference, status } = await req.json();
        // console.log("employee to be updated:", {username, password, email, role, level, teamleadername, companiesCompleted, companiesRejected, companiesWorking ,companiesCompletedName, companiesRejectedName, companiesWorkingName, spreadsheet,deployedlink, revenueapi, preference,status });

        const exists = await User.findOne({username});
        if(!exists) {
            return NextResponse.json({error:"User with this username does not exists"});
        }

        //new password
        if(password !== "") {
            const hashedPassword = await bcrypt.hash(password, 10);
            const updatedUser = await User.updateOne(
                {username},
                {
                    $set: { 
                        email,
                        password: hashedPassword,
                        role,
                        level,
                        spreadsheet,
                        teamleadername,
                        preference,
                        deployedlink,
                        revenueapi,
                        companiesCompleted, 
                        companiesRejected, 
                        companiesWorking,
                        companiesCompletedName, 
                        companiesRejectedName, 
                        companiesWorkingName, 
                        revenueapi, 
                        status,
                    },
                }
            );

            const allusers = await User.find({}, {password: 0});
            // console.log("all users.len:",allusers.length);
            

            // console.log("updated user in db:", updatedUser);
            return NextResponse.json({message:"User updated successfully", allusers}, {status: 201});
        }

        //update user without password
        else {

            const updatedUser = await User.updateOne(
                {username},
                {
                    $set: { 
                        email,
                        role,
                        level,
                        spreadsheet,
                        teamleadername,
                        preference,
                        deployedlink,
                        revenueapi,
                        companiesCompleted, 
                        companiesRejected, 
                        companiesWorking,
                        companiesCompletedName, 
                        companiesRejectedName, 
                        companiesWorkingName, 
                        revenueapi, 
                        status
                    },
                }
            );

            const allusers = await User.find({}, {password: 0});
            // console.log("all users.len:",allusers.length);

            console.log("updated user in db:", updatedUser);
            return NextResponse.json({message:"User updated successfully",allusers}, {status: 201});
        }
    }
    catch(err) {
        console.log("Error while registering user in route.js", err);

        return NextResponse.json({message: "Error in registered user in route.js"}, {status: 501});
    }
}
