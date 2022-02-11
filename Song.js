import * as React from 'react';
import { Text, View, StyleSheet, Image, TouchableOpacity} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Colors from "./Themes/colors";

export default function Song({ id, songName, duration, artistName, albumName, imageUrl, previewUrl, externalUrl, navigation}) {

  return (

    <TouchableOpacity style={styles.items} onPress={() => navigation.navigate('SongDetails', {details: externalUrl})}>
        <TouchableOpacity style={styles.a} onPress={() => navigation.navigate('SongPlay', {play: previewUrl})}>
            <Image style={{height: 30, width: 30}} source={require('./assets/play-button.png')} />
        </TouchableOpacity>
        <View style={styles.b}>
            <Image source={{uri: imageUrl}} style={{height: 64, width: 64}}/>

        </View>
        <View style={styles.c}>
            <Text numberOfLines={1} style={{fontSize: 16, color: 'white'}}> {songName} </Text>
            <Text numberOfLines={1} style={{color: Colors.gray}}> {artistName} </Text>

        </View>
        <View style={styles.d}>
            <Text numberOfLines={1} style={{fontSize: 16, color: 'white'}}> {albumName} </Text>

        </View>
        <View style={styles.e}>
            <Text style={{color: 'white'}}> {duration} </Text>

        </View>
    </TouchableOpacity>
  );
}


const styles = StyleSheet.create({
  items: {
    backgroundColor: Colors.background,
    flex: 1,
    height: 100,
    flexDirection: 'row',
    alignItems: 'center',
  },
  a: {
      flex: .15,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: Colors.background,
      height: '100%',
      width: '100%',
  },
  b: {
      flex: .2,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: Colors.background,
      height: '100%',
      width: '100%',
  },
  c: {
      flex: .25,
      justifyContent: 'center',
      backgroundColor: Colors.background,
      height: '100%',
      width: '100%',
  },
  d: {
      flex: .3,
      justifyContent: 'center',
      backgroundColor: Colors.background,
      height: '100%',
      width: '100%',
  },
  e: {
      flex: .1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: Colors.background,
      height: '100%',
      width: '100%',
  },
});
