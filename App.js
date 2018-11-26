import React from 'react';
import { StyleSheet, Text, TextInput, View, StatusBar, Dimensions, Platform} from 'react-native';


const {height, width} = Dimensions.get("window")

export default class App extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content"/>
        <Text style={styles.title}>Piann To Do</Text>
        <View style={styles.card}>
        <TextInput style={styles.input} placeholder={"New To Do"}/>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#b6bef0',
    alignItems: 'center',
    },
  title:{
    color:"white",
    fontSize:30,
    fontFamily:"sans-serif-thin",
    marginTop:50,
    marginBottom:40
  },
  card:{
    backgroundColor:"white",
    flex:1,
    width: width - 30,
    
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    ...Platform.select({
      ios:{
        shadowColor:"rgb(50,50,50)",
        shadowRadius:5,
        shadowOpacity:0.5,
      },
      
      android:{
        elevation: 5
      }
    })
    
  },

});
