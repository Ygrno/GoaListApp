import { useState, useEffect, useRef } from 'react';
import { TextInput, View, StyleSheet, Button, Keyboard, Pressable, Image } from 'react-native';

function GoalInput(props) {
  const [enteredGoalText, setEnteredGoalText] = useState('');
  const [isButtonPressed, setIsButtonPressed] = useState(false);
  const [TextInputPlaceholder, setTextInputPlaceholder] = useState('Add your goal for today');
  const textInputRef = useRef(null);

  function goalInputHandler(enteredText) {
    if (TextInputPlaceholder == "You didn't entered any text!") {
      setTextInputPlaceholder('Your Course Goal!!!');
    }
    setEnteredGoalText(enteredText);
  }
  function addGoalHandlerFromTextInput() {
    if (enteredGoalText != '') {
      setEnteredGoalText('');
      props.onGoalHandler({ text: enteredGoalText });
    } else {
      setTextInputPlaceholder("You didn't entered any text!");
    }

    textInputRef.current.focus();
  }

  function addGoalHandler() {
    if (isButtonPressed) {
      if (enteredGoalText != '') {
        setEnteredGoalText('');
        props.onGoalHandler({ text: enteredGoalText });
      } else {
        setTextInputPlaceholder("You didn't entered any text!");
      }
    } else {
      setIsButtonPressed(true);
      textInputRef.current.focus();
    }
  }

  useEffect(() => {
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setIsButtonPressed(false);
    });

    return () => {
      keyboardDidHideListener.remove();
    };
  }, []);

  useEffect(() => {
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidShow', () => {
      setIsButtonPressed(true);
    });

    return () => {
      keyboardDidHideListener.remove();
    };
  }, []);

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
        onSubmitEditing={addGoalHandlerFromTextInput}
        // editable={isButtonPressed ? true : false}
      ></TextInput>
      {/* <Button title="+" backgroundColor="white" color={'#242424ff'} onPress={addGoalHandler} /> */}
      <Pressable onPress={addGoalHandler} android_ripple={styles.ImagePressed}>
        <Image
          source={require('../assets/add-button.png')}
          style={{ width: 35, height: 35, paddingLeft: 5, resizeMode: 'contain' }}
        />
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
    // padding:8
    position: 'relative',
    paddingHorizontal: 25,
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
    flex: 1,
    borderWidth: 1,
    borderColor: '#cccccc',
    borderRadius: 15,
    width: '95%',
    marginRight: 8,
    padding: 8,
    color: 'white',
  },

  ImagePressed: {
    width: 35,
    height: 35,
    color: 'Blue',
  },
});
