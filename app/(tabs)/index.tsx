import { client, COMPLETIONS_COLLECTION_ID, DATABASE_ID, databases, HABITS_COLLECTION_ID, RealtimeResponse } from "@/lib/appwrite";
import { useAuth } from "@/lib/auth-context";
import { Habit, HabitCompletion } from "@/types/database.type";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useCallback, useEffect, useRef, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { ID, Query } from "react-native-appwrite";
import { Swipeable } from "react-native-gesture-handler";
import { Button, Text } from "react-native-paper";

export default function Index() {
  const { signOut, user } = useAuth();
  const [habits, setHabits] = useState<Habit[]>();
  const [completedHabits, setCompletedHabits] = useState<string[]>();
  
  const swipeableRefs = useRef<{[key: string]: Swipeable | null}>({});

  const fetchHabits = useCallback(async () => {
    if (!user?.$id) return;

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
  }, [user?.$id]);
  
  
  const fetchTodayCompletions = useCallback(async () => {
    if (!user?.$id) return;

    try {
      const today = new Date()
      today.setHours(0, 0, 0, 0);
      const response = await databases.listDocuments(
        DATABASE_ID,
        COMPLETIONS_COLLECTION_ID,
        [Query.equal("user_id", user.$id), Query.greaterThanEqual("completed_at", today.toISOString())]
      );

      const completions = response.documents as unknown as HabitCompletion[]
      setCompletedHabits(completions.map((c) => c.habit_id));
    } catch (error) {
      console.error(error);
    }
  }, [user?.$id]);

  useEffect(() => {
    if (user) {
      const habitsChannel = `databases.${DATABASE_ID}.collections.${HABITS_COLLECTION_ID}.documents`;
      const habitsSubscription = client.subscribe(
        habitsChannel,
        (response: RealtimeResponse) => {
          if (
            response.events.includes(
              "databases.*.collections.*.documents.*.create"
            )
          ) {
            fetchHabits();
          } else if (
            response.events.includes(
              "databases.*.collections.*.documents.*.update"
            )
          ) {
            fetchHabits();
          } else if (
            response.events.includes(
              "databases.*.collections.*.documents.*.delete"
            )
          ) {
            fetchHabits();
          }
        }
      );

      const completionsChannel = `databases.${DATABASE_ID}.collections.${COMPLETIONS_COLLECTION_ID}.documents`;
      const completionsSubscription = client.subscribe(
        completionsChannel,
        (response: RealtimeResponse) => {
          if (
            response.events.includes(
              "databases.*.collections.*.documents.*.create"
            )
          ) {
            fetchTodayCompletions();
          }
        }
      );

      fetchHabits();
      fetchTodayCompletions();
   

      return () => {
        habitsSubscription();
        completionsSubscription();
      };
    }
  }, [user]);
  
  const handleSignOut = async () => {
    await signOut();
  };

  const handleDeleteHabit = async (id: string) => {
    try {
      await databases.deleteDocument(DATABASE_ID, HABITS_COLLECTION_ID, id);
      await fetchHabits();
    } catch(error) {
      console.error(error);

    }

  }
  const handleCompleteHabit = async (id: string) => {
    if(!user || completedHabits?.includes(id)) return;

    try {
      const currentDate = new Date().toISOString()
      await databases.createDocument(DATABASE_ID, COMPLETIONS_COLLECTION_ID, ID.unique(),{
        habit_id: id,
        user_id: user.$id,
        completed_at: currentDate,
      });

      const habit = habits?.find((h) => h.$id === id);
      if(!habit) return;
      
      await databases.updateDocument(DATABASE_ID, HABITS_COLLECTION_ID, id, {
        streak_count: habit.streak_count + 1,
        last_completed: currentDate,
      })

      await fetchHabits();

    } catch(error) {
      console.error(error);

    }

  }

  const isHabitCompleted = (habitId: string) => 
    completedHabits?.includes(habitId);

  const renderRightAction = (habitId: string) => (
    <View style={styles.swipeActionRight}>
      {isHabitCompleted(habitId) ? <Text style={{color: "#fff"}}>completed!</Text> : (
      <MaterialCommunityIcons name="check-circle-outline" size={32} color="#fff" />)}
    </View>
  );

  const renderLeftAction = () => (
    <View style={styles.swipeActionLeft}>
      <MaterialCommunityIcons name="trash-can-outline" size={32} color="#fff" />
    </View>
  );

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
        >
          {habits?.map((habit, index) => (
            <Swipeable
              key={habit.$id || index}
              ref={(ref) => {
                if (ref) swipeableRefs.current[habit.$id] = ref;
              }}
              overshootLeft={false}
              overshootRight={false}
              renderRightActions={() => renderRightAction(habit.$id)}
              renderLeftActions={renderLeftAction}
              onSwipeableOpen={(direction) => {
                if (direction === "left") {
                  handleDeleteHabit(habit.$id)
                  swipeableRefs.current[habit.$id]?.close()
                } else if (direction === "right") {
                  handleCompleteHabit(habit.$id);
                  swipeableRefs.current[habit.$id]?.close()
                }
              } }
            >
          <View style={[styles.habitCard, isHabitCompleted(habit.$id) && styles.cardCompleted, ]}>
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
          ))}
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
    margin: 15,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 20,
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
    paddingBottom: 20,
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

  cardCompleted: {
    
    opacity: 0.6,
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
  swipeActionLeft: {
    justifyContent: "center",
    alignItems: "flex-start",
    flex: 1,
    backgroundColor: "#f44336",
    borderRadius: 18,
    marginBottom: 18,
    marginTop: 2,
    paddingLeft: 16,
  },
  swipeActionRight: {
    justifyContent: "center",
    alignItems: "flex-end",
    flex: 1,
    backgroundColor: "#4caf50",
    borderRadius: 18,
    marginBottom: 18,
    marginTop: 2,
    paddingRight: 16,
  },
});

