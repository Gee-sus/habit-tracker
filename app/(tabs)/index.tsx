import { client, DATABASE_ID, databases, HABITS_COLLECTION_ID, RealtimeResponse } from "@/lib/appwrite";
import { useAuth } from "@/lib/auth-context";
import { Habit } from "@/types/database.type";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { Dimensions, RefreshControl, ScrollView, StyleSheet, View } from "react-native";
import { Query } from "react-native-appwrite";
import { Swipeable } from "react-native-gesture-handler";
import { Button, Text } from "react-native-paper";

const SCREEN_WIDTH = Dimensions.get('window').width;

export default function Index() {
  const { signOut, user } = useAuth();
  const [habits, setHabits] = useState<Habit[]>();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (!user?.$id) return; // Only subscribe if user exists
    
    const fetchHabits = async () => {
      try {
        const response = await databases.listDocuments(
          DATABASE_ID,
          HABITS_COLLECTION_ID,
          [Query.equal("user_id", user.$id)]
        );
        setHabits(response.documents as unknown as Habit[]);
      } catch (error) {
        console.error(error);
      }
    };

    fetchHabits();

    const habitsSubscription = client.subscribe(
      `databases.${DATABASE_ID}.collections.${HABITS_COLLECTION_ID}.documents`,
      (response: RealtimeResponse) => {
        console.log('Realtime event received:', response.events); // Debug log
        
        // Check for any document event (more flexible matching)
        const hasDocumentEvent = response.events.some(event => 
          event.includes('.documents.') && (
            event.includes('.create') || 
            event.includes('.update') || 
            event.includes('.delete')
          )
        );
        
        if (hasDocumentEvent) {
          console.log('Refreshing habits...'); // Debug log
          fetchHabits();
        }
      }
    );
    
    return () => {
      habitsSubscription();
    };
  }, [user?.$id]); // Only depend on user.$id

  const handleSignOut = async () => {
    await signOut();
  };

  const onRefresh = async () => {
    if (!user?.$id) return;
    
    setRefreshing(true);
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        HABITS_COLLECTION_ID,
        [Query.equal("user_id", user.$id)]
      );
      setHabits(response.documents as unknown as Habit[]);
      console.log('✅ Refreshed habits:', response.documents.length);
    } catch (error) {
      console.error("Error refreshing habits:", error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleDeleteHabit = async (habitId: string) => {
    // Delete immediately - the realtime subscription will handle removal
    try {
      await databases.deleteDocument(
        DATABASE_ID,
        HABITS_COLLECTION_ID,
        habitId
      );
      // List will auto-refresh via realtime subscription
    } catch (error) {
      console.error("Error deleting habit:", error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="headlineSmall" style={styles.headerText}>Today's Habits</Text>
        <Button mode="text" onPress={handleSignOut} icon="logout" style={styles.signOutButton}>
          Sign Out
        </Button>
      </View>
      {habits?.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No Habits yet. Add your first Habit!</Text>
        </View>
      ) : (
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.habitsList}
          showsVerticalScrollIndicator={true}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#6200ee']}
              tintColor="#6200ee"
            />
          }
        >
          {habits?.map((habit, index) => {
            return (
              <Swipeable
                key={habit.$id || index}
                onSwipeableLeftOpen={() => {
                  console.log('Swiped right, deleting:', habit.$id);
                  handleDeleteHabit(habit.$id);
                }}
                friction={1.5}
                leftThreshold={SCREEN_WIDTH * 0.3}
                overshootLeft={true}
              >
                <View style={styles.habitCard}>
                  <View style={styles.habitHeader}>
                    <Text style={styles.habitTitle}>{habit.title}</Text>
                    <Text style={styles.habitFrequency}>
                      {habit.frequency.charAt(0).toUpperCase() + habit.frequency.slice(1)}
                    </Text>
                  </View>
                  <Text style={styles.habitDescription}>{habit.description}</Text>
                  <View style={styles.streakContainer}>
                    <MaterialCommunityIcons
                      name="fire"
                      size={20}
                      color={"#ff9800"}
                    />
                    <Text style={styles.streakText}>{habit.streak_count} day Streak</Text>
                  </View>
                </View>
              </Swipeable>
            );
          })}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    paddingTop: 8,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#e9ecef",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  headerText: {
    fontWeight: "700",
    fontSize: 24,
    letterSpacing: -0.5,
    color: "#1a1a1a",
  },
  signOutButton: {
    marginTop: 0,
  },
  scrollView: {
    flex: 1,
  },
  habitsList: {
    padding: 16,
    gap: 16,
    paddingBottom: 20, // Add some bottom padding for last item
  },
  habitCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 0,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  habitHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
    gap: 12,
  },
  habitTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1a1a1a",
    flex: 1,
    letterSpacing: -0.3,
    lineHeight: 28,
  },
  habitFrequency: {
    fontSize: 11,
    color: "#6200ee",
    backgroundColor: "#f3e5f5",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    overflow: "hidden",
  },
  habitDescription: {
    fontSize: 15,
    color: "#6c757d",
    marginBottom: 16,
    lineHeight: 22,
    letterSpacing: -0.2,
  },
  streakContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 4,
    backgroundColor: "#fff3e0",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  streakText: {
    fontSize: 15,
    color: "#e65100",
    fontWeight: "700",
    letterSpacing: -0.2,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 18,
    color: "#9e9e9e",
    textAlign: "center",
    lineHeight: 26,
    letterSpacing: -0.2,
  },
  title: {
    fontSize: 18,
    marginBottom: 10,
  },
  button: {
    marginTop: 20,
  },
});
