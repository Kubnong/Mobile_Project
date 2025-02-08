import React, {useState} from "react";
import {View ,TextInput ,StyleSheet, TouchableOpacity ,Text ,Alert ,Modal} from "react-native";
const Product = () => {
    const [isVisible, setIsVisible] = useState(false)
    return(
        <View style = {styles.container}>
            <TextInput
                style = {styles.input}
                placeholder="Search"
            />
            <TouchableOpacity 
                style={styles.button}
                onPress={() => setIsVisible(true)}
            >
                <Text>Add Product</Text>
            </TouchableOpacity> 
            <Modal visible={isVisible} transparent ={true} animationType="slide">
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <TextInput
                            style={styles.input}
                            placeholder="ชื่อสินค้า"
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="ราคาสินค้า"
                        />
                        <TouchableOpacity 
                            style={styles.button}
                            onPress={() => {
                                setIsVisible(false);
                            }}
                        ></TouchableOpacity>
                    </View>
                </View> 
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container:{
        flex: 1,
        flexDirection:"column"
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        fontSize: 18,
        margin: 5
    },
    button: {
        backgroundColor: 'green',
        paadding: 10,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        width: 200,
        height: 50
    },
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.5)",
    },
    modalContent: {
        width: 300,
        height: 400,
        backgroundColor: "white",
        padding: 20,
        borderRadius: 10,
        alignItems: "center",
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        fontSize: 18,
        margin: 5
    },
})

export default Product;