function LoadingSpinner({ size = 'w-12 h-12', color = 'border-t-[#00AB6B]' }) {
  return (
    <div className="flex justify-center items-center">
      <div 
        className={`animate-spin rounded-full border-4 border-gray-200 ${color} ${size}`}
        style={{ borderTopColor: '#00AB6B' }} // Fallback for dynamic class not working
      ></div>
    </div>
  );
}

export default LoadingSpinner; 