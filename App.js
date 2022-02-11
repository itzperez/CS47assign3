import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StyleSheet, View, Text, Image, TouchableOpacity, FlatList} from "react-native";
import { useState, useEffect } from "react";
import { ResponseType, useAuthRequest } from "expo-auth-session";
import { myTopTracks, albumTracks } from "./utils/apiOptions";
import { REDIRECT_URI, SCOPES, CLIENT_ID, ALBUM_ID } from "./utils/constants";
import Colors from "./Themes/colors"
import convertToSeconds from "./utils/millisToMinuteSeconds.js";
import Song from "./Song.js";
import { WebView } from 'react-native-webview';

// Endpoints for authorizing with Spotify
const discovery = {
  authorizationEndpoint: "https://accounts.spotify.com/authorize",
  tokenEndpoint: "https://accounts.spotify.com/api/token"
};

const Stack = createStackNavigator();

function SongDetails({ navigation, route }) {
  return (
      <WebView source={{ uri: route.params.details }} />
  );
}

function SongPlay({ navigation, route }) {
    return (
        <WebView source={{ uri: route.params.play }} />
    );
}

function Screen1({navigation}) {
  const [token, setToken] = useState("");
  const [tracks, setTracks] = useState([]);
  const [request, response, promptAsync] = useAuthRequest(
    {
      responseType: ResponseType.Token,
      clientId: CLIENT_ID,
      scopes: SCOPES,
      // In order to follow the "Authorization Code Flow" to fetch token after authorizationEndpoint
      // this must be set to false
      usePKCE: false,
      redirectUri: REDIRECT_URI
    },
    discovery
  );

  useEffect(() => {
    if (response?.type === "success") {
      const { access_token } = response.params;
      setToken(access_token);
    }
  }, [response]);

  useEffect(() => {
    const fetchTracks = async () => {
      const res = await myTopTracks(token);
      setTracks(res);
    };

    if (token) {
      // Authenticated, make API request
      fetchTracks();
    }
  }, [token]);

  /************************************************/


  const renderItem = (item) => (
    <Song
      id={item.id}
      songName={item.songName}
      duration={item.duration}
      artistName={item.artistName}
      albumName={item.albumName}
      imageUrl={item.imageUrl}
      previewUrl={item.previewUrl}
      externalUrl={item.externalUrl}
      navigation={navigation}
    />
  );

  let contentDisplayed = null;

  if (token) {
      // console.log('inside token', tracks[0].external_urls.spotify);
      let songs = [];
      for (let i = 0; i < tracks.length; i++) {
          let songObj = {};
          songObj['id'] = i + 1;
          songObj['songName'] = tracks[i].name;
          songObj['duration'] = convertToSeconds(tracks[i].duration_ms);
          songObj['artistName'] = tracks[i].artists[0].name;
          songObj['albumName'] = tracks[i].album.name;
          songObj['imageUrl'] = tracks[i].album.images.slice(-1)[0].url;
          songObj['previewUrl'] = tracks[i].preview_url;
          songObj['externalUrl'] = tracks[i].external_urls.spotify;

          songs.push(songObj);
      }

      contentDisplayed = (
          <View style={styles.container}>
              <View style={styles.top}>
                    <Image style={{height: 25, width: 25}} source={require("./assets/spotify-logo.png")}/>
                    <Text style={{color: 'white', fontSize: 24, marginLeft: 5}}> My Top Tracks </Text>

              </View>
              <View style={styles.remaining}>
                  <FlatList
                    data={songs} // the array of data that the FlatList displays
                    renderItem={({item}) => renderItem(item)} // function that renders each item
                    keyExtractor={(item) => item.id} // unique key for each item
                  />

              </View>
          </View>

      )

  } else {
      contentDisplayed = (
          <View style={styles.container}>
              <View style={styles.outer}>
                  <TouchableOpacity style={styles.button} onPress={promptAsync}>
                      <Image style={{height: 25, width: 25}} source={require("./assets/spotify-logo.png")}/>
                      <Text style={styles.textButton}>
                          CONNECT WITH SPOTIFY
                      </Text>


                  </TouchableOpacity>

              </View>
          </View>

      )

  }

  return contentDisplayed;
}


export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerStyle: {backgroundColor: Colors.background}, headerTitleStyle: {color: 'white'} }}>
        <Stack.Screen name="Screen1" component={Screen1} options={{headerShown: false}} />

        <Stack.Screen name="SongDetails" component={SongDetails} options={{title: "Song Details"}} />
        <Stack.Screen name="SongPlay" component={SongPlay} options={{title: "Song Preview"}} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: "center",

  },
  outer: {
    flex: .2,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.spotify,
    borderRadius: 30,
    width: '80%',
    flexDirection: 'row',
    paddingTop: 15,
    paddingBottom: 15,
  },
  textButton: {
    marginLeft: 12,
    textAlign: 'center',
    fontSize: 20,
    color: '#F3F3F3',
  },
  top: {
    flex: .1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
    marginTop: 15,
    marginBottom: 20,
    flexDirection: 'row',
  },
  remaining: {
    flex: .9,
    backgroundColor: Colors.background,
  },
});
