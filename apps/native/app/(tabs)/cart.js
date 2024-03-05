import { Link } from "expo-router";
import { View, Text } from "react-native";

export default function Tab() {
  return (
    <View style={{ justifyContent: "center", alignItems: "center", flex: 1 }}>
      <Text>Tab [Settings]</Text>
      <Link push href={"/auth/verify_otp"}>
        Click Me
      </Link>
    </View>
  );
}
