import { View } from "react-native";
import { SegmentedButtons, TextInput } from "react-native-paper";

const FREQUENCIES = ["daily", "weekly", "monthly"];

export default function AddHabitScreen() {
  return (
    <view>
      <TextInput label="Title" mode="outlined" />
      <TextInput label="Description" mode="outlined" />
      <View>
        <SegmentedButtons
          buttons={FREQUENCIES.map((freq) => ({
            value: freq,
            label: freq.charAt(0).toUpperCase() + freq.slice(1),
          }))}
        />
      </View>
      <button>Add Habit</button>
    </view>
  );
}
