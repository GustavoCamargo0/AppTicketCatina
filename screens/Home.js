import { StyleSheet, Text, View } from 'react-native';
import { useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NewButton } from '../components/componets';
import { FontAwesome, AntDesign } from '@expo/vector-icons';
import { ThemeContext } from '../contexts/themeContext';

export default function Home({ navigation }) {
  const { theme } = useContext(ThemeContext);
  const [Valor, setValor] = useState(0);
  const [tickets, setTickets] = useState(0);
  const [_, setTime] = useState(0);

  async function creditosGet() {
    const res = await AsyncStorage.getItem('Valor');
    setValor(parseFloat(res) || 0);
  }

  async function ticketsGet() {
    const res = await AsyncStorage.getItem('tickets');
    setTickets(parseFloat(res) || 0);
  }

  useEffect(() => {
    creditosGet();
    ticketsGet();

    const interval = setInterval(() => {
      setTime(prev => prev + 1);
      creditosGet();
    }, 5000);

    const contador = setInterval(async () => {
      const newTickets = (tickets ?? 0) + 1;
      setTickets(newTickets);
      await AsyncStorage.setItem("tickets", String(newTickets));
    }, 60000);

    return () => {
      clearInterval(interval);
      clearInterval(contador);
    };
  }, []);
  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={{ fontSize: 24, margin: 10, color: theme.text }}>Ticket: {tickets}{"\n"}Saldo: R${Valor} </Text>
      <View style={styles.row}>
        <View style={styles.collum}>
          <NewButton style={styles.button} onPress={() => { navigation.navigate('Creditos') }}>
            <FontAwesome name="dollar" size={24} color={`${theme.colorIcon}`} />
          </NewButton>
          <Text style={[styles.text, { color: theme.text }]}>Carregar creditos</Text>
        </View>

        <View style={styles.collum}>
          <NewButton style={styles.button} onPress={() => navigation.navigate('Cardapio')}>
            <AntDesign name="shop" size={24} color={`${theme.colorIcon}`} />
          </NewButton>
          <Text style={[styles.text, { color: theme.text }]}>Comprar na cantina</Text>
        </View>
      </View>
    </View >
  );
}


const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    flex: 1,
    alignItems: 'flex-start',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 30,

  },
  collum: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  button: {
    height: 50,
    width: 50,
    borderRadius: 50,
    margin: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    margin: 10,
    fontWeight: 'bold',
  }

});
