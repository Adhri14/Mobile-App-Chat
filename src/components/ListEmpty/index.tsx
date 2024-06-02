import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors, fonts } from "../../assets/theme";

type ListEmpty = {
    message?: string;
}

const ListEmpty = (props: ListEmpty) => {
    return (
        <View style={styles.empty}>
            <Text style={styles.textEmpty}>{props.message}</Text>
        </View>
    );
}

export default ListEmpty;

const styles = StyleSheet.create({
    empty: {
        flex: 1,
        alignItems: 'center',
        marginTop: 20
    },
    textEmpty: {
        fontSize: 14,
        fontFamily: fonts.medium,
        color: colors.black,
        textAlign: 'center',
    }
});