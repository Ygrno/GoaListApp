import { StyleSheet, View, ImageBackground, FlatList, Dimensions, Alert } from 'react-native';
import { useState, useEffect, useRef } from 'react';
import { StatusBar } from 'expo-status-bar';
import GoalItem from './Components/GoalItem';
import GoalInput from './Components/GoalInput';

import { loadGoals, fetchGoals, postGoal, deleteGoal, loadGoalsFromStorage, timeoutPromise } from './Network';

export default function App() {
  const [courseGoals, setCourseGoals] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  let fetchedGoals;

  const flatListRef = useRef();

  async function handleRefresh() {
    setRefreshing(true);
    const fetchPromise = fetchGoals();
    try {
      fetchedGoals = await Promise.race([fetchPromise, timeoutPromise]);
    } catch (error) {
      console.error(error);
      Alert.alert(
        'Sync Error',
        'There was a problem syncing with the remote server.',
        [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
        { cancelable: true }
      );
    } finally {
      if (fetchedGoals instanceof Error == false) {
        setCourseGoals(await loadGoals({ fetchedGoals }));
      }
      setRefreshing(false);
      console.log('refreshing = false');
    }
  }

  function scrollToIndex(index) {
    if (index < 5) return;
    flatListRef.current.scrollToIndex({ index });
  }

  useEffect(() => {
    const handleFetchAndStorage = async () => {
      setCourseGoals(await loadGoalsFromStorage());
      const fetchPromise = fetchGoals();
      fetchedGoals = await Promise.race([fetchPromise, timeoutPromise]);
      if (fetchedGoals instanceof Error) {
        Alert.alert(
          'Connection Error',
          'There was a problem connecting to the remote server.',
          [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
          { cancelable: false }
        );
      } else {
        setCourseGoals(await loadGoals({ fetchedGoals }));
      }
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
