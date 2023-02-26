import { StyleSheet } from "react-native";
import { View } from "react-native";
import { Avatar, Button, MD3LightTheme, Text } from "react-native-paper";

export function SuccessRegistrationScreen({ navigation }: any) {
    navigation.addListener("beforeRemove", (e: any) => {
        e.preventDefault();

        navigation.navigate("Login");
    });

    return (
        <View style={[StyleSheet.absoluteFill, { justifyContent: "center", alignItems: "center" }]} >
            <Avatar.Icon icon="check" size={96} color={MD3LightTheme.colors.primary} style={{ backgroundColor: MD3LightTheme.colors.primaryContainer }} />
            <Text variant="headlineMedium" style={{ marginTop: "30%" }}>Успешно!</Text>
            <Text variant="bodyMedium" style={{
                textAlign: "center",
                margin: "5%"
            }}>
                Для продолжения работы вам необходимо подтвердить свой адрес электронной почты.
                {"\n"}
                На вашу электронную почту было отправлено сообщение с ссылкой для подтверждения.
                {"\n"}
                Если сообщение не пришло, проверьте папку "Спам"
            </Text>
            <Button mode="contained" onPress={() => navigation.navigate("Login")}>Перейти к входу</Button>
        </View>
    );
}