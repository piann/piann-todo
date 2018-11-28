import React from 'react';
import { AsyncStorage, StyleSheet, Text, TextInput, View, StatusBar, Dimensions, Platform} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import ToDo from "./ToDo";
import {AppLoading} from "expo";
import uuidv1 from 'uuid/v1';




const {height, width} = Dimensions.get("window")

export default class App extends React.Component {
  state={
    newToDo:"",
    loadToDos:false,
    toDos:{}

  }
  componentDidMount = () =>{
    this._loadToDos();
  }
  
  render() {
    const {newToDo, loadToDos, toDos} = this.state;
    console.log(toDos)
    if(!loadToDos){
      return <AppLoading/>;
    }
    

    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content"/>
        <Text style={styles.title}>Piann To Do</Text>
        <View style={styles.card}>
        <TextInput style={styles.input} 
        placeholder={"New To Do"}
        value={newToDo}
        onChangeText={this._controlNewToDo}
        placeholderTextColor={"#999"}
        returnKeyType={"done"}
        autoCorrect={false}
        onSubmitEditing={this._addToDo}
        />
        <ScrollView contentContainerStyle={styles.toDos}>
          {Object.values(toDos).reverse().map(toDo => 
          <ToDo key={toDo.id} {...toDo} 
          deleteToDo={this._deleteToDo}
          uncompleteToDo={this._uncompleteToDo}
          completeToDo={this._completeToDo}
          updateToDo={this._updateToDo}
          />)}
        </ScrollView>
        </View>
      </View>
    );
  }

  _controlNewToDo = text =>{
    this.setState({
      newToDo: text
    });
  };
  
  _loadToDos = async () =>{
    try{
      const toDos = await AsyncStorage.getItem("toDos");
      let parsedToDos = JSON.parse(toDos);
      if(parsedToDos===null){parsedToDos={};}
      this.setState({
        loadToDos:true, toDos:parsedToDos,
      });
    }catch(err){
      console.log(err);
    }
 
  };
  
  _addToDo = () =>{
    const {newToDo} = this.state;
    if(newToDo !== ""){
      
      this.setState(prevState => {
        const ID = uuidv1();
        const newToDoObject = {
          [ID] : {
            id:ID,
            isCompleted: false,
            text: newToDo,
            createdAt: Date.now(),

          }
        };
        
        const newState={
          ...prevState,
          newToDo:"",
          toDos:{
            ...prevState.toDos,
            ...newToDoObject
          }
        }
        this._saveToDos(newState.toDos);
        return {...newState};

      });
    }
  };

  _deleteToDo = (id) => {
    this.setState(prevState=>{
      const toDos = prevState.toDos;
      delete toDos[id];
      const newState = {
        ...prevState,
        ...toDos
      };
      this._saveToDos(newState.toDos);
      return {newState};
    })
  };

  _uncompleteToDo = id =>{
    this.setState(prevState => {
      const newState={
        ...prevState,
        toDos:{
          ...prevState.toDos,
          [id]:{
            ...prevState.toDos[id],
            isCompleted:false,
          }
        }
      };
      this._saveToDos(newState.toDos);
      return {...newState};
    });
  };
  _completeToDo = id =>{
    this.setState(prevState => {
      const newState={
        ...prevState,
        toDos:{
          ...prevState.toDos,
          [id]:{
            ...prevState.toDos[id],
            isCompleted:true,
          }
        }
      }
      this._saveToDos(newState.toDos);
      return {...newState};
    });
  };

  _updateToDo = (id,text) =>{
    this.setState(prevState => {
      const newState={
        ...prevState,
        toDos:{
          ...prevState.toDos,
          [id]:{
            ...prevState.toDos[id],
            text:text,
          }
        }
      }
      this._saveToDos(newState.toDos);
      return {...newState};
    });
  };
  _saveToDos = (newToDos) => {
    console.log(JSON.stringify(newToDos));
    const saveTodos = AsyncStorage.setItem("toDos", JSON.stringify(newToDos));
  };

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
  input:{
    padding: 15,
    borderBottomColor:"#bbb",
    borderBottomWidth: 1,
    fontSize:20,
  },

  toDos:{
    alignItems:'center',
  }
});
