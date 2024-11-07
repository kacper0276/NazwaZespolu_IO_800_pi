import React, { FC } from "react";
import { StyleSheet, Text, View } from "react-native";

type Props = {
  userId: number;
};

const UserProfile: FC<Props> = ({ userId }) => {
  return (
    <View style={styles.mainContainer}>
      <View style={styles.profileContainer}>
        <Text>Nazwa użytkownika {userId}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    width: "100%",
    height: "100%",
    backgroundColor: "red",
  },
  profileContainer: {
    width: "100%",
    height: "40%",
    backgroundColor: "pink",
  },
});

export default UserProfile;
