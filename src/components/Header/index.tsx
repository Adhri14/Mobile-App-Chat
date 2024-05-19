import React from "react";
import { View, Text, StyleSheet, Image, Pressable } from "react-native";

const Header = ({ onPress }: { onPress: () => void }) => {
    return (
        <View style={styles.container}>
            <Pressable style={styles.button} onPress={onPress}>
                <Image source={require('../../assets/images/icon-back.png')} style={styles.image} />
            </Pressable>
            {/* <Text>Header</Text> */}
        </View>
    );
}

export default Header;

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 24,
        paddingVertical: 10,
        backgroundColor: 'white'
    },
    button: {
        width: 50,
        height: 50,
        justifyContent: 'center',
    },
    image: {
        width: 30,
        height: 30
    }
});