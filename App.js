import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import Product from "./src/screens/Product";
import AddProduct from "./src/screens/AddProduct";

const Stack = createStackNavigator()
const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Product">
        <Stack.Screen name="Product" component={Product}/>
        <Stack.Screen name="AddProduct" component={AddProduct}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App