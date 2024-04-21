import React, { memo, useEffect, useState } from "react";
import CategorySkeleton from "../../Skeletons/CategorySkeleton";
import CategoryItem from "./CategoryItem";
import { FlatList, View } from "react-native";

// import { useGetAllCategoryQuery } from "@store/rtk/apis/categoryApi";
import { useSelector } from "react-redux";
import axios from "axios";

import { TbCategoryPlus } from "react-icons/tb";
import { Toast } from "toastify-react-native";

function Categories() {
  const { jwtToken } = useSelector((state) => state.auth);

  const [paginationPage, setPaginationPage] = useState(0);
  const [limit, setLimit] = useState(5);

  const [isLoading, setIsLoading] = useState(true);

  const [totalPages, setTotalPages] = useState(0);
  const [categoryList, setCategoryList] = useState([]);

  console.log("Categories List", categoryList);

  const getCategories = async () => {
    try {
      setIsLoading(true);

      const response = await axios.get(
        `${process.env.EXPO_PUBLIC_API_URL}/categories?page=${paginationPage}&limit=5`,
        {
          headers: {
            authorization: `Bearer ${jwtToken}`,
          },
        }
      );

      console.log(response.data);
      setCategoryList(response.data.categories);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error(error);
      Toast.error("Opps there is some error while fetching categories.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getCategories();
  }, []);

  useEffect(() => {
    (() => {
      // if we have less categories then totalPage will be 1
      if (totalPages > 1) {
        setCategoryList([
          ...categoryList,
          {
            _id: "cate_id_unique",
            categoryName: "See More",
            categoryImageUrl:
              "https://firebasestorage.googleapis.com/v0/b/crafter-ecommerce.appspot.com/o/renting%2Fimages%2Fproducts%2F360_F_385956366_Zih7xDcSLqDxiJRYUfG5ZHNoFCSLMRjm.jpg?alt=media&token=75b164a4-43bd-462b-95b3-77862c7aadc9",
            categoryKey: "more_category",
          },
        ]);
      }
    })();
  }, [totalPages]);

  // useEffect(() => {
  //   if (isError) {
  //     (() => {
  //       Toast.success(error?.message);
  //     })();
  //   }
  // }, [isError]);

  return (
    <View className="flex flex-row gap-x-2 w-screen pl-2 pr-2">
      {isLoading ? (
        <>
          <CategorySkeleton />
          <CategorySkeleton />
          <CategorySkeleton />
          <CategorySkeleton />
          <CategorySkeleton />
        </>
      ) : (
        <>
          <FlatList
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            data={categoryList}
            renderItem={({ item }) => (
              <CategoryItem
                key={item?._id}
                categoryImageUrl={item?.categoryImageUrl}
                categoryName={item?.categoryName}
                categoryKey={item?.categoryKey}
              />
            )}
          />
        </>
      )}
    </View>
  );
}

export default memo(Categories);
