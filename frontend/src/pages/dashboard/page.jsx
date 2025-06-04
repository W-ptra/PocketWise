import { useState, useEffect } from "react";
import Navbar from "@/pages/dashboard/_components/Navbar";
import Footer from "@/pages/dashboard/_components/Footer";
import { getToken } from "~utils/localStorage";
import { getRequest } from "~utils/api";

function Dashboard() {
    const [profileImage, setProfileImage] = useState("/logo/User.png");

    useEffect(() => {
        async function fetchProfileImage() {
            try {
                const token = getToken();
                const response = await getRequest("api/user/profile", token);
                console.log(response);
                if (response.data && response.data.profileImageUrl) {
                    setProfileImage(response.data.profileImageUrl);
                }
                
            } catch (error) {
                console.error("Error fetching profile image:", error);
            }
        }

        fetchProfileImage();
    }, []);

    return (
        <div className="bg-[#F2F2F2]">
            <Navbar profileImage={profileImage} />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <Footer/>
        </div>
    );
}

export default Dashboard;