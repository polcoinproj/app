import { useState } from "react";
import { Keyboard } from "react-native";
import { Modal, Searchbar, TouchableRipple, Text } from "react-native-paper";

export interface ListItem {
    id: number;
    value: string;
}

interface ListProps {
    visible: boolean;
    onDismiss: () => void;
    onSelect: (id: number) => void;
    data?: ListItem[];
}

export function List(props: ListProps) {
    const [query, setQuery] = useState<string>("");

    var data = props.data?.filter((e) => e.value.toLowerCase().includes(query));

    return (
        <Modal
            visible={props.visible}
            onDismiss={props.onDismiss}
            contentContainerStyle={{
                backgroundColor: "white",
                width: "80%",
                height: "50%",
                alignSelf: "center",
                justifyContent: "flex-start",
            }}
        >
            <Searchbar
                value={query}
                onChangeText={setQuery}
                style={{
                    margin: "5%",
                }}
            />
            {data?.map((v: ListItem) => (
                <TouchableRipple
                    style={{
                        width: "100%",
                        height: "15%",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                    key={v.id}
                    rippleColor="rgba(0, 0, 0, .10)"
                    onPress={() => {
                        props.onSelect(v.id);

                        props.onDismiss();
                    }}
                >
                    <Text>{v.value}</Text>
                </TouchableRipple>
            ))}
        </Modal>
    );
}
