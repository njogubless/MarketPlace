import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-8">
      <i className="fas fa-exclamation-triangle text-yellow-400 text-6xl mb-4"></i>
      <h1 className="text-6xl font-bold text-gray-800 mb-2">404</h1>
      <p className="text-xl text-gray-500 mb-6">Oops! Page not found.</p>
      <Link
        to="/"
        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
      >
        Go back home
      </Link>
    </div>
  );
};

export default NotFoundPage;