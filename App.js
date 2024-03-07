import { StyleSheet, View, ImageBackground, FlatList } from "react-native";
import { useState, useEffect } from "react";
import GoalItem from "./Components/GoalItem";
import GoalInput from "./Components/GoalInput";
// const image = {uri: './assets/mountains_Background.jpeg'};

import axios from "axios";
let i = 0;

export default function App() {
  const [courseGoals, setCourseGoals] = useState([]);

  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const response = await axios.get(
          "https://fastapi-example-xguk.onrender.com/goals/"
        );
        setCourseGoals(
          response.data.goals.map((goal) => {
            i++;
            console.log(goal);
            return { key: goal.ID, text: goal.Text };
          })
        );
      } catch (error) {
        console.error(error);
      }
    };

    fetchGoals();
  }, []); // The empty array means this effect runs once on mount

  function addGoalHandler(newCourseGoals) {
    setCourseGoals((currentCourseGoals) => [
      ...currentCourseGoals,
      { key: i.toString(), text: newCourseGoals.text },
    ]);

    const callApi = async () => {
      try {
        const response = await axios.post(
          "https://fastapi-example-xguk.onrender.com/goals/",
          {
            ID: i,
            Text: newCourseGoals.text,
          }
        );
        console.log(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    callApi();

    i++;
  }

  function deleteGoalHandler(goalId) {
    setCourseGoals((currentCourseGoals) => {
      return currentCourseGoals.filter((goal) => goal.key !== goalId);
    });

    const callApi = async () => {
      try {
        const response = await axios.delete(
          `https://fastapi-example-xguk.onrender.com/goals/${goalId}`
        );
        console.log(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    callApi();
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
            return (
              <GoalItem
                text={itemData.item.text}
                id={itemData.item.key}
                onDeleteItem={deleteGoalHandler}
              />
            );
          }}
          alwaysBounceVertical="false"
          keyExtractor={(item) => item.key}
          showsVerticalScrollIndicator={false}
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
