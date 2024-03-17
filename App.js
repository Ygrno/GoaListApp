import { StyleSheet, View, ImageBackground, FlatList, Dimensions, Alert } from 'react-native';
import { useState, useEffect, useRef } from 'react';
import { StatusBar } from 'expo-status-bar';
import GoalItem from './Components/GoalItem';
import GoalInput from './Components/GoalInput';

import {
  fetchGoals,
  postGoal,
  deleteGoal,
  getGoalsFromStorage,
  setGoalsToStorage,
  createTimeoutPromise,
} from './Network';

export default function App() {
  const [courseGoals, setCourseGoals] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const flatListRef = useRef();

  const LoadGoalsFromStorage = async () => {
    const storedGoals = await getGoalsFromStorage();
    setCourseGoals(storedGoals);
  };

  useEffect(() => {
    LoadGoalsFromStorage();
  }, []);

  async function handleRefresh() {
    setRefreshing(true);
    await LoadGoalsFromStorage();
    setRefreshing(false);
  }

  function scrollToIndex(index) {
    if (index < 5) return;
    flatListRef.current.scrollToIndex({ index });
  }

  function addGoalHandler(newCourseGoals) {
    let maxKey = courseGoals.length > 0 ? courseGoals[courseGoals.length - 1].key + 1 : 0;

    let updatedCourseGoals = [...courseGoals, { key: maxKey, text: newCourseGoals.text }];
    setCourseGoals(updatedCourseGoals);
    setGoalsToStorage(updatedCourseGoals);
  }

  function deleteGoalHandler(goalId) {
    let filiteredGoals = courseGoals.filter((goal) => goal.key !== goalId);
    setCourseGoals(filiteredGoals);
    setGoalsToStorage(filiteredGoals);
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
