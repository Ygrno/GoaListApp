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

  let textComponent;
  if (I18nManager.isRTL) {
    textComponent = (
      <Text style={isRTLText(props.text) ? styles.goalTextLeft : styles.goalTextRight}> {props.text} </Text>
    );
  } else
    textComponent = (
      <Text style={isRTLText(props.text) ? styles.goalTextRight : styles.goalTextLeft}> {props.text} </Text>
    );

  return (
    <Animated.View style={{ ...styles.goalItem, opacity: fadeAnim }}>
      <Pressable
        android_ripple={styles.pressedItem}
        onPress={props.onDeleteItem.bind(this, props.id)}
        style={({ pressed }) => pressed && !props.isRefreshing && styles.pressedItem}
      >
        <View style={{ flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row', alignItems: 'center' }}>
          {textComponent}
          <Image
            style={I18nManager.isRTL ? styles.trashIconR2L : styles.trashIcon}
            source={require('../assets/trashIcon.png')}
          ></Image>
        </View>
      </Pressable>
    </Animated.View>
  );
}

export default GoalItem;

const styles = StyleSheet.create({
  goalItem: {
    borderWidth: 2,
    backgroundColor: '#242424c8',
    borderColor: '#41414117',
    borderRadius: 15,
    overflow: 'hidden',
  },

  goalTextLeft: {
    color: 'white',
    padding: 8,
    paddingLeft: 35,
    flex: 1,
    textAlign: 'left',
    fontSize: 18,
  },

  goalTextRight: {
    color: 'white',
    padding: 8,
    paddingLeft: 10,
    flex: 1,
    textAlign: 'right',
    fontSize: 18,
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
    marginRight: 12,
    // paddingRight: 10,
  },

  trashIconR2L: {
    width: 20,
    height: 20,
    marginLeft: 12,
    // paddingRight: 10,
  },
});
