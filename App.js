import { StyleSheet, View, ImageBackground, FlatList } from "react-native";
import { useState } from "react";
import GoalItem from "./Components/GoalItem";
import GoalInput from "./Components/GoalInput";
// const image = {uri: './assets/mountains_Background.jpeg'};

export default function App() {
  const [courseGoals, setCourseGoals] = useState([]);

  function addGoalHandler(newCourseGoals) {
    setCourseGoals((currentCourseGoals) => [
      ...currentCourseGoals,
      newCourseGoals,
    ]);
  }

  return (
    <ImageBackground
      source={require("./assets/mountains_Background.jpeg")}
      resizeMode="cover"
      style={styles.appContainer}
    >
      <GoalInput onGoalHandler={addGoalHandler} />
      <View style={styles.goalsContainer}>
        <FlatList
          data={courseGoals}
          renderItem={(itemData) => {
            return <GoalItem text={itemData.item.text} />;
          }}
          alwaysBounceVertical="false"
          keyExtractor={(item) => item.key}
        />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    paddingTop: 40,
    paddingHorizontal: 25,
    justifyContent: "space-between",
  },

  goalsContainer: {
    paddingTop: 12,
    flex: 8,
    flexDirection: "column",
    position: "relative",
  },
});
