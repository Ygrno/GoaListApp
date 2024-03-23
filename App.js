import { StyleSheet, View, ImageBackground, FlatList, Dimensions, Alert } from 'react-native';
import { useState, useEffect, useRef } from 'react';
import { StatusBar } from 'expo-status-bar';
import GoalItem from './Components/GoalItem';
import GoalInput from './Components/GoalInput';

import { fetchGoals, postGoal, deleteGoal, getGoalsFromStorage, setGoalsToStorage } from './Network';

export default function App() {
  const [courseGoals, setCourseGoals] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const flatListRef = useRef();

  const FetchGoalsFromStorage = async () => {
    const storedGoals = await getGoalsFromStorage();
    return storedGoals;
  };

  const FetchGoalsFromServer = async () => {
    try {
      return await fetchGoals();
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  useEffect(() => {
    const initializeApp = async () => {
      let storageGoals = await FetchGoalsFromStorage();
      setCourseGoals(storageGoals);
      let serverGoals = await FetchGoalsFromServer();

      await mergeGoals(storageGoals, serverGoals);
    };
    initializeApp();
  }, []);

  async function handleRefresh() {
    setRefreshing(true);
    let storageGoals = courseGoals;
    let serverGoals = await FetchGoalsFromServer();

    await mergeGoals(storageGoals, serverGoals);

    setRefreshing(false);
  }

  async function mergeGoals(storageGoals, serverGoals) {
    for (let i = 0; i < storageGoals.length; i++) {
      let found = false;
      for (let j = 0; j < serverGoals.length && found == false; j++) {
        if (storageGoals[i].text == serverGoals[j].text) {
          found = true;
        }
      }
      if (found == false) {
        serverGoals.push({ key: Math.random().toString(36), text: storageGoals[i].text });
      }
    }

    await setGoalsToStorage(serverGoals);
    setCourseGoals(serverGoals);
    console.log(serverGoals);
  }

  function scrollToIndex(index) {
    if (index < 5) return;
    flatListRef.current.scrollToIndex({ index });
  }

  async function addGoalHandler(newCourseGoals) {
    maxKey = Math.random().toString(36);

    let goalToAdd = { key: maxKey, text: newCourseGoals.text };

    let updatedCourseGoals = [...courseGoals, goalToAdd];
    console.log('Added Goal = {' + goalToAdd.key + ', ' + goalToAdd.text + '}');

    setCourseGoals(updatedCourseGoals);
    setGoalsToStorage(updatedCourseGoals);

    postGoal({ id: goalToAdd.key, text: goalToAdd.text });
  }

  function deleteGoalHandler(goalId) {
    console.log('Deleting goal with id: ' + goalId);
    let filiteredGoals = courseGoals.filter((goal) => goal.key !== goalId);
    setCourseGoals(filiteredGoals);
    setGoalsToStorage(filiteredGoals);

    deleteGoal(goalId);
  }

  return (
    <>
      <StatusBar style="light" />
      <ImageBackground
        source={require('./assets/mountains_Background.jpeg')}
        resizeMode="cover"
        style={styles.appContainer}
      >
        <View style={styles.goalsContainer}>
          <FlatList
            ref={flatListRef}
            data={courseGoals}
            renderItem={(itemData) => {
              return (
                <GoalItem
                  text={itemData.item.text}
                  id={itemData.item.key}
                  onDeleteItem={deleteGoalHandler}
                  isRefreshing={refreshing}
                />
              );
            }}
            // alwaysBounceVertical="true"
            keyExtractor={(item) => item.key}
            showsVerticalScrollIndicator={false}
            refreshing={refreshing}
            onRefresh={handleRefresh}
          />
        </View>
        <View style={styles.bottomLayout}>
          <GoalInput onGoalHandler={addGoalHandler} onKeyboardOpen={scrollToIndex} lastGoal={courseGoals.length - 1} />
        </View>
      </ImageBackground>
    </>
  );
}

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    justifyContent: 'space-between',
    width: Dimensions.get('screen').width,
    height: Dimensions.get('screen').height,
    direction: 'ltr',
    backgroundColor: '#000000',
  },

  goalsContainer: {
    paddingTop: 12,
    flex: 8,
    flexDirection: 'column',
    position: 'relative',
    paddingHorizontal: 25,
    paddingTop: 40,
  },

  bottomLayout: {
    backgroundColor: '#24242483',
  },
});
