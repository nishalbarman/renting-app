import { BaseSyntheticEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useDispatch } from "react-redux";

// custom redux package
import { setUserAuthData } from "@store/rtk";
import { isValidEmail } from "custom-validator-renting";

import axios from "axios";
import { toast } from "react-toastify";

type LoginFormData = {
  [key: string]: { value: any; isTouched: any; isError: any };
};

const Login = () => {
  const [formData, setFormData] = useState<LoginFormData>({
    email: { value: null, isTouched: null, isError: null },
    password: { value: null, isTouched: null, isError: null },
  });

  console.log(formData);

  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);

  const dispatch = useDispatch();
  const navigator = useNavigate();

  const [isPending, setIsPending] = useState(false);

  const handleLogin = async () => {
    const toastId = toast.loading("Loging in... Please wait...");
    try {
      setIsPending(true);

      const extractedData = Object.keys(formData).reduce(
        (newFormData, keyName) => {
          return { ...newFormData, [keyName]: formData[keyName].value };
        },
        { email: "", password: "" }
      ); // postable form data

      const response = await axios.post(
        `${process.env.VITE_APP_API_URL}/auth/admin-login`,
        extractedData
      );

      dispatch(setUserAuthData({ ...response.data.user }));
      navigator("/");
      toast.update(toastId, {
        type: "success",
        render: "Login successfull",
        autoClose: 2000,
        isLoading: false,
      });
    } catch (error: any) {
      console.error(error);
      toast.update(toastId, {
        type: "error",
        render:
          error.response?.data.message ||
          "Opps, some error occured. Please try again",
        autoClose: 2000,
        isLoading: false,
      });
    } finally {
      setIsPending(false);
    }
  };

  useEffect(() => {
    setIsSubmitDisabled(
      !formData.email.isTouched ||
        formData.email.isError ||
        !formData.password.isTouched ||
        formData.password.isError
    );
  }, [formData]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 w-full">
      <div className="flex w-full max-w-md flex-col space-y-8 bg-white p-8 shadow-lg">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">
            Welcome to RentPro!
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
              onKeyUp={(e: BaseSyntheticEvent) => {
                setFormData((prev) => ({
                  ...prev,
                  email: {
                    ...prev["email"],
                    value: e.target.value,
                    isTouched: true,
                    isError: !isValidEmail(e.target?.value),
                  },
                }));
              }}
              autoComplete="email"
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
              onKeyUp={(e: BaseSyntheticEvent) => {
                setFormData((prev) => ({
                  ...prev,
                  password: {
                    ...prev["password"],
                    value: e.target.value,
                    isTouched: true,
                    isError: !e.target.value || e.target.value.length < 5,
                  },
                }));
              }}
              autoComplete="current-password"
            />
          </div>
          {/* <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input type="checkbox" className="form-checkbox" />
              <span className="ml-2 text-sm text-gray-600">Remember me</span>
            </label>
            <a href="#" className="text-sm text-purple-600 hover:underline">
              Forgot Password?
            </a>
          </div> */}
          <div>
            <button
              type="submit"
              className="w-full py-2 px-4 bg-purple-600 text-white font-semibold rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-600"
              onClick={handleLogin}
              disabled={isPending || isSubmitDisabled}>
              Login
            </button>
          </div>
          <div className="text-center">
            {/* <p className="text-sm text-gray-600">
              New on our platform?{" "}
              <a href="#" className="text-purple-600 hover:underline">
                Create an account
              </a>
            </p> */}
            <p className="text-sm text-gray-600">
              Do not share browser tab with any one. If you are accessing this
              site from cafe or someone elses computer make sure to surfe from
              incognito mode and clear browsing data.
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
