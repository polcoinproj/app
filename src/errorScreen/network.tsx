import { BackHandler, StyleSheet } from "react-native";
import { View } from "react-native";
import { Avatar, Button, MD3LightTheme, Text } from "react-native-paper";

export function NetworkErrorScreen({ navigation }: any) {
    // navigation.addListener("beforeRemove", (e: any) => e.preventDefault());

    return (
        <View style={[StyleSheet.absoluteFill, { justifyContent: "center", alignItems: "center" }]} >
            <Avatar.Icon icon="lan-disconnect" size={96} color={MD3LightTheme.colors.primary} style={{ backgroundColor: MD3LightTheme.colors.primaryContainer }} />
            <Text variant="headlineMedium" style={{ marginTop: "30%" }}>Нет соединения</Text>
            <Text variant="bodyMedium" style={{
                textAlign: "center",
                margin: "5%"
            }}>Запрос к серверу завершился с ошибкой. Проверьте подключение к интернету</Text>
            <Button mode="contained" onPress={() => BackHandler.exitApp()}>Выйти</Button>
        </View>
    );
}