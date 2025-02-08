import React from "react";
import {View ,TextInput ,StyleSheet} from "react-native";

const AddProduct = () => {
    return(
        <View>
            <TextInput
                style = {styles.input}
                placeholder="ชื่อสินค้า"
            />
            <TextInput
                style = {styles.input}
                placeholder="ราคาสินค้า"
            />
        </View>
    );
};

const styles = StyleSheet.create({
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        fontSize: 18,
        margin: 5
    },
})

export default AddProduct;