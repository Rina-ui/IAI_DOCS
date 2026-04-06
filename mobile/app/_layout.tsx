import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { Text, TextInput } from "react-native";
import "./global.css";

const defaultTextStyle = {
  fontFamily: "PlusJakartaSans_400Regular",
};

const TextWithDefaults = Text as typeof Text & {
  defaultProps?: { style?: unknown };
};
const TextInputWithDefaults = TextInput as typeof TextInput & {
  defaultProps?: { style?: unknown };
};

TextWithDefaults.defaultProps = TextWithDefaults.defaultProps ?? {};
TextInputWithDefaults.defaultProps = TextInputWithDefaults.defaultProps ?? {};

TextWithDefaults.defaultProps.style = [
  defaultTextStyle,
  TextWithDefaults.defaultProps.style,
];
TextInputWithDefaults.defaultProps.style = [
  defaultTextStyle,
  TextInputWithDefaults.defaultProps.style,
];

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    PlusJakartaSans_400Regular: require("../node_modules/@expo-google-fonts/plus-jakarta-sans/400Regular/PlusJakartaSans_400Regular.ttf"),
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="(main)" />
    </Stack>
  );
}
