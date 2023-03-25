import { useIsFocused } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { View, StyleSheet, StatusBar, BackHandler } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { Avatar, Button, IconButton, MD3LightTheme, Surface, Text } from "react-native-paper";
import { Api } from "../api/main";
import { Contact, User } from "../api/types";
import { LoadingComponent } from "../loading";

export function Info({ navigation }: any) {
    navigation.addListener("beforeRemove", (e: any) => {
        e.preventDefault();
        BackHandler.exitApp();
    });

    const isFocused = useIsFocused();

    const [userData, setUserData] = useState<User>();
    const [contacts, setContacts] = useState<Contact[]>();

    const api = new Api();

    useEffect(() => {
        (async () => {
            try {
                setUserData(await api.getUser());
                setContacts(await api.getContacts());
            } catch (e) {
                navigation.navigate("ErrorScreenNetwork");
            }
        })()
    }, [isFocused]);

    if (!userData) {
        return <LoadingComponent />;
    }

    return (
        <ScrollView>
            <View style={[{ marginTop: (__DEV__ ? StatusBar.currentHeight! * 2 : StatusBar.currentHeight), display: "flex" }]}>
                <Surface style={{ flex: 30, margin: "3%", borderRadius: 20, display: "flex" }} elevation={1}>
                    <View style={{ display: "flex", flexDirection: "row", alignItems: "center", padding: "5%" }}>
                        <Avatar.Text size={42} label={userData.firstName.charAt(0) + userData.lastName.charAt(0)} />
                        <View style={{ paddingStart: "3%" }}>
                            <Text variant="titleMedium">{userData.firstName + " " + userData.lastName}</Text>
                            <Text>#{userData.id}</Text>
                        </View>
                        <IconButton icon="cog" style={{ marginStart: "auto" }} mode="contained" selected={true} onPress={() => navigation.navigate("Settings", { role: userData.role })} />
                    </View>
                    <View style={{ alignItems: "center", marginTop: "auto", margin: "5%" }}>
                        <View style={{ display:"flex", flexDirection:"row", alignItems:"center" }}>
                            <Text variant="displayLarge">{userData.balance}</Text>
                            <Avatar.Image size={48} source={require("../../assets/coin.png")} style={{marginLeft:"3%"}}/>
                        </View>
                    </View>
                    <View style={{ marginStart: "5%", marginTop: "auto", marginBottom: "5%", display: "flex", flexDirection: "row" }}>
                        <Text variant="labelLarge" style={{ overflow: "hidden" }}>{userData.school.name.replace(/(.{20})..+/, "$1...")}</Text>
                        <Text variant="labelLarge" style={{ marginStart: "auto", marginEnd: "5%" }}>{userData.grade}</Text>
                    </View>
                </Surface>
                <Surface style={{ flex: 20, margin: "3%", borderRadius: 20 }} elevation={1}>
                    <Text variant="headlineSmall" style={{ marginTop: "6%", marginStart: "6%" }}>Потратить</Text>
                    <View style={{ display: "flex", flexDirection: "row", flex: 1, margin: "6%" }}>
                        <Button
                            labelStyle={{ fontSize: 32, overflow: "visible" }}
                            icon="bank-transfer-out" mode="contained" onPress={() => navigation.navigate("OperationTransfer", { contacts })}
                            style={{ justifyContent: "center" }}><Text style={{ fontSize: 14, color: "white" }}>Перевести</Text>
                        </Button>
                    </View>
                </Surface>
                <Surface style={{ flex: 20, margin: "3%", borderRadius: 20, display: "flex" }} elevation={1} >
                    <Text variant="headlineSmall" style={{ marginTop: "6%", marginStart: "6%" }}>Получить</Text>
                    <View style={{ display: "flex", flexDirection: "row", flex: 1, margin: "6%" }}>
                        <Button
                            labelStyle={{ fontSize: 24, overflow: "visible" }}
                            icon="file-document" mode="contained"
                            onPress={() => navigation.navigate("AchievementRequest")}
                            style={{ justifyContent: "center" }}><Text style={{ fontSize: 14, color: "white" }}>Заявка на получение</Text>
                        </Button>
                    </View>
                </Surface>
                <Surface style={{ flex: 30, margin: "3%", borderRadius: 20, display: "flex" }} elevation={1}>
                    <View style={{ display: "flex", flexDirection: "row", marginTop: "6%", marginStart: "6%", alignItems: "center" }}>
                        <Text variant="headlineSmall">Контакты</Text>
                        <IconButton
                            mode="contained" style={{ marginStart: "auto", marginEnd: "6%" }}
                            icon="account-plus" selected={true} onPress={() => navigation.navigate("AddContact")} />
                    </View>
                    <View style={{ flex: 1 }}>
                        {
                            contacts?.length == 0 ?
                                (
                                    <View style={{ marginTop: "10%", alignItems: "center", marginBottom: "20%" }}>
                                        <Avatar.Icon icon="account-off" size={36} color={MD3LightTheme.colors.primary} style={{ backgroundColor: MD3LightTheme.colors.primaryContainer }} />
                                        <Text variant="labelLarge">Ничего не найдено</Text>
                                    </View>
                                ) : (
                                    <View>
                                        {
                                            contacts?.map((v) => <View key={v.id} style={{
                                                display: "flex", flexDirection: "row", marginStart: "3%", padding: "3%", borderRadius: 10, alignItems: "center"
                                            }}>
                                                <Text variant="labelLarge">{v.firstName + " " + v.lastName}</Text>
                                                <Text variant="labelLarge" style={{ marginStart: "7%", color: MD3LightTheme.colors.primary }}>{v.grade}</Text>
                                                <IconButton icon="bank-transfer-out" mode="contained" selected={true} style={{ marginStart: "auto" }}
                                                    onPress={() => navigation.navigate("OperationTransfer", { contacts, entry: v.id })} />
                                                <IconButton icon="trash-can" mode="contained" selected={true} />
                                            </View>)
                                        }
                                    </View>
                                )
                        }
                    </View>
                </Surface >
            </View >
        </ScrollView>
    )
}