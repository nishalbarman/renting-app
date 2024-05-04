import { Stack } from "expo-router";

export default function App() {
  return (
    <Stack>
      <Stack.Screen name="view" />
      <Stack.Screen name="list" />
    </Stack>
  );
}
