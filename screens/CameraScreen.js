import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useEffect, useRef, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { Camera } from "expo-camera";
import * as MediaLibrary from "expo-media-library";
import ShowAlert from "../components/ShowAlert";
import { AntDesign } from "@expo/vector-icons";
import { RoundButtonWithIcon } from "../components/CustomButtons";
import { Colors } from "../styles/Colors";
import {
  fbStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "../components/FirebaseConfig";

export default function CameraScreen() {
  let cameraRef = useRef();
  const [photo, setPhoto] = useState();
  const [allowCamera, setAllowCamera] = useState(false);
  const [allowMediaLibrary, setAllowMediaLibrary] = useState(false);
  const [flashMode, setFlashMode] = useState("off");
  const [loading, setLoading] = useState(true);

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

  let takePhoto = async () => {
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

  const uploadToStorage = async (uri, name, onProgress) => {
    const fetchResponse = await fetch(uri);
    const theBlob = await fetchResponse.blob();
    const imageRef = ref(fbStorage, `images/${name}`);

    const uploadTask = uploadBytesResumable(imageRef, theBlob);
    return new Promise((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          onProgress && onProgress(progress);
        },
        (error) => {
          // handle errors
          reject(error);
        },
        async () => {
          // handle successful uploads on complete
          const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
          resolve({
            downloadUrl,
            metadata: uploadTask.snapshot.metadata,
          });
        }
      );
    });
  };

  if (photo) {
    let savePhoto = () => {
      MediaLibrary.saveToLibraryAsync(photo.uri).then(() => {
        setPhoto(undefined);
      });
    };

    let upload = async () => {
      try {
        const photoUri = photo.uri;
        const fileName = photoUri.split("/").pop();
        const uploadResp = await uploadToStorage(photoUri, fileName, (value) =>
          console.log(value)
        );
        console.log(uploadResp);
        navigation.navigate({
          name: "AddRecipe",
          params: {
            photoUrl: uploadResp.downloadUrl,
            photoName: uploadResp.metadata.fullPath,
          },
          merge: true, // merge params to addrecipe screen
        });
      } catch (error) {
        Alert.alert("Error Uploading Image " + error.message);
      } finally {
        setLoading(false);
      }
    };

    let uploadToForm = () => {
      Alert.alert(
        "Kuva lisätään reseptiin",
        "Tallennetaanko myös puhelimen kuviin?",
        [
          {
            text: "Kyllä",
            onPress: () => {
              MediaLibrary.saveToLibraryAsync(photo.uri).then(upload());
            },
          },
          {
            text: "Ei",
            onPress: async () => upload(),
            style: "cancel",
          },
          {
            text: "Peruuta",
            onPress: () => {
              setPhoto(undefined);
            },
            style: "cancel",
          },
        ]
      );
    };

    return (
      <View style={styles.container}>
        {loading && <ActivityIndicator size="large" animating={true} />}
        <Image
          style={styles.preview}
          source={{ uri: "data:image/jpg;base64," + photo.base64 }}
        />
        <View style={styles.buttonContainer}>
          {allowMediaLibrary && (
            <RoundButtonWithIcon
              icon="save"
              iconColor="#fff"
              color={Colors.primary}
              onPress={savePhoto}
            />
          )}
          <RoundButtonWithIcon
            icon="back"
            iconColor="#fff"
            color={Colors.primary}
            onPress={() => navigation.goBack()}
          />
          <RoundButtonWithIcon
            icon="reload1"
            iconColor="#fff"
            color={Colors.primary}
            onPress={() => setPhoto(undefined)}
          />
          <RoundButtonWithIcon
            icon="upload"
            iconColor="#fff"
            color={Colors.secondary}
            onPress={() => uploadToForm()}
          />
        </View>
      </View>
    );
  }

  return allowCamera ? (
    <Camera style={styles.container} ref={cameraRef} flashMode={flashMode}>
      <View style={styles.roundButtonContainer}>
        <TouchableOpacity onPress={takePhoto} style={styles.roundButton} />
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
    </Camera>
  ) : null;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: "#fff",
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
    borderRadius: 50,
    height: 25,
    width: 25,
  },
  backButton: {
    position: "absolute",
    left: "5%",
    top: "5%",
  },
  buttonContainer: {
    flexDirection: "row",
    alignSelf: "auto",
    justifyContent: "space-evenly",
    alignContent: "center",
    marginTop: 8,
    marginBottom: 8,
  },
});
