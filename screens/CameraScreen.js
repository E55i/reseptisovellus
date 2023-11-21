import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Button,
  Image,
  TouchableOpacity,
} from "react-native";
import { useEffect, useRef, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { Camera } from "expo-camera";
import * as MediaLibrary from "expo-media-library";
import ShowAlert from "../components/ShowAlert";
import { AntDesign } from "@expo/vector-icons";

export default function CameraScreen() {
  let cameraRef = useRef();
  const [photo, setPhoto] = useState();
  const [allowCamera, setAllowCamera] = useState(false);
  const [allowMediaLibrary, setAllowMediaLibrary] = useState(false);
  const [flashMode, setFlashMode] = useState("off");

  // navigate back from camera after save or cancel
  const navigation = useNavigation();

  useEffect(() => {
    (async () => {
      // Request camera permissions
      let cameraStatus = await Camera.requestCameraPermissionsAsync();

      // Request media library permissions
      let mediaLibraryStatus = await MediaLibrary.requestPermissionsAsync();

      if (mediaLibraryStatus.status === "granted") {
        setAllowMediaLibrary(true);
      }
      try {
        // Check camera permissions
        if (cameraStatus.status !== "granted") {
          return ShowAlert(
            "Ei lupaa käyttää kameraa",
            "Anna sovellukselle lupa käyttää puhelimen kameraa, mikäli haluat ottaa kuvan."
          );
        } else {
          setAllowCamera(true);
        }
        // Check media library permissions
        if (mediaLibraryStatus.status !== "granted") {
          return ShowAlert(
            "Ei lupaa käyttää puhelimen kuvia",
            "Anna sovellukselle lupa käyttää puhelimen kuvia, mikäli haluat tallentaa kuvan puhelimeesi."
          );
        }
      } catch (error) {
        console.log(error);
        return ShowAlert("Error", error);
      }
    })();
  }, []);

  let takePic = async () => {
    let options = {
      quality: 1,
      base64: true,
      exif: false,
    };

    let newPhoto = await cameraRef.current.takePictureAsync(options);
    setPhoto(newPhoto);
  };

  handleFlashMode = () => {
    if (flashMode === "on") {
      setFlashMode("off");
    } else if (flashMode === "off") {
      setFlashMode("on");
    } else {
      setFlashMode("auto");
    }
  };

  if (photo) {
    let savePhoto = () => {
      MediaLibrary.saveToLibraryAsync(photo.uri).then(() => {
        setPhoto(undefined);
      });
    };

    return (
      <SafeAreaView style={styles.container}>
        <Image
          style={styles.preview}
          source={{ uri: "data:image/jpg;base64," + photo.base64 }}
        />
        {allowMediaLibrary && (
          <Button title="Tallenna kuviin" onPress={savePhoto} />
        )}
        <Button title="Ota uusi kuva" onPress={() => setPhoto(undefined)} />
        <Button title="Sulje kamera" onPress={() => navigation.goBack()} />
      </SafeAreaView>
    );
  }

  return allowCamera ? (
    <Camera style={styles.container} ref={cameraRef} flashMode={flashMode}>
      <View style={styles.roundButtonContainer}>
        <TouchableOpacity onPress={takePic} style={styles.roundButton} />
      </View>

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => {
          navigation.goBack();
        }}
      >
        <AntDesign name={"back"} size={24} color="#fff" />
      </TouchableOpacity>

      <TouchableOpacity
        style={{
          ...styles.flashButton,
          backgroundColor: flashMode === "off" ? "#000" : "#fff",
        }}
        onPress={handleFlashMode}
      >
        <Text style={{ fontSize: 20 }}>⚡️</Text>
      </TouchableOpacity>
      <StatusBar style="auto" />
    </Camera>
  ) : null;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  preview: {
    alignSelf: "stretch",
    flex: 1,
  },
  roundButtonContainer: {
    position: "absolute",
    bottom: 0,
    flexDirection: "row",
    flex: 1,
    width: "100%",
    padding: 20,
    justifyContent: "center",
  },
  roundButton: {
    width: 70,
    height: 70,
    bottom: 0,
    borderRadius: 50,
    backgroundColor: "#fff",
  },
  flashButton: {
    position: "absolute",
    left: "5%",
    top: "10%",
    borderRadius: "50%",
    height: 25,
    width: 25,
  },
  backButton: {
    position: "absolute",
    left: "5%",
    top: "5%",
  },
});
