import React from "react";

const Login = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 w-full">
      <div className="flex w-full max-w-md flex-col space-y-8 bg-white p-8 shadow-lg">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">
            Welcome to Vuexy!
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Please sign-in to your account and start the adventure
          </p>
        </div>
        <form className="mt-8 space-y-6">
          <div className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
          </div>
          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input type="checkbox" className="form-checkbox" />
              <span className="ml-2 text-sm text-gray-600">Remember me</span>
            </label>
            <a href="#" className="text-sm text-purple-600 hover:underline">
              Forgot Password?
            </a>
          </div>
          <div>
            <button
              type="submit"
              className="w-full py-2 px-4 bg-purple-600 text-white font-semibold rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-600">
              Login
            </button>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">
              New on our platform?{" "}
              <a href="#" className="text-purple-600 hover:underline">
                Create an account
              </a>
            </p>
          </div>
        </form>
        <div className="flex justify-center space-x-4">
          <a href="#" className="text-gray-600">
            <i className="fab fa-facebook-f"></i>
          </a>
          <a href="#" className="text-gray-600">
            <i className="fab fa-twitter"></i>
          </a>
          <a href="#" className="text-gray-600">
            <i className="fab fa-github"></i>
          </a>
          <a href="#" className="text-gray-600">
            <i className="fab fa-google"></i>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;
