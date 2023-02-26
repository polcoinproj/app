import { useEffect, useState } from "react";
import { ScrollView, StatusBar, View } from "react-native";
import { StyleSheet } from "react-native";
import { Appbar, Surface, Text, TouchableRipple } from "react-native-paper";
import { Api } from "../api/main";
import { Achievement, AchievementStatus } from "../api/types";
import { LoadingComponent } from "../loading";

export function AchievementsApprovementScreen({ navigation }: any) {
    const [data, setData] = useState<Achievement[]>();
    const [isLoading, setLoading] = useState<boolean>(true);

    const api = new Api();

    useEffect(() => {
        (async () => {
            setData(
                await api.achievementsGetByStatus(AchievementStatus.inProcess)
            );
            setLoading(false);
        })();
    }, []);

    if (isLoading) {
        return <LoadingComponent />;
    }

    return (
        <View>
            <Appbar.Header
                statusBarHeight={__DEV__ ? StatusBar.currentHeight! * 1.5 : 0}
            >
                <Appbar.BackAction onPress={() => navigation.goBack()} />
                <Appbar.Content title="Заявки" />
            </Appbar.Header>
            <ScrollView>
                {data?.map((e, k) => (
                    <Surface
                        elevation={1}
                        style={{
                            margin: "5%",
                            borderRadius: 20,
                        }}
                        key={k}
                    >
                        <TouchableRipple
                            onPress={() => {}}
                            style={{
                                borderRadius: 20,
                                padding: "5%",
                            }}
                        >
                            <View>
                                <View
                                    style={{
                                        display: "flex",
                                        flexDirection: "row",
                                    }}
                                >
                                    <Text
                                        variant="titleMedium"
                                        style={{
                                            color: "gray",
                                            marginEnd: "3%",
                                        }}
                                    >
                                        #{e.id}
                                    </Text>
                                    <Text variant="titleMedium">
                                        {e.user.firstName} {e.user.lastName}
                                    </Text>
                                    <Text
                                        variant="titleMedium"
                                        style={{ marginStart: "auto" }}
                                    >
                                        {e.user.grade}
                                    </Text>
                                </View>
                                {e.comment ? (
                                    <Text
                                        variant="bodyMedium"
                                        style={{ margin: "2%" }}
                                    >
                                        {e.comment}
                                    </Text>
                                ) : (
                                    <Text
                                        variant="bodyMedium"
                                        style={{ margin: "2%", color: "gray" }}
                                    >
                                        пустой комментарий
                                    </Text>
                                )}
                            </View>
                        </TouchableRipple>
                    </Surface>
                ))}
            </ScrollView>
        </View>
    );
}
