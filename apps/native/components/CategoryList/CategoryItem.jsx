import React from "react";
import { Pressable, Text, TouchableHighlight, View } from "react-native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";

function CategoryItem({
  categoryId,
  categoryImageUrl,
  categoryName,
  categoryKey,

  grow = 0,
  mt = "auto",
}) {
  const router = useRouter();
  return (
    <Pressable
      style={{
        flexGrow: grow,
        marginTop: mt,
      }}
      className="w-[90px] h-36 pb-2 border border-gray-300 rounded-md mx-1"
      onPress={() => {
        if (categoryId === "cate_id_unique") {
          return router.navigate(`/more-category`);
        }
        // console.log(categoryImageUrl);
        router.navigate(
          `/list?category=${categoryId}&categoryName=${categoryName}`
        );
      }}>
      <View className="w-fit h-fit flex flex-col align-center justify-center gap-y-2 m-2">
        <View className="h-[70px] w-[70px] bg-white w-fit h-fit rounded-full flex justify-center align-center self-center">
          <Image
            className="h-[70px] w-[70px] rounded-full aspect-square"
            source={{
              uri: categoryImageUrl,
            }}
            contentFit="contain"
            contentPosition={"center"}
          />
        </View>
        <Text className="font-[roboto-mid] self-center text-[12px] text-center">
          {categoryName}
        </Text>
      </View>
    </Pressable>
  );
}

export default React.memo(CategoryItem);
