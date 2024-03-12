import { StyleSheet, View, ImageBackground, FlatList, Dimensions, Alert } from 'react-native';
import { useState, useEffect, useRef } from 'react';
import GoalItem from './Components/GoalItem';
import GoalInput from './Components/GoalInput';
import { StatusBar } from 'expo-status-bar';

import { loadGoals, fetchGoals, postGoal, deleteGoal, loadGoalsFromStorage } from './Network';

export default function App() {
  const [courseGoals, setCourseGoals] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  let fetchedGoals = [];
  let fetchedGoalsAndStoredGoalsUnion = [];

  const flatListRef = useRef();

  async function handleRefresh() {
    setRefreshing(true);
    const timeoutPromise = new Promise((resolve, reject) => {
      setTimeout(() => {
        reject(new Error('Request timed out'));
      }, 5000);
    });
    try {
      const fetchPromise = fetchGoals();
      fetchedGoals = await Promise.race([fetchPromise, timeoutPromise]);
      fetchedGoalsAndStoredGoalsUnion = await loadGoals({ fetchedGoals });
      setCourseGoals(fetchedGoalsAndStoredGoalsUnion);
    } catch (error) {
      console.error(error);
      Alert.alert(
        'Sync Error',
        'There was a problem syncing with the remote server.',
        [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
        { cancelable: false }
      );
    } finally {
      setRefreshing(false);
    }
  }

  function scrollToIndex(index) {
    if (index < 5) return;
    flatListRef.current.scrollToIndex({ index });
  }

  useEffect(() => {
    const handleFetchAndStorage = async () => {
      let storageGoals = await loadGoalsFromStorage();
      setCourseGoals(storageGoals);
      fetchedGoals = await fetchGoals();
      fetchedGoalsAndStoredGoalsUnion = await loadGoals({ fetchedGoals });
      setCourseGoals(fetchedGoalsAndStoredGoalsUnion);
    };

    handleFetchAndStorage();
  }, []);

  function addGoalHandler(newCourseGoals) {
    setCourseGoals((currentCourseGoals) => [
      ...currentCourseGoals,
      { key: courseGoals.length, text: newCourseGoals.text },
    ]);

    postGoal({ id: courseGoals.length, text: newCourseGoals.text });
  }

  function deleteGoalHandler(goalId) {
    setCourseGoals((currentCourseGoals) => {
      return currentCourseGoals.filter((goal) => goal.key !== goalId);
    });

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
