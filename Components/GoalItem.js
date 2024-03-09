import { Text, View, StyleSheet, Pressable, Image, I18nManager, Animated } from 'react-native';
import React, { useEffect, useRef } from 'react';
import isRTLText from '../is-rtl-detect';

function GoalItem(props) {
  const fadeAnim = useRef(new Animated.Value(0)).current; // Initial value for opacity: 0

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 250,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  return (
    <Animated.View style={{ ...styles.goalItem, opacity: fadeAnim }}>
      <Pressable
        android_ripple={styles.pressedItem}
        onPress={props.onDeleteItem.bind(this, props.id)}
        style={({ pressed }) => pressed && styles.pressedItem}
      >
        <View style={{ flexDirection: I18nManager.isRTL ? 'reverse-row' : 'row', alignItems: 'center' }}>
          <Text style={isRTLText(props.text) ? styles.goalTextRight : styles.goalTextLeft}> {props.text} </Text>
          <Image style={styles.trashIcon} source={require('../assets/trashIcon.png')}></Image>
        </View>
      </Pressable>
    </Animated.View>
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
    color: '#cfcfcf',
  },

  trashIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
});
