import {
  catBreeds,
  dogBreeds,
  provinceCities
} from '@/../lib/breeds';
import { useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';

interface CreateAdModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: FormData) => void;
  isSubmitting: boolean;
}

interface AdFormData {
  title: string;
  description: string;
  price: string;
  category: string;
  province: string;
  city: string;
  breed: string;
  age: string;
  gender: string;
  weight: string;
  height: string;
  maxLife: string;
  contactNumber: string;
  vaccinated: boolean;
  kcpRegistered: boolean;
  suitableFor: string[];
 images: ImagePicker.ImagePickerAsset[];
}

export default function CreateAdModal({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
}: CreateAdModalProps) {
  const [formData, setFormData] = useState<AdFormData>({
    title: '',
    description: '',
    price: '',
    category: '',
    province: '',
    city: '',
    breed: '',
    age: '',
    gender: '',
    weight: '',
    height: '',
    maxLife: '',
    contactNumber: '',
    vaccinated: false,
    kcpRegistered: false,
    suitableFor: [],
    images: [],
  });

  const getAvailableBreeds = (): string[] => {
    if (formData.category === 'dog') return [...dogBreeds];
    if (formData.category === 'cat') return [...catBreeds];
    return [];
  };

  const getAvailableCities = (): string[] => {
    if (formData.province && provinceCities[formData.province]) {
      return [...provinceCities[formData.province]];
    }
    return [];
  };

  const handleInputChange = (field: keyof AdFormData, value: any) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value };
      if (field === 'category' && value !== prev.category) {
        updated.breed = '';
      }
      if (field === 'province' && value !== prev.province) {
        updated.city = '';
      }
      return updated;
    });
  };

  const toggleSuitableFor = (option: string) => {
    setFormData((prev) => ({
      ...prev,
      suitableFor: prev.suitableFor.includes(option)
        ? prev.suitableFor.filter((item) => item !== option)
        : [...prev.suitableFor, option],
    }));
  };

  const handleSelectImages = async () => {
  const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

  if (!permissionResult.granted) {
    alert('Permission to access photo library is required!');
    return;
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    allowsMultipleSelection: true,
    quality: 0.8,
  });

  if (!result.canceled) {
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...result.assets],
    }));
  }
};
  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = () => {
    const formDataToSend = new FormData();
Object.entries(formData).forEach(([key, value]) => {
  if (key === 'images') {
    (value as ImagePicker.ImagePickerAsset[]).forEach((file, idx) => {
      const extension = file.uri.split('.').pop();
      formDataToSend.append('images', {
        uri: file.uri,
        type: file.mimeType || `image/${extension || 'jpeg'}`,
        name: file.fileName || `photo_${idx}.${extension || 'jpg'}`,
      } as any);
    });
  } else if (key === 'vaccinated' || key === 'kcpRegistered') {
    formDataToSend.append(key, value.toString());
  } else if (key === 'suitableFor') {
    formDataToSend.append(key, (value as string[]).join(', '));
  } else if (key !== 'province' && key !== 'city') {
    formDataToSend.append(key, value as string);
  }
});
 

    formDataToSend.append('location', `${formData.city}, ${formData.province}`);
    onSubmit(formDataToSend);

    setFormData({
      title: '',
      description: '',
      price: '',
      category: '',
      province: '',
      city: '',
      breed: '',
      age: '',
      gender: '',
      weight: '',
      height: '',
      maxLife: '',
      contactNumber: '',
      vaccinated: false,
      kcpRegistered: false,
      suitableFor: [],
      images: [],
    });
  };

  return (
    <Modal visible={isOpen} animationType="slide" transparent={true} onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Create New Advertisement</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Text style={styles.closeBtnText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.formContent} showsVerticalScrollIndicator={false}>
            {/* Basic Info */}
            <Text style={styles.sectionTitle}>Basic Information</Text>
            
            <Text style={styles.label}>Pet Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Golden Retriever Puppy"
              value={formData.title}
              onChangeText={(text) => handleInputChange('title', text)}
            />

            <Text style={styles.label}>Category *</Text>
            <View style={styles.optionsRow}>
              {['dog', 'cat', 'small-pet'].map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[styles.chip, formData.category === cat && styles.chipActive]}
                  onPress={() => handleInputChange('category', cat)}
                >
                  <Text style={formData.category === cat ? styles.chipTextActive : styles.chipText}>
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.label}>Gender *</Text>
            <View style={styles.optionsRow}>
              {['Male', 'Female'].map((g) => (
                <TouchableOpacity
                  key={g}
                  style={[styles.chip, formData.gender === g && styles.chipActive]}
                  onPress={() => handleInputChange('gender', g)}
                >
                  <Text style={formData.gender === g ? styles.chipTextActive : styles.chipText}>
                    {g}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.label}>Description *</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              multiline
              numberOfLines={4}
              placeholder="Describe your pet's personality and requirements..."
              value={formData.description}
              onChangeText={(text) => handleInputChange('description', text)}
            />

            {/* Physical Details */}
            <Text style={styles.sectionTitle}>Physical Details</Text>
            <View style={styles.gridRow}>
              <View style={styles.gridCol}>
                <Text style={styles.label}>Age (months)</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  value={formData.age}
                  onChangeText={(text) => handleInputChange('age', text)}
                />
              </View>
              <View style={styles.gridCol}>
                <Text style={styles.label}>Weight (kg)</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  value={formData.weight}
                  onChangeText={(text) => handleInputChange('weight', text)}
                />
              </View>
            </View>

            {/* Images Selection */}
            <Text style={styles.sectionTitle}>Pet Images *</Text>
            <ScrollView horizontal style={styles.imagePreviewRow}>
              {formData.images.map((img, index) => (
                <View key={index} style={styles.imageWrapper}>
                  <Image source={{ uri: img.uri }} style={styles.previewImage} />
                  <TouchableOpacity style={styles.removeImageBtn} onPress={() => removeImage(index)}>
                    <Text style={styles.removeImageText}>✕</Text>
                  </TouchableOpacity>
                </View>
              ))}
              <TouchableOpacity style={styles.uploadBtn} onPress={handleSelectImages}>
                <Text style={styles.uploadBtnText}>+ Add Photo</Text>
              </TouchableOpacity>
            </ScrollView>

            {/* Health Toggles */}
            <View style={styles.switchRow}>
              <Text style={styles.label}>Vaccinated</Text>
              <Switch
                value={formData.vaccinated}
                onValueChange={(val) => handleInputChange('vaccinated', val)}
              />
            </View>

            <View style={styles.switchRow}>
              <Text style={styles.label}>KCP Registered</Text>
              <Switch
                value={formData.kcpRegistered}
                onValueChange={(val) => handleInputChange('kcpRegistered', val)}
              />
            </View>

            {/* Action Buttons */}
            <View style={styles.actionRow}>
              <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.submitBtn}
                onPress={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.submitBtnText}>Create Advertisement</Text>
                )}
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContainer: { backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, maxHeight: '90%', padding: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#111827' },
  closeBtn: { padding: 8 },
  closeBtnText: { fontSize: 18, color: '#6B7280' },
  formContent: { marginBottom: 20 },
  sectionTitle: { fontSize: 16, fontWeight: '600', marginTop: 15, marginBottom: 10, color: '#111827' },
  label: { fontSize: 14, fontWeight: '500', color: '#374151', marginBottom: 6 },
  input: { borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 12, padding: 12, fontSize: 14, marginBottom: 12 },
  textArea: { height: 80, textAlignVertical: 'top' },
  optionsRow: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  chip: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20, borderWidth: 1, borderColor: '#D1D5DB' },
  chipActive: { backgroundColor: '#028d8f', borderColor: '#028d8f' },
  chipText: { color: '#374151' },
  chipTextActive: { color: '#fff', fontWeight: 'bold' },
  gridRow: { flexDirection: 'row', gap: 12 },
  gridCol: { flex: 1 },
  imagePreviewRow: { flexDirection: 'row', marginVertical: 10 },
  imageWrapper: { position: 'relative', marginRight: 10 },
  previewImage: { width: 80, height: 80, borderRadius: 8 },
  removeImageBtn: { position: 'absolute', top: -5, right: -5, backgroundColor: 'red', borderRadius: 10, width: 20, height: 20, justifyContent: 'center', alignItems: 'center' },
  removeImageText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
  uploadBtn: { width: 80, height: 80, borderRadius: 8, borderWidth: 1, borderColor: '#028d8f', borderStyle: 'dashed', justifyContent: 'center', alignItems: 'center' },
  uploadBtnText: { color: '#028d8f', fontSize: 12, fontWeight: '600' },
  switchRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 8 },
  actionRow: { flexDirection: 'row', gap: 12, marginTop: 20, marginBottom: 30 },
  cancelBtn: { flex: 1, padding: 14, borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 12, alignItems: 'center' },
  cancelBtnText: { color: '#374151', fontWeight: '600' },
  submitBtn: { flex: 1, padding: 14, backgroundColor: '#028d8f', borderRadius: 12, alignItems: 'center' },
  submitBtnText: { color: '#fff', fontWeight: '600' },
});