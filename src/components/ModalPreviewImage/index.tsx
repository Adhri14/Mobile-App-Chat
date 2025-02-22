import React, { ReactNode } from "react";
import { View, Modal, StyleSheet, Dimensions } from "react-native";

type ModalPreviewImageProps = {
    children: ReactNode;
    visible: boolean;
    onRequestClose: () => void;
}

const { width, height } = Dimensions.get('window');

export default function ModalPreviewImage({ children, visible, onRequestClose }: ModalPreviewImageProps) {
    return (
        <Modal visible={visible} onRequestClose={onRequestClose} animationType="slide" style={styles.container}>
            <View style={styles.modal}>
                {children}
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
    },
    modal: {
        // flex: 1,
        width,
        height,
        backgroundColor: 'black',
        flexDirection: 'column',
        paddingTop: 40,
        position: 'absolute',
        // zIndex: 1,
    }
});