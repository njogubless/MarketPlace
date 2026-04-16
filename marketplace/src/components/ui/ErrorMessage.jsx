const ErrorMessage = ({ message = "Something went wrong." }) => {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md text-center">
        <i className="fas fa-exclamation-circle text-red-500 text-3xl mb-3"></i>
        <p className="text-red-700 font-medium">{message}</p>
      </div>
    </div>
  );
};

export default ErrorMessage;