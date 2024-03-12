import { useState, useEffect, useRef } from 'react';
import { Text, TextInput, View, StyleSheet, Keyboard, Pressable, I18nManager } from 'react-native';

function GoalInput({ onGoalHandler, onKeyboardOpen, lastGoal }) {
  const [enteredGoalText, setEnteredGoalText] = useState('');
  // const [isButtonPressed, setIsButtonPressed] = useState(false);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [TextInputPlaceholder, setTextInputPlaceholder] = useState(
    I18nManager.isRTL ? 'הוסף מטרה להיום' : 'Add your goal for today'
  );

  // const [TextInputPlaceholder, setTextInputPlaceholder] = useState('Add your goal for today');
  const [isThereNoText, setIsThereNoText] = useState(true);
  const textInputRef = useRef(null);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardVisible(true); // or some other action
      onKeyboardOpen(lastGoal);
      console.log(lastGoal);
    });
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false); // or some other action
      setIsThereNoText(true);
      goalInputHandler('');
    });

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, [lastGoal]);

  function goalInputHandler(enteredText) {
    if (isThereNoText) {
      if (I18nManager.isRTL) {
        setTextInputPlaceholder('הוסף מטרה להיום');
      } else {
        setTextInputPlaceholder('Add your goal for today');
      }
    }
    setEnteredGoalText(enteredText);
    setIsThereNoText(true);
  }

  function addGoalHandler() {
    if (isKeyboardVisible) {
      if (enteredGoalText != '') {
        setEnteredGoalText('');
        onGoalHandler({ text: enteredGoalText });
        onKeyboardOpen(lastGoal);
      } else {
        if (I18nManager.isRTL) {
          setTextInputPlaceholder('לא הזנת טקסט!');
        } else {
          setTextInputPlaceholder("You didn't entered any text!");
        }
      }
    } else {
      textInputRef.current.focus();
    }
  }

  const buttonText = I18nManager.isRTL ? 'הוסף' : 'Add';

  return (
    <View style={styles.inputContainer}>
      <TextInput
        style={styles.textInputPressed}
        editable={true}
        ref={textInputRef}
        placeholder={TextInputPlaceholder}
        placeholderTextColor={'#ffffffff'}
        onChangeText={goalInputHandler}
        keyboardAppearance="dark"
        value={enteredGoalText}
        blurOnSubmit={false}
        onSubmitEditing={addGoalHandler}
      ></TextInput>
      <Pressable
        android_ripple={styles.pressedItem}
        onPress={addGoalHandler}
        style={{
          flex: 1,
          backgroundColor: '#242424e9',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 8,
          borderRadius: 3,
        }}
      >
        <Text style={{ color: 'white', fontSize: 16 }}>{buttonText}</Text>
      </Pressable>
    </View>
  );
}

export default GoalInput;

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    paddingBottom: 15,
    paddingTop: 15,
    // borderTopWidth: 1,
    // borderTopColor: '#cccccc',
    padding: 8,
    position: 'relative',
    // paddingHorizontal: 20,
  },

  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#cccccc',
    borderRadius: 15,
    width: '95%',
    marginRight: 8,
    padding: 8,
    color: 'white',
    opacity: 0,
    userSelect: 'none',
  },

  textInputPressed: {
    flex: 4,
    borderWidth: 1,
    borderColor: '#cccccc',
    borderRadius: 15,
    width: '95%',
    marginRight: 8,
    padding: 8,
    color: 'white',
    fontSize: 16,
  },

  ImagePressed: {
    width: 35,
    height: 35,
    color: 'Blue',
  },

  sendText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },

  pressedItem: {
    opacity: 0.5,
    //reddish color
    backgroundColor: '#ff0000',
    flex: 1,
    color: '#989090',
  },
});
