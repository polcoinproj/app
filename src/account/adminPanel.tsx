import { useState } from "react";
import { Keyboard, View } from "react-native";
import {
    Text,
    Surface,
    Button,
    Portal,
    Dialog,
    TextInput,
} from "react-native-paper";
import { useAlerts } from "react-native-paper-alerts";
import { Api } from "../api/main";
import { SectionButton } from "../components/sectionButton";

interface initialStateType {
    addCoinVisible: boolean;
    addCoinUserId: string;
    addCoinAmount: string;
    addCoinLoading: boolean;
}

const initialState: initialStateType = {
    addCoinVisible: false,
    addCoinUserId: "",
    addCoinAmount: "",
    addCoinLoading: false,
};

export function AdminPanel({ navigation }: any) {
    const [values, setValues] = useState(initialState);
    const set = (key: any, value: any) => {
        setValues({
            ...values,
            [key]: value,
        });
    };

    const alerts = useAlerts();

    const makeAlert = (content: string) => {
        alerts.alert("Ошибка", content, [{ text: "Хорошо" }]);

        Keyboard.dismiss();
    };

    const api = new Api();

    return (
        <View style={{ width: "90%", marginTop: "5%" }}>
            <Text variant="titleMedium" style={{ marginStart: "2%" }}>
                Админ-панель
            </Text>
            <Surface
                style={{ borderRadius: 20, marginTop: "4%" }}
                elevation={1}
            >
                <SectionButton
                    text="Начислить монеты"
                    variant="top"
                    onPress={() => {
                        set("addCoinVisible", true);
                    }}
                />
                <SectionButton
                    text="Обработать заявки"
                    variant="bottom"
                    onPress={() => {
                        navigation.navigate("AchievementsApprovement");
                    }}
                />
            </Surface>

            <Portal>
                <Dialog
                    visible={values.addCoinVisible}
                    onDismiss={() => set("addCoinVisible", false)}
                >
                    <Dialog.Content>
                        <Text variant="titleMedium" style={{ margin: "2%" }}>
                            ID пользователя
                        </Text>
                        <TextInput
                            value={values.addCoinUserId}
                            onChangeText={(t) => set("addCoinUserId", t)}
                        />
                        <Text
                            variant="titleMedium"
                            style={{ margin: "2%", marginTop: "3%" }}
                        >
                            Количество
                        </Text>
                        <TextInput
                            value={values.addCoinAmount}
                            onChangeText={(t) => set("addCoinAmount", t)}
                        />
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={() => set("addCoinVisible", false)}>
                            Отмена
                        </Button>
                        <Button
                            loading={values.addCoinLoading}
                            onPress={() => {
                                if (!values.addCoinUserId) {
                                    set("addCoinVisible", false);
                                    makeAlert("Нужно ввести ID пользователя");

                                    return;
                                }
                                if (!values.addCoinAmount) {
                                    set("addCoinVisible", false);
                                    makeAlert("Нужно ввести количество");

                                    return;
                                }

                                set("addCoinLoading", true);

                                api.transactionMake({
                                    to: parseInt(values.addCoinUserId),
                                    amount: parseInt(values.addCoinAmount),
                                })
                                    .then(() => {
                                        alerts.alert(
                                            "Успешно",
                                            "Запрос успешно выполнен",
                                            [{ text: "Хорошо" }]
                                        );

                                        set("addCoinVisible", false);

                                        Keyboard.dismiss();
                                    })
                                    .catch((e: Error) => {
                                        switch (e.message) {
                                            case "targetUserNotFound":
                                                makeAlert(
                                                    "Пользователь не найден"
                                                );
                                                break;
                                        }

                                        set("addCoinVisible", false);
                                    })
                                    .finally(() =>
                                        set("addCoinLoading", false)
                                    );
                            }}
                        >
                            Начислить
                        </Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
        </View>
    );
}
