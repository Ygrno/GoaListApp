import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

async function fetchGoals(i) {
  try {
    const response = await axios.get('https://fastapi-example-xguk.onrender.com/goals/');
    const fetchedGoals = response.data.goals.map((goal) => {
      i++;
      //   console.log(goal);
      return { key: goal.ID, text: goal.Text };
    });
    await AsyncStorage.setItem('courseGoals', JSON.stringify(fetchedGoals));
    return fetchedGoals;
  } catch (error) {
    console.error(error);
  }
}

async function loadGoals({ fetchedGoals }) {
  try {
    const storedGoals = await AsyncStorage.getItem('courseGoals');
    // console.log(storedGoals);
    // console.log(props.fetchedGoals);
    if (storedGoals.length > 2 && fetchedGoals.length > 2) {
      console.log('storedGoals is not empty');
      // if stored goals are not empty setCourseGoals the union of storedGoals and fetchedGoals
      let parsedStoredGoals = JSON.parse(storedGoals);

      for (let i = 0; i < fetchedGoals.length; i++) {
        let isGoalAlreadyStored = false;
        for (let j = 0; j < parsedStoredGoals.length; j++) {
          if (fetchedGoals[i].key === parsedStoredGoals[j].key) {
            isGoalAlreadyStored = true;
            break;
          }
        }
        if (!isGoalAlreadyStored) {
          parsedStoredGoals.push(fetchedGoals[i]);
        }
      }
      await AsyncStorage.setItem('courseGoals', JSON.stringify(parsedStoredGoals));
      return parsedStoredGoals;
    } else return fetchedGoals;
  } catch (error) {
    console.error(error);
  }
}

async function loadGoalsFromStorage() {
  try {
    const storedGoals = await AsyncStorage.getItem('courseGoals');
    return JSON.parse(storedGoals);
  } catch (error) {
    console.error(error);
  }
}

async function postGoal({ id, text }) {
  try {
    const response = await axios.post('https://fastapi-example-xguk.onrender.com/goals/', {
      ID: id,
      Text: text,
    });
    console.log(response.data);

    const storedGoals = await AsyncStorage.getItem('courseGoals');
    if (storedGoals) {
      let parsedStoredGoals = JSON.parse(storedGoals);
      parsedStoredGoals.push({ key: id.toString(), text: text });
      await AsyncStorage.setItem('courseGoals', JSON.stringify(parsedStoredGoals));
    }
  } catch (error) {
    console.error(error);
  }
}

async function deleteGoal(goalId) {
  try {
    const response = await axios.delete(`https://fastapi-example-xguk.onrender.com/goals/${goalId}`);
    console.log(response.data);

    const storedGoals = await AsyncStorage.getItem('courseGoals');
    if (storedGoals) {
      let parsedStoredGoals = JSON.parse(storedGoals);
      let filteredStoredGoals = parsedStoredGoals.filter((goal) => goal.key !== goalId);
      await AsyncStorage.setItem('courseGoals', JSON.stringify(filteredStoredGoals));
    }
  } catch (error) {
    console.error(error);
  }
}

export { fetchGoals, loadGoals, postGoal, deleteGoal, loadGoalsFromStorage };
