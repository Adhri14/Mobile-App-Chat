import React from "react";
import { Image, ImageURISource, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colors, fonts } from "../../assets/theme";
import StatisticCount from "../StatisticCount";
import { useNavigation } from "@react-navigation/native";
import { ProfileScreenTypes } from "../../router";

type HeadStatisticProfileType = {
    image: ImageURISource;
    totalPosting: number;
    totalFollowers: number;
    totalFollowing: number;
    fullname: string;
    bio?: string;
    onNavigate?: () => void;
}

const HeadStatisticProfile = (props: HeadStatisticProfileType) => {
    const { image, totalPosting, totalFollowers, totalFollowing, fullname, bio, onNavigate } = props;
    return (
        <View style={styles.container}>
            <View style={styles.wrapperHeader}>
                <View style={styles.wrapperImage}>
                    <Image source={image} style={styles.image} />
                </View>
                <View style={styles.statistic}>
                    {/* <StatisticCount total={totalPosting} label="postingan" /> */}
                    <StatisticCount total={totalFollowers} label="pengikut" />
                    <StatisticCount total={totalFollowing} label="mengikuti" />
                </View>
            </View>
            <Text style={styles.name}>{fullname}</Text>
            <Text style={styles.bio}>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Eos non impedit excepturi, quisquam iste reiciendis beatae blanditiis dicta.</Text>
            <TouchableOpacity style={styles.btn} onPress={onNavigate}>
                <Text style={styles.textBtn}>Edit profil</Text>
            </TouchableOpacity>
        </View>
    );
}

export default HeadStatisticProfile;

const styles = StyleSheet.create({
    container: {
        marginBottom: 30
    },
    wrapperImage: {
        width: 110,
        height: 110,
        borderRadius: 110 / 2,
        overflow: 'hidden',
        padding: 4,
        backgroundColor: colors.primarySoft
    },
    image: {
        width: '100%',
        aspectRatio: 1,
        borderRadius: 110 / 2
    },
    wrapperHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 10
    },
    statistic: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        flex: 1,
        marginLeft: 20
    },
    name: {
        fontSize: 12,
        fontFamily: fonts.bold,
        color: colors.primary
    },
    bio: {
        fontSize: 12,
        paddingRight: 30,
        fontFamily: fonts.normal
    },
    btn: {
        paddingVertical: 10,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
        backgroundColor: colors.gray,
        marginTop: 10
    },
    textBtn: {
        fontSize: 14,
        fontFamily: fonts.medium,
        color: colors.black
    }
});