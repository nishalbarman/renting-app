import React, { useEffect } from "react";
import { AntDesign, Entypo, MaterialIcons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import ActionSheet, { ScrollView } from "react-native-actions-sheet";
import OrderTrackSkeleton from "../../Skeletons/OrderTrackSkeleton";

export default function OrderTrack() {
  const [isTrackDetailsLoading, setIsTrackDetailsLoading] =
    React.useState(true);

  useEffect(() => {
    (async () => {
      return await new Promise((res) => {
        setTimeout(() => {
          setIsTrackDetailsLoading(false);
          res();
        }, 2000);
      });
    })();
  }, []);

  const handleViewTrackDetailsClick = () => {
    try {
    } catch (error) {}
  };

  return (
    <ActionSheet closeOnPressBack={true} gestureEnabled={true}>
      <ScrollView className="p-4">
        {isTrackDetailsLoading ? (
          <OrderTrackSkeleton />
        ) : (
          <View className="flex flex-col items-center gap-y-5 pb-10">
            <Text className="font-[poppins-bold] text-[21px] mb-3">
              Progress of your Order
            </Text>

            <View className="mb-10">
              <View className="flex-row items-start mt-[5px] mb-[5px]">
                <View className="mr-3 items-center justify-center rounded-full bg-purple w-[50px] h-[50px] self-center">
                  <FontAwesome5 name="store" size={18} color="white" />
                </View>
                <View>
                  <Text className="font-bold text-[17px]">Order recieved</Text>
                  <Text className="text-[13px] font-bold text-grey mt-1">
                    17 July 2017
                  </Text>
                </View>
              </View>
              <View className="flex-col items-center">
                <Text className="text-[#26095c] leading-[15px]">|</Text>
                <Text className="text-[#26095c] leading-[15px]">|</Text>
                <Text className="text-[#26095c] leading-[15px]">|</Text>
                <Text className="text-[#26095c] leading-[15px]">|</Text>
              </View>
              <View className="flex-row items-start mt-[5px] mb-[5px]">
                <View className="mr-3 items-center justify-center rounded-full bg-purple w-[50px] h-[50px] self-center">
                  <MaterialIcons name="done" size={24} color="white" />
                </View>
                <View>
                  <Text className="font-bold text-[17px]">Order Processed</Text>
                  <Text className="text-[13px] font-bold text-grey mt-1">
                    17 July 2017
                  </Text>
                </View>
              </View>
              <View className="flex-col items-center">
                <Text className="text-[#c7c7c7] leading-[15px]">|</Text>
                <Text className="text-[#c7c7c7] leading-[15px]">|</Text>
                <Text className="text-[#c7c7c7] leading-[15px]">|</Text>
                <Text className="text-[#c7c7c7] leading-[15px]">|</Text>
              </View>
              <View className="flex-row items-start mt-[5px] mb-[5px]">
                <View className="mr-3 items-center justify-center rounded-full bg-purple w-[50px] h-[50px] self-center">
                  <AntDesign name="car" size={23} color="white" />
                </View>
                <View>
                  <Text className="font-bold text-[17px]">On the way</Text>
                  <Text className="text-[13px] font-bold text-grey mt-1">
                    17 July 2017
                  </Text>
                </View>
              </View>
              <View className="flex-col items-center">
                <Text className="text-[#c7c7c7] leading-[15px]">|</Text>
                <Text className="text-[#c7c7c7] leading-[15px]">|</Text>
                <Text className="text-[#c7c7c7] leading-[15px]">|</Text>
                <Text className="text-[#c7c7c7] leading-[15px]">|</Text>
              </View>
              <View className="flex-row items-start mt-[5px] mb-[5px]">
                <View className="mr-3 items-center justify-center rounded-full bg-purple w-[50px] h-[50px] self-center">
                  <Entypo name="location" size={22} color="white" />
                </View>
                <View>
                  <Text className="font-bold text-[17px]">Order Delivered</Text>
                  <Text className="text-[13px] font-bold text-grey mt-1">
                    17 July 2017
                  </Text>
                </View>
              </View>
            </View>
            <TouchableOpacity
              onPress={handleViewTrackDetailsClick}
              className="flex items-center justify-center w-[200px] h-[49px] p-[0px_20px] bg-purple rounded-lg">
              <Text className="text-white font-bold">View Details</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </ActionSheet>
  );
}
