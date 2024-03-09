import { useState, useEffect, useRef } from 'react';
import { TextInput, View, StyleSheet, Button, Keyboard, Pressable, Image, I18nManager } from 'react-native';
import isRTLText from '../is-rtl-detect';

function GoalInput(props) {
  const [enteredGoalText, setEnteredGoalText] = useState('');
  // const [isButtonPressed, setIsButtonPressed] = useState(false);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [TextInputPlaceholder, setTextInputPlaceholder] = useState('Add your goal for today');
  const [isThereNoText, setIsThereNoText] = useState(true);
  const textInputRef = useRef(null);

  if (I18nManager.isRTL) {
    setTextInputPlaceholder('הוסף מטרה להיום');
  }

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardVisible(true); // or some other action
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
  }, []);

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
        props.onGoalHandler({ text: enteredGoalText });
      } else {
        if (I18nManager.isRTL) {
          setTextInputPlaceholder('"!לא הזנת טקסט');
        } else {
          setTextInputPlaceholder("You didn't entered any text!");
        }
      }
    } else {
      textInputRef.current.focus();
    }
  }

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
      <View style={{ flex: 1 }}>
        <Button title={I18nManager.isRTL ? 'הוסף' : 'Add'} onPress={addGoalHandler} color="#1c1c22d0"></Button>
      </View>
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
});
