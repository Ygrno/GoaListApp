import { Text, View, StyleSheet, Pressable, Image, I18nManager } from 'react-native';
import isRTLText from '../is-rtl-detect';

function GoalItem(props) {
  return (
    <View style={styles.goalItem}>
      <Pressable
        android_ripple={styles.pressedItem}
        onPress={props.onDeleteItem.bind(this, props.id)}
        style={({ pressed }) => pressed && styles.pressedItem}
      >
        <Text style={isRTLText(props.text) ? styles.goalTextRight : styles.goalTextLeft}> {props.text} </Text>
        <Image style={styles.trashIcon} source={require('../assets/trashIcon.png')}></Image>
      </Pressable>
    </View>
  );
}

export default GoalItem;

const styles = StyleSheet.create({
  goalItem: {
    borderWidth: 2,
    backgroundColor: '#2424244b',
    borderColor: '#41414110',
    borderRadius: 15,
    overflow: 'hidden',
  },

  goalTextLeft: {
    color: 'white',
    padding: 8,
    paddingLeft: 35,
    flex: 1,
    textAlign: 'left',
    fontSize: 16,
  },

  goalTextRight: {
    color: 'white',
    padding: 8,
    paddingLeft: 35,
    flex: 1,
    textAlign: 'right',
    fontSize: 16,
  },

  pressedItem: {
    opacity: 0.5,
    //reddish color
    backgroundColor: '#ff0000',
    flex: 1,
    flexDirection: I18nManager.isRTL ? 'reverse-row' : 'row',
    color: '#cfcfcf',
  },

  trashIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
});
