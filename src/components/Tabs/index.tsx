
import React, { useState, useEffect, useRef } from 'react';
import { View, SafeAreaView, TouchableOpacity, Animated, useWindowDimensions, FlatList, Text } from 'react-native';
import { colors, fonts } from '../../assets/theme';

// import Text from '@src/components/Text';
// import { useColor } from '@src/components/Color';
// import { Divider, Line } from '@src/styled';

type TabIndicatorProps = {
    measures: any[];
    scrollX: any;
    data: any[];
}

const TabIndicator = ({ measures, scrollX, data }: TabIndicatorProps) => {
    const { width } = useWindowDimensions();
    // const { Color } = useColor();

    const inputRange = data.map((_, i) => i * width);
    const indicatorWidth = scrollX.interpolate({
        inputRange,
        outputRange: measures.map((m) => m.width),
    });

    const translateX = scrollX.interpolate({
        inputRange,
        outputRange: measures.map((m) => m.x),
    });

    return (
        <Animated.View style={{
            height: 2,
            left: 16,
            width: width / data.length - 32, // indicatorWidth,
            backgroundColor: colors.primary,
            transform: [{
                translateX: translateX
            }]
        }} />
    )
}

type TabHeaderProps = {
    scrollX: any;
    onPress: (index: number) => void;
    activeIndex: number;
    data: any[];
}

const TabHeader = ({ scrollX, onPress, activeIndex, data }: TabHeaderProps) => {
    const [measures, setMeasures] = useState<{ x: number, y: number, width: number, height: number }[]>([]);
    const [reload, setReload] = useState(false);

    const { width: windowWidth } = useWindowDimensions();
    const containerRef = useRef<View>(null);
    // const { Color } = useColor();

    useEffect(() => {
        let m = [];
        data.forEach((item) => {
            if (item.ref.current) {
                item.ref.current.measureLayout(
                    containerRef.current,
                    (x: number, y: number, width: number, height: number) => {
                        if (x === 0 && y === 0 && width === 0 && height === 0) {
                            setReload(true);
                            return;
                        }

                        setReload(false);

                        m.push({
                            x, y, width, height
                        });

                        if (m.length === data.length) {
                            setMeasures(m);
                        }
                    }
                );
            }
        });
    }, [reload, data]);

    return (
        <View
            ref={containerRef}
            style={{
                width: windowWidth,
                paddingTop: 24,
                justifyContent: 'center',
            }}
        >
            <View style={{ width: windowWidth - 32, flexDirection: 'row', justifyContent: 'space-between' }}>
                {data.map((item, idx) => {
                    return (
                        <TouchableOpacity
                            key={idx}
                            ref={item.ref}
                            onPress={() => onPress(idx)}
                            style={{
                                width: windowWidth / data.length - 0,
                                alignItems: 'center',
                            }}
                        >
                            <Text
                                style={{
                                    color: activeIndex === idx ? colors.primary : colors.dark,
                                    fontSize: 16,
                                    fontFamily: activeIndex === idx ? fonts.bold : fonts.normal,
                                    marginBottom: 8,
                                }}
                            >{item.title}</Text>
                        </TouchableOpacity>
                    )
                })}
            </View>

            {/* <Divider height={8} /> */}

            {/* <Line
                width={windowWidth - 32}
                color={Color.border}
                style={{ position: 'absolute', bottom: 0, left: 16 }}
            /> */}

            {measures.length > 0 &&
                <TabIndicator
                    measures={measures}
                    scrollX={scrollX}
                    data={data}
                />
            }
        </View>
    )
}

type TabsProps = {
    data: any[];
    onChangeTab?: (index: number) => void;
    initialRouteIndex?: number;
    userId: string;
}

const Tabs = (props: TabsProps) => {
    const {
        data,
        initialRouteIndex,
        userId,
    } = props;

    const [activeIndex, setActiveIndex] = useState(initialRouteIndex || 0);

    const { width, height } = useWindowDimensions();
    // const { Color } = useColor();

    const flatListRef = useRef<FlatList>(null);
    const scrollX = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (activeIndex < data.length) {
            props.onChangeTab && props.onChangeTab(activeIndex);
            goToNext(activeIndex);
        }
    }, [activeIndex]);

    useEffect(() => {
        setTimeout(() => {
            goToNext(initialRouteIndex as number);
        }, 1000);
    }, [initialRouteIndex]);

    const getItemLayout = (data: any, index: number) => (
        { length: data.length, offset: width * index, index }
    )

    const goToNext = (index: number) => {
        if (flatListRef.current) {
            flatListRef.current?.scrollToIndex({ animated: true, index });
        }
    }

    return (
        <SafeAreaView
            style={{
                flex: 1,
                backgroundColor: colors.white,
            }}
        >
            <TabHeader
                scrollX={scrollX}
                onPress={(i) => setActiveIndex(i)}
                activeIndex={activeIndex}
                data={data}
            />

            <Animated.FlatList
                ref={flatListRef}
                keyExtractor={(item) => item.key}
                data={data}
                pagingEnabled
                horizontal
                bounces={false}
                showsHorizontalScrollIndicator={false}
                keyboardShouldPersistTaps='handled'
                getItemLayout={getItemLayout}
                initialNumToRender={1}
                initialScrollIndex={activeIndex}
                onMomentumScrollEnd={event => {
                    setActiveIndex(event.nativeEvent.contentOffset.x / width)
                }}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { x: scrollX } } }], { useNativeDriver: false }
                )}
                renderItem={({ item, index }) => {
                    const Component = item.children;
                    return (
                        <View style={{ width, padding: 18 }} key={index}>
                            <Component userId={userId} />
                        </View>
                    )
                }}
            />
        </SafeAreaView>
    );
}

export default Tabs;