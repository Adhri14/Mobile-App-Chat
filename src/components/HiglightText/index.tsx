import React, { useCallback } from "react";
import { View, Text, StyleSheet, TextStyle, Linking, Alert } from "react-native";
import { colors, fonts } from "../../assets/theme";

type HighlightTextType = {
    text?: string;
}

type Parts = {
    text: string;
    isMatch: boolean;
}

const HighlightText = (props: HighlightTextType) => {
    const regex = /https?:\/\/[^\s]+/g; // Regex untuk URL
    const { text } = props;
    const splitTextByRegex = (text: string, regex: any) => {
        const newParts: Parts[] = [];
        let lastIndex = 0;

        text.replace(regex, (match: string, index?: number) => {
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
        const supported = await Linking.canOpenURL(url);
        if (supported) {
            await Linking.openURL(url);
        }
    }, []);

    return (
        <Text style={[styles.bio]}>
            {parts.map((part, index) => (
                <Text
                    key={index}
                    style={part.isMatch ? styles.highlightStyle : null}
                    onPress={() => part.isMatch ? onOpenURL(part.text) : null}
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
        paddingRight: 30,
        fontFamily: fonts.normal,
        color: colors.black,
    },
    highlightStyle: {
        color: colors.primary,
    }
});