import { StatusBar } from 'expo-status-bar';
import {
  Button,
  KeyboardAvoidingView, Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Alert,
} from 'react-native';
import {useState} from "react";


function CartItem({text, price, sum, onDeleteItem}) {

  const styles = {
    listElem: {
      flexDirection: 'row',
      justifyContent: "space-between",
      height: 40,
      alignItems: "center",
      paddingRight: 30,
      borderBottomWidth: 1,
      borderColor: '#DDD',
    },
    listElemLabel: {
      flex: 1,
      marginLeft: 20,
    },
    cancelButton: {
      backgroundColor: '#ffdfdf',
      height: '100%',
      justifyContent: 'center',
      width: 30,
      alignItems: 'center',
    }
  }

  const createTwoButtonAlert = () =>
      Alert.alert('Eliminar item?', `Eliminar el item ${text}`, [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Eliminar', onPress: () => {
            onDeleteItem()
          }
        },
      ]);

  return (
      <View style={styles.listElem}>
        <Pressable style={[styles.cancelButton]} onPress={createTwoButtonAlert}><Text>X</Text></Pressable>
        <Text style={[styles.listElemLabel]}>{text}</Text>
        <Text>{price.toFixed(2)}</Text>
        <Text style={{marginLeft: 20}}>{sum.toFixed(2)}</Text>
      </View>
  )
}

export default function App() {

  const [elements, setElements] = useState([]);
  const [labelInput, setLabelInput] = useState('')
  const [priceInput, setPriceInput] = useState('')


  const computeAverage = () => {
    if (elements.length === 0) {
      return 0
    }
    const totalSum = elements[elements.length - 1].sum
    return totalSum/elements.length
  }

  const cleanList = () => {
    setElements([])
  }

  const onDeleteItem = (index) => {
    const newElements = []
    elements.map(elem => {
      if (elem.index !== index) {
        newElements.push({
          ...elem,
          index: newElements.length
        })
      }
    })
    setElements(newElements)
  }

  const addElement = () => {
    if (!labelInput || !priceInput || labelInput.trim() === '' || priceInput.trim() === '') {
      return
    }

    if (isNaN(parseFloat(priceInput))) {
      return
    }

    const lastElement = elements.length > 0 ? elements[elements.length - 1] : null

    const priceInputNumeric = parseFloat(parseFloat(priceInput).toFixed(2))

    setElements([
      ...elements,
      {
        label: labelInput,
        price: priceInputNumeric,
        sum:
            parseFloat((priceInputNumeric + (lastElement ? lastElement.sum : 0)).toFixed(2)),
        index: elements.length,
      }
    ])

    setLabelInput('')
    setPriceInput('')
  }

  return (
    <KeyboardAvoidingView behavior={"padding"} style={styles.containerA}>
        <View style={styles.containerB}>
          <ScrollView style={[styles.middleContent]} contentContainerStyle={styles.middleContentInsideContainer}>
            <View style={[styles.list]}>
              {
                  elements.map((elem, key) => (
                      <CartItem key={key} text={elem.label} price={elem.price} sum={elem.sum} onDeleteItem={() => {onDeleteItem(elem.index)}} />
                  ))
              }
            </View>
            <View style={styles.infoPanel}>
              <Text style={styles.averageLabel}>Promedio: {(computeAverage()).toFixed(2)}</Text>
              <Pressable style={styles.cleanListButton} onPress={cleanList}>
                <Text style={styles.cleanListButtonText}>Limpiar lista</Text>
              </Pressable>
            </View>
          </ScrollView>
          <View style={styles.bottomSection} >
            <TextInput style={[styles.textInput, styles.labelInput]} value={labelInput} onChangeText={setLabelInput} />
            <TextInput keyboardType='numeric' style={[styles.textInput, styles.priceInput]} value={priceInput} onChangeText={setPriceInput} />
            <Button onPress={addElement} title="Agregar"/>
          </View>
          <StatusBar style="auto" />
        </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  containerA: {
    flex: 1,
  },
  containerB: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    paddingTop: 50,
    justifyContent: 'space-between'
  },
  middleContent: {
    width: '100%',
    flex: 1,
  },
  middleContentInsideContainer: {
    backgroundColor: 'white',
    flexGrow: 1,
    justifyContent: 'space-between',
  },
  list: {
    minHeight: 100,
    flex: 1,
    backgroundColor: '#EEE',
  },
  infoPanel: {
    width: '100%',
    height:150,
    padding: 25,
  },
  averageLabel: {
    fontSize: 16,
  },
  cleanListButton: {
    position: 'absolute',
    bottom: 0,
    marginBottom: 10,
    marginLeft: 10,
  },
  cleanListButtonText: {
    fontSize: 20,
    color: '#006adc',
  },
  bottomSection: {
    flexDirection: "row"
  },
  textInput: {
    borderWidth: 1,
    borderColor: 'black',
    borderStyle: 'solid',
    height: 50,
    paddingLeft: 10,
  },
  priceInput: {
    width: 80,
    borderLeftWidth: 0
  },
  labelInput: {
    flex: 1,
    paddingLeft: 20,
    marginBottom: 20
  }
});
