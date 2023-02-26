import { useEffect, useState } from "react";
import { Keyboard, StyleSheet, View } from "react-native";
import {
    Button,
    Modal,
    Text,
    TextInput,
    TouchableRipple,
    Searchbar,
    ActivityIndicator,
} from "react-native-paper";
import { useAlerts } from "react-native-paper-alerts";
import { Api } from "../api/main";
import { SchoolInfo } from "../api/types";
import isEmail from "validator/lib/isEmail";
import { LoadingComponent } from "../loading";
import { List, ListItem } from "../components/list";

interface initialValuesType {
    firstName: string;
    lastName: string;
    email: string;
    school: SchoolInfo;
    grade: string;
    password: string;
    passwordHidden: boolean;
}

const initialValues: initialValuesType = {
    firstName: "",
    lastName: "",
    email: "",
    grade: "",
    password: "",
    passwordHidden: true,
    school: {
        id: -1,
        name: "",
    },
};

export function Register({ navigation }: any) {
    const alerts = useAlerts();
    const [schoolVisible, setSchoolVisible] = useState(false); // Modal

    const [schools, setSchools] = useState<SchoolInfo[]>(); // API loading
    const [isLoading, setLoading] = useState(true); // API loading

    const [values, setValues] = useState(initialValues);
    const set = (key: any, value: any) => {
        setValues({
            ...values,
            [key]: value,
        });
    };

    const [buttonLoading, setButtonLoading] = useState<boolean>();

    const api = new Api();

    useEffect(() => {
        (async () => {
            var data;

            try {
                data = await api.getSchools();
            } catch (_) {
                navigation.navigate("ErrorScreenNetwork");
            }

            setSchools(data);
            setLoading(false);
        })();
    }, []);

    if (isLoading) {
        return <LoadingComponent />;
    }

    return (
        <View style={StyleSheet.absoluteFill}>
            <View
                style={[
                    StyleSheet.absoluteFill,
                    { justifyContent: "center", alignItems: "center" },
                ]}
            >
                <Text variant="headlineLarge">Добро пожаловать!</Text>

                <View
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        marginTop: "10%",
                    }}
                >
                    <TextInput
                        label="Имя"
                        style={{ width: 120 }}
                        value={values.firstName}
                        onChangeText={(t) => set("firstName", t)}
                    />
                    <TextInput
                        label="Фамилия"
                        style={{ width: 170, marginStart: 5 }}
                        value={values.lastName}
                        onChangeText={(t) => set("lastName", t)}
                    />
                </View>
                <TextInput
                    label="Электронный адрес"
                    style={{ marginTop: "2%", width: 300 }}
                    value={values.email}
                    onChangeText={(t) => set("email", t)}
                />
                <View
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        marginTop: "2%",
                    }}
                >
                    <TouchableRipple
                        onPress={() => {
                            Keyboard.dismiss();
                            setSchoolVisible(true);
                        }}
                    >
                        <TextInput
                            label="Школа"
                            style={{ width: 200 }}
                            editable={false}
                            value={values.school.name}
                            selection={{
                                start: 0,
                            }}
                        />
                    </TouchableRipple>
                    <TextInput
                        label="Класс"
                        style={{ width: 100, marginStart: 5 }}
                        value={values.grade}
                        onChangeText={(t) => set("grade", t)}
                    />
                </View>
                <TextInput
                    label="Пароль"
                    style={{ marginTop: "2%", width: 300 }}
                    value={values.password}
                    onChangeText={(t) => set("password", t)}
                    secureTextEntry={values.passwordHidden}
                    right={
                        <TextInput.Icon
                            icon="eye"
                            onPress={() =>
                                set("passwordHidden", !values.passwordHidden)
                            }
                        />
                    }
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

                        if (!values.firstName) {
                            makeAlert("Нужно ввести имя");

                            return;
                        }
                        if (!values.lastName) {
                            makeAlert("Нужно ввести фамилию");

                            return;
                        }
                        if (!values.email) {
                            makeAlert("Нужно ввести электронный адрес");

                            return;
                        }
                        if (!values.password) {
                            makeAlert("Нужно ввести пароль");

                            return;
                        }
                        if (!values.grade) {
                            makeAlert("Нужно ввести класс");

                            return;
                        }
                        if (values.school.id == -1) {
                            makeAlert("Нужно выбрать школу");

                            return;
                        }

                        if (!isEmail(values.email)) {
                            makeAlert("Недопустимый адрес электронной почты");

                            return;
                        }

                        setButtonLoading(true);

                        var completeValues: any = Object.assign({}, values);
                        completeValues.school = values.school.id;

                        api.register(completeValues)
                            .then(() => {
                                navigation.navigate(
                                    "SuccessScreenRegistration"
                                );
                            })
                            .catch((e: Error) => {
                                switch (e.message) {
                                    case "emailUsed":
                                        makeAlert(
                                            "Адрес электронной почты уже занят"
                                        );
                                        break;
                                    case "badEmail":
                                        makeAlert(
                                            "Недопустимый адрес электронной почты"
                                        );
                                        break;
                                    case "noSuchSchool":
                                        makeAlert("Такой школы не существует");
                                        break;
                                    default:
                                        makeAlert("Неизвестная ошибка");
                                }
                            })
                            .finally(() => setButtonLoading(false));
                    }}
                >
                    Начать
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
                    onPress={() => navigation.navigate("Login")}
                >
                    У меня уже есть аккаунт
                </Button>
            </View>
            <List
                visible={schoolVisible}
                onDismiss={() => setSchoolVisible(false)}
                onSelect={(id: number) =>
                    set(
                        "school",
                        schools?.find((e) => e.id == id)
                    )
                }
                data={
                    schools?.map(
                        (e): ListItem => ({ id: e.id, value: e.name })
                    )!
                }
            />
        </View>
    );
}
