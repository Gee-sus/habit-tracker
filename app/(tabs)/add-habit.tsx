import { DATABASE_ID, databases, HABITS_COLLECTION_ID } from "@/lib/appwrite";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { ID } from "react-native-appwrite"; // Add this import
import { Button, SegmentedButtons, Text, TextInput, useTheme } from "react-native-paper";

const FREQUENCIES = ["daily", "weekly", "monthly"];

type frequency = (typeof FREQUENCIES) [number]

export default function AddHabitScreen() {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [frequency, setFrequency] = useState<frequency>("daily");
  const [error, setError] = useState<string>('');
  const {user} = useAuth()
  const router = useRouter();
  const theme = useTheme(); // Add this line

  const handleSubmit = async () => {
    if(!user) return;

    try {
      await databases.createDocument(
        DATABASE_ID, 
        HABITS_COLLECTION_ID, 
        ID.unique(), // Use unique ID instead of user.$id
        {
          title,
          description,
          frequency,
          user_id: user.$id, // Change from userId to user_id
          streak_count: 0,
          last_completed: new Date().toISOString(),
          created_at: new Date().toISOString(), // Change from createdAt to created_at
        }
      );

      router.back();
    } catch(error) {
      if(error instanceof Error) {
        setError(error.message);
        return;
      }

      setError("There was an Error creating the habit");
    }
  };


  return (
    <View style={styles.container}>
      <TextInput label="Title" mode="outlined" onChangeText={setTitle} style={styles.input} />
      <TextInput label="Description" mode="outlined" style={styles.input} onChangeText={setDescription} />
      <View style={styles.frequencyContainer}>
        <SegmentedButtons
        value={frequency}
        onValueChange={(value) => {
            setFrequency(value as frequency)
        }}
          buttons={FREQUENCIES.map((freq) => ({
            value: freq,
            label: freq.charAt(0).toUpperCase() + freq.slice(1),
          }))}
          style={styles.segmentedButtons}
        />
      </View>
      <Button mode="contained" style={styles.button}
      disabled={!title || !description} onPress={handleSubmit}>
        Add Habit
      </Button>
      {error && <Text style={{ color: theme.colors.error }}> {error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "f5f5f5",
    justifyContent: "center",
  },

  input: {
    marginBottom: 16,
  },

  frequencyContainer: {
    marginBottom: 24,
  },

  segmentedButtons: {
    marginBottom: 16,
  },

  button: {
    marginTop: 8,
  },


});
