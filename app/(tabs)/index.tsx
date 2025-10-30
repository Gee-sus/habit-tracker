import { useAuth } from '@/lib/auth-context';
import { Link } from 'expo-router';
import { StyleSheet, Text, View } from "react-native";
import { Button } from 'react-native-paper';

export default function Index() {
  const { signOut } = useAuth();
  
  const handleSignOut = async () => {
    await signOut();
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>hello there</Text>
      <Link href="/login"> Login Page </Link>
      <Button 
        mode="contained" 
        onPress={handleSignOut} 
        icon="logout"
        style={styles.button}
      >
        Sign Out
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    marginBottom: 10,
  },
  button: {
    marginTop: 20,
  },
});
