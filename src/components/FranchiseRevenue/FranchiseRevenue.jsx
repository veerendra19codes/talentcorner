"use client";

import { getAllUsers } from "@/lib/actions";
import { useEffect, useState } from "react";
import axios from "axios";

const FranchiseRevenue = ({ username, teamleadername }) => {
    // console.log("username in Franchise Revenue:", username);
    // console.log("teamleadername in FranchiseRevenue:", teamleadername);

    // const [revenuegained, setRevenuegained] = useState(0);
    // const [revenuelost, setRevenuelost] = useState(0);
    const [revenue, setRevenue] = useState({ gained: 0, lost: 0 });
    const [url, setUrl] = useState("");
    const [tlname, setTlname] = useState(teamleadername);
    // console.log('tlname:', tlname);

    useEffect(() => {
        const getteamleaderurl = async () => {
            try {
                // console.log("hello inside useEffect");
                const url = `${process.env.NEXTAUTH_URL}/api/user`
                const res = await axios({
                    method: "GET",
                    url
                });
                // console.log("allUsers:", allUsers);
                const allUsers = res.data;
                console.log("allUsers:", allUsers);

                const teamleaderarr = allUsers.filter((user) => user.username === tlname)
                console.log("teamleaderarr:", teamleaderarr);
                const teamleaderobj = teamleaderarr[0];
                console.log("teamleaderobj:", teamleaderobj);

                setUrl(teamleaderobj.revenueapi);
                console.log("url:", url);
            }
            catch (err) {
                // console.log("error getting teamleader deployed url:", err);
            }
        }
        getteamleaderurl();
    }, [tlname]);

    // useEffect(() => {

    //     const fetchData = async () => {
    //         if (!url) return;
    //         try {
    //             console.log("url in fetchData:", url);
    //             console.log("username in fetchData:", username);

    //             const response = await fetch(url);

    //             const data = await response.json();
    //             console.log('data: ', data);

    //             const franchiseData = data.filter((d) => d.nameoffranchisee.replace(/\s/g, '').toLowerCase() === username.replace(/\s/g, '').toLowerCase());
    //             console.log("franchiseData:", franchiseData);

    //             const statusEntry = franchiseData[0];
    //             console.log("statusEntry:", statusEntry);

    //             const rg = statusEntry.closed || 0;
    //             const rl = statusEntry.cancel || 0;
    //             setRevenue((prev) => ({
    //                 ...prev,
    //                 lost: rl,
    //                 gained: rg
    //             }));
    //             // setRevenuegained(rg);
    //             // setRevenuelost(rl);


    //         } catch (error) {
    //             setRevenue((prev) => ({
    //                 ...prev,
    //                 lost: 0,
    //                 gained: 0
    //             }));
    //             // setRevenuegained(0);
    //             // setRevenuelost(0);
    //             // console.error("Error fetching data:", error);
    //         }
    //     };

    //     fetchData();
    // }, [url]);

    useEffect(() => {
        const fetchData = async () => {
            if (!url) return;
            try {
                console.log("Fetching data from URL:", url); // Log URL before fetching
                const response = await fetch(url);
                const data = await response.json();
                const franchiseData = data.filter((d) => d.nameoffranchisee.replace(/\s/g, '').toLowerCase() === username.replace(/\s/g, '').toLowerCase());
                if (franchiseData.length > 0) {
                    const statusEntry = franchiseData[0];
                    const rg = statusEntry.closed || 0;
                    const rl = statusEntry.cancel || 0;
                    setRevenue({ gained: rg, lost: rl });
                } else {
                    console.error("No franchise data found");
                }
            } catch (error) {
                console.error("Error fetching data:", error);
                setRevenue({ gained: 0, lost: 0 });
            }
        };
        fetchData();
    }, [url]);


    return (
        <div className="w-full franchiserevenue flex justify-center items-center gap-4 lg:flex-row lg:text-xs lg:px-0">

            <div className="revenuegained flex flex-col justify-around items-center bg-green-500 rounded-xl w-full py-4 px-8 h-[80px]">
                <div className="title font-bold text-white text-center">Revenue Gained</div>
                <div className="title font-bold text-white text-center">Rs.{revenue.gained}</div>
            </div>

            <div className="revenuelost flex flex-col justify-around items-center bg-red-500 rounded-xl w-full py-4 px-8 h-[80px]">
                <div className="title font-bold text-white text-center">Revenue Lost</div>
                <div className="title font-bold text-white text-center">Rs.{revenue.lost}</div>
            </div>

        </div>
    )
}

export default FranchiseRevenue
