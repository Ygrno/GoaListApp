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
} from './GoalsApi';

export default function App() {
  const [courseGoals, setCourseGoals] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const flatListRef = useRef();

  let maxKey = 0;

  const LoadGoalsFromStorage = async () => {
    const storedGoals = await getGoalsFromStorage();
    //find the max key in the stored goals
    maxKey = storedGoals.length > 0 ? storedGoals[storedGoals.length - 1].key : 0;
    setCourseGoals(storedGoals);
  };

  function LoadGoalsFromServer(fetchedGoals) {
    let currentGoals = courseGoals;

    currentGoals.forEach((goal) => {
      let index = fetchedGoals.findIndex((g) => g.text === goal.text);
      if (index === -1) {
        maxKey++;
        fetchedGoals.push({ key: maxKey, text: goal.text });
      }
    });

    currentGoals = fetchedGoals;

    //sort the goals by key from low to high
    currentGoals.sort((a, b) => a.key - b.key);
    maxKey = currentGoals.length > 0 ? currentGoals[currentGoals.length - 1].key + 1 : 0;

    return currentGoals;
  }

  const FetchGoalsFromServer = async (showAlert) => {
    try {
      const fetchedGoals = await Promise.race([fetchGoals(), createTimeoutPromise(3000)]);
      if (fetchedGoals) {
        let fetchedGoalsMaxKey = 0;

        //find the max key in the fetched goals
        for (let i = 0; i < fetchedGoals.length; i++) {
          if (fetchedGoals[i].key > fetchedGoalsMaxKey) {
            fetchedGoalsMaxKey = fetchedGoals[i].key;
          }
        }

        if (fetchedGoalsMaxKey > maxKey) maxKey = fetchedGoalsMaxKey;
        return fetchedGoals;
      }
      return [];
    } catch (error) {
      if (showAlert) {
        Alert.alert('Error', 'Failed to fetch goals from server');
      }
      console.error(error);
      return [];
    }
  };

  useEffect(() => {
    LoadGoalsFromStorage();
    FetchGoalsFromServer(false).then((fetchedGoals) => {
      setCourseGoals(LoadGoalsFromServer(fetchedGoals));
    });
  }, []);

  async function handleRefresh() {
    setRefreshing(true);
    const fetchedGoals = await FetchGoalsFromServer(true);
    if (fetchedGoals.length > 0) {
      setCourseGoals(LoadGoalsFromServer(fetchedGoals));
    }
    setRefreshing(false);
  }

  function scrollToIndex(index) {
    if (index < 5) return;
    flatListRef.current.scrollToIndex({ index });
  }

  function addGoalHandler(newCourseGoals) {
    Promise.race([FetchGoalsFromServer(false), createTimeoutPromise(500)])
      .then((fetchedGoals) => {
        maxKey++;

        let updatedCourseGoals = [...courseGoals, { key: maxKey, text: newCourseGoals.text }];
        setCourseGoals(updatedCourseGoals);
        setGoalsToStorage(updatedCourseGoals);

        //Server Request
        postGoal({ id: maxKey, text: newCourseGoals.text });
      })
      .catch((error) => {
        console.error(error);
        maxKey++;
        let updatedCourseGoals = [...courseGoals, { key: maxKey, text: newCourseGoals.text }];
        setCourseGoals(updatedCourseGoals);
        setGoalsToStorage(updatedCourseGoals);
      });
  }

  function deleteGoalHandler(goalId) {
    let filiteredGoals = courseGoals.filter((goal) => goal.key !== goalId);
    setCourseGoals(filiteredGoals);
    setGoalsToStorage(filiteredGoals);

    //Server Request
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
