import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import PopUp from "./components/PopUp";

export default function App() {
  const [showModal, setShowModal] = useState<boolean>(false);

  const showModalFunc = () => {
    setShowModal(true);
  };

  const closeModalFunc = () => {
    setShowModal(false);
  };

  return (
    <View style={styles.container}>
      <Text>Open up App.tsx to start working on your app!</Text>
      <TouchableOpacity onPress={showModalFunc}>
        <Text>KLIK</Text>
      </TouchableOpacity>
      {showModal && (
        <PopUp
          body={<Text>BODY</Text>}
          header={<Text>Header</Text>}
          closeModal={closeModalFunc}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
