import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import ActionSheet, {
  SheetManager,
  FlatList,
} from "react-native-actions-sheet";
import { useDeleteAddressMutation, useGetAddressQuery } from "@store/rtk";

import { useRouter } from "expo-router";

import { useSelector } from "react-redux";
import AddressCardSkeleton from "../../Skeletons/AddressCardSkeleton";

import { MaterialIcons } from "@expo/vector-icons";
import Toast from "react-native-toast-message";
import handleGlobalError from "../../lib/handleError";

export default function AddressList() {
  const { name, mobileNo } = useSelector((state) => state.auth);

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

  const [deleteOneAddress, { isLoading: isAddressDeleteLoading }] =
    useDeleteAddressMutation();

  const handleDeleteAddress = async (id) => {
    try {
      const response = await deleteOneAddress(id).unwrap();
      Toast.show({
        type: "sc",
        text1: "Address Deleted",
      });
    } catch (error) {
      console.error("SavedAddressesList Sheet -->");
      handleGlobalError(error);
    } finally {
      refetch();
    }
  };

  return (
    <ActionSheet
      enableGesturesInScrollView={true}
      closeOnPressBack={true}
      gestureEnabled={true}>
      <FlatList
        data={[""]}
        renderItem={() => {
          return (
            <View className="pt-3 flex flex-col items-center pb-10">
              <Text className="font-[roboto-bold] text-sm">
                Your addresses
              </Text>

              {isAddressLoading ? (
                <View className="w-full px-2">
                  <AddressCardSkeleton />
                  <ActivityIndicator
                    className="mt-3"
                    size={25}
                    color={"green"}
                  />
                </View>
              ) : (
                <>
                  <View className="pt-2 px-3 justify-center mt-1 w-full">
                    <FlatList
                      data={address}
                      renderItem={({ item }) => {
                        return (
                          <View
                            key={item._id}
                            className="bg-light-blue-200 p-4 rounded-md mb-3 w-[100%] border border-gray-300">
                            <View>
                              <Text className="text-black font-medium mb-2 text-[15px]">
                                {name}
                              </Text>
                              <Text className="text-gray-700 mb-2 text-sm">
                                Full Address:{" "}
                                <Text className="font-bold text-sm">
                                  {item.prefix}, {item.streetName}, {item.city},{" "}
                                  {item.postalCode}, {item.state},{" "}
                                  {item.country}
                                </Text>
                              </Text>
                              <Text className="text-gray-700 mb-2 text-sm">
                                Road: {item.streetName}
                              </Text>
                              <Text className="text-gray-700 mb-2 text-sm">
                                City: {item.city}
                              </Text>
                              <Text className="text-gray-700 mb-2 text-sm">
                                State: {item.state}
                              </Text>
                              <Text className="text-gray-700 mb-2 text-sm">
                                PinCode: {item.postalCode}
                              </Text>
                              <Text className="text-gray-700">{mobileNo}</Text>
                            </View>
                            <View className="w-full flex items-end">
                              <TouchableOpacity
                                disabled={isAddressDeleteLoading}
                                onPress={() => {
                                  handleDeleteAddress(item._id);
                                }}
                                className="flex items-center justify-center flex-0 p-1 rounded-full bg-black w-10 h-10 mt-4">
                                {isAddressDeleteLoading ? (
                                  <ActivityIndicator
                                    size={20}
                                    color={"white"}
                                  />
                                ) : (
                                  <MaterialIcons
                                    name="delete"
                                    size={24}
                                    color="white"
                                  />
                                )}
                              </TouchableOpacity>
                            </View>
                          </View>
                        );
                      }}
                      ListEmptyComponent={
                        <Text className="font-[roboto] text-[18px] text-center mt-2">
                          No address found
                        </Text>
                      }
                    />
                  </View>
                  {(!address || address?.length < 5) && (
                    <TouchableOpacity
                      onPress={handleAddAddressClick}
                      className="mt-6 flex items-center justify-center self-center w-64 h-11 p-[0px_20px] bg-black rounded-lg">
                      <Text className="text-white font-bold text-sm">Add One</Text>
                    </TouchableOpacity>
                  )}
                  {address.length >= 5 && (
                    <Text className="mt-1 text-red-600 font-[roboto-bold]">
                      * Maximum allowed address limit reached (5), delete
                      already available address to add a new address.
                    </Text>
                  )}
                </>
              )}
            </View>
          );
        }}></FlatList>
    </ActionSheet>
  );
}
