import React, { useEffect } from "react";
import { AntDesign, Entypo, MaterialIcons } from "@expo/vector-icons";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import ActionSheet, { useScrollHandlers } from "react-native-actions-sheet";
import { NativeViewGestureHandler } from "react-native-gesture-handler";

export default function Widget() {
  const handlers = useScrollHandlers();

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
      <NativeViewGestureHandler
        simultaneousHandlers={handlers.simultaneousHandlers}>
        <ScrollView className="p-4" {...handlers}>
          <View
            style={{
              flex: 1,
              backgroundColor: "#F3F4F6",
              alignItems: "center",
              justifyContent: "center",
              padding: 4,
            }}>
            <View
              style={{
                backgroundColor: "#FFFFFF",
                borderRadius: 8,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
                elevation: 5,
                padding: 6,
                width: "100%",
                maxWidth: 320,
              }}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  padding: 1,
                  marginBottom: 5,
                  backgroundColor: "#6B46C1",
                  borderRadius: 4,
                }}>
                <View
                  style={{
                    backgroundColor: "#C4B5FD",
                    borderRadius: 10,
                    padding: 2,
                  }}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round">
                    <path d="M5.121 11.121a1.5 1.5 0 011.415 0l.879.88-.878.879a1.5 1.5 0 01-2.121 0l-.88-.88.88-.879zm0 0a1.5 1.5 0 000 2.122M17.121 11.121a1.5 1.5 0 010 2.122m0 0a1.5 1.5 0 01-2.122 0l-.88-.88.88-.879a1.5 1.5 0 012.122 0zm-6 6v.379m0-6.379V9m0 4h2.5a1.5 1.5 0 011.5 1.5v.5a1.5 1.5 0 01-1.5 1.5H11z" />
                  </svg>
                </View>
                <View>
                  <Text
                    style={{
                      color: "#FFFFFF",
                      fontSize: 16,
                      fontWeight: "600",
                    }}>
                    Anna Avetisyan
                  </Text>
                </View>
              </View>
              <View style={{ marginTop: 4 }}>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: 4,
                  }}>
                  <View
                    style={{
                      backgroundColor: "#CBD5E0",
                      borderRadius: 10,
                      padding: 4,
                      marginRight: 3,
                    }}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round">
                      <path d="M8 10h.01M12 10h.01M16 10h.01M12 6h.01M12 14h.01" />
                    </svg>
                  </View>
                  <TextInput
                    placeholder="Anna Avetisyan"
                    style={{
                      flex: 1,
                      padding: 4,
                      backgroundColor: "#F3F4F6",
                      color: "#1F2937",
                      borderRadius: 4,
                      borderWidth: 1,
                      borderColor: "#CBD5E0",
                    }}
                  />
                </View>
                {/* Repeat the above pattern for other input fields */}
              </View>
              <TouchableOpacity
                style={{
                  backgroundColor: "#6B46C1",
                  borderRadius: 8,
                  padding: 8,
                  marginTop: 4,
                }}>
                <Text
                  style={{
                    color: "#FFFFFF",
                    textAlign: "center",
                    fontWeight: "600",
                  }}>
                  Edit Profile
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </NativeViewGestureHandler>
    </ActionSheet>
  );
}
