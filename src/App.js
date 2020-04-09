import React, { useState, useEffect } from "react";

import {
  SafeAreaView,
  View,
  FlatList,
  Text,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import api from "./services/api";

export default function App() {
  const [repositories, setRepositories] = useState([]);

  useEffect(() => {
    handleGetRepositories();
  }, []);

  async function handleGetRepositories() {
    const repos = await api.get("/repositories");
    setRepositories([...repos.data]);
  }

  async function handleLikeRepository(id) {
    const repo = await api.post(`/repositories/${id}/like`);

    if (repo.status === 200) {
      const repoIndex = repositories.findIndex((item) => item.id === id);
      repositories[repoIndex] = repo.data;

      setRepositories([...repositories]);
    }
  }

  function renderItem({ item }) {
    return (
      <View style={styles.repositoryContainer}>
        <Text style={styles.repository}>{item.title}</Text>

        <View style={styles.techsContainer}>
          {item.techs.map((tech, index) => (
            <Text key={index} style={styles.tech}>
              {tech}
            </Text>
          ))}
        </View>

        <View style={styles.likesContainer}>
          <Text style={styles.likeText} testID={`repository-likes-${item.id}`}>
            {item.likes} {item.like === 1 ? "curtida" : "curtidas"}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={() => handleLikeRepository(item.id)}
          testID={`like-button-${item.id}`}
        >
          <Text style={styles.buttonText}>Curtir</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#7159c1" />
      <SafeAreaView style={styles.container}>
        <FlatList
          data={repositories}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
        />
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#7159c1",
  },
  repositoryContainer: {
    marginBottom: 15,
    marginHorizontal: 15,
    backgroundColor: "#fff",
    padding: 20,
  },
  repository: {
    fontSize: 32,
    fontWeight: "bold",
  },
  techsContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  tech: {
    fontSize: 12,
    fontWeight: "bold",
    marginRight: 10,
    backgroundColor: "#04d361",
    paddingHorizontal: 10,
    paddingVertical: 5,
    color: "#fff",
  },
  likesContainer: {
    marginTop: 15,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  likeText: {
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 10,
  },
  button: {
    marginTop: 10,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 10,
    color: "#fff",
    backgroundColor: "#7159c1",
    padding: 15,
  },
});
