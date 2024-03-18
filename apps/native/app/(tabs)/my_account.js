import { View, Text } from "react-native";
import { Button } from "nativewind";

export default function Tab() {
  return (
    <View style={{ justifyContent: "center", alignItems: "center", flex: 1 }}>
      <Text>Tab [Settings]</Text>
      <View>
        <Text style="text-2xl">My Account</Text>
        <Button style="mt-4">Edit Profile</Button>
        <Button style="mt-2">Change Password</Button>
        <Button style="mt-2" variant="outline">
          Logout
        </Button>
      </View>
    </View>
  );
}
