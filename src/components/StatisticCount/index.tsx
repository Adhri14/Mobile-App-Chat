import React from "react";
import { Text, View, StyleSheet } from "react-native";
import { colors, fonts } from "../../assets/theme";

type StatisticCountType = {
    total: number;
    label: string;
}

const StatisticCount = (props: StatisticCountType) => {
    const { total, label } = props;

    return (
        <View style={styles.wrapperStatistic}>
            <Text style={styles.totalStatistic}>{total}</Text>
            <Text style={styles.labelStatistic}>{label}</Text>
        </View>
    );
}

export default StatisticCount;

const styles = StyleSheet.create({
    wrapperStatistic: {
        alignItems: 'center',
    },
    totalStatistic: {
        fontSize: 12,
        fontFamily: fonts.medium,
        color: colors.black
    },
    labelStatistic: {
        fontSize: 12,
        fontFamily: fonts.normal,
        color: colors.black
    }
});