"use client";

import React, { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Line, Bar, Doughnut } from "react-chartjs-2"
import { Chart as ChartJs, ArcElement, Title, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, registerables } from 'chart.js';
ChartJs.register(ArcElement, Title, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, ...registerables);
import Link from 'next/link';
import { FaExternalLinkAlt } from "react-icons/fa";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSession } from 'next-auth/react';

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import axios from 'axios';

const DashboardADPage = () => {
    const router = useRouter();
    const { data: session, status } = useSession();
    // console.log("session:", session);

    const [users, setUsers] = useState([]);
    const [tls, setTls] = useState([]);
    const [frs, setFrs] = useState([]);
    const [selectedTL, setSelectedTL] = useState('');
    const [selectedFR, setSelectedFR] = useState('');
    const [franchise, setFranchise] = useState({});
    const [revenuegained, setRevenuegained] = useState(0);
    const [revenuelost, setRevenuelost] = useState(0);
    const [revenue, setRevenue] = useState({ lost: 0, gained: 0 })
    const [userData, setUserData] = useState({});
    const [cityData, setCityData] = useState({});
    const [stateData, setStateData] = useState({});
    const [industryData, setIndustryData] = useState({});
    const [positionStatusData, setPositionStatusData] = useState({});
    const [loading, setLoading] = useState(true);

    // State variables for the second API
    const [chartData, setChartData] = useState({
        city: {
            datasets: [{
                data: [],
                backgroundColor: []
            }],
            labels: []
        },
        state: {
            datasets: [{
                data: [],
                backgroundColor: []
            }],
            labels: []
        },
        industry: {
            datasets: [{
                data: [],
                backgroundColor: []
            }],
            labels: []
        },
        positionStatus: {
            datasets: [{
                data: [],
                backgroundColor: []
            }],
            labels: []
        },
        status: {
            datasets: [{
                data: [],
                backgroundColor: []
            }],
            labels: []
        }
    });

    useEffect(() => {
        if (status !== "loading" && !session) {
            router.push("/login")
        }
        else {
            if (status !== "loading" && session?.user?.role !== "ad") {
                router.back();
            }
            setLoading(false);
            getUsers();
        }
    }, [session, status, router]);

    // gettings allusers
    const getUsers = async () => {
        try {
            setLoading(true);
            const res = await fetch(`/api/user`, { cache: "no-cache" });
            if (res.ok) {
                const allusers = await res.json();
                // console.log("all users:", allusers);
                setUsers(allusers);
                const teamleaders = allusers?.filter((user) => user?.role === "tl");
                setTls(teamleaders)
                setLoading(false);
            }
        }
        catch (err) {
            // console.log("error in getting all users in /dashboardtl", err)
            setLoading(false);
        }
        finally {
            setLoading(false);
        }
    }

    // Function to generate random color
    const getRandomColor = () => {
        return '#' + Math.floor(Math.random() * 16777215).toString(16);
    };

    useEffect(() => {
        const getAllFranchiseUnderMe = async () => {
            try {
                const filteredFrs = users?.filter(user => user?.role === "fr" && user?.teamleadername === selectedTL);
                setFrs(filteredFrs);
                // console.log("frs:", frs);
            } catch (error) {
                // console.error("Error fetching users:", error);
            }
            finally {

            }
        };
        getAllFranchiseUnderMe();
    }, [selectedTL])


    const getAllFranchiseUnderMe = async () => {
        try {
            const filteredFrs = users?.filter(user => user?.role === "fr" && user?.teamleadername === selectedTL);
            setFrs(filteredFrs);
            // console.log("frs:", frs);
        } catch (error) {
            // console.error("Error fetching users:", error);
        }
        finally {

        }
    };

    const SelectTL = async (e) => {
        setSelectedTL(e.target.value);
        // await getAllFranchiseUnderMe();
    };

    useEffect(() => {
        if (selectedFR !== "") {
            const fetchSheetData = async (e) => {
                try {
                    // console.log("sheetdata")
                    const url = session?.user?.deployedlink;
                    // console.log("session.user.deployedlink:", session?.user?.deployedlink);

                    const response = await fetch(url);

                    // const response = await fetch("/api/fetchAppscript", {
                    //     method: "POST",
                    //     headers: {
                    //         "Content-Type": "application/json",
                    //     },
                    //     body: JSON.stringify({ url })
                    // })
                    // console.log("response:", response)
                    // console.log("selecetedFR:", selectedFR);
                    const data = await response.json();
                    // console.log("data from sheetdAta:", data);
                    setUserData(data);

                    const selectedFRNormalized = selectedFR.replace(/\s+/g, '').toLowerCase();
                    // console.log("normalized selectedfr:", selectedFRNormalized);

                    const dataKeysNormalized = Object.keys(data).reduce((acc, key) => {
                        acc[key.replace(/\s+/g, '').toLowerCase()] = data[key];
                        return acc;
                    }, {});
                    // console.log("dataKeyNormalized:", dataKeysNormalized);

                    if (dataKeysNormalized.hasOwnProperty(selectedFRNormalized)) {
                        const clientData = dataKeysNormalized[selectedFRNormalized];
                        // console.log("clientData:", clientData);
                        // console.log("clientData.cityState:", clientData.cityState);

                        if (clientData && clientData.cityState) {

                            // Set city data
                            const cityCounts = {};
                            clientData.cityState.forEach(cityState => {
                                if (!cityCounts[cityState.city]) {
                                    cityCounts[cityState.city] = 0;
                                }
                                cityCounts[cityState.city]++;
                            });
                            setCityData(cityCounts);


                            // Set state data
                            const stateCounts = {};
                            clientData.cityState.forEach(cityState => {
                                if (!stateCounts[cityState.state]) {
                                    stateCounts[cityState.state] = 0;
                                }
                                stateCounts[cityState.state]++;
                            });
                            setStateData(stateCounts);

                            // Set industry data
                            const industryCounts = {};
                            clientData.industries.forEach(industry => {
                                if (!industryCounts[industry]) {
                                    industryCounts[industry] = 0;
                                }
                                industryCounts[industry]++;
                            });
                            setIndustryData(industryCounts);


                            // Process positionStatusCounts data
                            if (clientData && clientData.positionStatusCounts) {
                                const positionStatusCounts = clientData.positionStatusCounts.reduce((acc, item) => {
                                    const key = Object.keys(item)[0];
                                    acc[key] = item[key];
                                    return acc;
                                }, {});
                                setPositionStatusData(positionStatusCounts);

                                // Set unique colors for positionStatusCounts data
                                // Define a color mapping for each status label
                                const statusColorMap = {
                                    "Closed": "green",
                                    "Cancel": "red",
                                    "Hold": "blue",
                                    "In Progress": "yellow",
                                    "Internally Closed": "purple",
                                };

                                // Set unique colors for positionStatusCounts data
                                const positionStatusColors = Object.keys(positionStatusCounts).map(() => statusColorMap[status] || getRandomColor());
                                setChartData(prevState => ({
                                    ...prevState,
                                    positionStatus: {
                                        datasets: [{
                                            data: Object.values(positionStatusCounts),
                                            backgroundColor: positionStatusColors
                                        }],
                                        labels: Object.keys(positionStatusCounts)
                                    }
                                }));
                            }

                            // Set unique colors for city data
                            const cityColors = Object.keys(cityCounts).map(() => getRandomColor());
                            setChartData(prevState => ({
                                ...prevState,
                                city: {
                                    datasets: [{
                                        data: Object.values(cityCounts),
                                        backgroundColor: cityColors
                                    }],
                                    labels: Object.keys(cityCounts)
                                }
                            }));

                            // Set unique colors for state data
                            const stateColors = Object.keys(stateCounts).map(() => getRandomColor());
                            setChartData(prevState => ({
                                ...prevState,
                                state: {
                                    datasets: [{
                                        data: Object.values(stateCounts),
                                        backgroundColor: stateColors
                                    }],
                                    labels: Object.keys(stateCounts)
                                }
                            }));

                            // Set unique colors for industry data
                            const industryColors = Object.keys(industryCounts).map(() => getRandomColor());
                            setChartData(prevState => ({
                                ...prevState,
                                industry: {
                                    datasets: [{
                                        data: Object.values(industryCounts),
                                        backgroundColor: industryColors
                                    }],
                                    labels: Object.keys(industryCounts)
                                }
                            }));
                        }
                        else {
                            // console.log("first round");
                        }
                    } else {
                        // console.error("This user not found:", selectedFR);
                    }

                } catch (error) {
                    // console.error("Error fetching data:", error);
                }
                finally {

                }
            }
            fetchSheetData();
        }
    }, [selectedFR, session?.user?.deployedlink, status])


    //selectFR
    const handleSelectChange = (selectedValue) => {
        setSelectedFR(selectedValue);
    }


    const renderLineChart = () => {
        const data = {
            labels: Object.keys(cityData),
            datasets: [
                {
                    label: 'City Counts',
                    data: Object.values(cityData),
                    fill: true,
                    borderColor: 'blue',
                    borderWidth: 2,
                },
            ],
        };

        const options = {
            scales: {
                x: {
                    type: 'category',
                    labels: data.labels,
                },
                y: {
                    type: 'linear',
                    beginAtZero: true,
                },
            },

        };

        return <Line data={data} options={options} />;
    };


    const renderLineChartStates = () => {
        const data = {
            labels: Object.keys(stateData),
            datasets: [
                {
                    label: 'States Worked In',
                    data: Object.values(stateData),
                    fill: true,
                    borderColor: 'green',
                    backgroundColor: 'rgba(0, 128, 0, 0.2)',
                    borderWidth: 2,
                },
            ],
        };

        const options = {
            scales: {
                x: {
                    type: 'category',
                    labels: data.labels,
                },
                y: {
                    type: 'linear',
                    beginAtZero: true,
                    ticks: {
                        // Set the font size for y-axis ticks
                        fontSize: typeof window !== 'undefined' && window.innerWidth > 768 ? 14 : 10, // Adjust font size based on screen width
                    },
                },
            },

        };

        return <Line data={data} options={options} />;
    };

    const barColors = ["#ADD8E6"];

    const options = {
        plugins: {
            legend: {
                labels: {
                    // Set the font size for legend labels
                    fontSize: typeof window !== 'undefined' && window.innerWidth > 768 ? 14 : 10, // Adjust font size based on screen width
                },
            },
            title: {
                display: true,
                text: 'Chart Title',
                // Set the font size for the chart title
                fontSize: typeof window !== 'undefined' && window.innerWidth > 768 ? 18 : 14, // Adjust font size based on screen width
            },
        },
        // Other chart options...
    };


    const renderVerticalBarChart = () => {
        const data = {
            labels: Object.keys(industryData),
            datasets: [
                {
                    label: 'Industries Worked In',
                    data: Object.values(industryData),
                    backgroundColor: barColors, // Set the color for all bars to blue
                    borderWidth: 1,
                },
            ],
        };

        const options = {
            indexAxis: 'y', // Set the bar chart to be vertical
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        // Set the font size for y-axis ticks
                        fontSize: typeof window !== 'undefined' && window.innerWidth > 768 ? 14 : 3,
                    },
                },
                x: {
                    ticks: {
                        // Set the font size for x-axis ticks
                        fontSize: typeof window !== 'undefined' && window.innerWidth > 768 ? 14 : 3,
                    },
                },
            },
            plugins: {
                legend: {
                    labels: {
                        // Set the font size for legend labels
                        fontSize: typeof window !== 'undefined' && window.innerWidth > 768 ? 14 : 10,
                    },
                },
                title: {
                    display: true,
                    text: 'Industries Worked In',
                    // Set the font size for the chart title
                    fontSize: typeof window !== 'undefined' && window.innerWidth > 768 ? 18 : 14,
                },
            },
        };
        return <Bar data={data} options={options} />;
    };

    useEffect(() => {

        setLoading(true);
        const fetchUserDetails = async () => {
            if (session?.user) {
                try {

                    const franchisedata = users.filter((u) => u.username === selectedFR);
                    // console.log("franchiseData:", franchiseData);
                    // console.log("franchisedata:", franchisedata);

                    setFranchise(franchisedata[0]);

                    // setError("");
                    // setLoading(false);
                } catch (error) {
                    // setLoading(false);
                    // console.error("Error fetching revenue:", error);
                }
                finally {

                }
            }
        };

        fetchUserDetails();

        const fetchRevenue = async () => {
            // console.log("franchise revenue cal")
            if (session?.user) {
                try {
                    // setLoading(true);
                    // console.log('franchise teamleadername:', franchise?.teamleadername);
                    const teamleaderarr = users?.filter((user) => user?.role === "tl" && user?.username === franchise?.teamleadername)
                    // console.log("teamleaderarr:", teamleaderarr)

                    const url = teamleaderarr[0].revenueapi;
                    // console.log("url:", url);
                    const response = await fetch(url);

                    const data = await response.json();
                    // console.log('data: ', data);

                    const franchiseData = data?.filter((d) => d?.nameoffranchisee.replace(/\s/g, '').toLowerCase() === selectedFR.replace(/\s/g, '').toLowerCase());
                    // console.log("franchiseData:", franchiseData);

                    const statusEntry = franchiseData[0];
                    // console.log("statusEntry:", statusEntry);

                    //error handling for no url
                    let rg = 0;
                    let rl = 0;
                    rg = statusEntry.closed;
                    rl = statusEntry.cancel;
                    // console.log("rg:", rg);

                    // setRevenuegained(rg);
                    // setRevenuelost(rl);
                    setRevenue((prev) => ({
                        ...prev,
                        lost: rl,
                        gained: rg
                    }));
                } catch (error) {
                    // setRevenuegained(0);
                    // setRevenuelost(0)
                }
                finally {
                    // setRevenuegained(0);
                    // setRevenuelost(0)
                }
            }
        };

        fetchRevenue();

        setLoading(false);
    }, [selectedFR, status]);

    const handleAlert = async () => {
        setLoading(true);
        const franchisearr = users?.filter((franchise) => franchise?.username === selectedFR);
        // console.log("franchiseobj:", franchisearr);
        const franchiseobj = franchisearr[0];
        const email = franchiseobj.email;

        const emails = [];
        emails.push(email);

        const spreadsheet = franchiseobj.spreadsheet;
        // console.log("emails in handleAlert fn in frontend", emails);

        try {
            const res = await fetch("/api/sendEmail", {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ emails, spreadsheet })
            });
            // console.log("res in frontend:", res);
            if (res.ok) {
                // setError("");
                // console.log("mail sent successfully");
                // router.refresh("dashboardtl")
                router.refresh("./dashboardtl")
                router.refresh("./dashboardfr")
                router.refresh("./dashboardsh");



                //update reminder count
                try {

                    const res = fetch(`api/user/${franchiseobj._id}`, {
                        method: 'PUT',
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ message: "update reminder count" })
                    })
                    if (!res.ok) {
                        setLoading(false);
                        // console.log("error in updating reminder count");
                    }
                    toast.success('Mail sent successfully', {
                        position: "top-right",
                        autoClose: 2000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "light",
                    });
                    await getUsers();
                    // setError("");
                    setLoading(false);

                    // console.log("successfully sent email")
                }
                catch (err) {
                    // setError("");
                    setLoading(false);
                    // console.log("error in updating count")
                }
                finally {
                    setLoading(false);
                }
            }
            else {
                // console.log("error in sending email:", res.json);
                toast.error('Try again later', {
                    position: "top-right",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
                // setError("");
                setLoading(false);
            }
        }
        catch (err) {
            toast.error('Try again later', {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
            // setError("");
            setLoading(false);
            // console.log("error in sending email in frontend:", err);
        }
        finally {
            setLoading(false);
        }
    }


    //pagination
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 15;

    const totalRows = Math.max(
        franchise?.companiesAccepted?.length || 0,
        franchise?.companiesRejected?.length || 0,
        franchise?.companiesReallocated?.length || 0
    );

    const totalPages = Math.ceil(totalRows / rowsPerPage);

    const handleChangePage = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    const startIdx = (currentPage - 1) * rowsPerPage;
    const endIdx = startIdx + rowsPerPage;


    const handleAlertAll = async () => {
        setLoading(true);
        // const res = await fetch("/api/user", { cache: "no-store" });
        // const users = await res.json();
        // console.log("clicked")




        // const activeFrs = users?.filter((u) => u?.status === "active");
        // console.log("activeFrs:", activeFrs);

        // const allfranchisee = activeFrs?.filter((user) => user?.role === "fr");
        // console.log("allfranchisee:", allfranchisee);


        // const emails = allfranchisee?.map(user => user?.email);
        // console.log(emails);


        const activeFrs = users?.filter((u) => u?.status === "active");
        // console.log("activeFrs:", activeFrs);

        const allfranchisee = activeFrs?.filter((user) => user?.role === "fr");
        // console.log("allfranchisee:", allfranchisee);


        const emails = allfranchisee?.map(user => user?.email);
        // console.log(emails);

        if (!emails || emails.length === 0) {
            setLoading(false);
            toast.error('No users found to send emails', {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
            return;
        }

        try {
            const res = await fetch("/api/sendEmailAll", {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ emails })
            });

            if (res.ok) {
                // setError("");
                router.refresh("./dashboardtl");
                router.refresh("./dashboardfr");
                router.refresh("./dashboardsh");

                toast.success('Emails sent successfully', {
                    position: "top-right",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });

                // Optionally, you can update reminders or any other logic here

            } else {
                toast.error('Try again later', {
                    position: "top-right",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
                // setError("");
            }
        } catch (err) {
            toast.error('Try again later', {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
            // setError("");
        }
        finally {
            setLoading(false);
        }

        setLoading(false);
    };



    return (
        <div className="flex flex-col justify-start items-center w-full min-h-screen gap-4 pt-8 pb-24 px-24 lg:px-2">

            <div className="flex w-full gap-4 justify-between  lg:flex-col-reverse  lg:justify-center lg:items-center lg:gap-2 items-end">

                <div className="flex w-full gap-4 lg:justify-between lg:gap-2 lg:px-0">

                    <div className="tldropdown w-1/4 lg:w-1/2">

                        <label className="block text-white font-medium text-sm  mb-2 lg:text-[12px]">Select Teamleader:</label >
                        <select
                            className="block appearance-none w-full bg-white border border-gray-300 rounded py-2 px-4 leading-tight focus:outline-none focus:border-blue-500 lg:text-[12px] cursor-pointer"
                            onChange={SelectTL}
                            value={selectedTL}
                        >
                            <option value="">Select Team Leader</option>
                            {tls.map(tl => (
                                <option key={tl._id} value={tl.username}>{tl.username}</option>
                            ))}
                        </select>
                    </div>

                    {selectedTL &&
                        <div className="frdropdown w-1/4 lg:w-1/2">

                            <label className="block text-white font-medium text-sm  mb-2 lg:text-[12px]">Select Franchise:</label >
                            <Select
                                onValueChange={handleSelectChange}
                            >
                                <SelectTrigger className="w-[280px] lg:w-full h-[36px] lg:h-[32px] rounded border-none outline-none px-2 lg:p-0" placeholder="Select Franchise">
                                    <SelectValue placeholder="Select Franchise" />
                                </SelectTrigger>
                                <SelectContent className="h-[150px]">
                                    {frs.map((f) => (
                                        <SelectItem key={f._id} value={f.username} className="py-1">{f.username}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    }

                </div>

                {session?.user?.username &&

                    <div className="flex justify-center items-center gap-4 lg:w-full">
                        <button className="py-0 px-8 rounded bg-red-500 hover:bg-red-300 gap-4 text-white whitespace-nowrap flex justify-center items-center h-[40px] cursor pointer lg:w-1/2" onClick={handleAlertAll}>
                            Alert all
                        </button>

                        <div className="py-0 px-8 rounded bg-blue-500 hover:bg-blue-300 gap-4 flex items-center h-[40px] lg:w-1/2 justify-center">
                            <Link href={session?.user?.spreadsheet || ""} target="_blank" className="text-white font-semi-bold text-center whitespace-nowrap">
                                My Spreadsheet
                            </Link>
                            <FaExternalLinkAlt size={12} color='white' />
                        </div>
                    </div>
                }

            </div>

            {selectedFR ?
                <div className="flex flex-col justify-center items-center w-full h-auto gap-4">

                    <div className="w-full flex justify-center items-center bg-white rounded p-4 lg:flex-col lg:p-2 gap-4 lg:text-[10px]">
                        <div className="userdetailstext flex flex-col justify-between  items-start w-3/5 lg:w-full bg-white rounded px-4 py-2 lg:p-0">
                            <div className="row flex justify-start items-start w-full gap-4">
                                <label className="w-2/5 py-2 font-bold lg:py-0 lg:font-medium">Username</label>
                                <div className="w-3/5 py-2 lg:py-0 lg:font-normal overflow-x-auto text-gray-500">{franchise?.username || "select a franchise"}</div>
                            </div>
                            <div className="row flex justify-start items-start w-full gap-4">
                                <label className="w-2/5 py-2 font-bold lg:py-0 lg:font-medium">Email</label>
                                <div className="w-3/5 py-2 lg:py-0 lg:font-normal overflow-x-auto text-gray-500">{franchise?.email || "select a franchise"}</div>
                            </div>
                            <div className="row flex justify-start items-start w-full gap-4">
                                <label className="w-2/5 py-2 font-bold lg:py-0 lg:font-medium">Team Leader</label>
                                <div className="w-3/5 py-2 lg:py-0 lg:font-normal overflow-x-auto text-gray-500">{franchise?.teamleadername || "loading..."}</div>
                            </div>
                            <div className="row flex justify-start items-start w-full gap-4">
                                <label className="w-2/5 py-2 font-bold lg:py-0 lg:font-medium">Spreadsheet</label>
                                <div className="w-3/5 py-2 lg:py-0 lg:font-normal overflow-x-auto text-gray-500">
                                    <a href={franchise?.spreadsheet} target="_blank" className="text-blue-500 hover:underline cursor-pointer w-3/5">Click here</a>
                                </div>
                            </div>
                            <div className="row flex justify-start items-start w-full gap-4">
                                <label className="w-2/5 py-2 font-bold lg:py-0 lg:font-medium">Companies Accepted</label>
                                <div className="w-3/5 py-2 lg:py-0 lg:font-normal overflow-x-auto text-gray-500">{franchise?.companiesAccepted?.length === 0 ? 0 : franchise?.companiesAccepted?.length}</div>
                            </div>
                            <div className="row flex justify-start items-start w-full gap-4">
                                <label className="w-2/5 py-2 font-bold lg:py-0 lg:font-medium">Companies Rejected</label>
                                <div className="w-3/5 py-2 lg:py-0 lg:font-normal overflow-x-auto text-gray-500">{franchise?.companiesRejected?.length === 0 ? 0 : franchise?.companiesRejected?.length}</div>
                            </div>
                            <div className="row flex justify-start items-start w-full gap-4">
                                <label className="w-2/5 py-2 font-bold lg:py-0 lg:font-medium">Companies Reallocated</label>
                                <div className="w-3/5 py-2 lg:py-0 lg:font-normal overflow-x-auto text-gray-500">{franchise?.companiesReallocated?.length === 0 ? 0 : franchise?.companiesReallocated?.length}</div>
                            </div>
                            <div className="row flex justify-start items-start w-full gap-4">
                                <label className="w-2/5 py-2 font-bold lg:py-0 lg:font-medium">Reminders</label>
                                <div className="w-3/5 py-2 lg:py-0 lg:font-normal overflow-x-auto text-gray-500">{franchise?.reminders || 0}</div>
                            </div>
                            <div className="row flex justify-start items-start w-full gap-4">
                                <label className="w-2/5 py-2 font-bold lg:py-0 lg:font-medium">Preference</label>
                                <div className="w-3/5 py-2 lg:py-0 lg:font-normal overflow-x-auto text-gray-500">{franchise?.preference || "any"}</div>
                            </div>
                            <div className="row flex justify-start items-start w-full gap-4">
                                <label className="w-2/5 py-2 font-bold lg:py-0 lg:font-medium">Status</label>
                                <div className="w-3/5 py-2 lg:py-0 lg:font-normal overflow-x-auto text-gray-500">{franchise?.status || "active"}</div>
                            </div>
                        </div>


                        <div className="w-2/5 p-4 flex flex-col justify-between gap-4 h-full lg:w-full lg:flex-row lg:p-0 lg:gap-2 lg:justify-center items-center">
                            <div className="franchiserevenue flex justify-center items-center flex-col gap-4 lg:flex-row lg:gap-2 w-full">
                                <div className="revenuegained flex flex-col justify-center items-center bg-green-500 rounded w-full py-4 lg:py-2 h-full  lg:px-4 lg:h-[50px]">
                                    <div className="title font-bold text-white text-center lg:font-medium lg:text-[10px] whitespace-nowrap">Revenue Gained</div>
                                    <div className="title font-bold text-white text-center lg:font-medium lg:text-xs">Rs.{revenue.gained}</div>
                                </div>
                                <div className="revenuelost flex flex-col justify-center items-center bg-red-500 rounded w-full py-4  lg:py-2 h-full lg:px-4 lg:h-[50px]">
                                    <div className="title font-bold text-white text-center lg:font-medium lg:text-[10px] whitespace-nowrap">Revenue Lost</div>
                                    <div className="title font-bold text-white text-center lg:font-medium lg:text-xs">Rs.{revenue.lost}</div>
                                </div>
                            </div>
                            <button
                                className="alert bg-red-500 py-2 px-8 font-bold text-white text-xl rounded h-1/2 lg:px-4 lg:font-medium lg:text-base active:bg-red-300 hover:bg-red-300 lg:h-[50px]"
                                onClick={handleAlert}>Alert
                            </button>
                        </div>
                    </div>

                    <div className="flex justify-between items-center w-full h-auto gap-4 lg:flex-col">
                        <div className="w-1/2 flex flex-col justify-center  text-center items-center  p-4 bg-white rounded lg:w-full h-[300px]"  >

                            <h2>Position Status Counts</h2>
                            {Object.keys(positionStatusData).length > 0 ?
                                <div className="piechart w-auto h-full">
                                    <Doughnut data={chartData.positionStatus} options={options} />
                                </div> : <p className="w-full h-[200px]">Loading...</p>}
                        </div>
                        <div className="w-1/2 h-[300px] lg:h-[200px] bg-white text-black p-4 text-center rounded lg:w-full flex flex-col justify-center items-center">
                            <h2>Industries Worked In</h2>
                            {Object.keys(industryData).length > 0 ?
                                renderVerticalBarChart()
                                :
                                <p className="w-full h-[200px]">Loading...</p>}
                        </div>

                    </div>

                    <div className="flex justify-between items-center w-full h-auto gap-4 lg:flex-col">
                        <div className="w-1/2 h-full bg-white text-black p-4 text-center rounded lg:w-full lg:p-0">
                            <h2>Cities Worked In</h2>
                            {Object.keys(cityData).length > 0 ? renderLineChart() : <p className="w-full h-[200px]">Loading...</p>}
                        </div>
                        <div className="w-1/2 h-full bg-white text-black p-4 text-center rounded lg:w-full lg:p-0">
                            <h2>States Worked In</h2>
                            {Object.keys(stateData).length > 0 ? renderLineChartStates() : <p className="w-full h-[200px]">Loading...</p>}
                        </div>
                    </div>

                    <div className="Table w-full h-full flex flex-col justify-center items-center whitespace-nowrap lg:overflow-x-auto bg-white border-gray-400 border-[1px] lg:text-[10px]">
                        <div className="w-full">
                            <div className="w-1/3 py-2 border-[1px] border-gray-300 text-center font-bold whitespace-nowrap inline-block lg:min-w-[200px] lg:py-1 ">
                                Companies Accepted/Working
                            </div>
                            <div className="w-1/3 py-2 border-[1px] border-gray-300 text-center font-bold whitespace-nowrap inline-block lg:min-w-[200px] lg:py-1 ">
                                Companies Rejected
                            </div>
                            <div className="w-1/3 py-2 border-[1px] border-gray-300 text-center font-bold whitespace-nowrap inline-block lg:min-w-[200px] lg:py-1 ">
                                Companies Reallocated
                            </div>
                        </div>

                        <div className="w-full gap-0">
                            {Array.from({ length: rowsPerPage }).map((_, index) => {
                                const rowIdx = startIdx + index;
                                return (
                                    <div key={rowIdx} className="w-full flex">
                                        <div className="w-1/3 py-2 border-[1px] border-gray-300 text-center whitespace-nowrap inline-block lg:min-w-[200px] lg:py-1">
                                            {franchise?.companiesAcceptedName?.slice().reverse()[rowIdx] || '-'}
                                        </div>
                                        <div className="w-1/3 py-2 border-[1px] border-gray-300 text-center whitespace-nowrap inline-block lg:min-w-[200px] lg:py-1">
                                            {franchise?.companiesRejectedName?.slice().reverse()[rowIdx] || '-'}
                                        </div>
                                        <div className="w-1/3 py-2 border-[1px] border-gray-300 text-center whitespace-nowrap inline-block lg:min-w-[200px] lg:py-1">
                                            {franchise?.companiesReallocatedName?.slice().reverse()[rowIdx] || '-'}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                    </div>
                    <div className="flex justify-center mt-4 gap-2" >
                        <button
                            className="px-3 py-1 border rounded-lg border-gray-400 bg-gray-200 hover:bg-gray-300"
                            onClick={() => handleChangePage(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                            Prev
                        </button>
                        <div className="px-3 py-1 rounded-lg border-t border-b border-gray-400 bg-gray-200">
                            Page {currentPage} of {totalPages}
                        </div>
                        <button
                            className="px-3 py-1 border rounded-lg border-gray-400 bg-gray-200 hover:bg-gray-300"
                            onClick={() => handleChangePage(currentPage + 1)}
                            disabled={currentPage === totalPages}
                        >
                            Next
                        </button>
                    </div>
                </div>
                :
                <p className="text-white text-2xl text-center">Please select a teamleader and franchise to view their dashboard</p>
            }
            <ToastContainer />

        </div>
    )
}

export default DashboardADPage

