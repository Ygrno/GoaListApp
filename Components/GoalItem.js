import { Text, View, StyleSheet } from "react-native";

function GoalItem(props) {
  return (
    <View>
      <Text style={styles.goalItem}> {props.text} </Text>
    </View>
  );
}

export default GoalItem;

const styles = StyleSheet.create({
  goalItem: {
    borderWidth: 2,
    backgroundColor: "#2424244b",
    borderColor: "#41414110",
    borderRadius: 5,
    color: "white",
    padding: 8,
    textAlign: "center",
    margin: 4,
  },
});
