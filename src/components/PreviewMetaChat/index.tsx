import { Animated, Dimensions, Image, Pressable, StyleSheet, Text, useWindowDimensions, View } from "react-native";
import { colors, fonts } from "../../assets/theme";
import { metaDataState, MetaDataType } from "../../recoil/state";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

type PreviewMetaChatType = {
    fadeAnimation?: any;
    onPress?: () => void;
}

const initValue = {
    title: '',
    description: '',
    image: '',
    url: '',
};

export default function PreviewMetaChat(props: PreviewMetaChatType) {
    const { fadeAnimation, onPress } = props;
    const regex = /https?:\/\/[^\s]+/g; // Regex untuk URL
    const metaDataValue = useRecoilValue(metaDataState);
    const [metaTagging, setMetaTagging] = useState<MetaDataType>(initValue);
    const [isShowMeta, setIsShowMeta] = useState(false);

    useEffect(() => {
        if (metaDataValue.status && metaDataValue.data) {
            setMetaTagging(metaDataValue?.data!);
            setIsShowMeta(true);
        } else {
            setMetaTagging(initValue);
            setIsShowMeta(false);
        }
    }, [metaDataValue.status, metaDataValue.data]);

    console.log(metaDataValue.data);

    if (metaDataValue && metaDataValue?.isLoading) {
        return (
            <View style={{ width: '100%', backgroundColor: colors.gray, paddingVertical: 10 }}>
                <SkeletonPlaceholder>
                    <SkeletonPlaceholder.Item style={styles.rowPlaceholder}>
                        <SkeletonPlaceholder.Item
                            width={70}
                            height={70}
                            borderRadius={10}
                            justifyContent="center"
                            alignItems="center"
                            style={{ marginLeft: 20 }}
                        />

                        {/* Placeholder for the text */}
                        <SkeletonPlaceholder.Item marginLeft={10}>
                            <SkeletonPlaceholder.Item width={200} height={20} borderRadius={4} />
                            <SkeletonPlaceholder.Item width={150} height={15} borderRadius={4} marginTop={5} />
                        </SkeletonPlaceholder.Item>
                    </SkeletonPlaceholder.Item>
                </SkeletonPlaceholder>
                <View style={[styles.rowPlaceholder, { position: 'absolute', top: 10, left: 20 }]}>
                    <View style={{ width: 70, height: 70, justifyContent: 'center', alignItems: 'center', borderRadius: 10, transform: [{ rotate: '-40deg' }] }}>
                        <Ionicons name="link-outline" size={24} color={colors.black} />
                    </View>
                </View>
            </View>
        );
    }

    if (isShowMeta && metaDataValue && !metaDataValue?.isLoading) {
        return (
            <Animated.View style={[styles.containerMeta, { opacity: fadeAnimation }]}>
                {regex.test(metaTagging?.image!) ? <Image style={{ width: 70, height: '100%', resizeMode: 'cover' }} source={{ uri: metaTagging?.image }} /> : null}
                <View style={{ flex: 1, padding: 10 }}>
                    <Text style={styles.titleMeta} numberOfLines={1}>{metaTagging?.title}</Text>
                    <Text style={styles.descMeta} numberOfLines={1}>{metaTagging?.description}</Text>
                    <Text style={styles.urlMeta}>{metaTagging?.url}</Text>
                </View>
                <Pressable style={{ paddingRight: 24 }} onPress={onPress}>
                    <Ionicons name="close-circle-outline" size={24} color={colors.black} />
                </Pressable>
            </Animated.View>
        );
    }

    return null;
}

const styles = StyleSheet.create({
    containerMeta: {
        flexDirection: 'row',
        backgroundColor: colors.gray,
        marginBottom: 5,
        alignItems: 'center',
    },
    titleMeta: {
        fontSize: 16,
        fontFamily: fonts.bold,
        color: colors.black,
        marginBottom: 5,
    },
    descMeta: {
        fontSize: 12,
        fontFamily: fonts.normal,
        color: colors.black,
    },
    urlMeta: {
        fontSize: 10,
        fontFamily: fonts.normal,
        color: colors.black,
        marginTop: 'auto',
    },
    rowPlaceholder: {
        width: '100%',
        flexDirection: 'row',
        marginBottom: 5,
        // alignItems: 'center',
    }
});