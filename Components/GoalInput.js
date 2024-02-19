import { TextInput, View, StyleSheet, Button } from "react-native";
import { useState } from "react";

function GoalInput(props) {
  const [enteredGoalText, setEnteredGoalText] = useState("");
  const [TextInputPlaceholder, setTextInputPlaceholder] = useState(
    "Add your goal for today"
  );

  function goalInputHandler(enteredText) {
    if (TextInputPlaceholder == "You didn't entered any text!") {
      setTextInputPlaceholder("Your Course Goal!!!");
    }
    setEnteredGoalText(enteredText);
  }

  function addGoalHandler() {
    if (enteredGoalText != "") {
      setEnteredGoalText("");
      props.onGoalHandler({ text: enteredGoalText });
    } else {
      setTextInputPlaceholder("You didn't entered any text!");
    }
  }

  return (
    <View style={styles.inputContainer}>
      <TextInput
        style={styles.textInput}
        placeholder={TextInputPlaceholder}
        placeholderTextColor={"#ffffffff"}
        onChangeText={goalInputHandler}
        value={enteredGoalText}
      ></TextInput>
      <Button
        title="Add Goal"
        backgroundColor="white"
        color={"#242424ff"}
        onPress={addGoalHandler}
      />
    </View>
  );
}

export default GoalInput;

const styles = StyleSheet.create({
  inputContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    // paddingBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#cccccc",
    // padding:8
    position: "relative",
  },

  textInput: {
    borderWidth: 1,
    borderColor: "#cccccc",
    borderRadius: 15,
    width: "70%",
    marginRight: 8,
    padding: 8,
    color: "white",
  },
});
