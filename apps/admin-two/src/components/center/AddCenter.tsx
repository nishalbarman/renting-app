import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const ProductAdd = () => {
  const [centerData, setCenterData] = useState({
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
    longitude: "",
    latitude: "",
    addressProof: [],
    identityProof: [],
    centerImages: [],
  });

  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);

  useEffect(() => {
    let isEverythingOk =
      !!centerData?.name &&
      !!centerData?.email &&
      !!centerData?.password &&
      !!centerData?.centerName &&
      !!centerData?.streetName &&
      !!centerData?.locality &&
      !!centerData?.city &&
      !!centerData?.country &&
      !!centerData?.postalCode &&
      centerData.addressProof.length > 0 &&
      centerData.identityProof.length > 0 &&
      centerData.centerImages.length > 0 &&
      !isNaN(Number(centerData.longitude)) &&
      !isNaN(Number(centerData.latitude));
    setIsSubmitDisabled(!isEverythingOk);
  }, [centerData]);

  const [isFormSubmitting, setIsFormSubmitting] = useState(false);

  const { jwtToken } = useSelector((state) => state.auth);

  function convertImagesToBase64(imageFiles) {
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

  const handleAddCenter = async (e) => {
    e.preventDefault();
    const id = toast.loading("Sending your request.. Please wait..");

    try {
      setIsFormSubmitting(true);

      try {
        centerData.identityProof = await convertImagesToBase64(
          centerData.identityProof
        );

        centerData.addressProof = await convertImagesToBase64(
          centerData.addressProof
        );

        if (centerData.centerImages.length > 0) {
          const centerImages = await convertImagesToBase64(
            centerData.centerImages
          );
          centerData.centerImages = centerImages;
        }
      } catch (error) {
        console.error(error);
      }

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
        longitude: "",
        latitude: "",
        addressProof: [],
        identityProof: [],
        centerImages: [],
      });
      toast.update(id, {
        render: "Center Created",
        type: "success",
        isLoading: false,
        autoClose: 5000,
      });
    } catch (error) {
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
    <div className="container mx-auto p-4">
      <div className="bg-white shadow-md rounded p-6 mb-4">
        <h2 className="text-2xl font-bold mb-4">Add Center</h2>
        <p className="text-gray-600 mb-2">
          List one new center to the database
        </p>
        <p className="text-red-600 mb-4">
          &lt;All fields are required and strictly need to be filled&gt;
        </p>

        <form onSubmit={handleAddCenter} className="space-y-4">
          <div className="bg-gray-50 p-4 rounded">
            <h3 className="text-xl font-semibold mb-2">Owner Details</h3>

            <div>
              <label
                htmlFor="ownername"
                className="block text-sm font-medium text-gray-700">
                Owner Name
              </label>
              <input
                type="text"
                id="ownername"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="Ramesh"
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
                Email
              </label>
              <input
                type="email"
                id="userEmail"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
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
                Password
              </label>
              <input
                type="password"
                id="userPassword"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="Strong Password"
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
                Mobile No.
              </label>
              <input
                inputMode="numeric"
                id="userMobileNo"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="Mobile No."
                value={centerData.mobileNo}
                onChange={(e) =>
                  setCenterData({ ...centerData, mobileNo: e.target.value })
                }
                minLength={8}
                required
              />
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded">
            <h3 className="text-xl font-semibold mb-2">Center Details</h3>

            <div>
              <label
                htmlFor="centerName"
                className="block text-sm font-medium text-gray-700">
                Center Name
              </label>
              <input
                type="text"
                id="centerName"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="My Center"
                value={centerData.centerName}
                onChange={(e) =>
                  setCenterData({ ...centerData, centerName: e.target.value })
                }
                minLength={3}
                required
              />
            </div>

            <div>
              <label
                htmlFor="centerStreetName"
                className="block text-sm font-medium text-gray-700">
                Street Name
              </label>
              <input
                type="text"
                id="centerStreetName"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="Street Name"
                value={centerData.streetName}
                onChange={(e) =>
                  setCenterData({ ...centerData, streetName: e.target.value })
                }
                minLength={5}
                required
              />
            </div>

            <div>
              <label
                htmlFor="centerLocality"
                className="block text-sm font-medium text-gray-700">
                Locality
              </label>
              <input
                type="text"
                id="centerLocality"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="Locality"
                value={centerData.locality}
                onChange={(e) =>
                  setCenterData({ ...centerData, locality: e.target.value })
                }
                minLength={5}
                required
              />
            </div>

            <div>
              <label
                htmlFor="centerCity"
                className="block text-sm font-medium text-gray-700">
                City
              </label>
              <input
                type="text"
                id="centerCity"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="City"
                value={centerData.city}
                onChange={(e) =>
                  setCenterData({ ...centerData, city: e.target.value })
                }
                minLength={5}
                required
              />
            </div>

            <div>
              <label
                htmlFor="centerPostalCode"
                className="block text-sm font-medium text-gray-700">
                Postal Code
              </label>
              <input
                type="number"
                id="centerPostalCode"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="781456"
                value={centerData.postalCode}
                onChange={(e) =>
                  setCenterData({ ...centerData, postalCode: e.target.value })
                }
                minLength={7}
                maxLength={7}
                required
              />
            </div>

            <div>
              <label
                htmlFor="centerCountry"
                className="block text-sm font-medium text-gray-700">
                Country
              </label>
              <input
                type="text"
                id="centerCountry"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="Country"
                value={centerData.country}
                onChange={(e) =>
                  setCenterData({ ...centerData, country: e.target.value })
                }
                minLength={2}
                required
              />
            </div>

            <div>
              <label
                htmlFor="centerLongitude"
                className="block text-sm font-medium text-gray-700">
                Longitude
              </label>
              <input
                type="number"
                id="centerLongitude"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="Longitude"
                step="any"
                value={centerData.longitude}
                onChange={(e) =>
                  setCenterData({ ...centerData, longitude: +e.target.value })
                }
                required
              />
            </div>

            <div>
              <label
                htmlFor="centerLatitude"
                className="block text-sm font-medium text-gray-700">
                Latitude
              </label>
              <input
                type="number"
                id="centerLatitude"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="Latitude"
                step="any"
                value={centerData.latitude}
                onChange={(e) =>
                  setCenterData({ ...centerData, latitude: +e.target.value })
                }
                required
              />
            </div>

            <div>
              <label
                htmlFor="addressProof"
                className="block text-sm font-medium text-gray-700">
                Address Proof
              </label>
              <input
                type="file"
                id="addressProof"
                className="mt-1 block w-full"
                aria-label="Address Proof"
                accept="image/*"
                onChange={(e) =>
                  setCenterData({ ...centerData, addressProof: e.target.files })
                }
                required
              />
            </div>

            <div>
              <label
                htmlFor="identityProof"
                className="block text-sm font-medium text-gray-700">
                Identity Proof
              </label>
              <input
                type="file"
                id="identityProof"
                className="mt-1 block w-full"
                aria-label="Identity Proof"
                accept="image/*"
                onChange={(e) =>
                  setCenterData({
                    ...centerData,
                    identityProof: e.target.files,
                  })
                }
                required
              />
            </div>

            <div>
              <label
                htmlFor="centerImages"
                className="block text-sm font-medium text-gray-700">
                Center Images
              </label>
              <input
                type="file"
                id="centerImages"
                className="mt-1 block w-full"
                aria-label="Center Images"
                accept="image/*"
                onChange={(e) =>
                  setCenterData({ ...centerData, centerImages: e.target.files })
                }
                multiple
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
              isSubmitDisabled || isFormSubmitting
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
            disabled={isSubmitDisabled || isFormSubmitting}>
            Submit form
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProductAdd;
