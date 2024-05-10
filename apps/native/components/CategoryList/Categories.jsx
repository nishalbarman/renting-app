import React, { memo, useEffect, useState } from "react";
import CategorySkeleton from "../../Skeletons/CategorySkeleton";
import CategoryItem from "./CategoryItem";
import { FlatList, Text, View } from "react-native";

// import { useGetAllCategoryQuery } from "@store/rtk";
import { useSelector } from "react-redux";
import axios from "axios";
import Toast from "react-native-toast-message";

function Categories() {
  const { jwtToken } = useSelector((state) => state.auth);

  const [paginationPage, setPaginationPage] = useState(0);
  const [limit, setLimit] = useState(5);

  const [isError, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const [totalPages, setTotalPages] = useState(0);
  const [categoryList, setCategoryList] = useState([]);

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
      setError(error);
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
      if (!(totalPages > 1)) {
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

  return (
    <View className="w-screen pl-2 pr-2 mt-3 rounded-t-md">
      {/* bg-[#c1ebbe]  */}
      {isLoading ? (
        <View className="flex flex-row gap-x-2 ">
          <CategorySkeleton />
          <CategorySkeleton />
          <CategorySkeleton />
          <CategorySkeleton />
          <CategorySkeleton />
        </View>
      ) : (
        <>
          <Text className="font-[poppins-xbold] tracking-wider text-lg text-black mt-4 mb-1 ml-2">
            Categories
          </Text>
          <FlatList
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            data={categoryList}
            renderItem={({ item }) => (
              <CategoryItem
                key={item?._id}
                categoryId={item?._id}
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
