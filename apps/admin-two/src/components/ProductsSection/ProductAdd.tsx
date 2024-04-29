import React, { useEffect, useMemo, useState } from "react";

import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import axios from "axios";
import { useSelector } from "react-redux";

import { toast } from "react-toastify";

type ProductAddProps = {
  loading?: boolean | undefined;
  setIsUpdateLoading?: any | undefined;
  fetchProductData?: any;
  setVisible?: any;
};

const ProductAdd = ({
  loading = undefined,
  setIsUpdateLoading = undefined,
  fetchProductData = undefined,
  setVisible = undefined,
}: ProductAddProps) => {
  const [updateProductId, setUpdateProductId] = useState(null);

  const [variantQuantity, setVariantQuantity] = useState();

  const [productData, setProductData] = useState({
    title: "",
    previewImage: [],
    slideImages: [],
    description: "",
    category: "",
    productType: "",
    rentingPrice: "",
    discountedPrice: "",
    originalPrice: "",
    shippingPrice: "",
    availableStocks: "",
    isVariantAvailable: false,
    productVariant: {},
  });

  const [categoryList, setCategoryList] = useState([]);

  // ! Fetch category logic
  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        const response = await axios.get(
          `${process.env.VITE_APP_API_URL}/categories`,
          {
            headers: {
              Authorization: `Bearer ${jwtToken}`,
            },
          }
        );
        setCategoryList(response.data.categories);
      } catch (error) {
        console.error(error);
        toast.error(
          error.response.data?.message || "Some unknown error occured"
        );
      }
    };

    fetchCategoryData();
  }, []);

  // ! Update product logic
  useEffect(() => {
    const id = sessionStorage.getItem("productId") || null;
    setUpdateProductId(id);

    if (!!id) {
      const fetchData = async () => {
        try {
          const response = await axios.get(
            `${process.env.VITE_APP_API_URL}/products/admin-view/${id}`,
            {
              headers: {
                Authorization: `Bearer ${jwtToken}`,
              },
            }
          );

          const product = response.data.product;

          setProductData({
            title: product.title,
            previewImage: [],
            slideImages: [],
            description: product.description,
            category: product.category,
            productType: product.productType,
            rentingPrice: product.rentingPrice,
            discountedPrice: product.discountedPrice,
            originalPrice: product.originalPrice,
            shippingPrice: product.shippingPrice,
            availableStocks: product.availableStocks,
            isVariantAvailable: product.isVariantAvailable,
            productVariant:
              product.productVariant.length > 0
                ? product.productVariant.reduce((acc, variant, index) => {
                    variant.previewImage = [];
                    variant.slideImages = [];
                    return { ...acc, [`variant_no_${index}`]: variant };
                  }, {})
                : {},
          });

          setVariantQuantity(product?.productVariant?.length || 0);
          if (typeof setIsFormSubmitting !== undefined)
            setIsUpdateLoading(false);
        } catch (error) {
          console.error(error);
        }
      };
      fetchData();
    }
  }, []);

  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);

  useEffect(() => {
    let isEverythingOk =
      !!productData?.title &&
      productData.title.length >= 10 &&
      productData.previewImage.length > 0 &&
      productData.slideImages.length > 0 &&
      productData.description?.length > 5 &&
      !!productData.category &&
      !!productData.productType &&
      !isNaN(Number(productData.rentingPrice)) &&
      !isNaN(Number(productData.discountedPrice)) &&
      !isNaN(Number(productData.originalPrice)) &&
      +productData.discountedPrice < +productData.originalPrice;

    // if (productData.isVariantAvailable) {
    //   isEverythingOk =
    //     isEverythingOk && Object.keys(productData.productVariant).length === variantQuantity
    // }

    setIsSubmitDisabled(!isEverythingOk);
  }, [productData]);

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

  const handleAddProduct = async () => {
    try {
      productData.previewImage = await convertImagesToBase64(
        productData.previewImage
      );

      if (productData.slideImages.length > 0) {
        const slideImages = await convertImagesToBase64(
          productData.slideImages
        );
        productData.slideImages = slideImages;
      }

      const variants = Object.values(productData.productVariant);

      for (let i = 0; i < variants.length; i++) {
        variants[i].previewImage = await convertImagesToBase64(
          variants[i].previewImage
        );
        if (variants[i].slideImages.length > 0) {
          const slideImages = await convertImagesToBase64(
            variants[i].slideImages
          );
          variants[i].slideImages = slideImages;
        }
      }
    } catch (error) {
      console.error(error);
    }

    // console.log(productData)

    const response = await axios.post(
      `${process.env.VITE_APP_API_URL}/products`,
      {
        productData,
      },
      {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      }
    );
  };

  const handleUpdateProduct = async () => {
    try {
      if (!!productData.previewImage.length) {
        productData.previewImage = await convertImagesToBase64(
          productData.previewImage
        );
      }

      if (productData.slideImages.length) {
        const slideImages = await convertImagesToBase64(
          productData.slideImages
        );
        productData.slideImages = slideImages;
      }

      const variants = Object.values(productData.productVariant);

      for (let i = 0; i < variants.length; i++) {
        if (variants[i].previewImage.length) {
          variants[i].previewImage = await convertImagesToBase64(
            variants[i].previewImage
          );
        }

        if (variants[i].slideImages.length > 0) {
          const slideImages = await convertImagesToBase64(
            variants[i].slideImages
          );
          variants[i].slideImages = slideImages;
        }
      }
    } catch (error) {
      console.error(error);
    }

    console.log(productData);

    const response = await axios.patch(
      `${process.env.VITE_APP_API_URL}/products/update/${updateProductId}`,
      {
        productData,
      },
      {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      }
    );
    if (typeof fetchProductData !== undefined) {
      fetchProductData();
    }

    if (typeof setVisible !== undefined) {
      setVisible(false);
    }
    sessionStorage.removeItem("productId");
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    const id = toast.loading("Sending your request.. Please wait..");
    try {
      setIsFormSubmitting(true);
      if (!!updateProductId) {
        await handleUpdateProduct();
        toast.update(id, {
          render: "Product Updated",
          type: "success",
          isLoading: false,
          autoClose: 5000,
        });
      } else {
        await handleAddProduct();
        toast.update(id, {
          render: "Product Created",
          type: "success",
          isLoading: false,
          autoClose: 5000,
        });
      }
    } catch (error) {
      console.error(error);
      toast.error();
      toast.update(id, {
        render:
          error.response?.data?.message ||
          error.message ||
          "Opps, Some error occured",
        type: "error",
        isLoading: false,
        closeOnClick: true,
      });
    } finally {
      setIsFormSubmitting(false);
    }
  };

  return (
    <div
      className={`flex flex-col flex-1 p-6 bg-gray-100 ${!updateProductId && "ml-64"} max-md:ml-0`}>
      <div className="bg-white shadow-md rounded p-6 mb-4">
        <h2 className="text-2xl font-bold mb-4">
          {!updateProductId ? "Add Product" : "Update Product"}
        </h2>
        <form onSubmit={handleProductSubmit} className="space-y-6">
          <div className="bg-white p-4 rounded shadow-lg border">
            <h3 className="text-xl font-semibold mb-3">Product Details</h3>

            {/* <div className="grid grid-cols-1 gap-4 sm:grid-cols-2"> */}
            <div className="mb-3">
              <label
                htmlFor="productTitle"
                className="block text-sm font-medium text-gray-700">
                Product Title{" "}
                {!updateProductId && (
                  <span className="text-red-500 font-extrabold">*</span>
                )}
              </label>
              <input
                type="text"
                id="productTitle"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm h-10 border border-gray-300 px-2"
                placeholder="Enter your product title here"
                value={productData.title}
                onChange={(e) => {
                  setProductData((prev) => {
                    return { ...prev, title: e.target.value };
                  });
                }}
                minLength={10}
                required={!updateProductId}
              />
            </div>

            <div className="mb-3">
              <label
                htmlFor="productDescription"
                className="block text-sm font-medium text-gray-700 mb-1">
                Description{" "}
                {!updateProductId && (
                  <span className="text-red-500 font-extrabold">*</span>
                )}
              </label>
              <CKEditor
                id={"productDescription"}
                editor={ClassicEditor}
                data={productData?.description}
                onReady={(editor) => {
                  // You can store the "editor" and use when it is needed.
                  console.log("Editor is ready to use!", editor);
                }}
                onChange={(e, editor) => {
                  setProductData((prev) => {
                    return { ...prev, description: editor.getData() };
                  });
                }}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="centerCategory"
                  className="block text-sm font-medium text-gray-700">
                  Category{" "}
                  {!updateProductId && (
                    <span className="text-red-500 font-extrabold">*</span>
                  )}
                </label>
                <select
                  id="centerCategory"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm h-10 border border-gray-300 px-2"
                  value={productData?.category?._id}
                  onChange={(e) => {
                    setProductData((prev) => {
                      return { ...prev, category: e.target.value };
                    });
                  }}
                  required={!updateProductId}
                  aria-label="Product Category">
                  <option>Select Category</option>
                  {categoryList?.map((category) => (
                    <option
                      key={category?._id?.toString()}
                      value={category._id}>
                      {category.categoryName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="productType"
                  className="block text-sm font-medium text-gray-700">
                  Product Type{" "}
                  {!updateProductId && (
                    <span className="text-red-500 font-extrabold">*</span>
                  )}
                </label>
                <select
                  id="productType"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm h-10 border border-gray-300 px-2"
                  value={productData.productType}
                  onChange={(e) => {
                    setProductData((prev) => {
                      return { ...prev, productType: e.target.value };
                    });
                  }}
                  required={!updateProductId}
                  aria-label="Product Type">
                  <option>Select Product Type</option>
                  <option value="rent">Rent</option>
                  <option value="buy">Buy</option>
                  <option value="both">Both Rent and Buy</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded shadow-lg border">
            <h3 className="text-xl font-semibold mb-3">Product Images</h3>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="productPreviewImage"
                  className="block text-sm font-medium text-gray-700">
                  Preview Image{" "}
                  {!updateProductId && (
                    <span className="text-red-500 font-extrabold">*</span>
                  )}
                </label>
                <input
                  type="file"
                  id="productPreviewImage"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border border-gray-300"
                  aria-label="Preview Image"
                  accept="image/*"
                  onChange={(e) => {
                    setProductData((prev) => {
                      return { ...prev, previewImage: e.target.files };
                    });
                  }}
                  required={!updateProductId}
                />
              </div>

              <div>
                <label
                  htmlFor="productSlideImage"
                  className="block text-sm font-medium text-gray-700">
                  Slider Images{" "}
                  {!updateProductId && (
                    <span className="text-red-500 font-extrabold">*</span>
                  )}
                </label>
                <input
                  type="file"
                  id="productSlideImage"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border border-gray-300"
                  aria-label="Slide Images"
                  accept="image/*"
                  onChange={(e) => {
                    setProductData((prev) => {
                      return { ...prev, slideImages: e.target.files };
                    });
                  }}
                  multiple={true}
                  required={!updateProductId}
                />
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded shadow-lg border">
            <h3 className="text-xl font-semibold mb-3">Product Pricing</h3>

            <div className="mb-2 bg-green-200 p-3 rounded-md">
              <p className="text-body-secondary small">
                <strong>
                  Below are the instructions how to fill the pricing fields.
                </strong>
              </p>
              <ul>
                <li>
                  <code>Rent Price is the default rent price</code>
                </li>
                <li>
                  <code>
                    Buy price is the discounted buying price of the product
                  </code>
                </li>
                <li>
                  <code>
                    Original Price is the original price or MRP price of the
                    product
                  </code>
                </li>
                <li>
                  <code>
                    Shipping price is the shipping price for an product,
                    shipping price will only be applied to buy products. Rent
                    products will have 0 as shipping price as it is going to be
                    picked by user from `Center`
                  </code>
                </li>
              </ul>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="productRentPrice"
                  className="block text-sm font-medium text-gray-700">
                  Rent Price{" "}
                  {!updateProductId && (
                    <span className="text-red-500 font-extrabold">*</span>
                  )}
                </label>
                <input
                  id="productRentPrice"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm h-10 border border-gray-300 px-2"
                  placeholder="Enter renting price for product"
                  value={productData.rentingPrice}
                  onChange={(e) => {
                    setProductData((prev) => {
                      return { ...prev, rentingPrice: +e.target.value || "" };
                    });
                  }}
                  onWheel={(e) => {
                    e.preventDefault();
                  }}
                  type="number"
                  required={!updateProductId}
                />
              </div>

              <div>
                <label
                  htmlFor="productPurchasePrice"
                  className="block text-sm font-medium text-gray-700">
                  Purchasable Price{" "}
                  {!updateProductId && (
                    <span className="text-red-500 font-extrabold">*</span>
                  )}
                </label>
                <input
                  id="productPurchasePrice"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm h-10 border border-gray-300 px-2"
                  placeholder="Enter purchasable price for product"
                  value={productData.discountedPrice}
                  onWheel={(e) => {
                    e.preventDefault();
                  }}
                  onChange={(e) => {
                    setProductData((prev) => {
                      return {
                        ...prev,
                        discountedPrice: +e.target.value || "",
                      };
                    });
                  }}
                  type="number"
                  required={!updateProductId}
                />
              </div>

              <div>
                <label
                  htmlFor="producOriginalMRP"
                  className="block text-sm font-medium text-gray-700">
                  Original MRP{" "}
                  {!updateProductId && (
                    <span className="text-red-500 font-extrabold">*</span>
                  )}
                </label>
                <input
                  id="producOriginalMRP"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm h-10 border border-gray-300 px-2"
                  placeholder="Enter orignal MRP of product"
                  value={productData.originalPrice}
                  onWheel={(e) => {
                    e.preventDefault();
                  }}
                  onChange={(e) => {
                    setProductData((prev) => {
                      return { ...prev, originalPrice: +e.target.value || "" };
                    });
                  }}
                  type="number"
                  required={!updateProductId}
                />
              </div>

              <div>
                <label
                  htmlFor="productShippingPrice"
                  className="block text-sm font-medium text-gray-700">
                  Delivery Charge{" "}
                  {!updateProductId && (
                    <span className="text-red-500 font-extrabold">*</span>
                  )}
                </label>
                <input
                  id="productShippingPrice"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm h-10 border border-gray-300 px-2"
                  placeholder="Enter delivery charge of product"
                  value={productData.shippingPrice}
                  onWheel={(e) => {
                    e.preventDefault();
                  }}
                  onChange={(e) => {
                    setProductData((prev) => {
                      return { ...prev, shippingPrice: +e.target.value || "" };
                    });
                  }}
                  type="number"
                  required={!updateProductId}
                />
              </div>

              <div>
                <label
                  htmlFor="productAvailableStocks"
                  className="block text-sm font-medium text-gray-700">
                  Available Stocks{" "}
                  {!updateProductId && (
                    <span className="text-red-500 font-extrabold">*</span>
                  )}
                </label>
                <input
                  id="productAvailableStocks"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm h-10 border border-gray-300 px-2"
                  placeholder="Enter available stocks of the product"
                  value={productData.availableStocks}
                  onChange={(e) => {
                    setProductData((prev) => {
                      return {
                        ...prev,
                        availableStocks: +e.target.value || "" || "",
                      };
                    });
                  }}
                  type="number"
                  required={!updateProductId}
                />
              </div>
            </div>
          </div>

          {!updateProductId ||
          (!!updateProductId &&
            Object.keys(productData.productVariant).length > 0) ? (
            <div className="bg-white p-4 rounded shadow-lg border">
              <h3 className="text-xl font-semibold mb-3">
                Variant Information
              </h3>

              <div className="mb-2 bg-green-200 p-3 rounded-md">
                <p className="text-body-secondary ">
                  <strong>
                    Product variants are different product sizes and colors.
                    Each different product variant has different pricing
                    infomation and has different preview images
                  </strong>
                </p>
                <ul>
                  <li>
                    <code>Click the chekbox if you want to add variants</code>
                  </li>
                  <li>
                    <code>
                      Enter the number of variants you need beside the checkbox
                      to populate variant filling boxes
                    </code>
                  </li>
                </ul>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="variantRequiredConfirm"
                    className="block text-sm font-medium text-gray-700 mb-2">
                    Does Variant Required ?
                  </label>
                  <div className="flex items-center mb-3">
                    <div className="flex items-center p-2 border border-gray-300 rounded-md">
                      <input
                        id="variantCheckbox"
                        type="checkbox"
                        className="form-checkbox h-6 w-6 text-blue-600"
                        onChange={(e) => {
                          setProductData((prev) => {
                            return {
                              ...prev,
                              isVariantAvailable: e.target.checked,
                            };
                          });
                        }}
                        checked={!!productData?.isVariantAvailable}
                        aria-label="Product Variant Checkbox"
                        disabled={!!updateProductId}
                      />
                    </div>
                    {productData.isVariantAvailable && (
                      <input
                        type="number"
                        className="form-input ml-2 p-2 border border-gray-300 rounded-md flex-1"
                        onChange={(e) => {
                          setVariantQuantity(e.target.value);
                        }}
                        value={variantQuantity}
                        onWheel={(e) => {
                          e.preventDefault();
                        }}
                        min={0}
                        placeholder="Number of variants requried"
                        aria-label="Variant quantity"
                      />
                    )}
                  </div>

                  {!!productData?.isVariantAvailable && (
                    <p className="text-body-secondary ">
                      Fill the variant details:
                    </p>
                  )}
                </div>
              </div>

              {!!productData?.isVariantAvailable && (
                <div className="grid grid-cols-1 grid-flow-rows gap-4 md:grid-cols-2 w-full border p-2 rounded-sm">
                  {Array.from({ length: variantQuantity }).map(
                    (item, index) => {
                      return (
                        <div className="grow">
                          <div className="w-full p-3 bg-orange-300 rounded-t-md">
                            <p className="">
                              <strong>Variant No. {index + 1}</strong>
                            </p>
                          </div>
                          <div className="bg-white p-4 rounded shadow-lg border">
                            <h3 className="text-xl font-semibold mb-3">
                              Variant Images
                            </h3>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                              <div>
                                <label
                                  htmlFor={`variantPreviewImages-${index + 1}`}
                                  className="block text-sm font-medium text-gray-700">
                                  Preview Image{" "}
                                  {!updateProductId && (
                                    <span className="text-red-500 font-extrabold">
                                      *
                                    </span>
                                  )}
                                </label>
                                <input
                                  id={`variantPreviewImages-${index + 1}`}
                                  type="file"
                                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border border-gray-300"
                                  aria-label="Variant Preview Image"
                                  accept="image/*"
                                  onChange={(e) => {
                                    setProductData((prev) => {
                                      return {
                                        ...prev,
                                        productVariant: {
                                          ...prev.productVariant,
                                          [`variant_no_${index}`]: {
                                            ...prev.productVariant[
                                              `variant_no_${index}`
                                            ],
                                            previewImage: Array.from(
                                              e.target.files
                                            ),
                                          },
                                        },
                                      };
                                    });
                                  }}
                                  required={!updateProductId}
                                />

                                {/* <div className="flex items-center justify-center w-fit h-fit">
                              <label
                                htmlFor={`variantPreviewImages-${index + 1}`}
                                className="cursor-pointer bg-white p-8 rounded-md border-2 border-dashed border-gray-600 shadow-md mt-1"> {!updateProductId && <span className="text-red-500 font-extrabold">*</span>}
                                <div className="flex flex-col items-center justify-center gap-1">
                                  <svg
                                    viewBox="0 0 640 512"
                                    className="h-12 mb-5 fill-gray-600">
                                    <path d="M144 480C64.5 480 0 415.5 0 336c0-62.8 40.2-116.2 96.2-135.9c-.1-2.7-.2-5.4-.2-8.1c0-88.4 71.6-160 160-160c59.3 0 111 32.2 138.7 80.2C409.9 102 428.3 96 448 96c53 0 96 43 96 96c0 12.2-2.3 23.8-6.4 34.6C596 238.4 640 290.1 640 352c0 70.7-57.3 128-128 128H144zm79-217c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l39-39V392c0 13.3 10.7 24 24 24s24-10.7 24-24V257.9l39 39c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-80-80c-9.4-9.4-24.6-9.4-33.9 0l-80 80z"></path>
                                  </svg>
                                  <p>Drag and Drop</p>
                                  <p>or</p>
                                  <span className="bg-gray-600 text-white py-1 px-3 rounded-lg transition-all duration-300 hover:bg-gray-800">
                                    Browse file
                                  </span>
                                </div>
                                <input
                                  id={`variantPreviewImages-${index + 1}`}
                                  type="file"
                                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border border-gray-300 hidden"
                                  aria-label="Variant Preview Image"
                                  accept="image/*"
                                  onChange={(e) => {
                                    setProductData((prev) => {
                                      return {
                                        ...prev,
                                        productVariant: {
                                          ...prev.productVariant,
                                          [`variant_no_${index}`]: {
                                            ...prev.productVariant[
                                              `variant_no_${index}`
                                            ],
                                            previewImage: Array.from(
                                              e.target.files
                                            ),
                                          },
                                        },
                                      };
                                    });
                                  }}
                                  required={!updateProductId}
                                />
                              </label>
                            </div> */}
                              </div>

                              <div>
                                <label
                                  htmlFor={`variantSlideImages-${index + 1}`}
                                  className="block text-sm font-medium text-gray-700">
                                  Slider Images{" "}
                                  {!updateProductId && (
                                    <span className="text-red-500 font-extrabold">
                                      *
                                    </span>
                                  )}
                                </label>
                                <input
                                  id={`variantSlideImages-${index + 1}`}
                                  type="file"
                                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border border-gray-300"
                                  aria-label="Variant Slide Images"
                                  accept="image/*"
                                  onChange={(e) => {
                                    setProductData((prev) => {
                                      return {
                                        ...prev,
                                        productVariant: {
                                          ...prev.productVariant,
                                          [`variant_no_${index}`]: {
                                            ...prev.productVariant[
                                              `variant_no_${index}`
                                            ],
                                            slideImages: Array.from(
                                              e.target.files
                                            ),
                                          },
                                        },
                                      };
                                    });
                                  }}
                                  multiple
                                  required={!updateProductId}
                                />

                                {/* <div className="flex items-center justify-center w-fit h-fit">
                              <label
                                htmlFor={`variantSlideImages-${index + 1}`}
                                className="cursor-pointer bg-white p-8 rounded-md border-2 border-dashed border-gray-600 shadow-md mt-1"> {!updateProductId && <span className="text-red-500 font-extrabold">*</span>}
                                <div className="flex flex-col items-center justify-center gap-1">
                                  <svg
                                    viewBox="0 0 640 512"
                                    className="h-12 mb-5 fill-gray-600">
                                    <path d="M144 480C64.5 480 0 415.5 0 336c0-62.8 40.2-116.2 96.2-135.9c-.1-2.7-.2-5.4-.2-8.1c0-88.4 71.6-160 160-160c59.3 0 111 32.2 138.7 80.2C409.9 102 428.3 96 448 96c53 0 96 43 96 96c0 12.2-2.3 23.8-6.4 34.6C596 238.4 640 290.1 640 352c0 70.7-57.3 128-128 128H144zm79-217c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l39-39V392c0 13.3 10.7 24 24 24s24-10.7 24-24V257.9l39 39c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-80-80c-9.4-9.4-24.6-9.4-33.9 0l-80 80z"></path>
                                  </svg>
                                  <p>Drag and Drop</p>
                                  <p>or</p>
                                  <span className="bg-gray-600 text-white py-1 px-3 rounded-lg transition-all duration-300 hover:bg-gray-800">
                                    Browse file
                                  </span>
                                </div>
                                <input
                                  id={`variantSlideImages-${index + 1}`}
                                  type="file"
                                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border border-gray-300 hidden"
                                  aria-label="Variant Slide Images"
                                  accept="image/*"
                                  onChange={(e) => {
                                    setProductData((prev) => {
                                      return {
                                        ...prev,
                                        productVariant: {
                                          ...prev.productVariant,
                                          [`variant_no_${index}`]: {
                                            ...prev.productVariant[
                                              `variant_no_${index}`
                                            ],
                                            slideImages: Array.from(
                                              e.target.files
                                            ),
                                          },
                                        },
                                      };
                                    });
                                  }}
                                  multiple
                                  required={!updateProductId}
                                />
                              </label>
                            </div> */}
                              </div>
                            </div>
                          </div>

                          <div className="bg-white p-4 rounded shadow-lg border">
                            <h3 className="text-xl font-semibold mb-3">
                              Variant Pricing
                            </h3>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                              <div>
                                <label
                                  htmlFor={`variantRentablePrice-${index + 1}`}
                                  className="block text-sm font-medium text-gray-700">
                                  Rent Price{" "}
                                  {!updateProductId && (
                                    <span className="text-red-500 font-extrabold">
                                      *
                                    </span>
                                  )}
                                </label>
                                <input
                                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm h-10 border border-gray-300 px-2"
                                  placeholder="Enter renting price for variant"
                                  value={
                                    productData?.productVariant[
                                      `variant_no_${index}`
                                    ]?.rentingPrice
                                  }
                                  onChange={(e) => {
                                    setProductData((prev) => {
                                      return {
                                        ...prev,
                                        productVariant: {
                                          ...prev.productVariant,
                                          [`variant_no_${index}`]: {
                                            ...prev.productVariant[
                                              `variant_no_${index}`
                                            ],
                                            rentingPrice:
                                              +e.target.value || "" || "",
                                          },
                                        },
                                      };
                                    });
                                  }}
                                  onWheel={(e) => {
                                    e.preventDefault();
                                  }}
                                  type="number"
                                  id={`variantRentablePrice-${index + 1}`}
                                  required={!updateProductId}
                                />
                              </div>

                              <div>
                                <label
                                  htmlFor={`variantPurchasablePrice-${index + 1}`}
                                  className="block text-sm font-medium text-gray-700">
                                  Purchasable Price{" "}
                                  {!updateProductId && (
                                    <span className="text-red-500 font-extrabold">
                                      *
                                    </span>
                                  )}
                                </label>
                                <input
                                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm h-10 border border-gray-300 px-2"
                                  placeholder="Enter purchasable price for product"
                                  value={
                                    productData?.productVariant[
                                      `variant_no_${index}`
                                    ]?.discountedPrice
                                  }
                                  onChange={(e) => {
                                    setProductData((prev) => {
                                      return {
                                        ...prev,
                                        productVariant: {
                                          ...prev.productVariant,
                                          [`variant_no_${index}`]: {
                                            ...prev.productVariant[
                                              `variant_no_${index}`
                                            ],
                                            discountedPrice:
                                              +e.target.value || "",
                                          },
                                        },
                                      };
                                    });
                                  }}
                                  onWheel={(e) => {
                                    e.preventDefault();
                                  }}
                                  type="number"
                                  id={`variantPurchasablePrice-${index + 1}`}
                                />
                              </div>

                              <div>
                                <label
                                  htmlFor={`variantOriginalMRP-${index + 1}`}
                                  className="block text-sm font-medium text-gray-700">
                                  Original MRP{" "}
                                  {!updateProductId && (
                                    <span className="text-red-500 font-extrabold">
                                      *
                                    </span>
                                  )}
                                </label>
                                <input
                                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm h-10 border border-gray-300 px-2"
                                  placeholder="Enter orignal MRP of product"
                                  value={
                                    productData?.productVariant[
                                      `variant_no_${index}`
                                    ]?.originalPrice
                                  }
                                  onChange={(e) => {
                                    setProductData((prev) => {
                                      return {
                                        ...prev,
                                        productVariant: {
                                          ...prev.productVariant,
                                          [`variant_no_${index}`]: {
                                            ...prev.productVariant[
                                              `variant_no_${index}`
                                            ],
                                            originalPrice:
                                              +e.target.value || "",
                                          },
                                        },
                                      };
                                    });
                                  }}
                                  onWheel={(e) => {
                                    e.preventDefault();
                                  }}
                                  type="number"
                                  id={`variantOriginalMRP-${index + 1}`}
                                  required={!updateProductId}
                                />
                              </div>

                              <div>
                                <label
                                  htmlFor={`variantDeliveryCharges-${index + 1}`}
                                  className="block text-sm font-medium text-gray-700">
                                  Delivery Charge{" "}
                                  {!updateProductId && (
                                    <span className="text-red-500 font-extrabold">
                                      *
                                    </span>
                                  )}
                                </label>
                                <input
                                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm h-10 border border-gray-300 px-2"
                                  placeholder="Enter delivery charge of product"
                                  value={
                                    productData?.productVariant[
                                      `variant_no_${index}`
                                    ]?.shippingPrice
                                  }
                                  onChange={(e) => {
                                    setProductData((prev) => {
                                      return {
                                        ...prev,
                                        productVariant: {
                                          ...prev.productVariant,
                                          [`variant_no_${index}`]: {
                                            ...prev.productVariant[
                                              `variant_no_${index}`
                                            ],
                                            shippingPrice:
                                              +e.target.value || "",
                                          },
                                        },
                                      };
                                    });
                                  }}
                                  onWheel={(e) => {
                                    e.preventDefault();
                                  }}
                                  type="number"
                                  id={`variantDeliveryCharges-${index + 1}`}
                                  required={!updateProductId}
                                />
                              </div>
                            </div>
                          </div>

                          <div className="bg-white p-4 rounded shadow-lg border">
                            <h3 className="text-xl font-semibold mb-3">
                              Variants Stocks
                            </h3>

                            <div>
                              <label
                                htmlFor={`variantAvailableStocks-${index + 1}`}
                                className="block text-sm font-medium text-gray-700">
                                Available Stocks{" "}
                                {!updateProductId && (
                                  <span className="text-red-500 font-extrabold">
                                    *
                                  </span>
                                )}
                              </label>
                              <input
                                id={`variantAvailableStocks-${index + 1}`}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm h-10 border border-gray-300 px-2"
                                placeholder="Enter available stocks of the variant"
                                value={
                                  productData?.productVariant[
                                    `variant_no_${index}`
                                  ]?.availableStocks
                                }
                                onChange={(e) => {
                                  setProductData((prev) => {
                                    return {
                                      ...prev,
                                      productVariant: {
                                        ...prev.productVariant,
                                        [`variant_no_${index}`]: {
                                          ...prev.productVariant[
                                            `variant_no_${index}`
                                          ],
                                          availableStocks:
                                            +e.target.value || "",
                                        },
                                      },
                                    };
                                  });
                                }}
                                type="number"
                                required={!updateProductId}
                              />
                            </div>
                          </div>

                          <div className="bg-white p-4 rounded shadow-lg border">
                            <h3 className="text-xl font-semibold mb-3">
                              Variation
                            </h3>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                              <div>
                                <label
                                  htmlFor={`variantColor-${index + 1}`}
                                  className="block text-sm font-medium text-gray-700">
                                  Color{" "}
                                  {!updateProductId && (
                                    <span className="text-red-500 font-extrabold">
                                      *
                                    </span>
                                  )}
                                </label>
                                <input
                                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm h-10 border border-gray-300 px-2"
                                  // placeholder="Enter color for product variant"
                                  value={
                                    productData?.productVariant[
                                      `variant_no_${index}`
                                    ]?.color
                                  }
                                  onChange={(e) => {
                                    setProductData((prev) => {
                                      return {
                                        ...prev,
                                        productVariant: {
                                          ...prev.productVariant,
                                          [`variant_no_${index}`]: {
                                            ...prev.productVariant[
                                              `variant_no_${index}`
                                            ],
                                            color: e.target.value,
                                          },
                                        },
                                      };
                                    });
                                  }}
                                  type="text"
                                  id={`variantColor-${index + 1}`}
                                  placeholder="Black | White | Red etc."
                                  required={!updateProductId}
                                />
                              </div>

                              <div>
                                <label
                                  htmlFor={`variantSize-${index + 1}`}
                                  className="block text-sm font-medium text-gray-700">
                                  Size{" "}
                                  {!updateProductId && (
                                    <span className="text-red-500 font-extrabold">
                                      *
                                    </span>
                                  )}
                                </label>
                                <input
                                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm h-10 border border-gray-300 px-2"
                                  // placeholder="Enter Size for product variant"
                                  value={
                                    productData?.productVariant[
                                      `variant_no_${index}`
                                    ]?.size
                                  }
                                  onChange={(e) => {
                                    setProductData((prev) => {
                                      return {
                                        ...prev,
                                        productVariant: {
                                          ...prev.productVariant,
                                          [`variant_no_${index}`]: {
                                            ...prev.productVariant[
                                              `variant_no_${index}`
                                            ],
                                            size: e.target.value,
                                          },
                                        },
                                      };
                                    });
                                  }}
                                  type="text"
                                  id={`variantSize-${index + 1}`}
                                  placeholder="S | L | XL | 8 etc."
                                  required={!updateProductId}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    }
                  )}
                </div>
              )}
            </div>
          ) : (
            <></>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              className="cursor-pointer inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-indigo-200"
              disabled={
                !(updateProductId || (!isSubmitDisabled && !isFormSubmitting))
              }>
              {updateProductId ? "Update Product" : "Submit form"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductAdd;
