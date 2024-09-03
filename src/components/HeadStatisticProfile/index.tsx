import React from "react";
import { Image, ImageURISource, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colors, fonts } from "../../assets/theme";
import StatisticCount from "../StatisticCount";
import { useNavigation } from "@react-navigation/native";
import { ProfileScreenTypes } from "../../router";
import HighlightText from "../HiglightText";

type HeadStatisticProfileType = {
    image: ImageURISource;
    totalPosting: number;
    totalFollowers: number;
    totalFollowing: number;
    fullname: string;
    bio?: string;
    onNavigate?: () => void;
    onMessage?: () => void;
    logout?: boolean;
    isFollowing?: boolean;
}

const HeadStatisticProfile = (props: HeadStatisticProfileType) => {
    const { image, totalPosting, totalFollowers, totalFollowing, fullname, bio, onNavigate, logout = false, isFollowing = false, onMessage } = props;
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
            {/* <Text style={styles.bio}>{bio}</Text> */}
            <HighlightText text={bio} isBio />
            <View style={styles.rowButton}>
                {!logout && isFollowing && (
                    <TouchableOpacity style={[styles.btn, { backgroundColor: colors.primary, width: '50%', marginRight: 10 }]} onPress={onMessage}>
                        <Text style={[styles.textBtn, { color: 'white' }]}>Kirim pesan</Text>
                    </TouchableOpacity>
                )}
                <TouchableOpacity style={[styles.btn, { backgroundColor: logout || isFollowing ? colors.gray : colors.primary, width: !logout && isFollowing ? '50%' : '100%' }]} onPress={onNavigate}>
                    <Text style={[styles.textBtn, { color: logout || isFollowing ? colors.black : 'white' }]}>{logout ? 'Edit profil' : isFollowing ? 'Berhenti mengikuti' : 'Ikuti'}</Text>
                </TouchableOpacity>
            </View>
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
        fontSize: 16,
        fontFamily: fonts.bold,
        color: colors.primary,
        marginBottom: 5
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
        marginTop: 10
    },
    textBtn: {
        fontSize: 14,
        fontFamily: fonts.medium,
        color: colors.black
    },
    rowButton: {
        flexDirection: 'row',
        alignItems: 'center'
    }
});