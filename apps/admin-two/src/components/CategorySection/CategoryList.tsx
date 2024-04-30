import { BaseSyntheticEvent, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useAppSelector } from "@store/rtk";

import { Base64StringWithType, Category } from "../../types";

const ProductAdd = () => {
  const [categoryData, setCategoryData] = useState<Category>({
    categoryName: "",
    categoryImageUrl: [],
  });

  //   const categoryImageRef = useRef(null);

  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);

  useEffect(() => {
    let isEverythingOk =
      !!categoryData?.categoryName &&
      categoryData.categoryName.length >= 3 &&
      categoryData.categoryImageUrl !== null &&
      categoryData.categoryImageUrl.length > 0;
    setIsSubmitDisabled(!isEverythingOk);
  }, [categoryData]);

  const [isFormSubmitting, setIsFormSubmitting] = useState(false);

  const { jwtToken } = useAppSelector((state) => state.auth);

  const convertImagesToBase64 = (imageFiles: File[]) => {
    const promises = Array.from(imageFiles).map((file) => {
      return new Promise<Base64StringWithType>((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.readAsDataURL(file);
        fileReader.onload = () =>
          resolve({
            base64String: fileReader.result as string,
            type: file.type,
          });
        fileReader.onerror = (error) => reject(error);
      });
    });

    return Promise.all(promises);
  };

  const [categoryList, setCategoryList] = useState<Category[]>([]);
  const [_, setPaginationPage] = useState(1);
  // const [paginationLimit, setPaginationLimit] = useState(10);

  const [isCategoriesLoading, sestIsCategoriesLoading] = useState(true);

  const getCategories = async () => {
    try {
      sestIsCategoriesLoading(true);
      const response = await axios.get(
        `${process.env.VITE_APP_API_URL}/categories`,
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );
      setCategoryList(response.data?.categories);
      setPaginationPage(response.data?.totalPages);
    } catch (error: any) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      sestIsCategoriesLoading(false);
    }
  };

  useEffect(() => {
    getCategories();
  }, []);

  const [deleteCategoryId, setDeleteCategoryId] = useState<string | null>(null);
  const [deleteButtonLoading, setDeleteButtonLoading] = useState(false);

  const handleDeleteCategory = async () => {
    try {
      setDeleteButtonLoading(true);
      const response = await axios.delete(
        `${process.env.VITE_APP_API_URL}/categories/${deleteCategoryId}`,
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );
      console.log(response);
      toast.success("Category deleted");
      setDeleteCategoryId(null);
      getCategories();
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setDeleteButtonLoading(false);
    }
  };

  const handleAddCategory = async () => {
    try {
      setIsFormSubmitting(true);
      let categoryImageUrl: Base64StringWithType[];
      try {
        categoryImageUrl = (await convertImagesToBase64(
          categoryData.categoryImageUrl as File[]
        )) as Base64StringWithType[];
      } catch (error: any) {
        console.error(error);
        return toast.error(error.message);
      }

      const response = await axios.post(
        `${process.env.VITE_APP_API_URL}/categories`,
        {
          categoryData: { ...categoryData, categoryImageUrl },
        },
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );

      toast.success(response?.data?.message);
      setCategoryData({
        categoryName: "",
        categoryImageUrl: [],
      });
      getCategories();
    } catch (error: any) {
      console.error(error);
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Opps, Some error occured"
      );
    } finally {
      setIsFormSubmitting(false);
    }
  };

  const [updateCategoryId, setUpdateCategoryId] = useState<undefined | string>(
    undefined
  );

  const handleUpdateCategory = async () => {
    try {
      setIsFormSubmitting(true);

      if (!!(categoryData?.categoryImageUrl as File[]).length) {
        try {
          categoryData.categoryImageUrl = (await convertImagesToBase64(
            categoryData.categoryImageUrl as File[]
          )) as Base64StringWithType[];
        } catch (error: any) {
          console.error(error);
          toast.error(error.message);
        }
      }

      const response = await axios.patch(
        `${process.env.VITE_APP_API_URL}/categories/update/${updateCategoryId}`,
        {
          categoryData,
        },
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );
      toast.success(response?.data?.message);
      setCategoryData({
        categoryName: "",
        categoryImageUrl: [],
      });

      setUpdateCategoryId(undefined);
      getCategories();
    } catch (error: any) {
      console.error(error);
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Opps, Some error occured"
      );
    } finally {
      setIsFormSubmitting(false);
    }
  };

  const handleCategorySubmit = (e: BaseSyntheticEvent) => {
    e.preventDefault();
    if (!!updateCategoryId) {
      handleUpdateCategory();
    } else {
      handleAddCategory();
    }
  };

  return (
    <div className="flex flex-col flex-1 p-3 md:p-6 bg-gray-100 ml-64 max-md:ml-0">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Category</h1>
        {/* <div>
          <input
            type="text"
            placeholder="Type anywhere to search"
            className="px-4 py-2 border border-gray-300 rounded-md"
          />
        </div> */}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
        <div>
          <div className="bg-white shadow-md rounded-md p-4">
            <h2 className="text-lg font-semibold mb-2">
              {!updateCategoryId ? "Add Category" : "Update Category"}
            </h2>
            {!updateCategoryId ? (
              <p className="text-gray-500 text-md">
                List one new category to database
              </p>
            ) : (
              <>
                <p className="text-gray-700 text-lg">
                  Update information:{" "}
                  <strong>{categoryData.categoryName}</strong>
                </p>
                <ul className="list-disc list-inside mt-1">
                  <li className="text-gray-500 text-md">
                    <code>
                      &lt;You can update the category name or category image
                      both or anyone of them. name&gt;
                    </code>
                    <code>
                      &lt;Click on the submit button after filling the required
                      updated details, It's done!&gt;
                    </code>
                  </li>
                </ul>
              </>
            )}

            <form onSubmit={handleCategorySubmit} className="mt-4">
              <div className="mb-4">
                <label
                  htmlFor="categoryName"
                  className="block font-semibold mb-1">
                  Category Name
                </label>
                <input
                  type="text"
                  id="categoryName"
                  placeholder={!!updateCategoryId ? "Updated name" : "Category"}
                  value={categoryData.categoryName}
                  onChange={(e) => {
                    setCategoryData((prev) => {
                      return { ...prev, categoryName: e.target.value };
                    });
                  }}
                  minLength={3}
                  required
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {!updateCategoryId && (
                  <p className="text-red-500 text-sm mt-1">
                    Please provide a valid category name with minimum length of
                    3 characters.
                  </p>
                )}
              </div>
              <div className="mb-4">
                <label
                  htmlFor="previewImage"
                  className="block font-semibold mb-1">
                  Category Image
                </label>
                <input
                  type="file"
                  id="previewImage"
                  aria-label="Preview Image"
                  accept="image/*"
                  onChange={(e) => {
                    setCategoryData((prev) => {
                      return { ...prev, categoryImageUrl: e.target.files };
                    });
                  }}
                  required={!updateCategoryId}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {!updateCategoryId && (
                  <p className="text-red-500 text-sm mt-1">
                    Only image files are allowed (.jpg, .jpeg, .png, .gif)
                  </p>
                )}
              </div>

              <div className="flex space-x-2">
                <button
                  type="submit"
                  disabled={
                    !updateCategoryId && (isSubmitDisabled || isFormSubmitting)
                  }
                  className={`px-4 py-2 rounded-md text-white ${
                    !updateCategoryId && (isSubmitDisabled || isFormSubmitting)
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-blue-500 hover:bg-blue-600"
                  }`}>
                  {!!updateCategoryId ? "Update Category" : "Submit"}
                </button>

                <button
                  onClick={() => {
                    setCategoryData({
                      categoryName: "",
                      categoryImageUrl: [],
                    });
                    setUpdateCategoryId(undefined);
                  }}
                  disabled={
                    !updateCategoryId && (isSubmitDisabled || isFormSubmitting)
                  }
                  className={`px-4 py-2 rounded-md text-white ${
                    !updateCategoryId && (isSubmitDisabled || isFormSubmitting)
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-red-500 hover:bg-red-600"
                  }`}>
                  Clear
                </button>
              </div>
            </form>
          </div>
        </div>

        <div>
          <div className="bg-white shadow-md rounded-md p-4">
            <h2 className="text-lg font-semibold mb-4">Categories</h2>
            {isCategoriesLoading ? (
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <div className=" overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 bg-gray-100 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        SL.
                      </th>
                      <th className="px-6 py-3 bg-gray-100 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <i className="cil-apps text-gray-500"></i>
                      </th>
                      <th className="px-6 py-3 bg-gray-100 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 bg-gray-100 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Key
                      </th>
                      <th className="px-6 py-3 bg-gray-100 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Dates
                      </th>
                      <th className="px-6 py-3 bg-gray-100 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Activity
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {categoryList?.map((item, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                          {index + 1}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <img
                            src={item.categoryImageUrl as string}
                            alt={item.categoryName}
                            className="w-12 h-12 rounded-full"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {item.categoryName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {item.categoryKey}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div>Created: {item.createdAt}</div>
                          <div>Last Updated: {item.updatedAt}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-center space-x-2">
                            <button
                              onClick={() => {
                                setUpdateCategoryId(item._id);
                                setCategoryData((prev) => {
                                  return {
                                    ...prev,
                                    categoryName: item.categoryName,
                                  };
                                });
                              }}
                              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded">
                              Edit
                            </button>
                            <button
                              onClick={() => {
                                setDeleteCategoryId(item._id as string);
                              }}
                              className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded">
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>{" "}
              </div>
            )}
          </div>
        </div>
      </div>

      {deleteCategoryId && (
        <div className="fixed inset-0 z-50 overflow-auto bg-gray-800 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto">
            <h3 className="text-lg font-semibold mb-4">
              Are you sure about that?
            </h3>
            <p className="text-gray-700">
              Deleting this category will remove this category from database
            </p>
            <div className="mt-6 flex justify-end space-x-2">
              <button
                onClick={() => setDeleteCategoryId(null)}
                className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded">
                Close
              </button>
              <button
                disabled={deleteButtonLoading}
                onClick={handleDeleteCategory}
                className={`bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded ${
                  deleteButtonLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}>
                {deleteButtonLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                  </div>
                ) : (
                  "Delete"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductAdd;
