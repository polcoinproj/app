import { View } from "react-native";
import { StyleSheet } from "react-native";
import { ActivityIndicator } from "react-native-paper";

export function LoadingComponent() {
    return (
        <View style={[StyleSheet.absoluteFill, { justifyContent: "center", alignItems: "center" }]}>
            <ActivityIndicator animating={true} />
        </View >
    );
};