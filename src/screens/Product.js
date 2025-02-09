import React, {useState ,useEffect} from "react";
import {View ,TextInput ,StyleSheet, TouchableOpacity ,Text ,Alert ,Modal ,FlatList} from "react-native";
import Card from "../components/Card";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { launchImageLibrary } from "react-native-image-picker";

const Product = () => {
    const [isVisible, setIsVisible] = useState(false)
    const [image, setImage] = useState();
    const [name, setName] = useState("");
    const [price , setPrice] = useState("");
    const [product, setProduct] = useState([]);
    const [sumPrice, setSumprice] = useState(0);
    const [searchText, setSearchText] = useState("");
    const STORAGE_KEY = '@product_data';

    const addProduct = async () => {
        if(!name.trim() || !price.trim()){
            alert("กรุณากรอกชื่อสินค้า หรือราคาด้วย");
            return ;
        }
        const newProduct = { id:Date.now().toString(),name ,price ,image};
        const updateProduct = [newProduct, ...product]
        setProduct(updateProduct);
        setName("");
        setPrice("");
        calculateSumprice(updateProduct);

        try {
            console.log(STORAGE_KEY,updateProduct)
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updateProduct))
        } catch(error){
            console.log("Error : ",error )
        }
    };

    const loadProduct = async () => {
        try{
            const storedProduct = await AsyncStorage.getItem(STORAGE_KEY);
            setProduct(JSON.parse(storedProduct));
        } catch(error){
            console.log("Failed to load",error)
        }
    }

    useEffect(() => {
        loadProduct();
    }, []);

    const filteredProduct = product.filter((product) => 
        product.name.toLowerCase().includes(searchText.toLowerCase())
    );

    const deleteProduct = (name) => {
        const newList = product.filter((item) => item.name != name);
        setProduct(newList);
        calculateSumprice(newList);
    };
    const toggleCheck = (id) => {
        const updatedProducts = product.map((item) => {
            if (item.id === id) {
                return { ...item, check: !item.check };
            }
            return item;
        });
        setProduct(updatedProducts);
        calculateSumprice(updatedProducts);
    };
    const calculateSumprice = (product) => {
        const total = product.reduce((sum, item) => {
            if (item.check) {
                return sum ;
            }
            else{
                return sum + parseFloat(item.price);
            }
        },0 );
        setSumprice(total);
    };
    
    const openGallery = () => {
        const options = {
            mediaType: "photo",
            selectionLimit: 1,
        }
        launchImageLibrary( options, (response) => {
            if(response,didCancel){
                console.log("Cancel Gallery");
            } else if(response.errorMessage){
                console.log("Gallery Error : ",response.errorMessage);
            } else {
                console.log('Selected Image URI : ', response.assets[0].uri);
                const uri = response.assets[0].uri;
                setImage(uri);
            }
        });
    };

    return(
        <View style = {styles.container}>
            <TextInput
                style = {styles.input}
                placeholder="Search"
                value={searchText}
                onChangeText={setSearchText}
            />
            <FlatList
                data={filteredProduct}
                keyExtractor={(item) => item.id}
                renderItem={ ({item}) => {
                    return (
                        <Card
                            image = {item.image}
                            name = {item.name}
                            price = {item.price}
                            check = {item.check}
                            onDelete={() => deleteProduct(item.name)} // ส่งฟังก์ชันลบไปให้ Card
                            onCheckChange={() => toggleCheck(item.id)} // ส่งฟังก์ชันเปลี่ยนสถานะไปให้ Card
                        />
                    )
                }}
            />
            <View>
                <Text>ผลรวมของราคาสินค้า = {sumPrice} </Text>
            </View>
            <View style={styles.closebuttonContainer}>
                <TouchableOpacity 
                    style={styles.clearButton}
                    onPress={ () => {setProduct([]) , setSumprice(0)} }
                >
                    <Text>Clear All</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.buttonContainer}>
                <TouchableOpacity 
                    style={styles.button}
                    onPress={() => setIsVisible(true)}
                >
                    <Text>Add Product</Text>
                </TouchableOpacity>
            </View> 
            <Modal visible={isVisible} transparent ={true} animationType="slide">
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text>Add Product</Text>
                        <View style={styles.closeButton}>
                            <TouchableOpacity 
                                onPress={() => {
                                    setIsVisible(false);
                                }}
                            >
                                <Text style={styles.buttonText}>X</Text>
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity
                            style={styles.clearButton}
                            onPress={openGallery}
                        >
                            <Text>Select Image</Text>
                        </TouchableOpacity>
                        {image}
                        <TextInput
                            style={styles.input}
                            placeholder="ชื่อสินค้า"
                            value={name}
                            onChangeText={setName}
                        />
                        <TextInput
                            style={styles.input}
                            //keyboardType="decimal-pad"
                            placeholder="ราคาสินค้า"
                            value={price}
                            onChangeText={setPrice}
                        />
                        <TouchableOpacity 
                            onPress={() => {addProduct}}
                        >
                            <Text>Add Product</Text>
                        </TouchableOpacity>
                    </View>
                </View> 
            </Modal>
        </View>
    );
};
const styles = StyleSheet.create({
    container:{
        flex: 1,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        fontSize: 18,
        margin: 5
    },
    buttonContainer: { // Style สำหรับ View ที่ครอบปุ่ม
        position: 'absolute',
        bottom: 20, // ระยะห่างจากขอบล่าง
        left: 20,   // ระยะห่างจากขอบซ้าย
        right: 20,  // ระยะห่างจากขอบขวา (เพื่อให้ปุ่มเต็มความกว้าง)
    },
    closebuttonContainer: { // Style สำหรับ View ที่ครอบปุ่ม
        position: 'absolute',
        bottom: 80, // ระยะห่างจากขอบล่าง
        left: 20,   // ระยะห่างจากขอบซ้าย
        right: 20,  // ระยะห่างจากขอบขวา (เพื่อให้ปุ่มเต็มความกว้าง)
    },
    button: {
        backgroundColor: 'green',
        paadding: 10,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        width: 370,
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
    closeButton: {
        alignSelf: "flex-start",
        backgroundColor: 'grey',
        paadding: 10,
        borderRadius: 10,
        width: 35,
        height: 35
    },
    buttonText:{
        color: 'white',
        fontSize: 16,
        fontWeight: "bold",
        alignItems: 'center', 
        justifyContent: 'center'
    },
    clearButton:{
        alignSelf: "flex-start",
        backgroundColor: 'grey',
        paadding: 30,
        borderRadius: 10,
        width: 200,
        height: 50
    }
})

export default Product;