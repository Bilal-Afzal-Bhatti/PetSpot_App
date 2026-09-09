import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function BreedScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.push('/breed/dog-breed')}>
        <Text style={styles.btnText}>Dog Breeds</Text>
      </TouchableOpacity>
      
      <TouchableOpacity onPress={() => router.push('/breed/cat-breed')}>
        <Text style={styles.btnText}>Cat Breeds</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 16 },
  btnText: { fontSize: 18, color: '#028d8f', fontWeight: 'bold' }
});