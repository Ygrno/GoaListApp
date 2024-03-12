import { StyleSheet, View, ImageBackground, FlatList, Dimensions } from 'react-native';
import { useState, useEffect, useRef } from 'react';
import GoalItem from './Components/GoalItem';
import GoalInput from './Components/GoalInput';
import { StatusBar } from 'expo-status-bar';

import { loadGoals, fetchGoals, postGoal, deleteGoal, loadGoalsFromStorage } from './Network';

let i = 0;

export default function App() {
  const [courseGoals, setCourseGoals] = useState([]);
  let fetchedGoals = [];
  let fetchedGoalsAndStoredGoalsUnion = [];

  const flatListRef = useRef();

  function scrollToIndex(index) {
    if (index < 5) return;
    flatListRef.current.scrollToIndex({ index });
  }

  useEffect(() => {
    const handleFetchAndStorage = async () => {
      let storageGoals = await loadGoalsFromStorage();
      setCourseGoals(storageGoals);

      fetchedGoals = await fetchGoals(i);
      fetchedGoalsAndStoredGoalsUnion = await loadGoals({ fetchedGoals });
      setCourseGoals(fetchedGoalsAndStoredGoalsUnion);
    };

    handleFetchAndStorage();
  }, []);

  function addGoalHandler(newCourseGoals) {
    setCourseGoals((currentCourseGoals) => [...currentCourseGoals, { key: i.toString(), text: newCourseGoals.text }]);

    postGoal({ id: i, text: newCourseGoals.text });

    i++;
  }

  function deleteGoalHandler(goalId) {
    deleteGoal(goalId);
    setCourseGoals((currentCourseGoals) => {
      return currentCourseGoals.filter((goal) => goal.key !== goalId);
    });
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
              return <GoalItem text={itemData.item.text} id={itemData.item.key} onDeleteItem={deleteGoalHandler} />;
            }}
            alwaysBounceVertical="false"
            keyExtractor={(item) => item.key}
            showsVerticalScrollIndicator={false}
          />
        </View>
        <View style={styles.bottomLayout}>
          <GoalInput
            onGoalHandler={addGoalHandler}
            onKeyboardOpen={scrollToIndex}
            lastGoal={{ id: courseGoals.length - 1 }}
          />
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
