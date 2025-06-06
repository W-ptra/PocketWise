import { useState, useEffect } from "react";
import { isInputsInvalid } from "~utils/validation";
import { deleteToken, getToken } from "~utils/localStorage";
import { getRequest, putRequest } from "~utils/api";
import Message from "@/pages/dashboard/_components/message";
import { UserCircle2, Mail, Edit2, LogOut, Star, Undo2 } from "lucide-react";
import { FaGoogle } from "react-icons/fa";

const categories = {
  Overspender: {
    name: "Overspender",
    color: "text-red-500",
    bgColor: "bg-red-50",
    borderColor: "border-red-100",
    starColor: "#EF4444",
  },
  "Savvy Saver": {
    name: "Savvy Saver",
    color: "text-emerald-500",
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-100",
    starColor: "#10B981",
  },
  Balanced: {
    name: "Balanced",
    color: "text-blue-500",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-100",
    starColor: "#3B82F6",
  },
  Beginner: {
    name: "Financial Beginner",
    color: "text-amber-500",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-100",
    starColor: "#F59E0B",
  },
};

function CategoryTag({ category = "Beginner" }) {
  const categoryData = categories[category] || categories["Beginner"];

  return (
    <div
      className={`flex items-center gap-2 ${categoryData.bgColor} px-3 py-1.5 rounded-full border ${categoryData.borderColor} group transition-all duration-200 hover:shadow-sm`}
    >
      <Star
        className={`w-4 h-4 ${categoryData.color} transition-transform duration-200 group-hover:scale-110`}
      />
      <span className={`text-sm font-medium ${categoryData.color}`}>
        {categoryData.name}
      </span>
    </div>
  );
}

function Profile() {
  const [userData, setUserData] = useState({
    id: "",
    name: "",
    email: "",
    profileImage: null,
    isGoogleAccount: false,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState({
    show: false,
    text: "",
    type: "error",
  });

  useEffect(() => {
    const getProfileInfo = async () => {
      const token = getToken();
      const response = await getRequest("api/user/profile", token);

      if (!response.error) {
        setUserData({
          id: response.data.id,
          name: response.data.name,
          email: response.data.email,
          profileImage: response.data.profileImageUrl,
          isGoogleAccount: response.data.authMethod === "google",
        });
      }
    };

    getProfileInfo();
  }, []);

  const handleUpdate = async () => {
    if (isInputsInvalid(userData.name)) {
      showMessage("Name cannot be empty", "error");
      return;
    }

    const token = getToken();
    const response = await putRequest("api/user/profile", token, {
      name: userData.name,
    });

    if (response.error) {
      showMessage(response.error, "error");
    } else {
      showMessage("Profile updated successfully", "message");
      setIsEditing(false);
    }
  };

  const showMessage = (text, type) => {
    setMessage({ show: true, text, type });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {message.show && (
        <Message
          type={message.type}
          message={message.text}
          onClose={() => setMessage({ ...message, show: false })}
        />
      )}

      <a className="relative absolute top-4 left-4 flex items-center gap-2 text-gray-600 cursor-pointer" href="/dashboard">
        <Undo2 className="w-4 h-4" />
        <span className="text-sm">Back to dashboard</span>
      </a>

      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="relative h-32 bg-gradient-to-r from-[#00AB6B] to-[#4ECDC4]">
            <div className="absolute -bottom-12 left-6">
              {userData.profileImage ? (
                <img
                  src={userData.profileImage}
                  alt="Profile"
                  className="w-24 h-24 rounded-full border-4 border-white shadow-md"
                />
              ) : (
                <div className="w-24 h-24 rounded-full border-4 border-white shadow-md bg-white flex items-center justify-center">
                  <UserCircle2 className="w-16 h-16 text-gray-400" />
                </div>
              )}
            </div>
          </div>

          <div className="pt-16 px-6 pb-6">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  {isEditing ? (
                    <input
                      type="text"
                      value={userData.name}
                      onChange={(e) =>
                        setUserData({ ...userData, name: e.target.value })
                      }
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00AB6B]"
                      placeholder="Your name"
                    />
                  ) : (
                    <h2 className="text-xl font-semibold text-gray-800">
                      {userData.name}
                    </h2>
                  )}
                  <CategoryTag category="Balanced" />
                </div>
                {!userData.isGoogleAccount && (
                  <button
                    onClick={() => {
                      if (isEditing) {
                        handleUpdate();
                      } else {
                        setIsEditing(true);
                      }
                    }}
                    className="ml-4 flex items-center gap-2 text-sm text-[#00AB6B] hover:text-[#00CF81]"
                  >
                    <Edit2 className="w-4 h-4" />
                    {isEditing ? "Save" : "Edit"}
                  </button>
                )}
              </div>

              <div className="flex items-center gap-3 text-gray-600">
                <Mail className="w-5 h-5" />
                <span>{userData.email}</span>
                {userData.isGoogleAccount && (
                  <div className="flex items-center gap-2 ml-2 text-sm text-[#00AB6B] bg-[#00AB6B]/10 px-2 py-1 rounded-full">
                    <FaGoogle className="w-4 h-4 bg-gradient-to-r from-[#00AB6B] to-[#4ECDC4] text-white rounded-full p-1" />
                    <span>Google Account</span>
                  </div>
                )}
              </div>

              <div className="pt-6 mt-6 border-t">
                <button
                  onClick={deleteToken}
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors cursor-pointer"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Log out</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
