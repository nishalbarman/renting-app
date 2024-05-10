import { Entypo } from "@expo/vector-icons";
import { Stack } from "expo-router";

export default function App() {
  return (
    <Stack>
      <Stack.Screen
        // options={{
        //   headerBackVisible: false,
        //   headerShown: true,
        //   headerShadowVisible: true,
        //   headerTitle: "Select Filter",
        //   headerLeft: () => {
        //     return (
        //       <Entypo
        //         style={{
        //           marginRight: 10,
        //           marginTop: 3
        //         }}
        //         name="cross"
        //         size={30}
        //         color="black"
        //       />
        //     );
        //   },
        // }}
        name="filter-screen"
      />
    </Stack>
  );
}
