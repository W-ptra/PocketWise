import { useState, useEffect } from "react";
import { isInputsInvalid, redirectIfLogout } from "~utils/validation";
import { postRequest } from "~utils/api";
import { Mail, Undo2 } from "lucide-react";

function RequestChangePassword() {
    const [email, setEmail] = useState("");
    const [isSubmit, setIsSubmit] = useState("");
    const [linkSent, setLinkSent] = useState(false);

    redirectIfLogout();

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handleIsSubmitChange = () => {
        setIsSubmit((isSubmit) => !isSubmit);
    };

    useEffect(() => {
        const button = document.getElementById("buttonSubmit");
        if (isSubmit) {
            button.disabled = true;
            return;
        }
        button.disabled = false;
    }, [isSubmit]);

    const requestResetLink = async () => {
        setErroMessage("");
        handleIsSubmitChange();

        const isInputInvalid = isInputsInvalid(email);

        if (isInputInvalid) {
            setErroMessage("Please enter your email address");
            handleIsSubmitChange();
            return;
        }

        try {
            const respond = await postRequest("api/auth/request-reset-password", null, {
                email,
            });

            if (respond.error) {
                setErroMessage(respond.error);
                handleIsSubmitChange();
                return;
            }

            setLinkSent(true);
            setLinkMessage(respond.message);
            setEmail("");
        } catch (err) {
            console.log(err);
            setErroMessage("Something went wrong. Please try again.");
        }
        handleIsSubmitChange();
    };

    const setErroMessage = (message) => {
        document.getElementById("errorMessage").innerText = message;
    };

    const setLinkMessage = (message) => {
        document.getElementById("linkMessage").innerText = message;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#f8fdfb] to-[#e6f5ef] flex justify-center items-center px-4">
            <div className="absolute top-4 left-4">
                <a
                    href="/login"
                    className="text-gray-400 text-sm flex items-center gap-2 hover:text-gray-600 transition-colors duration-200"
                >
                    <Undo2 className="h-5 w-5" />
                    Back to Login
                </a>
            </div>

            <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-lg transform transition-all duration-300 hover:shadow-xl">
                {/* Logo and Title Section */}
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center mb-2">
                        <img
                            src="/logo/pocket-wise-logo.jpg"
                            alt="PocketWise Logo"
                            className="h-12 w-auto rounded-full"
                        />
                    </div>
                    <h1 className="text-[#00AB6B] font-bold text-2xl">Reset Password</h1>
                    <p className="text-gray-600 text-sm mt-2">
                        Enter your email and we'll send you a reset link
                    </p>
                </div>

                {/* Input Field */}
                <div className="space-y-4">
                    <div className="relative">
                        <input
                            className="w-full pl-11 pr-4 py-3 bg-[#F8F8F8] border border-gray-200 rounded-lg focus:border-[#00AB6B] focus:ring-1 focus:ring-[#00AB6B] transition-all duration-200 outline-none placeholder:text-gray-400"
                            type="email"
                            placeholder="Enter your email"
                            onChange={handleEmailChange}
                            value={email}
                        />
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                            <Mail className="h-5 w-5" />
                        </span>
                    </div>
                </div>

                {/* Error Message */}
                <p id="errorMessage" className="text-red-500 text-center text-sm mt-2"></p>

                {/* Success Message */}
                <div className="mt-2">
                    <p
                        id="linkMessage"
                        className={`text-center text-sm ${
                            linkSent ? "text-green-600" : "text-black"
                        }`}
                    ></p>
                </div>

                {/* Submit Button */}
                <button
                    className="w-full mt-6 bg-[#00AB6B] text-white font-semibold py-3 rounded-lg hover:bg-[#00CF81] transform transition-all duration-200 hover:scale-[1.02] focus:ring-2 focus:ring-[#00AB6B] focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    onClick={requestResetLink}
                    id="buttonSubmit"
                >
                    Send Reset Link
                </button>

                {/* Help Text */}
                <p className="text-center text-gray-500 text-sm mt-4">
                    Remember your password?{" "}
                    <a
                        href="/login"
                        className="text-[#00AB6B] hover:text-[#00CF81] font-medium transition-colors duration-200"
                    >
                        Sign in
                    </a>
                </p>
            </div>
        </div>
    );
}

export default RequestChangePassword;