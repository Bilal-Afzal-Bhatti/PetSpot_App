import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';

export const data = [
  {
    iconFamily: 'FontAwesome5',
    iconName: 'heartbeat',
    title: "Healthy Pet",
    text: "Being pet lovers ourselves, we understand the importance of a pet’s health. All our puppies are at least eight weeks old when they are sent to you. Before your bundle of joy reaches you, they undergo an extensive health checkup by a licensed veterinarian.",
  },
  {
    iconFamily: 'MaterialCommunityIcons',
    iconName: 'needle',
    title: "Vaccinated & Insured Pet",
    text: "To make the initial experience with your furry family member smooth and trouble-free, we ensure that all our puppies are up-to-date on their vaccinations and are insured.",
  },
  {
    iconFamily: 'FontAwesome5',
    iconName: 'user-friends',
    title: "Responsible Breeders",
    text: "All our puppies are raised by responsible breeders who consider their pet’s health their foremost priority. We have zero tolerance for puppy mills.",
  },
  {
    iconFamily: 'FontAwesome5',
    iconName: 'smile-beam',
    title: "Easy & Hassle-free Process",
    text: "Your journey starts without difficulties. Access adorable pets looking for forever homes nationwide and receive guidance in the comfort of your home.",
  },
  {
    iconFamily: 'MaterialCommunityIcons',
    iconName: 'headset',
    title: "Expert Pet Guidance",
    text: "Our pet experts will guide you throughout your journey as a pet parent and are always available whenever you need help.",
  },
  {
    iconFamily: 'MaterialCommunityIcons',
    iconName: 'paw',
    title: "Happy Pet Parenting",
    text: "We connect you with service providers such as veterinarians, trainers, groomers, and hostels to ensure you always have access to the best care.",
  },
];

export default function BreedWhyMMP() {
  const renderIcon = (family: string, name: string) => {
    if (family === 'FontAwesome5') {
      return (
        <FontAwesome5
          name={name as React.ComponentProps<typeof FontAwesome5>['name']}
          size={36}
          color="#028d8f"
          style={styles.icon}
        />
      );
    }
    return (
      <MaterialCommunityIcons
        name={name as React.ComponentProps<typeof MaterialCommunityIcons>['name']}
        size={36}
        color="#028d8f"
        style={styles.icon}
      />
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.headerTitle}>Why MMP?</Text>
      <Text style={styles.headerSubtitle}>
        Looking for a furry companion? Know why MMP is the perfect option for you.
      </Text>

      <View style={styles.gridContainer}>
        {data.map((item, index) => (
          <View key={item.title || index} style={styles.card}>
            {renderIcon(item.iconFamily, item.iconName)}
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardText}>{item.text}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    paddingVertical: 24,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#028d8f',
    marginBottom: 8,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#4b5563',
    marginBottom: 24,
    textAlign: 'center',
  },
  gridContainer: {
    width: '100%',
    maxWidth: 1200,
    gap: 16,
  },
  card: {
    backgroundColor: '#ffffff',
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  icon: {
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  cardText: {
    fontSize: 13,
    color: '#4b5563',
    textAlign: 'center',
    lineHeight: 18,
  },
});