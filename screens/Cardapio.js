import { useEffect, useState, useContext } from 'react';
import { StyleSheet, Text, View, Image, ScrollView } from 'react-native';
import { supabase } from '../Back-end/supabase';
import NewButton from '../components/componets';
import { ThemeContext } from '../contexts/themeContext';
import { FontAwesome, MaterialCommunityIcons, FontAwesome6 } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MoneyContext, MoneyProvider } from '../contexts/ContextMoney';
import { FoodContext, FoodProvider } from '../contexts/ContextFoodSB';

function CardapioComidas({ navigation }) {

  const { Valor } = useContext(MoneyContext);
  const { theme } = useContext(ThemeContext);

  const [result, setResult] = useState([]);
  const [fotos, setFotos] = useState([]);

  const { comidas, urls } = useContext(FoodContext);
  useEffect(() => {
    const fetchGeneral = async () => {
      const cadaFoto = urls.map((file) => {
        const { data: publicUrl } = supabase.storage.from("Imagens").getPublicUrl(file.name);
        return { name: file.name, url: publicUrl.publicUrl };
      });
      setFotos(cadaFoto || []);
      setResult(comidas || []);
    };
    fetchGeneral();

  }, [comidas, urls]);

  return (
    <View style={[{ height: '100%', backgroundColor: theme.background }]}>
      <Text style={[styles.text, { color: theme.text, fontSize: 20, textAlign: 'right' }]} >Saldo: R${Valor} </Text>
  <ScrollView showsVerticalScrollIndicator={true} style={{ flex: 1 }} contentContainerStyle={styles.container}>

        {result.map((item, index) => {
          return (
            <View key={index} style={[styles.card, { backgroundColor: theme.cards }]}>
              <Image
                source={{ uri: fotos.find((i) => i.name.includes(item.Nome))?.url }}
                style={styles.image}
                resizeMode='contain'
              />
              <Text style={[styles.text, { color: theme.text }]}>
                🍽️ Nome: {item.Nome}{"\n"}
                💰 Preço: { " R$" + item.Valor }
              </Text>
              <View style={{ flexDirection: 'column' }} >
                <NewButton style={{ width: 100, height: 60, }}
                  onPress={async () => {
                    if (Valor >= item.Valor && item.Estoque > 0) {
                      const fecha = new Date().toLocaleString('pt-BR', {
                        dateStyle: 'short',
                        timeStyle: 'medium',
                      });
                      await supabase.from("Comidas").update([{ Vendas: item.Vendas + 1, Estoque: item.Estoque - 1 }]).eq("Nome", item.Nome)
                      await AsyncStorage.setItem("Valor", parseFloat(Valor - item.Valor))
                      await AsyncStorage.setItem("data", fecha)
                      try {
                        //Carregar arrays existentes
                        const produtosAtuais = await AsyncStorage.getItem('produto');
                        const precosAtuais = await AsyncStorage.getItem('preco');

                        // Converter para array ou criar novo se não existir
                        const arrayProdutos = produtosAtuais ? JSON.parse(produtosAtuais) : [];
                        const arrayPrecos = precosAtuais ? JSON.parse(precosAtuais) : [];

                        // Adicionar novos itens
                        arrayProdutos.push(item.Nome);
                        arrayPrecos.push(item.Valor);

                        // Salvar arrays atualizados
                        await AsyncStorage.setItem('produto', JSON.stringify(arrayProdutos));
                        await AsyncStorage.setItem('preco', JSON.stringify(arrayPrecos));

                        alert(`Adicionado ${item.Nome} ao carrinho!`);
                      } catch (error) {
                        console.error('Erro ao salvar item:' + error);
                        alert('Erro ao adicionar item ao carrinho');
                      }
                    } else {
                      alert("Saldo insuficiente! ou Produto sem estoque")
                    }

                  }}>{"Comprar este produto"}
                </NewButton>
                <NewButton
                  style={{ width: 100, height: 60 }}

                  onPress={() => {
                    navigation.navigate('DetalhesCompras', {
                      nombre: item.Nome,
                      Valor: item.Valor,
                      Estoque: item.Estoque,
                      img: fotos.find((i) => i.name.includes(item.Nome))?.url
                    });
                  }}>
                  {"Detalhes do produto"}
                </NewButton>
              </View>
            </View>
          )
        })}
      </ScrollView >
    </View >
  )
};

function CardapioBebidas({ navigation }) {
  const { Valor } = useContext(MoneyContext);
  const { theme } = useContext(ThemeContext);
  const [result, setResult] = useState([]);
  const [fotos, setFotos] = useState([]);

  const { bebidas, urls } = useContext(FoodContext);
  useEffect(() => {
    const fetchGeneral = async () => {
      const cadaFoto = urls.map((file) => {
        const { data: publicUrl } = supabase.storage.from("Imagens").getPublicUrl(file.name);
        return { name: file.name, url: publicUrl.publicUrl };
      });
      setFotos(cadaFoto || []);
      setResult(bebidas || []);
    };
    fetchGeneral();

  }, [bebidas, urls]);

  return (
    <View style={[{ height: '100%', backgroundColor: theme.background }]}>
      <Text style={[styles.text, { color: theme.text, fontSize: 20, textAlign: 'right' }]} >Saldo: R${Valor} </Text>
  <ScrollView showsVerticalScrollIndicator={true} style={{ flex: 1 }} contentContainerStyle={styles.container}>

        {result.map((item, index) => {
          return (
            <View key={index} style={[styles.card, { backgroundColor: theme.cards }]}>
              <Image
                source={{ uri: fotos.find((i) => i.name.includes(item.Nome))?.url }}
                style={styles.image}
                resizeMode='contain'
              />
              <Text style={[styles.text, { color: theme.text }]}>
                🍽️ Nome: {item.Nome}{"\n"}
                💰 Preço: {" R$" + item.Valor}
              </Text>
              <View style={{ flexDirection: 'column' }} >
                <NewButton style={{ width: 100, height: 60 }}
                  onPress={async () => {
                    if (Valor >= item.Valor && item.Estoque > 0) {
                      const fecha = new Date().toLocaleString('pt-BR', {
                        dateStyle: 'short',
                        timeStyle: 'medium',
                      });
                      await supabase.from("Bebidas").update([{ Vendas: item.Vendas + 1, Estoque: item.Estoque - 1 }]).eq("Nome", item.Nome)
                      await AsyncStorage.setItem("Valor", parseFloat(Valor - item.Valor))
                      await AsyncStorage.setItem("data", fecha)
                      try {
                        //Carregar arrays existentes
                        const produtosAtuais = await AsyncStorage.getItem('produto');
                        const precosAtuais = await AsyncStorage.getItem('preco');

                        // Converter para array ou criar novo se não existir
                        const arrayProdutos = produtosAtuais ? JSON.parse(produtosAtuais) : [];
                        const arrayPrecos = precosAtuais ? JSON.parse(precosAtuais) : [];

                        // Adicionar novos itens
                        arrayProdutos.push(item.Nome);
                        arrayPrecos.push(item.Valor);

                        // Salvar arrays atualizados
                        await AsyncStorage.setItem('produto', JSON.stringify(arrayProdutos));
                        await AsyncStorage.setItem('preco', JSON.stringify(arrayPrecos));

                        alert(`Adicionado ${item.Nome} ao carrinho!`);
                      } catch (error) {
                        console.error('Erro ao salvar item:' + error);
                        alert('Erro ao adicionar item ao carrinho');
                      }
                    } else {
                      alert("Saldo insuficiente! ou Produto sem estoque")
                    }

                  }}>{"Comprar este produto"}
                </NewButton>
                <NewButton
                  style={{ width: 100, height: 60 }}
                  onPress={() => {
                    navigation.navigate('DetalhesCompras', {
                      nombre: item.Nome,
                      Valor: item.Valor,
                      Estoque: item.Estoque,
                      img: fotos.find((i) => i.name.includes(item.Nome))?.url
                    });
                  }}>
                  {"Detalhes do produto"}
                </NewButton>
              </View>
            </View>
          )
        })}
      </ScrollView >
    </View >
  )
};

function CardapioOutros({ navigation }) {
  const { Valor } = useContext(MoneyContext);
  const { theme } = useContext(ThemeContext);
  const [result, setResult] = useState([]);
  const [fotos, setFotos] = useState([]);

  const { outros, urls } = useContext(FoodContext);
  useEffect(() => {
    const fetchGeneral = async () => {
      const cadaFoto = urls.map((file) => {
        const { data: publicUrl } = supabase.storage.from("Imagens").getPublicUrl(file.name);
        return { name: file.name, url: publicUrl.publicUrl };
      });
      setFotos(cadaFoto || []);
      setResult(outros || []);
    };
    fetchGeneral();

  }, [outros, urls]);

  return (
    <View style={[{ height: '100%', backgroundColor: theme.background }]}>
      <Text style={[styles.text, { color: theme.text, fontSize: 20, textAlign: 'right' }]} >Saldo: R${Valor} </Text>
  <ScrollView showsVerticalScrollIndicator={true} style={{ flex: 1 }} contentContainerStyle={styles.container}>

        {result.map((item, index) => {
          return (
            <View key={index} style={[styles.card, { backgroundColor: theme.cards }]}>
              <Image
                source={{ uri: fotos.find((i) => i.name.includes(item.Nome))?.url }}
                style={styles.image}
                resizeMode='contain'
              />
              <Text style={[styles.text, { color: theme.text }]}>
                🍽️ Nome: {item.Nome}{"\n"}
                💰 Preço: {" R$" + item.Valor}
              </Text>
              <View style={{ flexDirection: 'column' }} >
                <NewButton style={{ width: 100, height: 60 }}
                  onPress={async () => {
                    if (Valor >= item.Valor && item.Estoque > 0) {
                      const fecha = new Date().toLocaleString('pt-BR', {
                        dateStyle: 'short',
                        timeStyle: 'medium',
                      });
                      await supabase.from("Outras opcoes").update([{ Vendas: item.Vendas + 1, Estoque: item.Estoque - 1 }]).eq("Nome", item.Nome)
                      await AsyncStorage.setItem("Valor", parseFloat(Valor - item.Valor))
                      await AsyncStorage.setItem("data", fecha)
                      try {
                        //Carregar arrays existentes
                        const produtosAtuais = await AsyncStorage.getItem('produto');
                        const precosAtuais = await AsyncStorage.getItem('preco');

                        // Converter para array ou criar novo se não existir
                        const arrayProdutos = produtosAtuais ? JSON.parse(produtosAtuais) : [];
                        const arrayPrecos = precosAtuais ? JSON.parse(precosAtuais) : [];

                        // Adicionar novos itens
                        arrayProdutos.push(item.Nome);
                        arrayPrecos.push(item.Valor);

                        // Salvar arrays atualizados
                        await AsyncStorage.setItem('produto', JSON.stringify(arrayProdutos));
                        await AsyncStorage.setItem('preco', JSON.stringify(arrayPrecos));

                        alert(`Adicionado ${item.Nome} ao carrinho!`);
                      } catch (error) {
                        console.error('Erro ao salvar item:' + error);
                        alert('Erro ao adicionar item ao carrinho');
                      }
                    } else {
                      alert("Saldo insuficiente! ou Produto sem estoque")
                    }

                  }}>{"Comprar este produto"}
                </NewButton>
                <NewButton
                  style={{ width: 100, height: 60 }}
                  onPress={() => {
                    navigation.navigate('DetalhesCompras', {
                      nombre: item.Nome,
                      Valor: item.Valor,
                      Estoque: item.Estoque,
                      img: fotos.find((i) => i.name.includes(item.Nome))?.url
                    });
                  }}>
                  {"Detalhes do produto"}
                </NewButton>
              </View>
            </View>
          )
        })}
      </ScrollView >
    </View >
  )
};

function Ranking() {
  const [rank, setRanking] = useState([]);
  const [fotos, setFotos] = useState([]);
  const { theme } = useContext(ThemeContext);
  const { comidas, bebidas, outros, urls } = useContext(FoodContext);
  useEffect(() => {

    const fetchTodo = async () => {
      const cadaFoto = urls.map((file) => {
        const { data: publicUrl } = supabase.storage.from("Imagens").getPublicUrl(file.name);
        return { name: file.name, url: publicUrl.publicUrl };
      });
      const total = [
        ...(comidas || []),
        ...(bebidas || []),
        ...(outros || []),
      ];
      total.sort((a, b) => b.Vendas - a.Vendas)
      setRanking(total)
      setFotos(cadaFoto);
    }
    fetchTodo();

  }, [comidas, bebidas, outros, urls]);
  return (
    <View style={[{ height: '100%', backgroundColor: theme.background }]}>
      <Text style={[styles.text, { color: theme.text, fontSize: 20 }]}>Produtos mais comprados 🏆</Text>

  <ScrollView showsVerticalScrollIndicator={true} style={{ flex: 1 }} contentContainerStyle={styles.container} >
        {rank.map((item, index) => (
          <View key={index} style={[styles.card, { backgroundColor: theme.cards }]}>
            <Image source={{ uri: fotos.find((i) => i.name.includes(item.Nome))?.url }} style={styles.image} resizeMode='contain' />
            <Text style={[styles.text, { color: theme.text }]}>
              Top: {index + 1} {"\n"} Nome: {item.Nome} {"\n"} Vendas: {item.Vendas}
            </Text>
          </View>
        ))
        }
      </ScrollView >
    </View >
  );
}

export default function RouterCardapio({ navigation }) {
  const { theme } = useContext(ThemeContext);
  const Tab = createBottomTabNavigator();

  return (
    <FoodProvider>
      <MoneyProvider>
        <Tab.Navigator
          initialRouteName="Comidas"
          screenOptions={{
            headerShown: true,
            tabBarActiveTintColor: theme.text,
            tabBarInactiveTintColor: 'gray',
            headerTitleStyle: { color: theme.text },
            headerStyle: { backgroundColor: theme.background, },
            tabBarStyle: { backgroundColor: theme.background, },

            headerLeft: () => (
              <NewButton
                style={{ height: 40, width: 40 }}
                onPress={() => navigation.navigate("Drawer")}
              >
                <FontAwesome name="arrow-left" size={20} color={theme.colorIcon} />
              </NewButton>
            ),
          }}
        >
          <Tab.Screen
            name="Comidas"
            component={CardapioComidas}
            options={{
              tabBarIcon: () => (
                <MaterialCommunityIcons name="food-drumstick" size={20} color={theme.text} />
              ),
            }}
          />
          <Tab.Screen
            name="Bebidas"
            component={CardapioBebidas}
            options={{
              tabBarIcon: () => (
                <FontAwesome name="glass" size={20} color={theme.text} />
              ),
            }}
          />
          <Tab.Screen
            name="Outros"
            component={CardapioOutros}
            options={{
              tabBarIcon: () => (
                <FontAwesome name="ellipsis-h" size={20} color={theme.text} />
              ),
            }}
          />
          <Tab.Screen
            name="Ranking"
            component={Ranking}
            options={{
              tabBarIcon: () => (
                <FontAwesome6 name="ranking-star" size={24} color={theme.text} />
              ),
            }}
          />
        </Tab.Navigator>
      </MoneyProvider>
    </FoodProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 10,
  },

  card: {
    width: 200,
    marginBottom: 15,
    padding: 10,
    borderRadius: 10,

    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 150, height: 200, borderRadius: 10, marginBottom: 10
  },
  text: {
    fontSize: 16, fontWeight: 'bold', textAlign: 'center',
  },
});
