import { useState } from "react";
import { View, StyleSheet, StatusBar, Keyboard } from "react-native";
import { Appbar, Button, Snackbar, Surface, Text, TextInput } from "react-native-paper";
import { useAlerts } from "react-native-paper-alerts";
import { Api } from "../api/main";

export function ContactAddScreen({ navigation }: any) {
    const [id, setId] = useState<string>();
    const [loading, setLoading] = useState<boolean>();

    const [snackVisible, setSnackVisible] = useState<boolean>();

    const alerts = useAlerts();

    const api = new Api();

    return (
        <View style={StyleSheet.absoluteFill}>
            <Appbar.Header statusBarHeight={__DEV__ ? StatusBar.currentHeight! * 1.5 : 0}>
                <Appbar.BackAction onPress={() => navigation.goBack()} />
                <Appbar.Content title="Добавить контакт" />
            </Appbar.Header>
            <View style={[StyleSheet.absoluteFill, { justifyContent: "center", alignItems: "center" }]}>
                <Surface style={{ width: "90%", height: "50%", justifyContent: "center", alignItems: "center", borderRadius: 20 }} elevation={1}>
                    <Text variant="headlineMedium">Введите ID</Text>
                    <View style={{ display: "flex", flexDirection: "row", marginTop: "5%" }}>
                        <TextInput style={{ width: "70%", marginLeft: "3%" }} value={id} onChangeText={(t: string) => setId(t)} left={<TextInput.Affix text="# " />} />
                    </View>

                    <Button mode="contained" style={{ marginTop: "10%" }} loading={loading} onPress={() => {
                        const makeAlert = (content: string) => {
                            alerts.alert(
                                "Ошибка",
                                content,
                                [{ text: "Хорошо" }]
                            );

                            Keyboard.dismiss();
                        };

                        if (id == "") {
                            makeAlert("Нужно ввести ID");

                            return;
                        }

                        setLoading(true);

                        api.addContact({ "target": id }).then(() => {
                            setSnackVisible(true);
                            setLoading(false);
                        }).catch((e: Error) => {
                            switch (e.message) {
                                case "contactExists":
                                    makeAlert("Такой контакт уже добавлен");
                                    break;
                                case "cannotAddSelf":
                                    makeAlert("Вы не можете добавить самого(-у) себя");
                                    break;
                                case "userNotFound":
                                    makeAlert("Пользователь не существует");
                                    break;
                                default:
                                    makeAlert("Неизвестная ошибка");
                            }

                            setLoading(false);
                        })
                    }}>Добавить</Button>
                </Surface>
            </View>
            <View style={[StyleSheet.absoluteFill, { justifyContent: "flex-end", alignItems: "center" }]}>

                <Button style={{ marginBottom: "5%" }} onPress={() => {
                    alerts.alert(
                        "", `"ID" - это идентификатор пользователя.

Он отображён на главном экране чуть ниже имени и имеет префикс "#".`,
                        [{ text: "Хорошо" }]
                    );
                }} icon="chat-question">Что такое "ID"?</Button>
                <Snackbar visible={snackVisible!} onDismiss={() => setSnackVisible(false)} action={{ label: "Ок" }}>Пользователь успешно добавлен</Snackbar>
            </View>
        </View >
    )
}