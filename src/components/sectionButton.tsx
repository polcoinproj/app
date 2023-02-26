import { TouchableRipple, Text } from "react-native-paper";

export interface SectionButtonProps {
    text: string
    onPress: (() => void)
    variant?: string
}

export function SectionButton(props: SectionButtonProps) {
    const bottomRadius = (["bottom", "both"].includes(props.variant!)) ? 20 : 0;
    const topRadius = (["top", "both"].includes(props.variant!)) ? 20 : 0;

    return (
        <TouchableRipple style={{
            padding: "7%",
            borderTopRightRadius: topRadius,
            borderTopLeftRadius: topRadius,
            borderBottomRightRadius: bottomRadius,
            borderBottomLeftRadius: bottomRadius,
        }} onPress={props.onPress} borderless={true}>
            <Text>{props.text}</Text>
        </TouchableRipple>
    );
}