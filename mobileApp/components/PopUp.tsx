import React, { FC } from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props = {
  header: React.ReactNode;
  body: React.ReactNode;
  closeModal: () => void;
};

const PopUp: FC<Props> = ({ header, body, closeModal }) => {
  return (
    <Modal animationType="slide" transparent={true} visible={true}>
      <View style={styles.backdrop}>
        <View style={styles.mainContainer}>
          <View style={styles.header}>
            {header}
            <TouchableOpacity onPress={closeModal}>
              <Text style={styles.closeButton}>X</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.body}>{body}</View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  mainContainer: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
  },
  header: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  body: {
    width: "100%",
    height: "80%",
  },
  closeButton: {
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default PopUp;
