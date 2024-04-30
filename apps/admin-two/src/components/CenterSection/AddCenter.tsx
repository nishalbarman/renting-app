import { BaseSyntheticEvent, useEffect, useState } from "react";
import axios from "axios";
// import { useSelector } from "react-redux";
import { useAppSelector } from "@store/rtk";
import { toast } from "react-toastify";
import { Base64StringWithType, Center } from "../../types";

const AddNewCenter = () => {
  const [centerData, setCenterData] = useState<Center>({
    name: "",
    email: "",
    password: "",
    mobileNo: "",
    centerName: "",
    prefix: "",
    streetName: "",
    locality: "",
    postalCode: "",
    city: "",
    state: "",
    country: "",
    longitude: "",
    latitude: "",
    addressProofImage: [],
    idProofImage: [],
    centerImage: [],
  });

  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);

  useEffect(() => {
    let isEverythingOk =
      !!centerData?.name &&
      !!centerData?.email &&
      !!centerData?.password &&
      !!centerData?.centerName &&
      !!centerData?.prefix &&
      !!centerData?.streetName &&
      !!centerData?.locality &&
      !!centerData?.city &&
      !!centerData?.state &&
      !!centerData?.country &&
      !!centerData?.postalCode &&
      centerData.addressProofImage !== null &&
      centerData.addressProofImage.length > 0 &&
      centerData.idProofImage !== null &&
      centerData.idProofImage.length > 0 &&
      centerData.centerImage !== null &&
      centerData.centerImage.length > 0 &&
      !isNaN(Number(centerData.longitude)) &&
      !isNaN(Number(centerData.latitude));
    setIsSubmitDisabled(!isEverythingOk);
  }, [centerData]);

  const [isFormSubmitting, setIsFormSubmitting] = useState(false);

  const { jwtToken } = useAppSelector((state) => state.auth);

  function convertImagesToBase64(imageFiles: File[]) {
    const promises = Array.from(imageFiles).map((file) => {
      return new Promise((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.readAsDataURL(file);
        fileReader.onload = () =>
          resolve({ base64String: fileReader.result, type: file.type });
        fileReader.onerror = (error) => reject(error);
      });
    });

    return Promise.all(promises);
  }

  const handleAddCenter = async (e: BaseSyntheticEvent) => {
    e.preventDefault();
    const id = toast.loading("Sending your request.. Please wait..");

    try {
      setIsFormSubmitting(true);

      try {
        centerData.idProofImage = (await convertImagesToBase64(
          centerData.idProofImage as File[]
        )) as Base64StringWithType[];

        centerData.addressProofImage = (await convertImagesToBase64(
          centerData.addressProofImage as File[]
        )) as Base64StringWithType[];

        if (
          Array.isArray(centerData.centerImage) &&
          centerData.centerImage.length > 0
        ) {
          const centerImage = (await convertImagesToBase64(
            centerData.centerImage as File[]
          )) as Base64StringWithType[];
          centerData.centerImage = centerImage;
        }
      } catch (error) {
        console.error(error);
      }

      console.log(centerData);

      const response = await axios.post(
        `${process.env.VITE_APP_API_URL}/center/add`,
        {
          centerData,
        },
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );

      console.log(response);

      setCenterData({
        name: "",
        email: "",
        password: "",
        mobileNo: "",
        centerName: "",
        streetName: "",
        locality: "",
        postalCode: "",
        city: "",
        country: "",
        state: "",
        longitude: "",
        latitude: "",
        addressProofImage: [],
        idProofImage: [],
        centerImage: [],
      });
      toast.update(id, {
        render: "Center Created",
        type: "success",
        isLoading: false,
        autoClose: 5000,
      });
    } catch (error: any) {
      console.error(error);

      toast.update(id, {
        render:
          error.response?.data?.message ||
          error.message ||
          "Oops, some error occurred",
        type: "error",
        isLoading: false,
        closeOnClick: true,
        autoClose: false,
      });
    } finally {
      setIsFormSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col flex-1 p-3 md:p-6 bg-gray-100 ml-64 max-md:ml-0">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Center</h1>
      </div>
      <div className="bg-white shadow-md rounded p-3 md:p-6 mb-4">
        {/* <h2 className="text-2xl font-bold mb-4">Add Center</h2> */}
        <h2 className="text-lg font-bold mb-4">Add Center</h2>
        <form onSubmit={handleAddCenter} className="space-y-6">
          <div className="bg-white p-4 rounded shadow-lg border">
            <h3 className="text-xl font-semibold mb-3">Owner Details</h3>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="ownername"
                  className="block text-sm font-medium text-gray-700">
                  Full Name{" "}
                  <span className="text-red-500 font-extrabold">*</span>
                </label>
                <input
                  type="text"
                  id="ownername"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm h-10 border border-gray-300 px-2"
                  placeholder="Enter your full name"
                  value={centerData.name}
                  onChange={(e) =>
                    setCenterData({ ...centerData, name: e.target.value })
                  }
                  minLength={4}
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="userEmail"
                  className="block text-sm font-medium text-gray-700">
                  Email <span className="text-red-500 font-extrabold">*</span>
                </label>
                <input
                  type="email"
                  id="userEmail"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm h-10 border border-gray-300 px-2"
                  placeholder="example@gmail.com"
                  value={centerData.email}
                  onChange={(e) =>
                    setCenterData({ ...centerData, email: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="userPassword"
                  className="block text-sm font-medium text-gray-700">
                  Password{" "}
                  <span className="text-red-500 font-extrabold">*</span>
                </label>
                <input
                  type="password"
                  id="userPassword"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm h-10 border border-gray-300 px-2"
                  placeholder="Enter a strong password"
                  value={centerData.password}
                  onChange={(e) =>
                    setCenterData({ ...centerData, password: e.target.value })
                  }
                  minLength={8}
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="userMobileNo"
                  className="block text-sm font-medium text-gray-700">
                  Mobile No.{" "}
                  <span className="text-red-500 font-extrabold">*</span>
                </label>
                <input
                  inputMode="numeric"
                  id="userMobileNo"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm h-10 border border-gray-300 px-2"
                  placeholder="Enter your mobile no"
                  value={centerData.mobileNo}
                  onChange={(e) =>
                    setCenterData({ ...centerData, mobileNo: e.target.value })
                  }
                  minLength={8}
                  required
                />
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded shadow-lg border">
            <h3 className="text-xl font-semibold mb-3">Center Details</h3>

            {/* <div className="grid grid-cols-1 gap-4 sm:grid-cols-2"> */}
            <div>
              <label
                htmlFor="plan"
                className="block text-sm font-medium text-gray-700">
                Center Name{" "}
                <span className="text-red-500 font-extrabold">*</span>
              </label>
              <input
                type="text"
                id="plan"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm h-10 border border-gray-300 px-2"
                placeholder="Enter your center name"
                value={centerData.centerName}
                onChange={(e) =>
                  setCenterData({ ...centerData, centerName: e.target.value })
                }
                required
              />
            </div>
          </div>

          <div className="bg-white p-4 rounded shadow-lg border">
            <h3 className="text-xl font-semibold mb-3">Center Address</h3>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="centerStreetName"
                  className="block text-sm font-medium text-gray-700">
                  Street Name{" "}
                  <span className="text-red-500 font-extrabold">*</span>
                </label>
                <input
                  type="text"
                  id="centerStreetName"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm h-10 border border-gray-300 px-2"
                  placeholder="Enter your center's street name"
                  value={centerData.streetName}
                  onChange={(e) =>
                    setCenterData({
                      ...centerData,
                      streetName: e.target.value,
                    })
                  }
                  minLength={3}
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="centerLocality"
                  className="block text-sm font-medium text-gray-700">
                  Locality{" "}
                  <span className="text-red-500 font-extrabold">*</span>
                </label>
                <input
                  type="text"
                  id="centerLocality"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm h-10 border border-gray-300 px-2"
                  placeholder="Enter your center's locality"
                  value={centerData.locality}
                  onChange={(e) =>
                    setCenterData({ ...centerData, locality: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="centerCity"
                  className="block text-sm font-medium text-gray-700">
                  City <span className="text-red-500 font-extrabold">*</span>
                </label>
                <input
                  type="text"
                  id="centerCity"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm h-10 border border-gray-300 px-2"
                  placeholder="Enter your center's city name"
                  value={centerData.city}
                  onChange={(e) =>
                    setCenterData({ ...centerData, city: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="centerState"
                  className="block text-sm font-medium text-gray-700">
                  State <span className="text-red-500 font-extrabold">*</span>
                </label>
                <input
                  type="text"
                  id="centerState"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm h-10 border border-gray-300 px-2"
                  placeholder="Enter your center's state name"
                  value={centerData.state}
                  onChange={(e) =>
                    setCenterData({ ...centerData, state: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="centerCountry"
                  className="block text-sm font-medium text-gray-700">
                  Country <span className="text-red-500 font-extrabold">*</span>
                </label>
                <input
                  type="text"
                  id="centerCountry"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm h-10 border border-gray-300 px-2"
                  placeholder="Enter your center's country name"
                  value={centerData.country}
                  onChange={(e) =>
                    setCenterData({ ...centerData, country: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="centerPostalCode"
                  className="block text-sm font-medium text-gray-700">
                  Postal Code{" "}
                  <span className="text-red-500 font-extrabold">*</span>
                </label>
                <input
                  type="text"
                  id="centerPostalCode"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm h-10 border border-gray-300 px-2"
                  placeholder="Enter your center's postal code"
                  value={centerData.postalCode}
                  onChange={(e) =>
                    setCenterData({ ...centerData, postalCode: e.target.value })
                  }
                  minLength={4}
                  required
                />
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded shadow-lg border">
            <h3 className="text-xl font-semibold mb-3">Location Coordinates</h3>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="centerLongitude"
                  className="block text-sm font-medium text-gray-700">
                  Longitude{" "}
                  <span className="text-red-500 font-extrabold">*</span>
                </label>
                <input
                  type="text"
                  id="centerLongitude"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm h-10 border border-gray-300 px-2"
                  placeholder="Enter your center's longitude"
                  value={centerData.longitude}
                  onChange={(e) =>
                    setCenterData({
                      ...centerData,
                      longitude: e.target.value,
                    })
                  }
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="centerLatitude"
                  className="block text-sm font-medium text-gray-700">
                  Latitude{" "}
                  <span className="text-red-500 font-extrabold">*</span>
                </label>
                <input
                  type="text"
                  id="centerLatitude"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm h-10 border border-gray-300 px-2"
                  placeholder="Enter your center's latitude"
                  value={centerData.latitude}
                  onChange={(e) =>
                    setCenterData({
                      ...centerData,
                      latitude: e.target.value,
                    })
                  }
                  required
                />
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded shadow-lg border">
            <h3 className="text-xl font-semibold mb-3">Proofs</h3>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="idProofImage"
                  className="block text-sm font-medium text-gray-700">
                  Identity Proof{" "}
                  <span className="text-red-500 font-extrabold">*</span>
                </label>
                <input
                  type="file"
                  id="idProofImage"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border border-gray-300"
                  onChange={(e) =>
                    setCenterData({
                      ...centerData,
                      idProofImage: e.target.files,
                    })
                  }
                  multiple
                  accept="image/*"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="addressProofImage"
                  className="block text-sm font-medium text-gray-700">
                  Address Proof{" "}
                  <span className="text-red-500 font-extrabold">*</span>
                </label>
                <input
                  type="file"
                  id="addressProofImage"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border border-gray-300"
                  onChange={(e) =>
                    setCenterData({
                      ...centerData,
                      addressProofImage: e.target.files,
                    })
                  }
                  multiple
                  accept="image/*"
                  required
                />
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded shadow-lg border">
            <h3 className="text-xl font-semibold mb-3">Center Images</h3>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="centerImage"
                  className="block text-sm font-medium text-gray-700">
                  Center Images{" "}
                  <span className="text-red-500 font-extrabold">*</span>
                </label>
                <input
                  type="file"
                  id="centerImage"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border border-gray-300"
                  onChange={(e) =>
                    setCenterData({
                      ...centerData,
                      centerImage: e.target.files,
                    })
                  }
                  multiple
                  accept="image/*"
                  required
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              disabled={isSubmitDisabled || isFormSubmitting}>
              {isFormSubmitting ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddNewCenter;
