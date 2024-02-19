import { Text, View, StyleSheet, Pressable, Image } from "react-native";

function GoalItem(props) {
  return (
    <View style={styles.goalItem}>
      <Pressable
        android_ripple={styles.pressedItem}
        onPress={props.onDeleteItem.bind(this, props.id)}
        style={({ pressed }) => pressed && styles.pressedItem}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text style={styles.goalText}> {props.text} </Text>
          <Image
            style={styles.trashIcon}
            source={require("../assets/trashIcon.png")}
          ></Image>
        </View>
      </Pressable>
    </View>
  );
}

export default GoalItem;

const styles = StyleSheet.create({
  goalItem: {
    borderWidth: 2,
    backgroundColor: "#2424244b",
    borderColor: "#41414110",
    borderRadius: 15,
    overflow: "hidden",
  },

  goalText: {
    color: "white",
    padding: 8,
    paddingLeft: 35,
    flex: 1,
    textAlign: "center",
  },

  pressedItem: {
    opacity: 0.5,
    //reddish color
    backgroundColor: "#ff0000",
    flex: 1,
    color: "#cfcfcf",
  },

  trashIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
});
