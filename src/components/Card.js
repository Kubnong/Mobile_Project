import React from "react";
import { Touchable } from "react-native";
import { View, Text, StyleSheet, Image ,TouchableOpacity} from "react-native";
import CheckBox from "react-native-check-box";

const Card = ({image ,name , price , onDelete ,check ,onCheckChange}) => {
    return (
        <View style={styles.card}>
            <View>
                {image}
                <Text style={styles.title}>{name}</Text>
                <Text style={styles.content}>{price}</Text>
                <CheckBox
                    style={styles.checkbox}
                    isChecked={check}
                    onClick={onCheckChange}
                />
                <Text style={styles.text}>Buy</Text>
            </View>
            <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
                    <Text style={styles.deleteText}>X</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: 'white',
        padding: 20, // เพิ่มระยะห่างด้านในของการ์ด
        borderRadius: 10, // มุมของการ์ดโค้งมน 10 หน่วย
        margin: 10,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 2,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    content: {
        fontSize: 14,
        color: '#555'
    },
    image: {
        width: 300,
        height: 350,
        resizeMode: 'cover', // ทำให้รูปภาพพอดีกับพื้นที่โดยคงอัตราส่วนเดิม
        borderRadius: 10,
    },
    text: {
        fontSize: 18,
    },
    deleteButton: {
        backgroundColor: "red",
        padding: 10,
        borderRadius: 5,
    },
    deleteText: {
        color: "white",
        fontWeight: "bold",
    },
    checkbox: {
        alignSelf: 'center',
    },
})
export default Card;