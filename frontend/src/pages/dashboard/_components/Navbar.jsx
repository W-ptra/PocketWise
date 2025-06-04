import { LayoutDashboard, History, BarChart2 } from "lucide-react";

function Navbar({ profileImage = "/logo/User.png" }) {
    // Get current path to highlight active nav item
    const currentPath = window.location.pathname;

    const isActive = (path) => {
        return currentPath === path ? "text-[#00AB6B]" : "text-gray-500";
    };

    return (
        <nav className="bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-100">
            <div className="container mx-auto px-4">
                {/* Top Section */}
                <div className="flex justify-between items-center py-4">
                    <a href="/dashboard" className="flex items-center space-x-2">
                        <img
                            src="/logo/pocket-wise-logo.jpg"
                            alt="PocketWise Logo"
                            className="w-10 h-10 rounded-full"
                        />
                        <span className="text-xl font-bold text-[#00AB6B]">
                            PocketWise
                        </span>
                    </a>
                    <a href="/profile" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
                        <span className="text-gray-600 text-sm hidden sm:block">My Profile</span>
                        <img 
                            className="w-10 h-10 rounded-full border-2 border-gray-100" 
                            src={profileImage} 
                            alt="Profile" 
                        />
                    </a>
                </div>

                {/* Navigation Links */}
                <div className="flex justify-center space-x-8 py-2">
                    <a 
                        href="/dashboard"
                        className={`flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-50 transition-all duration-200 ${isActive('/dashboard')}`}
                    >
                        <LayoutDashboard className="w-5 h-5" />
                        <span className="font-medium">Dashboard</span>
                    </a>

                    <a 
                        href="/transaction-history"
                        className={`flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-50 transition-all duration-200 ${isActive('/transaction-history')}`}
                    >
                        <History className="w-5 h-5" />
                        <span className="font-medium">Transactions</span>
                    </a>

                    <a 
                        href="/analysis"
                        className={`flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-50 transition-all duration-200 ${isActive('/analysis')}`}
                    >
                        <BarChart2 className="w-5 h-5" />
                        <span className="font-medium">Analysis</span>
                    </a>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;