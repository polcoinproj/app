import { StyleSheet } from "react-native";
import { View } from "react-native";
import { Avatar, Button, MD3LightTheme, Text } from "react-native-paper";

export function SuccessTransferScreen({ navigation }: any) {
    return (
        <View style={[StyleSheet.absoluteFill, { justifyContent: "center", alignItems: "center" }]} >
            <Avatar.Icon icon="check" size={96} color={MD3LightTheme.colors.primary} style={{ backgroundColor: MD3LightTheme.colors.primaryContainer }} />
            <Text variant="headlineMedium" style={{ marginTop: "5%", marginBottom: "30%" }}>Успешно!</Text>
            <Button mode="contained" onPress={() => navigation.navigate("AccountInfo")}>Перейти на главный экран</Button>
        </View>
    );
}