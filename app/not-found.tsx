export default function NotFound() {
  return (
    <>
      <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="text-center bg-white rounded-2xl shadow-xl p-8 animate-fade-in max-w-lg w-full">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            404 - Page Not Found
          </h1>
          <p className="text-gray-600 mb-6">
            Sorry, the page you are looking for does not exist.
          </p>
          <a
            href="/"
            className="bg-indigo-600 text-white font-semibold py-3 px-6 rounded-xl hover:bg-indigo-700 transition duration-300 w-full inline-block shadow-md"
          >
            Return to Home
          </a>
        </div>
      </div>
    </>
  );
}
