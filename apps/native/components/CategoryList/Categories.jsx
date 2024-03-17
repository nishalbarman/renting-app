import React, { memo, useEffect } from "react";
import CategorySkeleton from "../../Skeletons/CategorySkeleton";
import CategoryItem from "./CategoryItem";
import { View } from "react-native";
import { Toast } from "expo-react-native-toastify";

import { useGetAllCategoryQuery } from "@store/rtk/apis/categoryApi";

function Categories() {
  const {
    data: categoryList,
    isError,
    isLoading,
    error,
  } = useGetAllCategoryQuery();

  useEffect(() => {
    if (isError) {
      (() => {
        Toast.success(error?.message);
      })();
    }
  }, [isError]);

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
          {categoryList?.data?.map(({ _id, categoryName, imageUrl }) => (
            <CategoryItem
              key={_id}
              categoryImage={imageUrl}
              categoryName={categoryName}
            />
          ))}
        </>
      )}
    </View>
  );
}

export default memo(Categories);
