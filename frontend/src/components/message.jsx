function Message({ type, message, onClose }) {
  let bgColor = "bg-white";
  if (type === "error") bgColor = "bg-red-500";
  else if (type === "message") bgColor = "bg-[#00AB6B]";

  return (
    <div className={`flex items-center fixed top-0 left-0 right-0 ${bgColor} py-5 px-10`}>
      <p className="text-white font-semibold text-center basis-2/3 flex justify-end px-[10rem]">
        {message}
      </p>

      <button
        className="cursor-pointer basis-1/3 flex justify-end"
        onClick={onClose}
      >
        <img className="size-7" src="/logo/cross.png" alt="Close" />
      </button>
    </div>
  );
}

export default Message;
