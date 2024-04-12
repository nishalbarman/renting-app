import React, { memo, useEffect, useState } from "react";
import CategorySkeleton from "../../Skeletons/CategorySkeleton";
import CategoryItem from "./CategoryItem";
import { FlatList, View } from "react-native";

// import { useGetAllCategoryQuery } from "@store/rtk/apis/categoryApi";
import { useSelector } from "react-redux";
import axios from "axios";

function Categories() {
  const { jwtToken } = useSelector((state) => state.auth);

  const [paginationPage, setPaginationPage] = useState(1);
  const [limit, setLimit] = useState(5);

  const [isLoading, setIsLoading] = useState(true);

  const [totalPages, setTotalPages] = useState(0);
  const [categoryList, setCategoryList] = useState([]);

  const getCategories = async () => {
    try {
      setIsLoading(true);

      const response = await axios.get(
        `${process.env.EXPO_PUBLIC_API_URL}/categories?page=${paginationPage}`,
        {
          headers: {
            authorization: `Bearer ${jwtToken}`,
          },
        }
      );

      console.log(response.data);
      setCategoryList(response.data.data);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error(error);
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
      if (totalPages > -1) {
        setCategoryList([
          ...categoryList,
          {
            _id: "cate_id_unique",
            categoryName: "See More",
            categoryImage:
              "https://cdn-icons-png.flaticon.com/512/3137/3137672.png",
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
    <View className="flex flex-row gap-x-2 w-[100%] pl-2 pr-2">
      {isLoading ? (
        <>
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
                categoryImage={item?.imageUrl}
                categoryName={item?.categoryName}
              />
            )}
          />

          {/* {categoryList?.data?.map(({ _id, categoryName, imageUrl }) => (
            
          ))} */}
        </>
      )}
    </View>
  );
}

export default memo(Categories);
