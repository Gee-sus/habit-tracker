import { Text, View, StyleSheet } from "react-native";
import { Link } from 'expo-router';

export default function Index() {
  
  const styles = StyleSheet.create({
    view: {
      flex: 1,
        justifyContent: "center",
        alignItems: "center",
    }
  })
  
  
  return (
    <View style={styles.view}
    >
      <Text>hello there</Text>
      <Link href="/login"> Login Page </Link>
    </View>
  );
  


}
