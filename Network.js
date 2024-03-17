import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

async function fetchGoals() {
  try {
    const response = await axios.get('https://fastapi-example-xguk.onrender.com/goals/');
    const fetchedGoals = response.data.goals.map((goal) => {
      console.log(goal);
      return { key: goal.ID, text: goal.Text };
    });
    return fetchedGoals;
  } catch (error) {
    console.error(error);
  }
}

async function loadGoals({ fetchedGoals }) {
  try {
    const storedGoals = await getGoalsFromStorage();
    let parsedStoredGoals = storedGoals;
    console.log('parsedStoredGoals:', parsedStoredGoals);
    if (fetchedGoals.length > 0) {
      console.log('storedGoals is not empty');
      // if stored goals are not empty setCourseGoals the union of storedGoals and fetchedGoals

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
    }
    return parsedStoredGoals;
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
  } catch (error) {
    console.error(error);
  }
}

async function deleteGoal(goalId) {
  try {
    const response = await axios.delete(`https://fastapi-example-xguk.onrender.com/goals/${goalId}`);
    console.log(response.data);
  } catch (error) {
    console.error(error);
  }
}

export const createTimeoutPromise = (timeout) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(new Error('Request timed out'));
    }, timeout);
  });
};

//Function for getting the goals from storage
async function getGoalsFromStorage() {
  try {
    const storedGoals = await AsyncStorage.getItem('courseGoals');
    console.log('storedGoals:', storedGoals);
    if (!storedGoals) return [];
    return JSON.parse(storedGoals);
  } catch (error) {
    console.error(error);
  }
}

//Function for setting the goals to storage
async function setGoalsToStorage(goals) {
  try {
    console.log('goals:', goals);
    await AsyncStorage.setItem('courseGoals', JSON.stringify(goals));
    console.log('Goals set to storage');
  } catch (error) {
    console.error(error);
  }
}

export { fetchGoals, loadGoals, postGoal, deleteGoal, getGoalsFromStorage, setGoalsToStorage };
