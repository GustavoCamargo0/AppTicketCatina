import { View, Text, Image, StyleSheet, Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState, useContext } from "react";
import { ThemeContext } from "../contexts/themeContext";
import * as FileSystem from "expo-file-system";
import NewButton from "../components/componets";

export default function Perfil({ navigation }) {
  const { theme } = useContext(ThemeContext);
  const [name, setName] = useState("");
  const [turma, setTurma] = useState("");
  const [descricao, setDescricao] = useState("");
  const [imgUri, setImgUri] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const storedName = await AsyncStorage.getItem("@storage_Name");
        const storedTurma = await AsyncStorage.getItem("@storage_Turma");
        const storedDescricao = await AsyncStorage.getItem("@storage_Descricao");
        const storedImg = await AsyncStorage.getItem("@storage_img");

        if (storedName) setName(storedName);
        if (storedTurma) setTurma(storedTurma);
        if (storedDescricao) setDescricao(storedDescricao);

        if (storedImg) {
          // Aceitamos URIs de web (base64) e mobile (file:// ou content://). Renderizamos direto.
          setImgUri(storedImg);
        }
      } catch (err) {
        console.log("Erro ao carregar dados:", err);
      }
    })();
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>Perfil</Text>

      {imgUri ? (
        <Image
          source={{ uri: imgUri }}
          style={styles.image}
          resizeMode="cover"
        />
      ) : (
        <View style={[styles.placeholder, { borderColor: theme.text }]}>
          <Text style={{ color: theme.text }}>Sem imagem</Text>
        </View>
      )}

      <Text style={[styles.text, { color: theme.text }]}>👤 Nome: {name}</Text>
      <Text style={[styles.text, { color: theme.text }]}>🎓 Turma: {turma}</Text>
      <Text style={[styles.text, { color: theme.text }]}>📝 Descrição: {descricao}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 20,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: "#999",
  },
  placeholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 16,
  },
});
