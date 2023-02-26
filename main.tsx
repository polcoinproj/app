import React from "react";
import { StyleSheet, View } from "react-native";
import { Button, Modal, Text, TextInput, TouchableRipple, Searchbar } from "react-native-paper";

export function Main() {
    const [schoolVisible, setSchoolVisible] = React.useState(false)
    const [schoolData, setSchoolData] = React.useState("")

    return (
        <View style={StyleSheet.absoluteFill}>
            <View style={[StyleSheet.absoluteFill, { justifyContent: "center", alignItems: "center" }]} >
                <Text variant="headlineMedium">Регистрация</Text>

                <View style={{ display: "flex", flexDirection: "row", paddingTop: "5%" }}>
                    <TextInput label="Имя" style={{ width: 120 }} />
                    <TextInput label="Фамилия" style={{ width: 170, marginStart: 5 }} />
                </View>
                <TextInput label="Электронный адрес" style={{ marginTop: "2%", width: 300 }} />
                <View style={{ display: "flex", flexDirection: "row", paddingTop: "2%" }}>
                    <TouchableRipple onPress={() => {
                        setSchoolVisible(true)
                    }}>
                        <TextInput
                            label="Школа"
                            style={{ width: 200 }}
                            editable={false}
                        />
                    </TouchableRipple>
                    <TextInput label="Класс" style={{ width: 100, marginStart: 5 }} />
                </View>

                <Button mode="contained" style={{ marginTop: "5%" }}>Начать</Button>
            </View>
            <View style={[StyleSheet.absoluteFill, { justifyContent: "flex-end", alignItems: "center" }]}>
                <Button style={{ marginBottom: "5%" }}>У меня уже есть аккаунт</Button>
            </View>
            <Modal visible={schoolVisible} onDismiss={() => setSchoolVisible(false)} contentContainerStyle={{
                backgroundColor: "white",
                width: "80%",
                height: "50%",
                alignSelf: "center",
                justifyContent: "flex-start"
            }}>
                <Searchbar value={schoolData} onChangeText={setSchoolData} style={{
                    margin: "5%"
                }} />
            </Modal>
        </View>
    )
}