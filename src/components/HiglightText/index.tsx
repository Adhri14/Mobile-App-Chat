import React, { useCallback } from "react";
import { View, Text, StyleSheet, TextStyle, Linking, Alert, Pressable } from "react-native";
import { colors, fonts } from "../../assets/theme";

type HighlightTextType = {
    text?: string;
    isBio?: boolean;
}

type Parts = {
    text: string;
    isMatch: boolean;
}

const HighlightText = (props: HighlightTextType) => {
    const regex = /https?:\/\/[^\s]+/g; // Regex untuk URL
    const { text }: any = props;
    const splitTextByRegex = (text: string, regex: any) => {
        const newParts: Parts[] = [];
        let lastIndex = 0;

        text.replace(regex, (match?: string, index?: number) => {
            if (Number(index) > lastIndex) {
                newParts.push({ text: text.slice(lastIndex, Number(index)), isMatch: false });
            }
            newParts.push({ text: String(match), isMatch: true });
            lastIndex = Number(index) + Number(match?.length);
        });

        if (lastIndex < text.length) {
            newParts.push({ text: text.slice(lastIndex), isMatch: false });
        }

        return newParts;
    };

    const parts = splitTextByRegex(text!, regex);

    const onOpenURL = useCallback(async (url: string) => {
        console.log('cek url : ', url);
        const supported = await Linking.canOpenURL(url);
        console.log('cek url : ', supported);
        if (supported) {
            await Linking.openURL(url);
        } else {
            await Linking.openURL(url);
        }
    }, []);

    return (
        <Text style={[styles.bio, { paddingRight: props.isBio ? 30 : 0 }]}>
            {parts.map((part, index) => (
                part.isMatch ? <Text
                    key={index}
                    style={styles.highlightStyle}
                    onPress={() => onOpenURL(part.text)}
                >
                    {part.text}
                </Text> : <Text
                    key={index}
                    style={{ color: colors.black }}
                >
                    {part.text}
                </Text>
            ))}
        </Text>
    );
}

export default HighlightText;

const styles = StyleSheet.create({
    bio: {
        fontSize: 12,
        fontFamily: fonts.normal,
        color: colors.black,
    },
    highlightStyle: {
        color: colors.primary,
    }
});