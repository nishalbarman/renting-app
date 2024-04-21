import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import ActionSheet, {
  SheetManager,
  useScrollHandlers,
} from "react-native-actions-sheet";
import { NativeViewGestureHandler } from "react-native-gesture-handler";
import {
  useDeleteAddressMutation,
  useGetAddressQuery,
} from "@store/rtk/apis/addressApi";

import { useRouter } from "expo-router";

import { useSelector } from "react-redux";
import AddressCardSkeleton from "../../Skeletons/AddressCardSkeleton";

import { MaterialIcons } from "@expo/vector-icons";

export default function AddressList() {
  const handlers = useScrollHandlers();

  const { name, mobileNo } = useSelector((state) => state.auth);

  console.log(mobileNo);

  const router = useRouter();
  const handleAddAddressClick = () => {
    router.push(`/add-address`);
    SheetManager.hide("address-list-sheet");
  };

  const {
    data: address,
    isLoading: isAddressLoading,
    isFetching: isAddressFetching,
    error: addressFetchError,
    refetch,
  } = useGetAddressQuery();

  console.log(address);

  const [deleteOneAddress, { isLoading: isAddressDeleteLoading }] =
    useDeleteAddressMutation();

  const handleDeleteAddress = async (id) => {
    console.log(id);
    try {
      const response = await deleteOneAddress(id).unwrap();

      console.log("Address Deleted");
    } catch (error) {
      console.error(error);
    } finally {
      refetch();
    }
  };

  return (
    <ActionSheet closeOnPressBack={true} gestureEnabled={true}>
      <NativeViewGestureHandler
        simultaneousHandlers={handlers.simultaneousHandlers}>
        <ScrollView {...handlers}>
          <View className="pt-3 flex flex-col items-center pb-10">
            <Text className="font-[poppins-bold] text-[15px]">
              Your addresses
            </Text>

            <View className="pt-2 px-3 justify-center mt-1 w-[100%]">
              {isAddressLoading ? (
                <AddressCardSkeleton />
              ) : (
                <>
                  {address &&
                    address.length > 0 &&
                    address.map((item) => {
                      return (
                        <View
                          key={item._id}
                          className="bg-light-blue-200 p-4 rounded-md mb-3 w-[100%] border border-gray-300">
                          <View>
                            <Text className="text-black font-medium mb-2">
                              {name}
                            </Text>
                            <Text className="text-gray-700 mb-2">
                              {item.name}, {item.locality}, {item.streetName},{" "}
                              {item.postalCode}, {item.country}
                            </Text>
                            <Text className="text-gray-700">{mobileNo}</Text>
                          </View>
                          <View className="w-full flex items-end">
                            {isAddressDeleteLoading ? (
                              <>
                                <ActivityIndicator
                                  size={15}
                                  color={"dark-purple"}
                                />
                              </>
                            ) : (
                              <>
                                <TouchableOpacity
                                  onPress={() => {
                                    handleDeleteAddress(item._id);
                                  }}
                                  className="flex items-center justify-center flex-0 p-1 rounded-full bg-dark-purple w-10 h-10 mt-4">
                                  <MaterialIcons
                                    name="delete"
                                    size={24}
                                    color="white"
                                  />
                                </TouchableOpacity>
                              </>
                            )}
                          </View>
                        </View>
                      );
                    })}

                  {(!address || address.length <= 0) && (
                    <Text className="font-[poppins-mid] text-[18px] text-center">
                      No address found
                    </Text>
                  )}
                </>
              )}
            </View>
            {(!address || address.length < 5) && (
              <TouchableOpacity
                onPress={handleAddAddressClick}
                className="mt-6 flex items-center justify-center self-center w-[200px] h-[45px] p-[0px_20px] bg-dark-purple rounded-lg">
                <Text className="text-white font-bold">Add One</Text>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
      </NativeViewGestureHandler>
    </ActionSheet>
  );
}
