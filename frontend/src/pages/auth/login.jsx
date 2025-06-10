import { useState, useEffect } from "react";
import { isInputsInvalid, redirectIfLogout } from "~utils/validation";
import { postRequest } from "~utils/api";
import { saveToken } from "~utils/localStorage";
import { Mail, Lock, Undo2 } from "lucide-react";
import { FaGoogle } from "react-icons/fa";

const googleOauthRedirectLink = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${
  import.meta.env.VITE_APP_GOOGLE_OAUTH_CLIENT_ID
}&redirect_uri=${encodeURIComponent(
  `${import.meta.env.VITE_APP_API_URL}/api/auth/google/callback`
)}&response_type=code&scope=openid%20email%20profile&access_type=offline&prompt=select_account`;

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmit, setIsSubmit] = useState(false);
  redirectIfLogout();

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
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

  const login = async () => {
    setErroMessage("");
    setEmail("");
    setPassword("");
    handleIsSubmitChange();

    const isInputInvalid = isInputsInvalid(email, password);

    if (isInputInvalid) {
      setErroMessage("Input can't empty");
      handleIsSubmitChange();
      return;
    }

    try {
      const respond = await postRequest("api/auth/login", null, {
        email,
        password,
      });

      if (respond.error) {
        setErroMessage(respond.error);
        handleIsSubmitChange();
        return;
      }
      saveToken(respond.token);
      window.location.href = "/dashboard";
    } catch (err) {
      console.log(err);
      setErroMessage("something went wrong");
    }
    handleIsSubmitChange();
  };

  const redirectToGoogleOauth = () => {
    window.location.href = googleOauthRedirectLink;
    return;
  };

  const setErroMessage = (message) => {
    document.getElementById("errorMessage").innerText = message;
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-[#f8fdfb] to-[#e6f5ef] flex justify-center items-center px-4">
        <div className="absolute top-4 left-4">
          <span
            className="text-gray-400 text-sm flex items-center gap-2 cursor-pointer"
            onClick={() => (window.location.href = "/")}
          >
            <Undo2 className="h-5 w-5" />
            Back
          </span>
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
            <h1 className="text-[#00AB6B] font-bold text-2xl">Welcome Back!</h1>
            <p className="text-gray-600 text-sm mt-2">
              Manage your finances wisely
            </p>
          </div>

          {/* Input Fields */}
          <div className="space-y-4">
            <div className="relative">
              <input
                className="w-full pl-11 pr-4 py-3 bg-[#F8F8F8] border border-gray-200 rounded-lg focus:border-[#00AB6B] focus:ring-1 focus:ring-[#00AB6B] transition-all duration-200 outline-none placeholder:text-gray-400"
                type="text"
                placeholder="Email"
                onChange={handleEmailChange}
                value={email}
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Mail className="h-5 w-5" />
              </span>
            </div>

            <div className="relative">
              <input
                className="w-full pl-11 pr-4 py-3 bg-[#F8F8F8] border border-gray-200 rounded-lg focus:border-[#00AB6B] focus:ring-1 focus:ring-[#00AB6B] transition-all duration-200 outline-none placeholder:text-gray-400"
                type="password"
                placeholder="Password"
                onChange={handlePasswordChange}
                value={password}
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Lock className="h-5 w-5" />
              </span>
            </div>
          </div>

          <p
            id="errorMessage"
            className="text-red-500 text-center text-sm mt-2"
          ></p>

          {/* Login Button */}
          <button
            className="w-full mt-6 bg-[#00AB6B] text-white font-semibold py-3 rounded-lg hover:bg-[#00CF81] transform transition-all duration-200 hover:scale-[1.02] focus:ring-2 focus:ring-[#00AB6B] focus:ring-opacity-50"
            onClick={login}
            id="buttonSubmit"
          >
            Sign In
          </button>

          {/* Links */}
          <div className="flex justify-between text-sm mt-4 text-[#00AB6B] font-medium">
            <a
              href="/request-change-password"
              className="hover:text-[#00CF81] transition-colors duration-200"
            >
              Forgot password?
            </a>
            <a
              href="/register"
              className="hover:text-[#00CF81] transition-colors duration-200"
            >
              Create account
            </a>
          </div>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-1 border-t border-gray-200"></div>
            <span className="px-4 text-sm text-gray-500">or continue with</span>
            <div className="flex-1 border-t border-gray-200"></div>
          </div>

          {/* Google Sign In */}
          <button
            onClick={redirectToGoogleOauth}
            className="w-full flex items-center justify-center gap-2 bg-white border border-gray-200 text-gray-700 font-medium py-3 rounded-lg hover:bg-gray-50 transition-all duration-200 hover:shadow-md cursor-pointer"
          >
            <FaGoogle className="h-5 w-5" />
            <span>Sign in with Google</span>
          </button>
        </div>
      </div>
    </>
  );
}

export default Login;
