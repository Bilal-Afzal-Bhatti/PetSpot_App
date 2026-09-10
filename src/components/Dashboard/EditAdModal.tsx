import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Switch,
  ActivityIndicator,
  StyleSheet,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { dogBreeds, catBreeds, suitableForOptions, pakistaniProvinces, provinceCities } from '@/../lib/breeds';
import { Base_URL } from '@/../Store/AdsStore';

type Ad = {
  _id: string;
  title?: string;
  description?: string;
  price?: number | string;
  category?: string;
  location?: string;
  breed?: string;
  age?: number | string;
  gender?: string;
  weight?: number | string;
  height?: number | string;
  maxLife?: number | string;
  contactNumber?: string;
  vaccinated?: boolean;
  kcpRegistered?: boolean;
  suitableFor?: string[] | string;
  images?: string[];
};

interface EditAdModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (adId: string, formData: FormData) => void;
  isSubmitting: boolean;
  ad: Ad | null;
}

const getDisplayImageUrl = (rawPath: string) => {
  if (!rawPath) return 'https://via.placeholder.com/150';
  if (rawPath.startsWith('http') || rawPath.startsWith('file:') || rawPath.startsWith('data:')) {
    return rawPath;
  }
  return `${Base_URL}${rawPath.startsWith('/') ? '' : '/'}${rawPath}`;
};

export default function EditAdModal({ isOpen, onClose, onSubmit, isSubmitting, ad }: EditAdModalProps) {
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [newImageAssets, setNewImageAssets] = useState<ImagePicker.ImagePickerAsset[]>([]);

  const [formData, setFormData] = useState({
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
    suitableFor: [] as string[],
  });

  // Populate form when ad changes
  useEffect(() => {
    if (ad && isOpen) {
      const locationParts = ad.location ? ad.location.split(', ') : ['', ''];
      const city = locationParts[0] || '';
      const province = locationParts[1] || '';

      const suitableForArray = Array.isArray(ad.suitableFor)
        ? ad.suitableFor
        : ad.suitableFor
        ? ad.suitableFor.split(', ').map((s) => s.trim())
        : [];

      setFormData({
        title: ad.title || '',
        description: ad.description || '',
        price: ad.price ? String(ad.price) : '',
        category: ad.category || '',
        province: province,
        city: city,
        breed: ad.breed || '',
        age: ad.age ? String(ad.age) : '',
        gender: ad.gender || '',
        weight: ad.weight ? String(ad.weight) : '',
        height: ad.height ? String(ad.height) : '',
        maxLife: ad.maxLife ? String(ad.maxLife) : '',
        contactNumber: ad.contactNumber || '',
        vaccinated: ad.vaccinated || false,
        kcpRegistered: ad.kcpRegistered || false,
        suitableFor: suitableForArray,
      });

      const rawImages = ad.images || [];
      setExistingImages(rawImages);
      setImagePreviews(rawImages);
      setNewImageAssets([]);
    }
  }, [ad, isOpen]);

  // Cleanup state on close
  useEffect(() => {
    if (!isOpen) {
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
      });
      setImagePreviews([]);
      setExistingImages([]);
      setNewImageAssets([]);
    }
  }, [isOpen]);

  const handleSelectImages = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert('Permission Required', 'Permission to access photo library is required!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsMultipleSelection: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      const newAssets = result.assets;
      setNewImageAssets((prev) => [...prev, ...newAssets]);

      const newUris = newAssets.map((asset) => asset.uri);
      setImagePreviews((prev) => [...prev, ...newUris]);
    }
  };

  const removeImage = (index: number) => {
    const totalImages = imagePreviews.length;
    if (totalImages === 1) {
      Alert.alert('Required Field', 'At least one image is required. You cannot remove the last image.');
      return;
    }

    const imageToRemove = imagePreviews[index];
    const isExisting = existingImages.includes(imageToRemove);

    if (isExisting) {
      setExistingImages((prev) => prev.filter((img) => img !== imageToRemove));
    } else {
      setNewImageAssets((prev) => prev.filter((asset) => asset.uri !== imageToRemove));
    }

    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const toggleSuitableFor = (option: string) => {
    setFormData((prev) => ({
      ...prev,
      suitableFor: prev.suitableFor.includes(option)
        ? prev.suitableFor.filter((item) => item !== option)
        : [...prev.suitableFor, option],
    }));
  };

  const handleSubmit = () => {
    if (!ad) return;

    const totalImages = existingImages.length + newImageAssets.length;
    if (totalImages === 0) {
      Alert.alert('Image Required', 'At least one image is required to update the advertisement.');
      return;
    }

    const formDataToSend = new FormData();

    formDataToSend.append('name', formData.title);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('price', formData.price);
    formDataToSend.append('type', formData.category);
    formDataToSend.append('breed', formData.breed);
    formDataToSend.append('age', formData.age);
    formDataToSend.append('gender', formData.gender);
    formDataToSend.append('weight', formData.weight);
    formDataToSend.append('height', formData.height);
    formDataToSend.append('maxLife', formData.maxLife);
    formDataToSend.append('contactNumber', formData.contactNumber);
    formDataToSend.append('vaccinated', formData.vaccinated.toString());
    formDataToSend.append('kcpRegistered', formData.kcpRegistered.toString());
    formDataToSend.append('suitableFor', formData.suitableFor.join(', '));

    const location = `${formData.city}, ${formData.province}`;
    formDataToSend.append('city', location);

    newImageAssets.forEach((file, idx) => {
      const extension = file.uri.split('.').pop();
      formDataToSend.append('images', {
        uri: file.uri,
        type: file.mimeType || `image/${extension || 'jpeg'}`,
        name: file.fileName || `photo_${idx}.${extension || 'jpg'}`,
      } as any);
    });

    if (existingImages.length > 0) {
      formDataToSend.append('existingImages', JSON.stringify(existingImages));
    }

    onSubmit(ad._id, formDataToSend);
  };

  return (
    <Modal visible={isOpen} animationType="slide" transparent={true} onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.headerTitle}>Edit Advertisement</Text>
              <Text style={styles.headerSubtitle}>Update your pet ad details</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Form Content */}
          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            {/* Basic Info Section */}
            <Text style={styles.sectionTitle}>Basic Information</Text>

            <Text style={styles.label}>Pet Name *</Text>
            <TextInput
              style={styles.input}
              value={formData.title}
              onChangeText={(text) => setFormData((prev) => ({ ...prev, title: text }))}
              placeholder="e.g., Golden Retriever Puppy"
            />

            <Text style={styles.label}>Category *</Text>
            <TextInput
              style={styles.input}
              value={formData.category}
              onChangeText={(text) => setFormData((prev) => ({ ...prev, category: text }))}
              placeholder="dog, cat, etc."
            />

            <Text style={styles.label}>Breed *</Text>
            <TextInput
              style={styles.input}
              value={formData.breed}
              onChangeText={(text) => setFormData((prev) => ({ ...prev, breed: text }))}
              placeholder="e.g., Labrador"
            />

            <Text style={styles.label}>Gender *</Text>
            <TextInput
              style={styles.input}
              value={formData.gender}
              onChangeText={(text) => setFormData((prev) => ({ ...prev, gender: text }))}
              placeholder="Male / Female"
            />

            <Text style={styles.label}>Description *</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={formData.description}
              onChangeText={(text) => setFormData((prev) => ({ ...prev, description: text }))}
              placeholder="Describe your pet's personality, health status, etc."
              multiline
              numberOfLines={4}
            />

            {/* Physical Details */}
            <Text style={styles.sectionTitle}>Physical Details</Text>
            <View style={styles.row}>
              <View style={styles.rowItem}>
                <Text style={styles.label}>Age (m)</Text>
                <TextInput
                  style={styles.input}
                  value={formData.age}
                  keyboardType="numeric"
                  onChangeText={(text) => setFormData((prev) => ({ ...prev, age: text }))}
                />
              </View>
              <View style={styles.rowItem}>
                <Text style={styles.label}>Weight (kg)</Text>
                <TextInput
                  style={styles.input}
                  value={formData.weight}
                  keyboardType="numeric"
                  onChangeText={(text) => setFormData((prev) => ({ ...prev, weight: text }))}
                />
              </View>
            </View>

            <View style={styles.row}>
              <View style={styles.rowItem}>
                <Text style={styles.label}>Height (cm)</Text>
                <TextInput
                  style={styles.input}
                  value={formData.height}
                  keyboardType="numeric"
                  onChangeText={(text) => setFormData((prev) => ({ ...prev, height: text }))}
                />
              </View>
              <View style={styles.rowItem}>
                <Text style={styles.label}>Life Exp. (yrs)</Text>
                <TextInput
                  style={styles.input}
                  value={formData.maxLife}
                  keyboardType="numeric"
                  onChangeText={(text) => setFormData((prev) => ({ ...prev, maxLife: text }))}
                />
              </View>
            </View>

            {/* Location and Contact */}
            <Text style={styles.sectionTitle}>Location & Contact</Text>
            <Text style={styles.label}>Province *</Text>
            <TextInput
              style={styles.input}
              value={formData.province}
              onChangeText={(text) => setFormData((prev) => ({ ...prev, province: text }))}
              placeholder="Punjab, Sindh, etc."
            />

            <Text style={styles.label}>City *</Text>
            <TextInput
              style={styles.input}
              value={formData.city}
              onChangeText={(text) => setFormData((prev) => ({ ...prev, city: text }))}
              placeholder="Lahore, Karachi, etc."
            />

            <Text style={styles.label}>Price (Rs) *</Text>
            <TextInput
              style={styles.input}
              value={formData.price}
              keyboardType="numeric"
              onChangeText={(text) => setFormData((prev) => ({ ...prev, price: text }))}
            />

            <Text style={styles.label}>Contact Number *</Text>
            <TextInput
              style={styles.input}
              value={formData.contactNumber}
              keyboardType="phone-pad"
              onChangeText={(text) => setFormData((prev) => ({ ...prev, contactNumber: text }))}
            />

            {/* Health & Status */}
            <Text style={styles.sectionTitle}>Health Status</Text>
            <View style={styles.switchRow}>
              <Text style={styles.switchLabel}>Vaccinated</Text>
              <Switch
                value={formData.vaccinated}
                onValueChange={(val) => setFormData((prev) => ({ ...prev, vaccinated: val }))}
              />
            </View>
            <View style={styles.switchRow}>
              <Text style={styles.switchLabel}>KCP Registered</Text>
              <Switch
                value={formData.kcpRegistered}
                onValueChange={(val) => setFormData((prev) => ({ ...prev, kcpRegistered: val }))}
              />
            </View>

            {/* Image Pickers & Previews */}
            <Text style={styles.sectionTitle}>Pet Images</Text>
            <View style={styles.imageGrid}>
              {imagePreviews.map((preview, index) => (
                <View key={index} style={styles.imageWrapper}>
                  <Image source={{ uri: getDisplayImageUrl(preview) }} style={styles.previewImage} />
                  <TouchableOpacity style={styles.removeBadge} onPress={() => removeImage(index)}>
                    <Text style={styles.removeBadgeText}>✕</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>

            <TouchableOpacity style={styles.uploadButton} onPress={handleSelectImages}>
              <Text style={styles.uploadButtonText}>+ Pick / Add Photos</Text>
            </TouchableOpacity>

            {/* Actions */}
            <View style={styles.actionRow}>
              <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.submitBtn,
                  (isSubmitting || imagePreviews.length === 0) && styles.disabledBtn,
                ]}
                onPress={handleSubmit}
                disabled={isSubmitting || imagePreviews.length === 0}
              >
                {isSubmitting ? (
                  <ActivityIndicator color="#FFF" />
                ) : (
                  <Text style={styles.submitBtnText}>Update Ad</Text>
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 16,
  },
  modalContainer: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    maxHeight: '85%',
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#6B7280',
  },
  closeButton: {
    padding: 8,
  },
  closeButtonText: {
    fontSize: 18,
    color: '#6B7280',
    fontWeight: 'bold',
  },
  scrollContent: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    marginTop: 16,
    marginBottom: 12,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    marginBottom: 12,
    color: '#111827',
  },
  textArea: {
    height: 90,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  rowItem: {
    flex: 1,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  switchLabel: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  imageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 12,
  },
  imageWrapper: {
    position: 'relative',
    width: 70,
    height: 70,
  },
  previewImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  removeBadge: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: '#EF4444',
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeBadgeText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  uploadButton: {
    borderWidth: 1,
    borderColor: '#028d8f',
    borderStyle: 'dashed',
    borderRadius: 10,
    padding: 14,
    alignItems: 'center',
    marginBottom: 20,
  },
  uploadButtonText: {
    color: '#028d8f',
    fontWeight: '600',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 10,
    marginBottom: 20,
  },
  cancelBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  cancelBtnText: {
    color: '#374151',
    fontWeight: '600',
  },
  submitBtn: {
    flex: 1,
    backgroundColor: '#028d8f',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  submitBtnText: {
    color: '#FFF',
    fontWeight: '600',
  },
  disabledBtn: {
    backgroundColor: '#9CA3AF',
  },
});