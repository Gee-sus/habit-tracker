import { client, COMPLETIONS_COLLECTION_ID, DATABASE_ID, databases, HABITS_COLLECTION_ID, RealtimeResponse } from '@/lib/appwrite';
import { useAuth } from '@/lib/auth-context';
import { Habit, HabitCompletion } from '@/types/database.type';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useCallback, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Query } from 'react-native-appwrite';
import { Card, Text } from 'react-native-paper';


export default function SteaksScreen() {

    const [habits, setHabits] = useState<Habit[]>();
  const [completedHabits, setCompletedHabits] = useState<HabitCompletion[]>();
  const {user} = useAuth();

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
      
      
      const fetchCompletions = useCallback(async () => {
        if (!user?.$id) return;
    
        try {
         
          const response = await databases.listDocuments(
            DATABASE_ID,
            COMPLETIONS_COLLECTION_ID,
            [Query.equal("user_id", user.$id)]
          );
    
          const completions = response.documents as unknown as HabitCompletion[]
          setCompletedHabits(completions);
        } catch (error) {
          console.error(error);
        }
      }, [user?.$id]);

  useEffect(() => {
    if (user) {
      // Add real-time subscription for completions
      const completionsChannel = `databases.${DATABASE_ID}.collections.${COMPLETIONS_COLLECTION_ID}.documents`;
      const completionsSubscription = client.subscribe(
        completionsChannel,
        (response: RealtimeResponse) => {
          if (
            response.events.includes(
              "databases.*.collections.*.documents.*.create"
            )
          ) {
            fetchCompletions(); // Refresh completions when new one is created
          }
        }
      );

      // Add real-time subscription for habits (in case streak_count changes)
      const habitsChannel = `databases.${DATABASE_ID}.collections.${HABITS_COLLECTION_ID}.documents`;
      const habitsSubscription = client.subscribe(
        habitsChannel,
        (response: RealtimeResponse) => {
          if (
            response.events.includes(
              "databases.*.collections.*.documents.*.update"
            )
          ) {
            fetchHabits(); // Refresh habits when updated
            fetchCompletions(); // Also refresh completions to recalculate streaks
          }
        }
      );

      // Initial fetch
      fetchHabits();
      fetchCompletions();

      // Cleanup subscriptions
      return () => {
        completionsSubscription();
        habitsSubscription();
      };
    }
  }, [user, fetchHabits, fetchCompletions]);

      interface StreakData {
        streak: number,
        bestStreak: number,
        total: number;
      }

      const getStreakData = (habitId: string) => {
        const habitCompletions = completedHabits?.filter((c) => c.habit_id === habitId).sort((a, b) => new Date(a.completed_at).getTime() - new Date(b.completed_at).getTime());

        if(habitCompletions?.length === 0) {
            return {streak: 0, bestStreak: 0, total: 0};
        }

        let streak = 0;
        let bestStreak = 0;
        let total = habitCompletions?.length;

        let lastDate: Date | null = null;
        let currentStreak = 0;

        habitCompletions?.forEach((c) => {
            const date = new Date(c.completed_at)
            if(lastDate) {
                const diff = (date.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24);

                if(diff <= 1.5) {
                    currentStreak += 1

                } else {
                    currentStreak = 1
                }

            } else {
                currentStreak = 1
            }
            
            if (currentStreak > bestStreak) bestStreak = currentStreak;
            streak = currentStreak
            lastDate = date
        })

        return {streak, bestStreak, total };
      }

      const habitStreak = habits?.map((habit) => {
        const {streak, bestStreak, total} = getStreakData(habit.$id)
        return {habit, bestStreak, streak, total}
      });

      const rankhabits = habitStreak?.sort((a, b) => b.bestStreak - a.bestStreak)
    
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text variant="headlineSmall" style={styles.headerText}>Streak Leaderboard</Text>
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
            {rankhabits?.map(({habit, streak, bestStreak, total}, key) => (
              <Card key={key} style={styles.habitCard}>
                <Card.Content>
                  <View style={styles.habitHeader}>
                    <Text variant="titleLarge" style={styles.habitTitle}>{habit.title}</Text>
                  </View>
                  <Text style={styles.habitDescription}>{habit.description}</Text>
                  <View style={styles.statsContainer}>
                    <View style={styles.statItem}>
                      <MaterialCommunityIcons
                        name="fire"
                        size={24}
                        color="#ff9800"
                      />
                      <View style={styles.statContent}>
                        <Text style={styles.statLabel}>Current</Text>
                        <Text style={styles.statValue}>{streak}</Text>
                      </View>
                    </View>
                    <View style={styles.statItem}>
                      <MaterialCommunityIcons
                        name="trophy"
                        size={24}
                        color="#ffd700"
                      />
                      <View style={styles.statContent}>
                        <Text style={styles.statLabel}>Best</Text>
                        <Text style={styles.statValue}>{bestStreak}</Text>
                      </View>
                    </View>
                    <View style={styles.statItem}>
                      <MaterialCommunityIcons
                        name="check-circle"
                        size={24}
                        color="#4caf50"
                      />
                      <View style={styles.statContent}>
                        <Text style={styles.statLabel}>Total</Text>
                        <Text style={styles.statValue}>{total}</Text>
                      </View>
                    </View>
                  </View>
                </Card.Content>
              </Card>
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
  habitDescription: {
    fontSize: 15,
    color: "#6c757d",
    marginBottom: 16,
    lineHeight: 22,
    letterSpacing: -0.2,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginTop: 8,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  statContent: {
    alignItems: "flex-start",
  },
  statLabel: {
    fontSize: 11,
    color: "#6c757d",
    textTransform: "uppercase",
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1a1a1a",
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
});