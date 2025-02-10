import React from "react";
import { Touchable } from "react-native";
import { View, Text, StyleSheet, Image ,TouchableOpacity} from "react-native";
import CheckBox from "react-native-check-box";

const Card = ({image , name , price , edit, onDelete ,check ,onCheckChange ,category, textStyle}) => {
    return (
        <View style={[styles.card ,textStyle]}>
            <View>
                <Image
                    source={{uri:image}}
                    style={styles.image}
                />
                <Text style={styles.title}>{name}</Text>
                <Text style={styles.content}>price : {price}</Text>
                <Text style={styles.content}>category : {category}</Text>
                <View style={styles.containerCheckbox}>
                    <CheckBox
                        style={styles.checkbox}
                        isChecked={check}
                        onClick={onCheckChange}
                    />
                    <Text style={styles.text}>Buy</Text>
                </View>
            </View>
            <View>
                <TouchableOpacity style={styles.editButton} onPress={edit}>
                    <Text style={styles.deleteText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
                    <Text style={styles.deleteText}>X</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        width: '45%',
        height: 250,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        backgroundColor: 'white',
        borderColor: '#3674B5', 
        borderWidth: 2,
        padding: 10, // เพิ่มระยะห่างด้านในของการ์ด
        borderRadius: 10, // มุมของการ์ดโค้งมน 10 หน่วย
        margin: 11,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    },
    title: {
        fontSize: 17,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    content: {
        fontSize: 14,
        color: '#555'
    },
    text: {
        fontSize: 15,
    },
    editButton: {
        backgroundColor: "grey",
        padding: 5,
        borderRadius: 5,
        top: 200,
        right: 18,
    },
    deleteButton: {
        backgroundColor: "red",
        padding: 5,
        borderRadius: 5,
        right: 18,
        top: -35,
        alignItems: 'center', 
        justifyContent: 'center'
    },
    deleteText: {
        color: "white",
        fontWeight: "bold",
    },
    checkbox: {
        width: 25,
    },
    image: {
        width: 150,
        height: 140,
        resizeMode:'center', // ทำให้รูปภาพพอดีกับพื้นที่โดยคงอัตราส่วนเดิม
        borderRadius: 10,
    },
    containerCheckbox:{
        flexDirection: 'row',
    }
})
export default Card;