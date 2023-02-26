import { useState } from "react";
import { View, StyleSheet, StatusBar, LogBox, Keyboard } from "react-native"
import { Appbar, Button, Surface, TextInput, TouchableRipple } from "react-native-paper"
import { useAlerts } from "react-native-paper-alerts";
import { Api } from "../api/main";
import { Contact } from "../api/types";
import { List, ListItem } from "../components/list";

interface initialValuesType {
    to: number
    comment: string

    amount: string
}

const initialValues: initialValuesType = {
    to: 0,
    comment: "",
    amount: ""
}

export function TransferScreen({ route, navigation }: any) {
    const [contactsVisible, setContactsVisible] = useState<boolean>();

    const [values, setValues] = useState(initialValues);
    const set = (key: any, value: any) => {
        setValues({
            ...values,
            [key]: value,
        });
    };

    const api = new Api();

    const alerts = useAlerts();

    if (route.params.entry) {
        set("to", route.params.entry);

        route.params.entry = undefined;
    }

    LogBox.ignoreLogs(["Currently we support only"]);

    return (
        <View style={StyleSheet.absoluteFill}>
            <Appbar.Header statusBarHeight={__DEV__ ? StatusBar.currentHeight! * 1.5 : 0}>
                <Appbar.BackAction onPress={() => navigation.goBack()} />
                <Appbar.Content title="Перевести" />
            </Appbar.Header>
            <View style={[StyleSheet.absoluteFill, { justifyContent: "center", alignItems: "center" }]}>
                <Surface style={{ width: "90%", height: "60%", justifyContent: "center", alignItems: "center", borderRadius: 20 }} elevation={1}>
                    <TouchableRipple style={{ width: "70%", marginLeft: "3%" }} onPress={() => setContactsVisible(true)}>
                        <TextInput placeholder="Контакт" editable={false} value={((): string => {
                            const c: Contact = route.params.contacts.find((e: Contact) => e.id == values.to);
                            if (!c) {
                                return "";
                            }

                            return c.firstName + " " + c.lastName;
                        })()} />
                    </TouchableRipple>
                    <TextInput placeholder="Сумма" style={{ width: "70%", marginLeft: "3%", marginTop: "3%" }}
                        onChangeText={(t: string) => set("amount", t.replace(/[^0-9]/g, ""))} value={values.amount} right={<TextInput.Affix text="PC" />} />
                    <TextInput multiline={true} placeholder="Комментарий (не обязательно)" style={{ width: "70%", marginLeft: "3%", marginTop: "3%", height: "25%" }}
                        onChangeText={(t: string) => set("comment", t)} value={values.comment} />
                    <Button mode="contained" style={{ marginTop: "10%" }} onPress={() => {
                        const makeAlert = (content: string) => {
                            alerts.alert(
                                "Ошибка",
                                content,
                                [{ text: "Хорошо" }]
                            );

                            Keyboard.dismiss();
                        };

                        if (values.to == 0) {
                            makeAlert("Нужно выбрать контакт");

                            return;
                        }
                        if (values.amount == "") {
                            makeAlert("Нужно ввести сумму");

                            return;
                        }

                        var completeValues: any = Object.assign({}, values);
                        completeValues.amount = parseInt(values.amount);

                        api.transactionMake(completeValues).then(() => {
                            navigation.navigate("SuccessScreenTransfer");
                        }).catch((e: Error) => {
                            switch (e.message) {
                                case "coinsNotEnough":
                                    makeAlert("Недостаточно средств");
                                    break;
                                case "targetUserNotFound":
                                    makeAlert("Пользователь не найден");
                                    break;
                            }
                        })
                    }}>Отправить</Button>
                </Surface>
            </View>
            <List visible={contactsVisible!}
                onDismiss={() => setContactsVisible(false)}
                onSelect={(id: number) => set("to", id)}
                data={route.params.contacts.map((e: Contact): ListItem => ({ id: e.id, value: e.firstName + " " + e.lastName }))}
            />
        </View >
    )
}