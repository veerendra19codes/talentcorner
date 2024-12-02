"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect, useMemo } from "react";
import { Doughnut } from 'react-chartjs-2';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Chart as ChartJs, Tooltip, Title, ArcElement, Legend } from 'chart.js';
ChartJs.register(
    Tooltip, Title, ArcElement, Legend
);
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";

const TLDashboardPage = () => {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [franchiseUnderMe, setFranchiseUnderMe] = useState([]);
    const [franchiseSelected, setFranchiseSelected] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('franchiseSelected') || "";
        } else {
            return "";
        }
    });

    const memoizedFranchise = useMemo(() => franchiseSelected, [franchiseSelected]);

    useEffect(() => {
        // Save franchiseSelected to localStorage whenever it changes
        if (typeof window !== 'undefined') {
            localStorage.setItem('franchiseSelected', franchiseSelected);
        }
    }, [franchiseSelected]);

    const [franchise, setFranchise] = useState({});
    const [revenue, setRevenue] = useState({ lost: 0, gained: 0 })
    const [chartData, setChartData] = useState({
        datasets: [{
            data: [0, 0, 0, 0],
            backgroundColor: [
                'yellow',
                'blue',
                'red',
                'green',
            ]
        }],
        labels: ['In Progress', 'Hold', 'Cancel', 'Closed']
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const juniorFranchise = franchiseUnderMe?.filter(franchise => franchise.level === 'junior');
    const midFranchise = franchiseUnderMe?.filter(franchise => franchise.level === 'mid');
    const topFranchise = franchiseUnderMe?.filter(franchise => franchise.level === 'top');
    const mid_seniorFranchise = franchiseUnderMe?.filter(franchise => franchise.level === 'mid-senior');
    const junior_midFranchise = franchiseUnderMe?.filter(franchise => franchise.level === 'junior-mid');


    useEffect(() => {
        if (status !== "loading" && !session) {
            router.push("/login")
        }
        else {
            if (status !== "loading" && session?.user?.role !== "tl") {
                router.back();
            }
            setLoading(false);
        }
    }, [session, status, router]);

    useEffect(() => {
        setLoading(true);
        const fetchUserDetails = async () => {
            if (session?.user) {
                try {
                    // setLoading(true);
                    const response = await fetch(`${process.env.NEXTAUTH_URL}/api/user`);

                    const allusers = await response.json();
                    // console.log('all users inside fetchUserDetails: ', allusers);

                    const franchisedata = allusers.filter((u) => u.username === franchiseSelected);
                    // console.log("franchiseData:", franchiseData);
                    // console.log("franchisedata:", franchisedata);

                    setFranchise(franchisedata[0]);

                    setError("");
                } catch (error) {
                    // setError("No data of this franchise");
                    setError("");
                    // console.error("Error fetching revenue:", error);
                }
                finally {
                    setError("");
                }
            }
        };

        fetchUserDetails();

        const fetchChartData = async () => {
            if (session?.user) {
                try {
                    // setLoading(true);
                    const url = session?.user?.deployedlink
                    console.log("deplpoyedlink:", url);
                    const response = await fetch(url);

                    const data = await response.json();
                    console.log('data: ', data);

                    const statusCount = {
                        'In Progress': 0,
                        'Hold': 0,
                        'Cancel': 0,
                        'Closed': 0
                    };
                    // console.log("statusCount:", statusCount);

                    const franchiseData = data.filter((d) => d.nameoffranchisee.replace(/\s/g, '').toLowerCase() === franchiseSelected.replace(/\s/g, '').toLowerCase());
                    console.log("franchiseData:", franchiseData);

                    const statusEntry = franchiseData[0];
                    console.log("statusEntry:", statusEntry);

                    statusCount['In Progress'] = statusEntry.inprogress;
                    statusCount['Hold'] = statusEntry.hold;
                    statusCount['Cancel'] = statusEntry.cancel;
                    statusCount['Closed'] = statusEntry.closed;
                    console.log("statusCount:", statusCount);

                    const statusData = Object.values(statusCount);
                    console.log("statusData:", statusData);

                    setChartData({
                        datasets: [{
                            data: statusData,
                            backgroundColor: [
                                'yellow',
                                'blue',
                                'red',
                                'green',
                            ]
                        }],
                        labels: ['In Progress', 'Hold', 'Cancel', 'Closed']
                    });
                    // console.log("chartdata:", chartData);

                    // setLoading(false);
                    setError("");
                } catch (error) {
                    //error handling in case of no url, no values for graph
                    const statusCount = {
                        'In Progress': 0,
                        'Hold': 0,
                        'Cancel': 0,
                        'Closed': 0
                    };

                    const statusData = Object.values(statusCount);

                    setChartData({
                        datasets: [{
                            data: statusData,
                            backgroundColor: [
                                'yellow',
                                'blue',
                                'red',
                                'green',
                            ]
                        }],
                        labels: ['In Progress', 'Hold', 'Cancel', 'Closed']
                    });

                    // console.error("Error fetching data:", error);
                    // setError("No data of this franchise");
                    setError("");
                    // setLoading(false);
                }
                finally {
                    setError("");
                }
            }
        };

        fetchChartData();

        const fetchRevenue = async () => {
            if (session?.user) {
                try {
                    // setLoading(true);
                    const url = session?.user?.revenueapi;
                    // console.log("url:", url);
                    const response = await fetch(url);

                    const data = await response.json();
                    // console.log('data: ', data);

                    const franchiseData = data.filter((d) => d.nameoffranchisee.replace(/\s/g, '').toLowerCase() === franchiseSelected.replace(/\s/g, '').toLowerCase());
                    // console.log("franchiseData:", franchiseData);

                    const statusEntry = franchiseData[0];
                    // console.log("statusEntry:", statusEntry);
                    // console.log("statusEntry:", statusEntry.closed);
                    // console.log("statusEntry:", statusEntry.cancel);



                    //error handling for no url
                    let rg = 0;
                    let rl = 0;
                    rg = statusEntry.closed;
                    rl = statusEntry.cancel;
                    // console.log("rg:", rg);


                    setRevenue((prev) => ({
                        ...prev,
                        lost: rl,
                        gained: rg
                    }));
                    // console.log("changed")
                    setError("");
                    // setLoading(false);
                } catch (error) {
                    setRevenue((prev) => ({
                        ...prev,
                        lost: 0,
                        gained: 0
                    }));
                    // setError("No data of this franchise");
                    setError("");
                    // setLoading(false);
                    // console.error("Error fetching revenue:", error);
                }
                finally {

                    // setError("No data of this franchise");
                    setError("");
                }
            }
        };

        fetchRevenue();

        setLoading(false);
    }, [franchiseSelected]);

    useEffect(() => {
        console.log("chartData:", chartData);
    }, [chartData])


    //to get franchiseUnderMe
    const getUsers = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${process.env.NEXTAUTH_URL}/api/user`, { cache: "no-cache" });
            if (res.ok) {
                const allusers = await res.json();
                // console.log("all users:", allusers);
                const franchise = allusers?.filter((u) => u.role === "fr" && u.teamleadername === session?.user?.username)
                // console.log("franchiseUnderme:", franchise);
                setFranchiseUnderMe(franchise);
                setLoading(false);
                setError("");
            }
        }
        catch (err) {
            // console.log("error in getting all users in /dashboardtl", err)
            setLoading(false);
            setError(err);
        }
        finally {
            setLoading(false);
            setError("")
        }
    }

    useEffect(() => {
        getUsers();
    }, [status])

    const handleAlert = async () => {
        setLoading(true);
        const franchisearr = franchiseUnderMe?.filter((franchise) => franchise.username === franchiseSelected);
        // console.log("franchiseobj:", franchisearr);
        const franchiseobj = franchisearr[0];
        const email = franchiseobj.email;

        const emails = [];
        emails.push(email);
        // console.log("emails in handleAlert fn in frontend", emails);

        try {
            const res = await fetch("/api/sendEmail", {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ emails })
            });
            // console.log("res in frontend:", res);
            if (res.ok) {
                setError("");
                // console.log("mail sent successfully");
                // router.refresh("dashboardtl")


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
                    await getUsers();
                    setError("");
                    setLoading(false);

                    // console.log("successfully sent email")
                }
                catch (err) {
                    setError("");
                    setLoading(false);
                    // console.log("error in updating count")
                }
                finally {
                    setError("");
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
                setError("");
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
            setError("");
            setLoading(false);
            // console.log("error in sending email in frontend:", err);
        }
        finally {
            setError("");
            setLoading(false);
        }
    }

    const handleSelectChange = (selectedValue) => {
        // console.log("Selected value:", selectedValue);
        setFranchiseSelected(selectedValue);
    };

    return (
        <>
            {error && <div className="text-red-400 min-h-screen">{error}</div>}
            {loading && <div className="text-white min-h-screen">Loading...</div>}
            {!loading &&
                <div className="w-full min-h-screen flex-col justify-center items-start py-12 px-24 gap-4 lg:px-2 lg:flex-col">

                    <div className="flex flex-col w-full gap-4 lg:w-full">
                        <Select
                            onValueChange={handleSelectChange}
                        >
                            <SelectTrigger className="w-[280px]">
                                <SelectValue placeholder="Select Franchise" />
                            </SelectTrigger>
                            <SelectContent className="h-[150px]">
                                {franchiseUnderMe.map((f) => (
                                    <SelectItem key={f._id} value={f.username} className="py-1">{f.username}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <div className="flex lg:flex-col gap-2 justify-between w-full">
                            <div className="userdetailstext flex flex-col justify-between  items-start w-full bg-white rounded px-4 py-2 lg:text-[10px]">
                                <div className="row flex justiy-start items-center w-full gap-4">
                                    <label className="w-2/5 py-2 font-bold lg:py-1 ">Username</label>
                                    <div className="w-3/5 py-2 lg:py-1 lg:font-normal overflow-x-auto">{franchise?.username || "select a franchise"}</div>
                                </div>
                                <div className="row flex justiy-start items-center w-full gap-4">
                                    <label className="w-2/5 py-2 font-bold lg:py-1 ">Email</label>
                                    <div className="w-3/5 py-2 lg:py-1 lg:font-normal overflow-x-auto">{franchise?.email || "select a franchise"}</div>
                                </div>
                                <div className="row flex justiy-start items-center w-full gap-4">
                                    <label className="w-2/5 py-2 font-bold lg:py-1 ">Team Leader</label>
                                    <div className="w-3/5 py-2 lg:py-1 lg:font-normal overflow-x-auto">{session?.user?.username || "loading..."}</div>
                                </div>
                                <div className="row flex justiy-start items-center w-full gap-4">
                                    <label className="w-2/5 py-2 font-bold lg:py-1 ">Spreadsheet</label>
                                    <a href={franchise?.spreadsheet} target="_blank" className="text-blue-500 hover:underline cursor-pointer w-3/5">Click here</a>
                                </div>
                                <div className="row flex justiy-start items-center w-full gap-4">
                                    <label className="w-2/5 py-2 font-bold lg:py-1 ">Companies Accepted</label>
                                    <div className="w-3/5 py-2 lg:py-1 lg:font-normal overflow-x-auto">{franchise?.companiesAccepted?.length === 0 ? 0 : franchise?.companiesAccepted?.length}</div>
                                </div>
                                <div className="row flex justiy-start items-center w-full gap-4">
                                    <label className="w-2/5 py-2 font-bold lg:py-1 ">Companies Rejected</label>
                                    <div className="w-3/5 py-2 lg:py-1 lg:font-normal overflow-x-auto">{franchise?.companiesRejected?.length === 0 ? 0 : franchise?.companiesRejected?.length}</div>
                                </div>
                                <div className="row flex justiy-start items-center w-full gap-4">
                                    <label className="w-2/5 py-2 font-bold lg:py-1 ">Companies Reallocated</label>
                                    <div className="w-3/5 py-2 lg:py-1 lg:font-normal overflow-x-auto">{franchise?.companiesReallocated?.length === 0 ? 0 : franchise?.companiesReallocated?.length}</div>
                                </div>
                                <div className="row flex justiy-start items-center w-full gap-4">
                                    <label className="w-2/5 py-2 font-bold lg:py-1 ">Reminders</label>
                                    <div className="w-3/5 py-2 lg:py-1 lg:font-normal overflow-x-auto">{franchise?.reminders || 0}</div>
                                </div>
                                <div className="row flex justiy-start items-center w-full gap-4">
                                    <label className="w-2/5 py-2 font-bold lg:py-1 ">Preference</label>
                                    <div className="w-3/5 py-2 lg:py-1 lg:font-normal overflow-x-auto">{franchise?.preference || "any"}</div>
                                </div>
                                <div className="row flex justiy-start items-center w-full gap-4">
                                    <label className="w-2/5 py-2 font-bold lg:py-1 ">Status</label>
                                    <div className="w-3/5 py-2 lg:py-1 lg:font-normal overflow-x-auto">{franchise?.status || "loading"}</div>
                                </div>

                            </div>


                            <div className="flex justify-center items-center bg-white rounded p-4 lg:flex-col lg:p-2">
                                <div className="w-1/2 p-4 flex flex-col justify-center lg:justify-between gap-4 h-full lg:w-full lg:flex-row lg:p-0 lg:gap-2">
                                    <div className="franchiserevenue flex justify-center items-center flex-col gap-4 lg:flex-row lg:gap-2">
                                        <div className="revenuegained flex flex-col justify-between items-center bg-green-500 rounded w-full py-4 px-8 lg:px-4 lg:py-2 lg:h-[50px]">
                                            <div className="title font-bold text-white text-center lg:font-medium lg:text-[10px] whitespace-nowrap">Revenue Gained</div>
                                            <div className="title font-bold text-white text-center lg:font-medium lg:text-xs">Rs.{revenue.gained}</div>
                                        </div>
                                        <div className="revenuelost flex flex-col justify-between items-center bg-red-500 rounded w-full py-4 px-8 lg:px-4 lg:py-2 lg:h-[50px]">
                                            <div className="title font-bold text-white text-center lg:font-medium lg:text-[10px] whitespace-nowrap">Revenue Lost</div>
                                            <div className="title font-bold text-white text-center lg:font-medium lg:text-xs">Rs.{revenue.lost}</div>
                                        </div>
                                    </div>
                                    <button
                                        className="alert bg-red-500 py-2 px-8 font-bold text-white text-xl rounded lg:h-[50px] lg:py-1 lg:px-4 lg:font-medium lg:text-base active:bg-red-300 hover:bg-red-300"
                                        onClick={handleAlert}>Alert
                                    </button>

                                </div>
                                <ToastContainer />

                                <div className="size-[300px] ">
                                    <Doughnut data={chartData} />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="w-full flex flex-col gap-4 justify-center items-center p-4 bg-white rounded lg:w-full lg:overflow-x-hidden mt-2 lg:p-2 lg:gap-2">
                        <div className="text-darkpurple font-bold">
                            Franchise under me
                        </div>

                        <div className="Table w-full h-full flex flex-col justify-center items-center whitespace-nowrap lg:overflow-x-auto bg-white border-gray-400 border-[1px] lg:text-[12px] ">
                            <div className="w-full flex">
                                <div className="w-1/5 py-2 border-[1px] border-gray-300 text-center font-bold whitespace-nowrap inline-block lg:min-w-[200px] lg:py-1 ">Junior</div>
                                <div className="w-1/5 py-2 border-[1px] border-gray-300 text-center font-bold whitespace-nowrap inline-block lg:min-w-[200px] lg:py-1 ">Junior-Mid</div>
                                <div className="w-1/5 py-2 border-[1px] border-gray-300 text-center font-bold whitespace-nowrap inline-block lg:min-w-[200px] lg:py-1 ">Mid</div>
                                <div className="w-1/5 py-2 border-[1px] border-gray-300 text-center font-bold whitespace-nowrap inline-block lg:min-w-[200px] lg:py-1 ">Mid-Senior</div>
                                <div className="w-1/5 py-2 border-[1px] border-gray-300 text-center font-bold whitespace-nowrap inline-block lg:min-w-[200px] lg:py-1 ">Top</div>
                            </div>

                            <div className="w-full gap-0">
                                {Array(Math.max(juniorFranchise.length, midFranchise.length, topFranchise.length, junior_midFranchise.length, mid_seniorFranchise.length)).fill().map((_, index) => (
                                    <div key={index} className="w-full flex">
                                        <div className="w-1/5 py-2 border-[1px] border-gray-300 text-center  flex-grow h-auto lg:min-w-[200px] lg:py-1">{juniorFranchise[index]?.username || '-'}{juniorFranchise[index]?.status === "active" ? "(A)" : ""}</div>
                                        <div className="w-1/5 py-2 border-[1px] border-gray-300 text-center  flex-grow h-auto lg:min-w-[200px] lg:py-1">{junior_midFranchise[index]?.username || '-'}{junior_midFranchise[index]?.status === "active" ? "(A)" : ""}</div>
                                        <div className="w-1/5 py-2 border-[1px] border-gray-300 text-center  flex-grow h-auto lg:min-w-[200px] lg:py-1">{midFranchise[index]?.username || ''}{midFranchise[index]?.status === "active" ? "(A)" : ""}</div>
                                        <div className="w-1/5 py-2 border-[1px] border-gray-300 text-center  flex-grow  h-auto lg:min-w-[200px] lg:py-1">{mid_seniorFranchise[index]?.username || '-'}{mid_seniorFranchise[index]?.status === "active" ? "(A)" : ""}</div>
                                        <div className="w-1/5 py-2 border-[1px] border-gray-300 text-center  flex-grow h-auto lg:min-w-[200px] lg:py-1">{topFranchise[index]?.username || '-'}{topFranchise[index]?.status === "active" ? "(A)" : ""}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>

                </div >
            }
        </>
    )
}


export default TLDashboardPage
