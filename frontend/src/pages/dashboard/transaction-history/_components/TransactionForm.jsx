import { useState, useRef } from "react";
import { Calendar, Camera, InfoIcon, X, Upload, RefreshCw } from "lucide-react";
import * as Ariakit from "@ariakit/react";
import { postRequest } from "~utils/api";
import { getToken } from "~utils/localStorage";
import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const TransactionType = [
  "Income",
  "Rent",
  "Loan Repayment",
  "Insurance",
  "Groceries",
  "Transport",
  "Eating Out",
  "Entertainment",
  "Utilities",
  "Healthcare",
  "Education",
  "Other",
];

const TransactionForm = () => {
  const [formData, setFormData] = useState({
    amount: "",
    title: "",
    transactionType: TransactionType[0],
    date: new Date().toISOString().split("T")[0],
  });

  const [showTooltip, setShowTooltip] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("upload");
  const [stream, setStream] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [videoDevices, setVideoDevices] = useState([]);
  const [currentDeviceIndex, setCurrentDeviceIndex] = useState(0);

  const videoRef = useRef(null);
  const fileInputRef = useRef(null);
  const videoDevicesRef = useRef([]);

  const startCamera = async (deviceId = null) => {
    try {
      const constraints = deviceId ? 
        { video: { deviceId: { exact: deviceId } } } : 
        { video: true };

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(mediaStream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }

      // Enumerate devices AFTER getting permission
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoInputs = devices.filter(device => device.kind === "videoinput");
      
      // Update both state and ref
      setVideoDevices(videoInputs);
      videoDevicesRef.current = videoInputs;

      // Set current index to active device
      if (deviceId) {
        const activeIndex = videoInputs.findIndex(d => d.deviceId === deviceId);
        if (activeIndex !== -1) setCurrentDeviceIndex(activeIndex);
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const handleTabChange = async (tab) => {
    if (tab === "camera") {
      setCapturedImage(null);
      startCamera();
    } else {
      stopCamera();
    }
    setActiveTab(tab);
  };


  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(videoRef.current, 0, 0);
      
      canvas.toBlob((blob) => {
        const imageUrl = URL.createObjectURL(blob);
        setCapturedImage({
          url: imageUrl,
          blob: blob
        });
      }, 'image/jpeg', 0.95);
    }
  };

  const rotateCamera = () => {
    const devices = videoDevicesRef.current;
    
    if (devices.length > 1) {
      const nextIndex = (currentDeviceIndex + 1) % devices.length;
      const nextDeviceId = devices[nextIndex].deviceId;
      
      setCurrentDeviceIndex(nextIndex);
      stopCamera();
      startCamera(nextDeviceId);
    } else {
      console.warn("Only one camera device found.");
    }
  };


  const retakePhoto = () => {
    if (capturedImage) {
      URL.revokeObjectURL(capturedImage.url);
      startCamera();
      setCapturedImage(null);
    }
  };

  const handleSubmitPhoto = async () => {
    if (capturedImage) {
      
      const formData = new FormData();
      formData.append("image", capturedImage.blob);

      await postRequest("api/ai/ocr",getToken(),formData,true);

      stopCamera();
      setOpen(false);
      setCapturedImage(null);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setUploadedImage({
        url: imageUrl,
        file: file
      });
    }
  };

  const handleRetakeUpload = () => {
    if (uploadedImage) {
      URL.revokeObjectURL(uploadedImage.url);
      setUploadedImage(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleSubmitUpload = async () => {
    if (uploadedImage) {

      const formData = new FormData();
      formData.append("image", uploadedImage.file);

      await postRequest("api/ai/ocr",getToken(),formData,true);

      setOpen(false);
      setUploadedImage(null);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTransactionTypeChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      transactionType: value,
    }));
  };

  const queryClient = useQueryClient();

  const { mutate: createTransaction, isLoading } = useMutation({
    mutationFn: async () => {
      const token = getToken();
      if (!token) {
        throw new Error("No authentication token found");
      }

      const payload = {
        title: formData.title,
        amount: Number(formData.amount),
        transactionType: formData.transactionType.replace(/\s+/g, '_'),
        createdAt: new Date(formData.date).toISOString(),
      };

      const result = await postRequest("api/transaction", token, payload);
      if (result.error) {
        throw new Error(result.message || "Failed to create transaction");
      }
      return result;
    },
    onSuccess: () => {
      toast.success("Transaction created successfully");
      setFormData({
        amount: "",
        title: "",
        transactionType: TransactionType[0],
        date: new Date().toISOString().split("T")[0],
      });
      
      queryClient.invalidateQueries(["transactions"]);
    },
    onError: (error) => {
      toast.error("Transaction creation failed");
      console.error("Transaction creation failed:", error);
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    createTransaction();
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <Ariakit.Dialog
        open={open}
        onClose={() => {
          stopCamera();
          if (capturedImage) {
            URL.revokeObjectURL(capturedImage.url);
          }
          if (uploadedImage) {
            URL.revokeObjectURL(uploadedImage.url);
          }
          setOpen(false);
          setActiveTab("upload");
        }}
        backdrop={<div className="fixed inset-0 z-50 bg-black/50" />}
        className="fixed inset-0 z-50 m-auto flex h-fit max-h-[80vh] w-full max-w-md flex-col gap-4 rounded-xl bg-white p-6 shadow-xl"
      >
        <header className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800">Upload Receipt</h2>
          <button 
            onClick={() => {
              stopCamera();
              if (capturedImage) {
                URL.revokeObjectURL(capturedImage.url);
              }
              if (uploadedImage) {
                URL.revokeObjectURL(uploadedImage.url);
              }
              setOpen(false);
              setActiveTab("upload");
            }}
            className="rounded-full p-1 transition-colors hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        <div className="flex gap-2 border-b">
          <button
            onClick={() => handleTabChange("upload")}
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === "upload"
                ? "border-b-2 border-[#00AB6B] text-[#00AB6B]"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <Upload className="w-4 h-4 inline-block mr-2" />
            Upload File
          </button>
          <button
            onClick={() => handleTabChange("camera")}
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === "camera"
                ? "border-b-2 border-[#00AB6B] text-[#00AB6B]"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <Camera className="w-4 h-4 inline-block mr-2" />
            Take Photo
          </button>
        </div>

        {activeTab === "upload" ? (
          <div className="flex flex-col items-center justify-center gap-4">
            {uploadedImage ? (
              <>
                <div className="relative w-full aspect-video bg-gray-100 rounded-lg overflow-hidden">
                  {uploadedImage?.url && (
                    uploadedImage.url.endsWith('.pdf') ? (
                      <img 
                        src={uploadedImage.url} 
                        alt="Uploaded receipt" 
                        className="w-full h-full object-contain" 
                      />
                    ) : (
                      <iframe
                        src={uploadedImage.url}
                        title="Uploaded PDF"
                        className="w-full h-full"
                      />
                      
                    )
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleRetakeUpload}
                    className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Choose Another
                  </button>
                  <button
                    onClick={handleSubmitUpload}
                    className="rounded-lg bg-[#00AB6B] px-4 py-2 text-sm font-semibold text-white hover:bg-[#00AB6B]/90"
                  >
                    Use Image
                  </button>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center gap-4 rounded-lg border-2 border-dashed border-gray-300 p-8 text-center">
                <div className="rounded-full bg-gray-100 p-3">
                  <Upload className="h-8 w-8 text-gray-500" />
                </div>
                <p className="text-gray-600">
                  Drag and drop your receipt image here
                  <br />
                  or
                </p>
                <label className="cursor-pointer rounded-lg bg-[#00AB6B] px-4 py-2 text-sm font-semibold text-white hover:bg-[#00AB6B]/90">
                  Browse Files
                  <input 
                    ref={fileInputRef}
                    type="file" 
                    className="sr-only" 
                    accept="image/*,application/pdf"
                    onChange={handleFileUpload}
                  />
                </label>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <div className="relative w-full aspect-video bg-gray-100 rounded-lg overflow-hidden">
              {capturedImage ? (
                <img 
                  src={capturedImage.url} 
                  alt="Captured receipt" 
                  className="w-full h-full object-contain"
                />
              ) : (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            <div className="flex gap-2">
              {capturedImage ? (
                <>
                  <button
                    onClick={retakePhoto}
                    className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Retake
                  </button>
                  <button
                    onClick={handleSubmitPhoto}
                    className="rounded-lg bg-[#00AB6B] px-4 py-2 text-sm font-semibold text-white hover:bg-[#00AB6B]/90"
                  >
                    Use Photo
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={capturePhoto}
                    className="rounded-lg bg-[#00AB6B] px-4 py-2 text-sm font-semibold text-white hover:bg-[#00AB6B]/90 cursor-pointer"
                  >
                    Capture Photo
                  </button>
                  <button
                    onClick={rotateCamera}
                    className="rounded-lg bg-[#00AB6B] px-4 py-2 text-sm font-semibold text-white hover:bg-[#00AB6B]/90 cursor-pointer"
                  >
                    Rotate Camera
                  </button>
                </>
                
              )}
            </div>
          </div>
        )}

        <p className="text-xs text-gray-500">
          We'll scan the receipt and attempt to fill out the transaction details
          for you.
        </p>
      </Ariakit.Dialog>

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-700">Add Transaction</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setOpen(true)}
            className="text-blue-400 border border-blue-400 px-4 py-2 rounded-lg transition-all duration-300 hover:bg-blue-400 hover:text-white cursor-pointer animate-bounce"
          >
            <Camera className="w-4 h-4" />
          </button>
          <div
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            className="relative flex items-center gap-0 md:gap-2"
          >
            <span className="text-sm text-gray-600">Scan/Upload Receipt</span>

            <InfoIcon className="w-4 h-4 text-gray-600 opacity-50 cursor-pointer" />
            {showTooltip && (
              <div className="absolute right-0 bottom-8 bg-white border border-gray-200 rounded-lg shadow-lg p-3 text-xs text-gray-700 w-64 z-20">
                Scan or upload your receipt to automatically fill in the
                transaction details.
              </div>
            )}
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="amount"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Amount
          </label>
          <div className="relative rounded-lg">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
              Rp.
            </div>
            <input
              type="number"
              min="0"
              name="amount"
              id="amount"
              value={formData.amount}
              onChange={handleChange}
              className="block w-full rounded-lg border border-gray-300 py-2 pl-10 pr-3 text-gray-900 placeholder:text-gray-400 focus:border-[#00AB6B] focus:outline-none focus:ring-1 focus:ring-[#00AB6B] sm:text-sm cursor-pointer"
              placeholder="0.00"
              required
            />
          </div>
        </div>

        {/* Title Field */}
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Title
          </label>
          <input
            type="text"
            name="title"
            id="title"
            value={formData.title}
            onChange={handleChange}
            className="block w-full rounded-lg border border-gray-300 py-2 px-3 text-gray-900 placeholder:text-gray-400 focus:border-[#00AB6B] focus:outline-none focus:ring-1 focus:ring-[#00AB6B] sm:text-sm cursor-pointer"
            placeholder="Enter transaction title"
            required
          />
        </div>

        <div>
          <label
            htmlFor="transactionType"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Transaction Type
          </label>
          <TransactionDropdown
            selected={formData.transactionType}
            onSelect={handleTransactionTypeChange}
          />
        </div>

        <div>
          <label
            htmlFor="date"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Date
          </label>
          <div className="relative rounded-lg">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Calendar className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="date"
              name="date"
              id="date"
              value={formData.date}
              onChange={handleChange}
              className="block w-full rounded-lg border border-gray-300 py-2 pl-10 pr-3 text-gray-900 focus:border-[#00AB6B] focus:outline-none focus:ring-1 focus:ring-[#00AB6B] sm:text-sm cursor-pointer"
              required
            />
          </div>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-lg bg-[#00AB6B] px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#00AB6B]/90 focus:outline-none focus:ring-2 focus:ring-[#00AB6B] focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isLoading ? "Adding..." : "Add Transaction"}
          </button>
        </div>
      </form>
    </div>
  );
};

const TransactionDropdown = ({ selected, onSelect }) => {
  const menu = Ariakit.useMenuStore();

  return (
    <Ariakit.MenuProvider>
      <Ariakit.MenuButton className="flex w-full items-center justify-between rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 hover:bg-gray-50 focus:border-[#00AB6B] focus:outline-none focus:ring-1 focus:ring-[#00AB6B] cursor-pointer">
        <span>{selected}</span>
        <svg
          className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${
            menu.open ? "rotate-180" : ""
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </Ariakit.MenuButton>
      <Ariakit.Menu
        gutter={4}
        className="z-50 max-h-[280px] w-full overflow-auto rounded-lg border border-gray-200 bg-white py-1 shadow-lg focus:outline-none"
      >
        {TransactionType.map((type) => (
          <Ariakit.MenuItem
            key={type}
            className="flex cursor-pointer items-center px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 focus:bg-gray-50 focus:text-gray-900 focus:outline-none"
            onClick={() => {
              onSelect(type);
              menu.hide();
            }}
          >
            {type}
          </Ariakit.MenuItem>
        ))}
      </Ariakit.Menu>
    </Ariakit.MenuProvider>
  );
};

export default TransactionForm;