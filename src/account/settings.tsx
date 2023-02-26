import AsyncStorage from "@react-native-async-storage/async-storage";
import { reloadAsync } from "expo-updates";
import { StatusBar, View, StyleSheet } from "react-native";
import { Appbar, Surface, Text } from "react-native-paper";
import { useAlerts } from "react-native-paper-alerts";
import { Role } from "../api/roles";
import { SectionButton } from "../components/sectionButton";
import { AdminPanel } from "./adminPanel";

export function SettingsScreen({ route, navigation }: any) {
    const alerts = useAlerts();

    return (
        <View style={StyleSheet.absoluteFill}>
            <Appbar.Header
                statusBarHeight={__DEV__ ? StatusBar.currentHeight! * 1.5 : 0}
            >
                <Appbar.BackAction onPress={() => navigation.goBack()} />
                <Appbar.Content title="Настройки" />
            </Appbar.Header>
            <View style={[{ alignItems: "center" }]}>
                <View style={{ width: "90%", marginTop: "5%" }}>
                    <Text variant="titleMedium" style={{ marginStart: "2%" }}>
                        Аккаунт
                    </Text>
                    <Surface
                        style={{ borderRadius: 20, marginTop: "4%" }}
                        elevation={1}
                    >
                        <SectionButton
                            text="Редактировать информацию"
                            onPress={() => {}}
                            variant="top"
                        />
                        <SectionButton
                            text="Выйти из аккаунта"
                            onPress={() => {
                                alerts.alert(
                                    "Выход",
                                    "Вы действительно хотите выйти из аккаунта?",
                                    [
                                        {
                                            text: "Да",
                                            onPress: () => {
                                                AsyncStorage.clear();

                                                reloadAsync();
                                            },
                                        },
                                        {
                                            text: "Нет",
                                        },
                                    ]
                                );
                            }}
                            variant="bottom"
                        />
                    </Surface>
                </View>
                {route.params.role == Role.admin && (
                    <AdminPanel navigation={navigation} />
                )}
            </View>
        </View>
    );
}
