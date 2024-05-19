import { FlatList, StatusBar, StyleSheet, Text, View } from "react-native";
import React from "react";
import Header from "../components/Header";
import SearchInput from "../components/SearchInput";
import ListMessage from "../components/ListMessage";
import { HomeScreenTypes } from "../router";

const Home = ({ navigation }: HomeScreenTypes) => {
    return (
        <View style={styles.page}>
            <StatusBar backgroundColor="white" barStyle="dark-content" />
            <Header isBack={false} iconRight />
            <View style={styles.container}>
                <FlatList
                    ListHeaderComponent={() => (
                        <View style={{ marginBottom: 20 }}>
                            <SearchInput />
                        </View>
                    )}
                    data={[1, 2, 3, 4, 5, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 12, 123, 123123, 12312, 213]}
                    renderItem={({ }) => (
                        <ListMessage
                            name="Adhri"
                            message="Lorem, ipsum dolor sit amet consectetur adipisicing elit. Sed nobis delectus error optio velit mollitia iste debitis"
                            time="10.10"
                            isNewMessage={false}
                            onPress={() => navigation.navigate('ChatRoom')}
                        />
                    )}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 10 }}
                />
            </View>
        </View>
    );
}

export default Home;

const styles = StyleSheet.create({
    page: {
        flex: 1,
        backgroundColor: 'white'
    },
    container: {
        flex: 1,
        paddingHorizontal: 24,
    },
});
