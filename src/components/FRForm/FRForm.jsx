'use client'

import { useEffect, useState, useRef } from 'react';
import { CgProfile } from "react-icons/cg";
import { MdLockOutline } from "react-icons/md";
import { MdOutlineMailOutline } from "react-icons/md";
import { RiTeamLine } from "react-icons/ri";
import { LuFileSpreadsheet } from "react-icons/lu";
import { BsGraphUpArrow } from "react-icons/bs";
import { GrUserExpert } from "react-icons/gr";
import { GrStatusGood } from "react-icons/gr";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useRouter } from 'next/navigation';
import axios from "axios"

const FRForm = ({ userdetails, method, setSelectedRole, teamleaders, setUsers, setSelectedFR, users, }) => {
    const router = useRouter();

    const [info, setInfo] = useState({
        username: userdetails.username || "",
        email: userdetails.email || "",
        password: "",
        role: userdetails.role || "",
        teamleadername: userdetails.teamleadername || "",
        spreadsheet: userdetails.spreadsheet || "",
        level: userdetails.level || "",
        preference: userdetails.preference || "",
        companiesCompleted: userdetails.companiesCompleted || "",
        companiesRejected: userdetails.companiesRejected || "",
        companiesWorking: userdetails.companiesWorking || "",
        companiesAccepted: userdetails.companiesAccepted || "",
        companiesCompletedName: userdetails.companiesCompletedName || "",
        companiesRejectedName: userdetails.companiesRejectedName || "",
        companiesWorkingName: userdetails.companiesWorkingName || "",
        companiesAcceptedName: userdetails.companiesAcceptedName || "",
        deployedlink: userdetails.deployedlink || "",
        revenueapi: userdetails.revenueapi || "",
        reminders: userdetails.reminders || 0,
        status: userdetails.status || "active",
    });

    const [newpassword, setNewPassword] = useState("");
    const [changePassword, setChangePassword] = useState(false);
    const [error, setError] = useState("");
    const [pending, setPending] = useState(false);

    const [preferences, setPreferences] = useState(info.preference.split(',').filter(p => p !== ""));
    const dropdownRef = useRef(null);
    const options = [
        "Analytics / KPO / Research",
        "BPO / Call Centre",
        "IT Services & Consulting",
        "Electronic Components / Semiconductors",
        "Electronics Manufacturing",
        "Electronics Manufacturing-Electronic Manufacturing Services (EMS)",
        "Emerging Technologies",
        "Emerging Technologies-AI/ML",
        "Emerging Technologies-AR/VR",
        "Emerging Technologies-3D Printing",
        "Emerging Technologies-Blockchain",
        "Emerging Technologies-Cloud",
        "Emerging Technologies-Cybersecurity",
        "Emerging Technologies-Drones/Robotics",
        "Emerging Technologies-IoT",
        "Emerging Technologies-Nanotechnology",
        "Hardware & Networking",
        "Internet",
        "internet-E-Commerce",
        "Internet-OTT",
        "Software Product",
        "Banking",
        "Financial Services",
        "Financial Services-Asset Management",
        "Financial Services-Broking",
        "FinTech / Payments",
        "Insurance",
        "Investment Banking / Venture Capital / Private Equity",
        "NBFC",
        "NBFC-Micro Finance",
        "Education / Training",
        "E-Learning / EdTech",
        "Auto Components",
        "Auto Components-Tyre",
        "Automobile",
        "Automobile-Automobile Dealers",
        "Automobile-Electric Vehicle (EV)",
        "Building Material",
        "Building Material-Cement",
        "Building Material-Ceramic",
        "Building Material-Glass",
        "Chemicals",
        "Chemicals-Paints",
        "Defence & Aerospace",
        "Electrical Equipment",
        "Fertilizers / Pesticides / Agro chemicals",
        "Industrial Automation",
        "Industrial Equipment / Machinery",
        "Industrial Equipment / Machinery-Construction Equipment",
        "Industrial Equipment / Machinery-Machine Tools",
        "Iron & Steel",
        "Metals & Mining",
        "Packaging & Containers",
        "Petrochemical / Plastics / Rubber",
        "Pulp & Paper",
        "Aviation",
        "Courier / Logistics",
        "Courier / Logistics-Logistics Tech",
        "Engineering & Construction",
        "Oil & Gas",
        "Ports & Shipping",
        "Ports & Shipping-Shipbuilding",
        "Power",
        "Power-Hydro",
        "Power-Nuclear",
        "Power-Solar",
        "Power-Wind",
        "Railways",
        "Real Estate",
        "Real Estate-Co-working",
        "Urban Transport",
        "Water Treatment / Waste Management",
        "Beauty & Personal Care",
        "Beverage",
        "Beverage-Brewery / Distillery",
        "Consumer Electronics & Appliances",
        "Fitness & Wellness",
        "FMCG",
        "Food Processing",
        "Food Processing-Dairy",
        "Food Processing-Meat / Poultry",
        "Food Processing-Sugar",
        "Furniture & Furnishing",
        "Gems & Jewellery",
        "Hotels & Restaurants",
        "Leather",
        "Retail",
        "Textile & Apparel",
        "Textile & Apparel-Fashion",
        "Textile & Apparel-Handicraft",
        "Textile & Apparel-Home Textile",
        "Textile & Apparel-Technical Textile",
        "Textile & Apparel-Yarn & Fabric",
        "Travel & Tourism",
        "Biotechnology",
        "Clinical Research / Contract Research",
        "Medical Devices & Equipment",
        "Medical Services / Hospital",
        "Medical Services / Hospital-Diagnostics",
        "Pharmaceutical & Life Sciences",
        "Advertising & Marketing",
        "Advertising & Marketing-Digital Marketing",
        "Advertising & Marketing-Public Relations",
        "Animation & VFX",
        "Events / Live Entertainment",
        "Film / Music / Entertainment",
        "Gaming",
        "Printing & Publishing",
        "Sports / Leisure & Recreation",
        "Telecom / ISP",
        "TV / Radio",
        "Accounting / Auditing",
        "Architecture / Interior Design",
        "Content Development / Language",
        "Design",
        "Facility Management Services",
        "Law Enforcement / Security Services",
        "Legal",
        "Management Consulting",
        "Recruitment / Staffing",
        "Agriculture / Forestry / Fishing",
        "Agriculture / Forestry / Fishing-Agri-tech",
        "Government / Public Administration",
        "Import & Export",
        "Miscellaneous",
        "NGO / Social Services / Industry Associations"
    ];

    const handleInput = (e) => {
        setInfo((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
            role: "fr",
        }));
        setError("");
    }

    useEffect(() => {
        setError("");

        if (changePassword) {
            setInfo((prev) => ({
                ...prev,
                password: newpassword
            }));
            setError("");
        }
    }, [newpassword, changePassword]);

    const checkErrors = () => {

        const { username, email, password, teamleadername, spreadsheet, level, preference, status } = info;

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError("Invalid email");
            return;
        }

        if (changePassword) {
            setInfo((prev) => ({
                ...prev,
                password: newpassword
            }))
            setError("");
        }

        //method is post i.e. registering new admin
        if (method !== "put") {
            if (!username || !email || !password || !teamleadername || !spreadsheet || !level || !preference || !status) {
                setError("Must provide all credentials");
            }
        }

        //method is put i.e. editing details of existing admin
        else {
            //edit with password
            if (changePassword) {
                // console.log("new password:", newpassword);
                setInfo((prev) => ({
                    ...prev,
                    password: newpassword
                }))
                setError("");
                // console.log("password:", password);

                if (!username || !email || !password || !teamleadername || !spreadsheet || !level || !preference || !status) {
                    setError("Must provide all credentials");
                }
            }

            //edit without password
            else {
                if (!username || !email || !teamleadername || !spreadsheet || !level || !preference || !status) {
                    setError("Must provide all credentials");
                }
            }
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();
        // console.log("info:", info);
        const { username, email, password, teamleadername, spreadsheet, level, preference, status } = info;


        //if method is post 
        if (method !== "put") {
            //check all fields
            if (!username || !email || !password || !teamleadername || !spreadsheet || !level || !preference || !status) {
                setError("Must provide all credentials");
            }

            //registering new franchise
            else {
                //all credentials , then post 
                try {
                    setPending(true);
                    // console.log("info", info)

                    const url = "/api/register";
                    const res = await axios({
                        method: "POST",
                        url,
                        data: info,
                        headers: {
                            "Content-Type": "application/json",
                        },
                    });
                    console.log("res:", res);


                    if (res.status === 201 || res.status === 200) {

                        const data = res.data;
                        // console.log("data:", data);

                        setUsers(data.allusers);
                        // console.log("users.len in adform:", users?.length)

                        //set userdetails to default values
                        setInfo({
                            username: "",
                            password: "",
                            email: "",
                            role: "",
                            level: "",
                            teamleadername: "",
                            companiesCompleted: [],
                            companiesRejected: [],
                            companiesWorking: [],
                            companiesAccepted: [],
                            companiesCompletedName: [],
                            companiesRejectedName: [],
                            companiesWorkingName: [],
                            companiesAcceptedName: [],
                            spreadsheet: "",
                            deployedlink: "",
                            revenueapi: "",
                            preference: "",
                            reminders: 0,
                            status: "",
                        });

                        toast.success('Franchise added successfully', {
                            position: "top-right",
                            autoClose: 2000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                            theme: "light",
                        });
                        setPending(false);
                        router.refresh("/edit")
                        // console.log("User registered successfully");
                    }
                    else {
                        console.log("res in else:", res);
                        const errorData = res.data;
                        console.log("errorData.messgage:", errorData.message);
                        setError(errorData.message);
                        setPending(false);
                    }
                } catch (err) {
                    console.log("error in catch:", err);
                    console.log("err.message:", err.message);
                    setError(err.message);
                    setPending(false);
                }
            }
        }

        //method is put
        else {
            //check if user wants to change the password 
            if (changePassword) {

                setInfo((prev) => ({
                    ...prev,
                    password: newpassword
                }));
                setError("");

                //check all fields
                if (!username || !email || !password || !teamleadername || !spreadsheet || !level || !preference || !status) {
                    setError("Must provide all credentials");
                }
                else {
                    try {
                        setPending(true);

                        const url = "/api/register";
                        const res = await axios({
                            method: "PUT",
                            url,
                            data: info,
                            headers: {
                                "Content-Type": "application/json",
                            },
                        });
                        // console.log("res:",res);

                        if (res.status === 200 || res.status === 201) {

                            const data = res.data;
                            // console.log("data:", data);

                            setUsers(data.allusers);
                            // console.log("users.len in adform:", users?.length);

                            // /set userdetails to default values
                            setInfo({
                                username: "",
                                password: "",
                                email: "",
                                role: "",
                                level: "",
                                teamleadername: "",
                                companiesCompleted: [],
                                companiesRejected: [],
                                companiesWorking: [],
                                companiesAccepted: [],
                                companiesCompletedName: [],
                                companiesRejectedName: [],
                                companiesWorkingName: [],
                                companiesAcceptedName: [],
                                spreadsheet: "",
                                deployedlink: "",
                                revenueapi: "",
                                preference: "",
                                reminders: 0,
                                status: "",
                            });

                            toast.success('Franchise updated successfully', {
                                position: "top-right",
                                autoClose: 2000,
                                hideProgressBar: false,
                                closeOnClick: true,
                                pauseOnHover: true,
                                draggable: true,
                                progress: undefined,
                                theme: "light",
                            });
                            setSelectedRole("")
                            setSelectedFR("");
                            setPending(false);
                            router.refresh("/edit")
                        }
                        else {
                            console.log("res in else:", res);

                            const errorData = res.data;
                            console.log("errorData.message:", res.data);
                            setError(errorData.message);
                            setPending(false);
                        }
                    }
                    catch (err) {
                        console.log("error in catch:", err);
                        setError(err.message);
                        setPending(false);
                    }
                }
            }

            else {
                //check everything except password
                if (!username || !email || !teamleadername || !spreadsheet || !level || !preference || !status) {
                    setError("Must provide all credentials");
                }
                else {

                    try {
                        setPending(true);
                        const url = "/api/register";
                        const res = await axios({
                            method: "PUT",
                            url,
                            data: info,
                            headers: {
                                "Content-Type": "application/json",
                            },
                        });
                        console.log("res:", res);

                        if (res.status === 200 || res.status === 201) {
                            const data = res.data;
                            // console.log("data:", data);

                            setUsers(data.allusers);
                            // console.log("users.len in adform:", users?.length);

                            // /set userdetails to default values
                            setInfo({
                                username: "",
                                password: "",
                                email: "",
                                role: "",
                                level: "",
                                teamleadername: "",
                                companiesCompleted: [],
                                companiesRejected: [],
                                companiesWorking: [],
                                companiesAccepted: [],
                                companiesCompletedName: [],
                                companiesRejectedName: [],
                                companiesWorkingName: [],
                                companiesAcceptedName: [],
                                spreadsheet: "",
                                deployedlink: "",
                                revenueapi: "",
                                preference: "",
                                reminders: 0,
                                status: "",
                            });

                            toast.success('Franchise updated successfully', {
                                position: "top-right",
                                autoClose: 2000,
                                hideProgressBar: false,
                                closeOnClick: true,
                                pauseOnHover: true,
                                draggable: true,
                                progress: undefined,
                                theme: "light",
                            });
                            setSelectedRole("")
                            setSelectedFR("");
                            setPending(false);
                            router.refresh("/edit")
                        }
                        else {
                            const errorData = res.data;
                            console.log("res in else:", res);
                            console.log("res.data:", res.data);
                            setError(errorData.message);
                            setPending(false);
                        }
                    }
                    catch (err) {
                        console.log("err in catch:", err);
                        setError(err.message);
                        setPending(false);
                    }
                }
            }
        }
    }

    const handleDeleteUser = async (e) => {
        e.preventDefault();

        try {
            setPending(true);
            const username = info.username;
            // console.log("username to delete:", username);

            const url = `/api/register/${username}`
            const res = await axios({
                method: "DELETE",
                url,
            })
            // console.log("res:", res);

            if (res.status === 201 || res.status === 200) {

                const data = res.data;
                // console.log("data:", data);

                setUsers(data.allusers);
                // console.log("users.len in adform:", users?.length);


                //set userdetails to default values
                setInfo({
                    username: "",
                    password: "",
                    email: "",
                    role: "",
                    level: "",
                    teamleadername: "",
                    companiesCompleted: [],
                    companiesRejected: [],
                    companiesWorking: [],
                    companiesAccepted: [],
                    companiesCompletedName: [],
                    companiesRejectedName: [],
                    companiesWorkingName: [],
                    companiesAcceptedName: [],
                    spreadsheet: "",
                    deployedlink: "",
                    revenueapi: "",
                    preference: "",
                    reminders: 0,
                    status: "",
                });

                toast.success('Franchise deleted successfully', {
                    position: "top-right",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });

                setSelectedFR("");
                setSelectedRole("");
                setPending(false);
                router.refresh("/edit")
            }
            else {
                const errorData = res.data;
                console.log("res in else:", res);
                setError(errorData.message);
                setPending(false);
            }
        }
        catch (err) {
            // console.log("Error while deleting FR in page.jsx:", err);
            setError("Error deleting FR");
            setPending(false);
        }
    }

    const handleToastClose = () => {
        setSelectedRole("");
    }


    const handleAddPreference = () => {
        const newPreference = dropdownRef.current.value;
        if (newPreference && !preferences.includes(newPreference)) {
            setPreferences([...preferences, newPreference]);
            setInfo(prevInfo => ({
                ...prevInfo,
                preference: [...preferences, newPreference].join(','),
            }));

            // Clear the input value and set focus back to the input field
            dropdownRef.current.value = '';
            dropdownRef.current.focus();
        }
    };


    const handleRemovePreference = (preference) => {
        const updatedPreferences = preferences.filter((pref) => pref !== preference);
        setPreferences(updatedPreferences);
        setInfo({ ...info, preference: updatedPreferences.join(',') });
    };

    return (

        <div className="FRFORM h-auto w-full overflow-hidden flex justify-center items-center  lg:text-[12px] mt-8">
            <div className="w-[500px] m-auto p-12 border-gray-400 border-[1px] rounded-lg flex flex-col justify-center items-center bg-white gap-4 sm:w-full sm:py-4 sm:px-4 sm:m-0 sm:gap-0 ">

                <h1 className="text-4xl font-bold sm:text-3xl text-lightpurple">
                    {method === "put" ? "Edit Franchise" : "Add Franchise"}
                </h1>
                <p className="text-gray-600 text-lg sm:text-xs">
                    {method == "put" ? "Note: Username cannot be edited" : "Enter details below"}
                </p>

                <form className="w-full flex flex-col justify-center items-center gap-4 sm:my-4 sm:gap-2" onSubmit={handleSubmit}>

                    <div className="w-full flex items-center gap-4 border-2 border-gray-400 py-2 px-4 rounded-2xl shadow-lg lg:py-1 lg:gap-0 ">
                        {method == "put" ? <h1 className="lg:text-[10px] text-gray-700">Username:</h1> : <CgProfile className="size-8 lg:size-6" color='purple' />}
                        <input
                            type="text"
                            name="username"
                            placeholder="Username"
                            className="p-2 pl-4 rounded w-full sm:py-1 border-none outline-none text-black "
                            onChange={handleInput}
                            value={info.username}
                            disabled={method === "put"}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    e.preventDefault();
                                }
                            }}
                        />
                    </div>

                    <div className="w-full flex items-center gap-4 border-2 border-gray-400 py-2 px-4 rounded-2xl shadow-lg lg:py-1 lg:gap-0 ">
                        {method == "put" ? <h1 className="lg:text-[10px] text-gray-700">Email:</h1> : <MdOutlineMailOutline className="size-8 lg:size-6" color='purple' />}
                        <input
                            type="email"
                            name="email"
                            placeholder="example@gmail.com"
                            className="p-2 pl-4 rounded w-full sm:py-1 border-none outline-none text-black "
                            onChange={handleInput}
                            value={info.email}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    e.preventDefault();
                                }
                            }} />
                    </div>


                    {(method === "post" || method !== "put") &&
                        <div className="w-full flex items-center gap-4 border-2 border-gray-400 py-2 px-4 rounded-2xl shadow-lg lg:py-1 lg:gap-0 ">
                            <MdLockOutline className="size-8 lg:size-6" color='purple' />
                            <input
                                type="text"
                                name="password"
                                placeholder="Password"
                                className="p-2 pl-4 rounded w-full sm:py-1 border-none outline-none text-black "
                                onChange={handleInput}
                                value={info.password}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        e.preventDefault();
                                    }
                                }} />
                        </div>
                    }

                    {(method === "put" && changePassword) &&
                        <div className="w-full flex flex-col items-center gap-4 border-2 border-gray-400 py-2 px-4 rounded-2xl shadow-lg lg:py-1 lg:gap-0 ">
                            <div className="flex items-center">
                                <h1 className="lg:text-[10px] text-gray-700">Password:</h1>
                                <input
                                    type="text"
                                    name="password"
                                    placeholder="Password"
                                    className="p-2 pl-4 rounded w-full sm:py-1  text-black border-none outline-none"
                                    onChange={(e) => setNewPassword(e.target.value)} value={newpassword}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            e.preventDefault();
                                        }
                                    }}
                                />
                            </div>
                            <div className="flex gap-4">
                                <button onClick={() => setChangePassword(!changePassword)} className="bg-darkpurple rounded px-2 py-1 text-sm text-white">No</button>

                            </div>
                        </div>
                    }

                    {!changePassword && method === "put" &&
                        <div className="w-full flex justify-between items-center gap-4 border-2 border-gray-400 py-2 px-4 rounded-2xl shadow-lg lg:py-1 lg:gap-0">
                            <div className="rounded text-purple">Change Password?</div>
                            <button onClick={() => setChangePassword(!changePassword)} className="bg-darkpurple rounded-xl px-2 py-1 text-sm text-white">Yes</button>
                        </div>
                    }

                    <div className="w-full flex items-center gap-4 border-2 border-gray-400 py-2 px-4 rounded-2xl shadow-lg lg:py-1 lg:gap-0 ">
                        {method == "put" ? <h1 className="lg:text-[10px] text-gray-700">Teamleader:</h1> : <RiTeamLine className="size-8 lg:size-6" color='purple' />}
                        <select name="teamleadername" className="p-2 rounded w-full sm:py-1 border-none outline-none text-black" onChange={handleInput}>
                            <option value="">Select Teamleader</option>
                            {teamleaders.map((teamleader) => (
                                <option key={teamleader._id} value={teamleader.username}>{teamleader.username}</option>
                            ))}
                        </select>
                    </div>

                    <div className="w-full flex items-center gap-4 border-2 border-gray-400 py-2 px-4 rounded-2xl shadow-lg lg:py-1 lg:gap-0 ">
                        {method == "put" ? <h1 className="lg:text-[10px] text-gray-700">Spreadsheet:</h1> : <LuFileSpreadsheet className="size-8 lg:size-6" color='purple' />}
                        <input type="text" name="spreadsheet" placeholder="Spreadsheet Link" className="p-2 pl-4 rounded w-full sm:py-1 border-none outline-none text-black" onChange={handleInput} value={info.spreadsheet} />
                    </div>

                    <div className="w-full flex items-center gap-4 border-2 border-gray-400 py-2 px-4 rounded-2xl shadow-lg lg:py-1 lg:gap-0 ">
                        <BsGraphUpArrow className="size-8 lg:size-6" color='purple' />
                        <select name="level" className="p-2 pl-4 rounded w-full sm:py-1 border-none outline-none text-black" onChange={handleInput}>
                            <option value="">Franchise Level</option>
                            <option value="junior">Junior</option>
                            <option value="junior-mid">Junior-Mid</option>
                            <option value="mid">Mid</option>
                            <option value="mid-senior">Mid-Senior</option>
                            <option value="top">Top</option>
                        </select>
                    </div>


                    {/* <div className="w-full flex items-center gap-4 border-2 border-gray-400 py-2 px-4 rounded-2xl shadow-lg lg:py-1 lg:gap-0">
                        {method == "put" ? <h1 className="lg:text-[10px] text-gray-700">Preference:</h1> : <GrUserExpert className="size-8 lg:size-6" color='purple' />}
                        <input type="text" name="preference" placeholder="Preference ex-any" className="p-2 pl-4 rounded w-full sm:py-1 border-none outline-none text-black " onChange={handleInput} value={info.preference} />
                    </div> */}

                    <div className="w-full flex-col items-center gap-4 border-2 border-gray-400 py-2 px-4 rounded-2xl shadow-lg lg:py-1 lg:gap-0">
                        {/* <div className="block text-sm font-medium text-gray-700  py-2 px-4 rounded-2xl  lg:py-1 lg:gap-0">Preferences</div> */}
                        <div className="flex items-center">
                            <input
                                ref={dropdownRef}
                                list="preferences"
                                className="block w-full text-black p-2 rounded-md border-black-300 focus:outline-none focus:border-indigo-500 lg:text-[12px]"
                                onChange={handleInput}
                                placeholder="preferences"
                            />
                            <datalist id="preferences">
                                {options.map((option, index) => (
                                    <option key={index} value={option} />
                                ))}
                            </datalist>
                            <button
                                type="button"
                                onClick={handleAddPreference}
                                className="bg-purple text-white px-6 py-2 rounded-md shadow-sm hover:bg-lightpurple focus:outline-none"
                            >
                                Add
                            </button>
                        </div>
                        <div className="">
                            {preferences.map((preference, index) => (
                                <div key={index} className="flex justify-between items-center border-[1px] border-lightpurple rounded px-2 my-1">
                                    <span className="rounded-md text-purple">{preference}</span>
                                    <button
                                        type="button"
                                        onClick={() => handleRemovePreference(preference)}
                                        className="text-red-500 hover:text-red-700 px-1 font-bold text-lg lg:text-md"
                                    >
                                        x
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="w-full flex items-center gap-4 border-2 border-gray-400 py-2 px-4 rounded-2xl shadow-lg lg:py-1 lg:gap-0 ">
                        {method == "put" ? <h1 className="lg:text-[10px] text-gray-700">Status:</h1> : <GrStatusGood className="size-8 lg:size-6" color='purple' />}
                        <select name="status" className="p-2 pl-4 rounded w-full sm:py-1 border-none outline-none text-black" onChange={handleInput}>
                            <option value="">Franchise Status</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </div>

                    {error && <span className="text-red-500 font-semibold">{error}</span>}

                    {method === "put" ?
                        <div className="flex justify-center items-center gap-4">


                            <AlertDialog>
                                <AlertDialogTrigger>
                                    <div onClick={checkErrors}
                                        className="w-auto rounded-xl py-4 px-8 text-2xl lg:text-xl text-white bg-purple hover:bg-lightpurple lg:py-2 lg:px-4 mt-2" disabled={pending ? true : false}>
                                        Update
                                    </div>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                        <AlertDialogDescription className="flex flex-col">
                                            {error && <span className="text-red-500 font-semibold">{error}</span>}

                                            This action cannot be undone. This will permanently update the user details.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel >Cancel</AlertDialogCancel>
                                        <AlertDialogAction type="submit" onClick={handleSubmit} disabled={(error !== "") || !info.username}>Continue</AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>



                            <AlertDialog>
                                <AlertDialogTrigger>
                                    <div
                                        className="w-auto rounded-xl py-4 px-8 text-2xl lg:text-xl text-white bg-purple hover:bg-lightpurple lg:py-2 lg:px-4 mt-2" disabled={pending ? true : false}>
                                        Delete
                                    </div>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                        <AlertDialogDescription className="flex flex-col">
                                            {error && <span className="text-red-500 font-semibold">{error}</span>}

                                            This action cannot be undone. This will permanently delete the user details.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel >Cancel</AlertDialogCancel>
                                        <AlertDialogAction onClick={handleDeleteUser} disabled={(error !== "") || !info.username}>Continue</AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>

                        </div>
                        :
                        //method === "post" 

                        <AlertDialog>
                            <AlertDialogTrigger>
                                <div
                                    onClick={checkErrors}
                                    className="w-auto rounded-xl py-4 px-8 text-2xl lg:text-xl text-white bg-purple hover:bg-lightpurple lg:py-2 lg:px-4 mt-2" disabled={pending ? true : false}>
                                    Add
                                </div>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                    <AlertDialogDescription className="flex flex-col">
                                        {error && <span className="text-red-500 font-semibold">{error}</span>}

                                        This action cannot be undone. This will permanently add a new user.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter onClick={() => setError("")}>
                                    <AlertDialogCancel >Cancel</AlertDialogCancel>
                                    <AlertDialogAction type="submit" onClick={handleSubmit} disabled={(error !== "") || !info.username}>Continue</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    }

                    <ToastContainer onClose={handleToastClose} />

                </form>
            </div >
        </div >

    );
}

export default FRForm;







// 'use client';

// import axios from 'axios';
// import { useEffect, useState, useRef } from 'react';
// import { CgProfile } from "react-icons/cg";
// import { MdLockOutline, MdOutlineMailOutline } from "react-icons/md";
// import { RiTeamLine } from "react-icons/ri";
// import { LuFileSpreadsheet } from "react-icons/lu";
// import { BsGraphUpArrow } from "react-icons/bs";
// import { GrUserExpert } from "react-icons/gr";
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import {
//     AlertDialog,
//     AlertDialogAction,
//     AlertDialogCancel,
//     AlertDialogContent,
//     AlertDialogDescription,
//     AlertDialogFooter,
//     AlertDialogHeader,
//     AlertDialogTitle,
//     AlertDialogTrigger,
// } from "@/components/ui/alert-dialog";

// const FRForm = ({ userdetails, method, setSelectedRole, teamleaders }) => {
//     const initialInfo = {
//         username: userdetails.username || "",
//         email: userdetails.email || "",
//         password: "",
//         role: userdetails.role || "fr",
//         teamleadername: userdetails.teamleadername || "",
//         spreadsheet: userdetails.spreadsheet || "",
//         level: userdetails.level || "",
//         preference: userdetails.preference || "",
//         companiesCompleted: userdetails.companiesCompleted || "",
//         companiesRejected: userdetails.companiesRejected || "",
//         companiesWorking: userdetails.companiesWorking || "",
//         companiesAccepted: userdetails.companiesAccepted || "",
//         deployedlink: userdetails.deployedlink || "",
//         revenueapi: userdetails.revenueapi || "",
//         reminders: userdetails.reminders || 0,
//     };

//     const [info, setInfo] = useState(initialInfo);
//     const [newPassword, setNewPassword] = useState("");
//     const [changePassword, setChangePassword] = useState(false);
//     const [error, setError] = useState("");
//     const [pending, setPending] = useState(false);
//     const [preferences, setPreferences] = useState(info.preference.split(',').filter(p => p !== ""));
//     const dropdownRef = useRef(null);
//     const options = [
//         "Analytics / KPO / Research",
//         "BPO / Call Centre",
//         "IT Services & Consulting",
//         "Electronic Components / Semiconductors",
//         "Electronics Manufacturing",
//         "Electronics Manufacturing--Electronic Manufacturing Services (EMS)",
//         "Emerging Technologies-",
//         "Emerging Technologies-----AI/ML",
//         "Emerging Technologies----AR/VR",
//         "Emerging Technologies-3D Printing",
//         "Emerging Technologies----Blockchain",
//         "Emerging Technologies----Cloud",
//         "Emerging Technologies----Cybersecurity",
//         "Emerging Technologies----Drones/Robotics",
//         "Emerging Technologies----IoT",
//         "Emerging Technologies----Nanotechnology",
//         "Hardware & Networking",
//         "Internet",
//         "internet----E-Commerce",
//         "Internet---OTT",
//         "Software Product",
//         "Banking",
//         "Financial Services",
//         "Financial Services--Asset Management",
//         "Financial Services---Broking",
//         "FinTech / Payments",
//         "Insurance",
//         "Investment Banking / Venture Capital / Private Equity",
//         "NBFC",
//         "NBFC----Micro Finance",
//         "Education / Training",
//         "E-Learning / EdTech",
//         "Auto Components",
//         "Auto Components---Tyre",
//         "Automobile",
//         "Automobile---Automobile Dealers",
//         "Automobile--Electric Vehicle (EV)",
//         "Building Material",
//         "Building Material---Cement",
//         "Building Material---Ceramic",
//         "Building Material----Glass",
//         "Chemicals",
//         "Chemicals---Paints",
//         "Defence & Aerospace",
//         "Electrical Equipment",
//         "Fertilizers / Pesticides / Agro chemicals",
//         "Industrial Automation",
//         "Industrial Equipment / Machinery",
//         "Industrial Equipment / Machinery----Construction Equipment",
//         "Industrial Equipment / Machinery----Machine Tools",
//         "Iron & Steel",
//         "Metals & Mining",
//         "Packaging & Containers",
//         "Petrochemical / Plastics / Rubber",
//         "Pulp & Paper",
//         "Aviation",
//         "Courier / Logistics",
//         "Courier / Logistics---Logistics Tech",
//         "Engineering & Construction",
//         "Oil & Gas",
//         "Ports & Shipping",
//         "Ports & Shipping---Shipbuilding",
//         "Power",
//         "Power---Hydro",
//         "Power---Nuclear",
//         "Power----Solar",
//         "Power----Wind",
//         "Railways",
//         "Real Estate",
//         "Real Estate---Co-working",
//         "Urban Transport",
//         "Water Treatment / Waste Management",
//         "Beauty & Personal Care",
//         "Beverage",
//         "Beverage---Brewery / Distillery",
//         "Consumer Electronics & Appliances",
//         "Fitness & Wellness",
//         "FMCG",
//         "Food Processing",
//         "Food Processing---Dairy",
//         "Food Processing---Meat / Poultry",
//         "Food Processing---Sugar",
//         "Furniture & Furnishing",
//         "Gems & Jewellery",
//         "Hotels & Restaurants",
//         "Leather",
//         "Retail",
//         "Textile & Apparel",
//         "Textile & Apparel------Fashion",
//         "Textile & Apparel----Handicraft",
//         "Textile & Apparel---Home Textile",
//         "Textile & Apparel----Technical Textile",
//         "Textile & Apparel----Yarn & Fabric",
//         "Travel & Tourism",
//         "Biotechnology",
//         "Clinical Research / Contract Research",
//         "Medical Devices & Equipment",
//         "Medical Services / Hospital",
//         "Medical Services / Hospital------Diagnostics",
//         "Pharmaceutical & Life Sciences",
//         "Advertising & Marketing",
//         "Advertising & Marketing----Digital Marketing",
//         "Advertising & Marketing----Public Relations",
//         "Animation & VFX",
//         "Events / Live Entertainment",
//         "Film / Music / Entertainment",
//         "Gaming",
//         "Printing & Publishing",
//         "Sports / Leisure & Recreation",
//         "Telecom / ISP",
//         "TV / Radio",
//         "Accounting / Auditing",
//         "Architecture / Interior Design",
//         "Content Development / Language",
//         "Design",
//         "Facility Management Services",
//         "Law Enforcement / Security Services",
//         "Legal",
//         "Management Consulting",
//         "Recruitment / Staffing",
//         "Agriculture / Forestry / Fishing",
//         "Agriculture / Forestry / Fishing---Agri-tech",
//         "Government / Public Administration",
//         "Import & Export",
//         "Miscellaneous",
//         "NGO / Social Services / Industry Associations"
//     ];

//     useEffect(() => {
//         if (changePassword) {
//             setInfo(prev => ({ ...prev, password: newPassword }));
//         }
//     }, [newPassword, changePassword]);

//     const handleInput = e => {
//         setInfo(prev => ({
//             ...prev,
//             [e.target.name]: e.target.value,
//         }));
//         setError("");
//     };

//     const checkErrors = () => {
//         const { username, email, password, teamleadername, spreadsheet, level, preference } = info;
//         const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

//         if (!emailRegex.test(email)) {
//             setError("Invalid email");
//             return;
//         }

//         if (method === "post") {
//             if (!username || !email || !password || !teamleadername || !spreadsheet || !level || !preference) {
//                 setError("Must provide all credentials");
//             }
//         } else {
//             if (changePassword && (!username || !email || !password || !teamleadername || !spreadsheet || !level || !preference)) {
//                 setError("Must provide all credentials");
//             } else if (!changePassword && (!username || !email || !teamleadername || !spreadsheet || !level || !preference)) {
//                 setError("Must provide all credentials");
//             }
//         }
//     };

//     const handleSubmit = async e => {
//         e.preventDefault();

//         checkErrors();

//         if (error) return;

//         setPending(true);

//         try {
//             const url = "/api/register";
//             const methodType = method === "put" ? "PUT" : "POST";
//             const res = await axios({
//                 method: methodType,
//                 url,
//                 data: info,
//                 headers: {
//                     "Content-Type": "application/json",
//                 },
//             });

//             if (res.status === 200) {
//                 setInfo(initialInfo);
//                 const successMessage = method === "put" ? "Franchise updated successfully" : "Franchise added successfully";
//                 toast.success(successMessage, {
//                     position: "top-right",
//                     autoClose: 2000,
//                     hideProgressBar: false,
//                     closeOnClick: true,
//                     pauseOnHover: true,
//                     draggable: true,
//                     progress: undefined,
//                     theme: "light",
//                 });
//             } else {
//                 setError(res.data.message);
//             }
//         } catch (err) {
//             setError(err.message);
//         } finally {
//             setPending(false);
//         }
//     };

//     const handleDeleteUser = async e => {
//         e.preventDefault();

//         setPending(true);

//         try {
//             const username = info.username;
//             const res = await axios.delete(/api/register / ${ username });

//             if (res.status === 201) {
//                 setInfo(initialInfo);
//                 toast.success('Franchise deleted successfully', {
//                     position: "top-right",
//                     autoClose: 2000,
//                     hideProgressBar: false,
//                     closeOnClick: true,
//                     pauseOnHover: true,
//                     draggable: true,
//                     progress: undefined,
//                     theme: "light",
//                 });
//                 setSelectedRole("");
//             } else {
//                 setError(res.data.message);
//             }
//         } catch (err) {
//             setError("Error deleting FR");
//         } finally {
//             setPending(false);
//         }
//     };

//     const handleToastClose = () => {
//         setSelectedRole("");
//     };

//     const handleAddPreference = () => {
//         const newPreference = dropdownRef.current.value;
//         if (newPreference && !preferences.includes(newPreference)) {
//             setPreferences([...preferences, newPreference]);
//             setInfo(prevInfo => ({
//                 ...prevInfo,
//                 preference: [...preferences, newPreference].join(','),
//             }));

//             // Clear the input value and set focus back to the input field
//             dropdownRef.current.value = '';
//             dropdownRef.current.focus();
//         }
//     };


//     const handleRemovePreference = (preference) => {
//         const updatedPreferences = preferences.filter((pref) => pref !== preference);
//         setPreferences(updatedPreferences);
//         setInfo({ ...info, preference: updatedPreferences.join(',') });
//     };
//     return (

//         <div className="FRFORM h-auto w-full overflow-hidden flex justify-center items-center  sm:mt-2">
//             <div className="w-[500px] m-auto p-12 border-gray-400 border-[1px] rounded-lg flex flex-col justify-center items-center bg-white gap-4 sm:w-full sm:py-4 sm:px-4 sm:m-0 sm:gap-0 ">

//                 <h1 className="text-4xl font-bold sm:text-3xl text-lightpurple">
//                     {method === "put" ? "Edit Franchise" : "Add Franchise"}
//                 </h1>
//                 <p className="text-gray-600 text-lg sm:text-xs">
//                     {method == "put" ? "Note: Username cannot be edited" : "Enter details below"}
//                 </p>

//                 <form className="w-full flex flex-col justify-center items-center gap-4 sm:my-4 sm:gap-2" onSubmit={handleSubmit}>

//                     <div className="w-full flex items-center gap-4 border-2 border-gray-400 py-2 px-4 rounded-2xl shadow-lg lg:py-1 lg:gap-0 ">
//                         {method == "put" ? <h1 className="lg:text-[10px] text-gray-700">Username:</h1> : <CgProfile className="size-8 lg:size-6" color='purple' />}
//                         <input
//                             type="text"
//                             name="username"
//                             placeholder="Username"
//                             className="p-2 pl-4 rounded w-full sm:py-1 border-none outline-none text-black "
//                             onChange={handleInput}
//                             value={info.username}
//                             disabled={method === "put"}
//                             onKeyDown={(e) => {
//                                 if (e.key === "Enter") {
//                                     e.preventDefault();
//                                 }
//                             }}
//                         />
//                     </div>

//                     <div className="w-full flex items-center gap-4 border-2 border-gray-400 py-2 px-4 rounded-2xl shadow-lg lg:py-1 lg:gap-0 ">
//                         {method == "put" ? <h1 className="lg:text-[10px] text-gray-700">Email:</h1> : <MdOutlineMailOutline className="size-8 lg:size-6" color='purple' />}
//                         <input
//                             type="email"
//                             name="email"
//                             placeholder="example@gmail.com"
//                             className="p-2 pl-4 rounded w-full sm:py-1 border-none outline-none text-black "
//                             onChange={handleInput}
//                             value={info.email}
//                             onKeyDown={(e) => {
//                                 if (e.key === "Enter") {
//                                     e.preventDefault();
//                                 }
//                             }} />
//                     </div>


//                     {(method === "post" || method !== "put") &&
//                         <div className="w-full flex items-center gap-4 border-2 border-gray-400 py-2 px-4 rounded-2xl shadow-lg lg:py-1 lg:gap-0 ">
//                             <MdLockOutline className="size-8 lg:size-6" color='purple' />
//                             <input
//                                 type="text"
//                                 name="password"
//                                 placeholder="Password"
//                                 className="p-2 pl-4 rounded w-full sm:py-1 border-none outline-none text-black "
//                                 onChange={handleInput}
//                                 value={info.password}
//                                 onKeyDown={(e) => {
//                                     if (e.key === "Enter") {
//                                         e.preventDefault();
//                                     }
//                                 }} />
//                         </div>
//                     }

//                     {(method === "put" && changePassword) &&
//                         <div className="w-full flex flex-col items-center gap-4 border-2 border-gray-400 py-2 px-4 rounded-2xl shadow-lg lg:py-1 lg:gap-0 ">
//                             <div className="flex items-center">
//                                 <h1 className="lg:text-[10px] text-gray-700">Password:</h1>
//                                 <input
//                                     type="text"
//                                     name="password"
//                                     placeholder="Password"
//                                     className="p-2 pl-4 rounded w-full sm:py-1  text-black border-none outline-none"
//                                     onChange={(e) => setNewPassword(e.target.value)} value={newpassword}
//                                     onKeyDown={(e) => {
//                                         if (e.key === "Enter") {
//                                             e.preventDefault();
//                                         }
//                                     }}
//                                 />
//                             </div>
//                             <div className="flex gap-4">
//                                 <button onClick={() => setChangePassword(!changePassword)} className="bg-darkpurple rounded px-2 py-1 text-sm text-white">No</button>

//                             </div>
//                         </div>
//                     }

//                     {!changePassword && method === "put" &&
//                         <div className="w-full flex justify-between items-center gap-4 border-2 border-gray-400 py-2 px-4 rounded-2xl shadow-lg lg:py-1 lg:gap-0">
//                             <div className="rounded text-purple">Change Password?</div>
//                             <button onClick={() => setChangePassword(!changePassword)} className="bg-darkpurple rounded-xl px-2 py-1 text-sm text-white">Yes</button>
//                         </div>
//                     }

//                     <div className="w-full flex items-center gap-4 border-2 border-gray-400 py-2 px-4 rounded-2xl shadow-lg lg:py-1 lg:gap-0 ">
//                         {method == "put" ? <h1 className="lg:text-[10px] text-gray-700">Teamleadername:</h1> : <RiTeamLine className="size-8 lg:size-6" color='purple' />}
//                         <select name="teamleadername" className="p-2 pl-4 rounded w-full sm:py-1 border-none outline-none text-black" onChange={handleInput}>
//                             <option value="">Select Teamleader</option>
//                             {teamleaders.map((teamleader) => (
//                                 <option key={teamleader._id} value={teamleader.username}>{teamleader.username}</option>
//                             ))}
//                         </select>
//                     </div>

//                     <div className="w-full flex items-center gap-4 border-2 border-gray-400 py-2 px-4 rounded-2xl shadow-lg lg:py-1 lg:gap-0 ">
//                         {method == "put" ? <h1 className="lg:text-[10px] text-gray-700">Spreadsheet:</h1> : <LuFileSpreadsheet className="size-8 lg:size-6" color='purple' />}
//                         <input type="text" name="spreadsheet" placeholder="Spreadsheet Link" className="p-2 pl-4 rounded w-full sm:py-1 border-none outline-none text-black" onChange={handleInput} value={info.spreadsheet} />
//                     </div>

//                     <div className="w-full flex items-center gap-4 border-2 border-gray-400 py-2 px-4 rounded-2xl shadow-lg lg:py-1 lg:gap-0 ">
//                         <BsGraphUpArrow className="size-8 lg:size-6" color='purple' />
//                         <select name="level" className="p-2 pl-4 rounded w-full sm:py-1 border-none outline-none text-black" onChange={handleInput}>
//                             <option value="">Select Franchise Level</option>
//                             <option value="junior">Junior</option>
//                             <option value="mid">Mid</option>
//                             <option value="senior">Senior</option>
//                         </select>
//                     </div>
//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 border-2 border-gray-400 py-2 px-4 rounded-2xl shadow-lg lg:py-1 lg:gap-0 ">Preferences</label>
//                         <div className="flex items-center mt-1 space-x-4">
//                             <input
//                                 ref={dropdownRef}
//                                 list="preferences"
//                                 className="block w-full text-black p-2 rounded-md border-black-300 shadow-sm focus:outline-none focus:border-indigo-500 sm:text-sm"
//                                 onChange={handleInput} // Ensuring value is set when input loses focus
//                             />
//                             <datalist id="preferences">
//                                 {options.map((option, index) => (
//                                     <option key={index} value={option} />
//                                 ))}
//                             </datalist>
//                             <button
//                                 type="button"
//                                 onClick={handleAddPreference}
//                                 className="bg-blue-500 text-white px-6 py-2 rounded-md shadow-sm hover:bg-blue-600 focus:outline-none"
//                             >
//                                 Add
//                             </button>
//                         </div>
//                         <div className="mt-4">
//                             {preferences.map((preference, index) => (
//                                 <div key={index} className="flex items-center space-x-2 mb-2">
//                                     <span className="bg-red-200  px-3 py-1 rounded-md">{preference}</span>
//                                     <button
//                                         type="button"
//                                         onClick={() => handleRemovePreference(preference)}
//                                         className="text-red-500 hover:text-red-700 "
//                                     >
//                                         Remove
//                                     </button>
//                                 </div>
//                             ))}
//                         </div>
//                     </div>

//                     {error && <span className="text-red-500 font-semibold">{error}</span>}

//                     {method === "put" ?
//                         <div className="flex justify-center items-center gap-4">


//                             <AlertDialog>
//                                 <AlertDialogTrigger>
//                                     <div onClick={checkErrors}
//                                         className="w-auto rounded-xl py-4 px-8 text-2xl lg:text-xl text-white bg-purple hover:bg-lightpurple lg:py-2 lg:px-4 mt-2" disabled={pending ? true : false}>
//                                         Update
//                                     </div>
//                                 </AlertDialogTrigger>
//                                 <AlertDialogContent>
//                                     <AlertDialogHeader>
//                                         <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
//                                         <AlertDialogDescription className="flex flex-col">
//                                             {error && <span className="text-red-500 font-semibold">{error}</span>}

//                                             This action cannot be undone. This will permanently update the user details.
//                                         </AlertDialogDescription>
//                                     </AlertDialogHeader>
//                                     <AlertDialogFooter>
//                                         <AlertDialogCancel >Cancel</AlertDialogCancel>
//                                         <AlertDialogAction type="submit" onClick={handleSubmit} disabled={(error !== "") || !info.username}>Continue</AlertDialogAction>
//                                     </AlertDialogFooter>
//                                 </AlertDialogContent>
//                             </AlertDialog>



//                             <AlertDialog>
//                                 <AlertDialogTrigger>
//                                     <div
//                                         className="w-auto rounded-xl py-4 px-8 text-2xl lg:text-xl text-white bg-purple hover:bg-lightpurple lg:py-2 lg:px-4 mt-2" disabled={pending ? true : false}>
//                                         Delete
//                                     </div>
//                                 </AlertDialogTrigger>
//                                 <AlertDialogContent>
//                                     <AlertDialogHeader>
//                                         <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
//                                         <AlertDialogDescription className="flex flex-col">
//                                             {error && <span className="text-red-500 font-semibold">{error}</span>}

//                                             This action cannot be undone. This will permanently delete the user details.
//                                         </AlertDialogDescription>
//                                     </AlertDialogHeader>
//                                     <AlertDialogFooter>
//                                         <AlertDialogCancel >Cancel</AlertDialogCancel>
//                                         <AlertDialogAction onClick={handleDeleteUser} disabled={(error !== "") || !info.username}>Continue</AlertDialogAction>
//                                     </AlertDialogFooter>
//                                 </AlertDialogContent>
//                             </AlertDialog>

//                         </div>
//                         :
//                         //method === "post"

//                         <AlertDialog>
//                             <AlertDialogTrigger>
//                                 <div
//                                     onClick={checkErrors}
//                                     className="w-auto rounded-xl py-4 px-8 text-2xl lg:text-xl text-white bg-purple hover:bg-lightpurple lg:py-2 lg:px-4 mt-2" disabled={pending ? true : false}>
//                                     Add
//                                 </div>
//                             </AlertDialogTrigger>
//                             <AlertDialogContent>
//                                 <AlertDialogHeader>
//                                     <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
//                                     <AlertDialogDescription className="flex flex-col">
//                                         {error && <span className="text-red-500 font-semibold">{error}</span>}

//                                         This action cannot be undone. This will permanently add a new user.
//                                     </AlertDialogDescription>
//                                 </AlertDialogHeader>
//                                 <AlertDialogFooter onClick={() => setError("")}>
//                                     <AlertDialogCancel >Cancel</AlertDialogCancel>
//                                     <AlertDialogAction type="submit" onClick={handleSubmit} disabled={(error !== "") || !info.username}>Continue</AlertDialogAction>
//                                 </AlertDialogFooter>
//                             </AlertDialogContent>
//                         </AlertDialog>
//                     }

//                     <ToastContainer onClose={handleToastClose} />

//                 </form>
//             </div >
//         </div >

//     );
// }

// export default FRForm;