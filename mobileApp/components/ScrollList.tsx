import React, { useRef, useState } from "react";
import {
  Animated,
  LayoutChangeEvent,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

type Props = {
  data: any[];
};

const ScrollList: React.FC<Props> = ({ data }) => {
  const [completeScrollBarHeight, setCompleteScrollBarHeight] = useState(1);
  const [visibleScrollBarHeight, setVisibleScrollBarHeight] = useState(0);
  const scrollIndicator = useRef(new Animated.Value(0)).current;

  const scrollIndicatorSize =
    completeScrollBarHeight > visibleScrollBarHeight
      ? (visibleScrollBarHeight * visibleScrollBarHeight) /
        completeScrollBarHeight /
        4
      : visibleScrollBarHeight;

  const difference =
    visibleScrollBarHeight > scrollIndicatorSize
      ? visibleScrollBarHeight - scrollIndicatorSize
      : 1;

  const scrollIndicatorPosition = Animated.multiply(
    scrollIndicator,
    (visibleScrollBarHeight - scrollIndicatorSize) /
      (completeScrollBarHeight - visibleScrollBarHeight)
  ).interpolate({
    extrapolate: "clamp",
    inputRange: [0, Math.max(difference - 20, 0)],
    outputRange: [0, Math.max(difference - 20, 0)],
  });

  const onContentSizeChange = (_: any, contentHeight: number) =>
    setCompleteScrollBarHeight(contentHeight);

  const onLayout = ({
    nativeEvent: {
      layout: { height },
    },
  }: LayoutChangeEvent) => {
    setVisibleScrollBarHeight(height);
  };

  return (
    <View style={styles.mainContainer}>
      <View style={styles.header}>
        <Text style={[styles.headerText, styles.borderRight]}>
          Typ zdarzenia
        </Text>
        <Text style={[styles.headerText, styles.borderRight]}>
          Imię i nazwisko
        </Text>
        <Text style={[styles.headerText, styles.borderRight]}>Data</Text>
        <Text style={styles.headerText}>Numer łóżka</Text>
      </View>
      <View style={{ flex: 1, flexDirection: "row" }}>
        {data.length > 0 ? (
          <>
            <ScrollView
              style={styles.dataContainer}
              onContentSizeChange={onContentSizeChange}
              onLayout={onLayout}
              onScroll={Animated.event(
                [{ nativeEvent: { contentOffset: { y: scrollIndicator } } }],
                { useNativeDriver: false }
              )}
              scrollEventThrottle={16}
              showsVerticalScrollIndicator={false}
            >
              {data.map((item, index) => (
                <View
                  key={index}
                  style={[styles.row, { backgroundColor: item.color }]}
                >
                  <Text style={styles.cell}>{item.type}</Text>
                  <Text style={styles.cell}>{item.name}</Text>
                  <Text style={styles.cell}>{item.date}</Text>
                  <Text style={styles.cell}>{item.bed}</Text>
                </View>
              ))}
            </ScrollView>

            <View style={styles.scrollIndicatorContainer}>
              <Animated.View
                style={[
                  styles.scrollIndicator,
                  {
                    height: scrollIndicatorSize,
                    transform: [{ translateY: scrollIndicatorPosition }],
                  },
                ]}
              />
            </View>
          </>
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    height: "100%",
    width: "100%",
  },
  header: {
    flexDirection: "row",
    backgroundColor: "azure",
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  headerText: {
    flex: 1,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    paddingVertical: 5,
    borderBottomColor: "#FFFFFF",
  },
  dataContainer: {
    padding: 10,
  },
  row: {
    flexDirection: "row",
    paddingVertical: 5,
    paddingHorizontal: 5,
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderColor: "#CCCCCC",
    backgroundColor: "white",
    marginTop: 10,
  },
  cell: {
    flex: 1,
    textAlign: "center",
    color: "#000",
    paddingVertical: 5,
  },
  borderRight: {
    borderRightWidth: 1,
    borderRightColor: "#CCCCCC",
  },
  scrollIndicatorContainer: {
    width: 10,
    backgroundColor: "#E0E0E0",
    marginLeft: 5,
    marginRight: 10,
    marginTop: 20,
  },
  scrollIndicator: {
    width: 18,
    backgroundColor: "blue",
    borderRadius: 12.5,
    marginHorizontal: -4,
  },
});

export default ScrollList;
