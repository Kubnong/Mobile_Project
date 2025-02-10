import React, {useState ,useEffect} from "react";
import {View ,TextInput ,StyleSheet, TouchableOpacity ,Text ,Modal ,FlatList ,ScrollView} from "react-native";
import Card from "../components/Card";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CheckBox from "react-native-check-box";
import { Switch } from "react-native-gesture-handler";

const Product = () => {
    const [isVisible, setIsVisible] = useState(false)
    const [name, setName] = useState("");
    const [price , setPrice] = useState("");
    const [url , setUrl] = useState("");
    const [product, setProduct] = useState([]);
    const [sumPrice, setSumprice] = useState(0);
    const [category, setCategory] = useState("");
    const [searchText, setSearchText] = useState("");
    const [searchCategory, setSearchCategory] = useState("");
    const [edit , setEdit] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const STORAGE_KEY = '@product_data';

    const addProduct = async () => { // เพิ่มสินค้า
        if(!url.trim() || !name.trim() || !price.trim() || !category.trim()){
            alert("กรุณากรอกข้อมูลให้ครบถ้วน");
            return ;
        }
        let updateProduct;

        if(edit) {
            updateProduct = product.map((item) =>
                item.id === edit ? { ...item, url, name, price, category } : item
            );
        }
        else {
            const newProduct = { id:Date.now().toString(),url ,name ,price ,category};
            updateProduct = [newProduct, ...product]
        }
        
        setProduct(updateProduct);
        setUrl("");
        setName("");
        setPrice("");
        setCategory("");
        setEdit(false);
        calculateSumprice(updateProduct);

        try {
            console.log(STORAGE_KEY,updateProduct)
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updateProduct))
        } catch(error){
            console.log("Error : ",error )
        }
    };

    const loadProduct = async () => {
        try {
            const storedProduct = await AsyncStorage.getItem(STORAGE_KEY);
            setProduct(storedProduct ? JSON.parse(storedProduct) : []);
            calculateSumprice(storedProduct ? JSON.parse(storedProduct) : []);
        } catch (error) {
            console.log("Failed to load", error);
        }
    };

    useEffect(() => { // โหลดสินค้าเมื่อเปิดหน้าจอ
        loadProduct();
    }, []);

    const filteredProduct = (product || []).filter((product) => 
        product.name.toLowerCase().includes(searchText.toLowerCase()) &&
        (searchCategory ? product.category === searchCategory : true)
    );
    
    const editProduct = (item) => {
        setIsVisible(true);
        setUrl(item.url);
        setName(item.name);
        setPrice(item.price);
        setCategory(item.category);
        setEdit(item.id);
    };
    
    const deleteProduct = async (name) => { // ลบสินค้า
        const newList = product.filter((item) => item.name != name);
        setProduct(newList);
        calculateSumprice(newList);

        try {
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newList));
        } catch (error) {
            console.log("Error deleting product:", error);
        }
    };

    const toggleCheck = (id) => { // เปลี่ยนสถานะของสินค้า
        const updatedProducts = product.map((item) => {
            if (item.id === id) {
                return { ...item, check: !item.check };
            }
            return item;
        });
        setProduct(updatedProducts);
        calculateSumprice(updatedProducts);
    };
    const calculateSumprice = (product) => { // คำนวณผลรวมของราคาสินค้า
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
    
    const clearAllProduct = async () => { // ลบสินค้าทั้งหมด
        setProduct([]);
        setSumprice(0);
        try {
            await AsyncStorage.removeItem(STORAGE_KEY);
        } catch (error) {
            console.log("Error clearing all product:", error);
        }
    }
    const toggleTheme = () => {
        setIsDarkMode((prev) => !prev);
    }
    return(
        <View style = {[styles.container, {backgroundColor: isDarkMode ? 'black' : '#D1F8EF'}]}>
            <Switch value={isDarkMode} onValueChange={toggleTheme}></Switch>
            <View style = {styles.searchContainer}>
                <TextInput
                    style={styles.font}
                    placeholder="🔍  Search"
                    value={searchText}
                    onChangeText={setSearchText}
                />
            </View>
            <View style={styles.categoryContainer}>
                <TouchableOpacity style={styles.buttonCategory}>
                    <Text style={styles.font} onPress={() => setSearchCategory("")}>All</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.buttonCategory}>
                    <Text style={styles.font} onPress={() => setSearchCategory("Food")}>Food</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.buttonCategory}>
                    <Text style={styles.font} onPress={() => setSearchCategory("Electronic")}>Electronic</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.buttonCategory}>
                    <Text style={styles.font} onPress={() => setSearchCategory("Health")}>Health</Text>
                </TouchableOpacity>
            </View>
            <FlatList
                data={filteredProduct}
                keyExtractor={(item) => item.id}
                numColumns={2}
                columnWrapperStyle={{justifyContent: 'space-between'}}
                renderItem={ ({item}) => {
                    return (
                        <Card
                            image = {item.url}
                            name = {item.name}
                            price = {item.price}
                            check = {item.check}
                            edit = {() => editProduct(item)} 
                            onDelete={() => deleteProduct(item.name)} // ส่งฟังก์ชันลบไปให้ Card
                            onCheckChange={() => toggleCheck(item.id)} // ส่งฟังก์ชันเปลี่ยนสถานะไปให้ Card
                            category={item.category}
                            textStyle={item.check ? styles.purchasedItem : null} // ส่ง style ไปให้ Card
                        />
                    )
                }}
            />
            <View style={{padding: 1 , alignItems: 'center'}}>
                <Text style={[styles.fontSumprice,{ color: isDarkMode ? "#fff" : "#000", fontSize: 18 }]}>ผลรวมของราคาสินค้าที่ยังไม่ได้ซื้อ = {sumPrice} </Text>
            </View>
            <View style={styles.containerButton}>
                <TouchableOpacity 
                    style={styles.addProductButton}
                    onPress={() => setIsVisible(true)}
                >
                    <Text style={{fontWeight:'bold' , color:'white'}}>Add Product</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={styles.clearProductButton}
                    onPress={clearAllProduct}
                >
                    <Text style={{fontWeight:'bold' , color:'white'}}>Clear All</Text>
                </TouchableOpacity>
            </View> 
            <Modal visible={isVisible} transparent ={true} animationType="slide">
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                            <Text style={{ fontSize: 18, fontWeight: 'bold', textAlign: 'center', flex: 1 }}>Add Product</Text>
                            <TouchableOpacity 
                                style={styles.closeButton}
                                onPress={() => {
                                    setUrl("");
                                    setName("");
                                    setPrice("");
                                    setCategory("");
                                    setIsVisible(false);
                                }}
                            >
                                <Text style={styles.buttonText}>X</Text>
                            </TouchableOpacity>
                        </View>
                        <TextInput
                            style={styles.input}
                            placeholder="Image URL"
                            value={url}
                            onChangeText={setUrl} 
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="ชื่อสินค้า"
                            value={name}
                            onChangeText={setName}
                        />
                        <TextInput
                            style={styles.input}
                            keyboardType="numeric"
                            placeholder="ราคาสินค้า"
                            value={price}
                            onChangeText={setPrice}
                        />
                        <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <CheckBox
                                    isChecked={category === "Food"}
                                    onClick={() => setCategory("Food")}
                                />
                                <Text style={{ marginLeft: 5 }}>Food</Text>
                            </View>

                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <CheckBox
                                    isChecked={category === "Electronic"}
                                    onClick={() => setCategory("Electronic")}
                                />
                                <Text style={{ marginLeft: 5 }}>Electronic</Text>
                            </View>

                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <CheckBox
                                    isChecked={category === "Health"}
                                    onClick={() => setCategory("Health")}
                                />
                                <Text style={{ marginLeft: 5 }}>Health</Text>
                            </View>
                        </View>
                        <TouchableOpacity
                            style={styles.addProductModal} 
                            onPress={addProduct}
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
        backgroundColor: '#D1F8EF'
    },
    searchContainer: {
        flexDirection: 'row',
        backgroundColor: 'white', 
        borderRadius: 20,
        paddingHorizontal: 10,
        margin: 10,
    },
    font: {
       fontSize: 14,
       fontWeight: 'bold',
       color: 'white',
    },
    fontSumprice: {
        fontSize: 14,
        fontWeight: 'bold',
        color: 'black',
     },
    categoryContainer: {
        paddingHorizontal: 10, // ปรับให้มีพื้นที่กดง่ายขึ้น
        flexDirection: 'row',
    },
    buttonCategory: {
        backgroundColor: '#3674B5',
        alignItems: 'center', 
        justifyContent: 'center',
        borderRadius: 20,
        padding: 10,
        width: 88,
        margin: 5,
    },
    buttonContainer: { // Style สำหรับ View ที่ครอบปุ่ม
        position: 'absolute',
        bottom: 20, // ระยะห่างจากขอบล่าง
        left: 20,   // ระยะห่างจากขอบซ้าย
        right: 20,  // ระยะห่างจากขอบขวา (เพื่อให้ปุ่มเต็มความกว้าง)
    },
    containerButton: {
        padding: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    addProductButton: {
        backgroundColor: 'green',
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        width: 300,
        height: 50
    },
    clearProductButton:{
        alignSelf: "flex-start",
        alignItems: 'center', 
        justifyContent: 'center',
        backgroundColor: 'red',
        paadding: 30,
        borderRadius: 10,
        width: 90,
        height: 50
    },
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.5)",
    },
    modalContent: {
        width: 320,
        backgroundColor: "white",
        padding: 20,
        borderRadius: 10,
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 5,
        alignItems: "center",
    },
    input: {
        width: "100%", // ให้กว้างเท่ากับ modalContent
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        fontSize: 14,
        marginVertical: 8, // เพิ่มระยะห่างแนวตั้ง
        backgroundColor: "#f9f9f9",
    },
    closeButton: {
        alignItems: 'center', 
        justifyContent: 'center',
        backgroundColor: 'red',
        borderRadius: 15,
        width: 30,
        height: 30,
        position: 'absolute',
        right: 260,
        top: -5,
    },
    buttonText:{
        color: 'white',
        fontSize: 16,
        fontWeight: "bold",
        alignItems: 'center', 
        justifyContent: 'center'
    },
    checkboxContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%", // จัดเรียงให้พอดีกับ modalContent
        marginVertical: 8,
    },
    text: {
        fontSize: 18,
    },
    addProductModal:{
        backgroundColor: 'green',
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        width: 275,
        height: 40,
        margin: 1, 
    },
    purchasedItem: {
        textDecorationLine: 'line-through',
        opacity: 0.5, // ทำให้สีจางลง
    },
})

export default Product;