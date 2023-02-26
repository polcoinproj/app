import { View, StyleSheet, StatusBar, LogBox, Keyboard } from "react-native";
import { Appbar, Button, Surface, TextInput, Text, MD3LightTheme, Avatar, IconButton } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { ScrollView } from "react-native-gesture-handler";
import { useAlerts } from "react-native-paper-alerts";
import { Api } from "../api/main";

export function AchievementRequestScreen({ navigation }: any) {
    LogBox.ignoreLogs(["Currently we support only"]);

    const [attachments, setAttachments] = useState<ImagePicker.ImageInfo[]>([]);
    const addAttachment = (val: ImagePicker.ImageInfo) => {
        setAttachments(attachments.concat([val]));
    }

    const [comment, setComment] = useState<string>("");
    const [loading, setLoading] = useState<boolean>();

    const alerts = useAlerts();

    const makeAlert = (content: string) => {
        alerts.alert(
            "Ошибка",
            content,
            [{ text: "Хорошо" }]
        );

        Keyboard.dismiss();
    };

    const api = new Api();

    return (
        <View style={StyleSheet.absoluteFill}>
            <Appbar.Header statusBarHeight={__DEV__ ? StatusBar.currentHeight! * 1.5 : 0}>
                <Appbar.BackAction onPress={() => navigation.goBack()} />
                <Appbar.Content title="Заявка на получение" />
            </Appbar.Header>
            <View style={[StyleSheet.absoluteFill, { justifyContent: "center", alignItems: "center" }]}>
                <Surface style={{ width: "90%", height: "50%", justifyContent: "center", alignItems: "center", borderRadius: 20 }} elevation={1}>
                    <View style={{
                        width: "90%",
                        maxHeight: "50%",
                        paddingBottom: "2%",
                        borderTopRightRadius: 5,
                        borderTopLeftRadius: 5,
                        borderBottomColor: MD3LightTheme.colors.outline,
                        borderBottomWidth: 1,
                        backgroundColor: "#E7DFEC",
                    }}>
                        <ScrollView>
                            <Text variant="bodyLarge" style={{ margin: "5%", color: "#4B4350" }}>Подтверждения достижений</Text>
                            <View style={{ width: "100%", justifyContent: "center", padding: "2%" }}>
                                {
                                    attachments.map((e, k) => (
                                        <View style={{ display: "flex", flexDirection: "row", marginHorizontal: "5%", marginTop: (k > 0) ? "2%" : "0%" }} key={k}>
                                            <Avatar.Image size={48} source={{ uri: e.uri }} />
                                            <IconButton icon="trash-can" mode="contained" style={{ marginStart: "auto" }} onPress={
                                                () => setAttachments(attachments.filter((v) => v != e))
                                            } />
                                        </View>
                                    ))
                                }
                                <Button icon="file-plus" onPress={() => {
                                    ImagePicker.launchImageLibraryAsync({
                                        mediaTypes: ImagePicker.MediaTypeOptions.Images,
                                        allowsEditing: false,
                                    }).then((val) => {
                                        if (val.cancelled) {
                                            return;
                                        }

                                        const type: string = val.uri.split(".").pop()!;
                                        if (!["png", "jpg", "jpeg"].includes(type)) {
                                            makeAlert("Неподдерживаемый тип изображения");

                                            return;
                                        }

                                        val.type = "image/" + ((["jpg", "jpeg"].includes(type)) ? "jpeg" : "png") as any;
                                        val.fileName = val.uri.split("/").pop()!

                                        addAttachment(val);
                                    });
                                }}>Добавить</Button>
                            </View>
                        </ScrollView>
                    </View>
                    <TextInput placeholder="Комментарий (не обязательно)" style={{ width: "90%", height: "15%", marginTop: "5%" }}
                        multiline={true} value={comment} onChangeText={(t) => setComment(t)} />
                    <Button mode="contained" style={{ marginTop: "7%" }} loading={loading} onPress={() => {
                        if (!attachments.length) {
                            makeAlert("Нужно прикрепить хотя бы одно подтверждение");

                            return;
                        }

                        setLoading(true);

                        api.createAchievement({ comment })
                            .then((id: number) => api.achievementAttach(id, attachments)
                                .then(() => navigation.navigate("SuccessScreenTransfer"))
                                .catch(() => makeAlert("Неизвестная ошибка"))
                                .finally(() => setLoading(false)))
                            .catch(() => {
                                makeAlert("Неизвестная ошибка");

                                setLoading(false);
                            })
                    }}>Отправить</Button>
                </Surface>
            </View >
        </View >
    );
}