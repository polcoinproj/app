import { useState } from "react";
import { View, StyleSheet, Keyboard } from "react-native";
import { Text, TextInput, Button } from "react-native-paper";
import { useAlerts } from "react-native-paper-alerts";
import { useRecoilState } from "recoil";
import isEmail from "validator/lib/isEmail";
import { Api } from "../api/main";
import {
    credentialsState,
    tokenState,
    CredentialsStateType,
} from "../state/credentials";

interface initialValuesType {
    email: string;
    password: string;
    passwordHidden: boolean;
}

const initialValues: initialValuesType = {
    email: "",
    password: "",
    passwordHidden: true,
};

export function Login({ navigation }: any) {
    const alerts = useAlerts();

    const [values, setValues] = useState(initialValues);
    const set = (key: any, value: any) => {
        setValues({
            ...values,
            [key]: value,
        });
    };

    const [buttonLoading, setButtonLoading] = useState<boolean>();

    const api = new Api();

    const [token, setToken] = useRecoilState(tokenState);
    const [credentials, setCredentials] = useRecoilState(credentialsState);

    return (
        <View style={StyleSheet.absoluteFill}>
            <View
                style={[
                    StyleSheet.absoluteFill,
                    { justifyContent: "center", alignItems: "center" },
                ]}
            >
                <Text variant="headlineMedium">Логин</Text>
                <TextInput
                    label="Электронный адрес"
                    style={{ marginTop: "5%", width: 300 }}
                    value={values.email}
                    onChangeText={(t: string) => set("email", t)}
                />
                <TextInput
                    label="Пароль"
                    style={{ marginTop: "2%", width: 300 }}
                    right={
                        <TextInput.Icon
                            icon="eye"
                            onPress={() =>
                                set("passwordHidden", !values.passwordHidden)
                            }
                        />
                    }
                    secureTextEntry={values.passwordHidden}
                    value={values.password}
                    onChangeText={(t: string) => set("password", t)}
                />

                <Button
                    mode="contained"
                    style={{ marginTop: "5%" }}
                    loading={buttonLoading}
                    onPress={() => {
                        Keyboard.dismiss();

                        const makeAlert = (content: string) => {
                            alerts.alert("Ошибка", content, [
                                { text: "Хорошо" },
                            ]);

                            Keyboard.dismiss();
                        };

                        if (!values.email) {
                            makeAlert("Нужно ввести электронный адрес");

                            return;
                        }
                        if (!values.password) {
                            makeAlert("Нужно ввести пароль");

                            return;
                        }

                        if (!isEmail(values.email)) {
                            makeAlert("Недопустимый адрес электронной почты");

                            return;
                        }

                        setButtonLoading(true);

                        api.login(values)
                            .then((token: string) => {
                                setToken(token);
                                setCredentials(
                                    values as unknown as CredentialsStateType
                                );

                                navigation.navigate("AccountInfo");
                            })
                            .catch((e: Error) => {
                                switch (e.message) {
                                    case "userNotFound":
                                        makeAlert(
                                            "Пользователь с таким адресом электронной почты не найден"
                                        );
                                        break;
                                    case "invalidPassword":
                                        makeAlert(
                                            "Неправильный или недопустимый пароль"
                                        );
                                        break;
                                    default:
                                        makeAlert("Неизвестная ошибка");
                                }
                            })
                            .finally(() => setButtonLoading(false));
                    }}
                >
                    Войти
                </Button>
            </View>
            <View
                style={[
                    StyleSheet.absoluteFill,
                    { justifyContent: "flex-end", alignItems: "center" },
                ]}
            >
                <Button
                    style={{ marginBottom: "5%" }}
                    onPress={() => navigation.navigate("Register")}
                >
                    У меня нет аккаунта
                </Button>
            </View>
        </View>
    );
}
