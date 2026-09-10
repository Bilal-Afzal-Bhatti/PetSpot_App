import React, { useState } from 'react';
import {
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
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import {
  dogBreeds,
  catBreeds,
  suitableForOptions,
  pakistaniProvinces,
  provinceCities,
} from '@/../lib/breeds';

export interface RNImageFile {
  uri: string;
  type: string;
  name: string;
}

export interface AdFormData {
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
  images: RNImageFile[];
}

interface CreateAdFormProps {
  onSubmit: (formData: FormData) => Promise<boolean>;
  isSubmitting: boolean;
}

export default function CreateAdForm({ onSubmit, isSubmitting }: CreateAdFormProps) {
  const [currentStep, setCurrentStep] = useState<number>(1);
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

  const totalSteps = 3;

  const getAvailableBreeds = (): readonly string[] => {
    if (formData.category === 'dog') return dogBreeds;
    if (formData.category === 'cat') return catBreeds;
    return [];
  };

  const getAvailableCities = (): string[] => {
    if (formData.province && provinceCities[formData.province]) {
      return provinceCities[formData.province];
    }
    return [];
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(formData.title && formData.category && formData.breed && formData.gender);
      case 2:
        return !!(
          formData.age &&
          formData.weight &&
          formData.height &&
          formData.maxLife &&
          formData.description
        );
      case 3:
        return !!(
          formData.province &&
          formData.city &&
          formData.contactNumber &&
          formData.price &&
          formData.images.length > 0
        );
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep) && currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSelectImages = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsMultipleSelection: true,
      quality: 0.8,
    });

    if (result.canceled || !result.assets) return;

    const selectedFiles: RNImageFile[] = result.assets.map((asset, index) => ({
      uri: asset.uri || '',
      type: asset.mimeType || 'image/jpeg',
      name: asset.fileName || `pet_image_${Date.now()}_${index}.jpg`,
    }));

    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...selectedFiles],
    }));
  };

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const toggleSuitableOption = (option: string) => {
    setFormData((prev) => {
      const exists = prev.suitableFor.includes(option);
      return {
        ...prev,
        suitableFor: exists
          ? prev.suitableFor.filter((item) => item !== option)
          : [...prev.suitableFor, option],
      };
    });
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;

    const formDataToSend = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      if (key === 'images') {
        (value as RNImageFile[]).forEach((file) => {
          // React Native FormData payload structure for files
          formDataToSend.append('images', {
            uri: file.uri,
            type: file.type,
            name: file.name,
          } as any);
        });
      } else if (key === 'vaccinated' || key === 'kcpRegistered') {
        formDataToSend.append(key, value.toString());
      } else if (key === 'suitableFor') {
        formDataToSend.append(key, (value as string[]).join(', '));
      } else if (key === 'province' || key === 'city') {
        // Skip individual province/city, combined into location below
      } else {
        formDataToSend.append(key, value as string);
      }
    });

    const location = `${formData.city}, ${formData.province}`;
    formDataToSend.append('location', location);

    const success = await onSubmit(formDataToSend);

    if (success) {
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
      setCurrentStep(1);
    }
  };

  const renderStepIndicator = () => (
    <View style={styles.indicatorContainer}>
      <View style={styles.stepsRow}>
        {[1, 2, 3].map((step) => (
          <React.Fragment key={step}>
            <View
              style={[
                styles.stepCircle,
                step <= currentStep ? styles.activeCircle : styles.inactiveCircle,
              ]}
            >
              <Text
                style={[
                  styles.stepText,
                  step <= currentStep ? styles.activeStepText : styles.inactiveStepText,
                ]}
              >
                {step}
              </Text>
            </View>
            {step < totalSteps && (
              <View
                style={[
                  styles.stepConnector,
                  step < currentStep ? styles.activeConnector : styles.inactiveConnector,
                ]}
              />
            )}
          </React.Fragment>
        ))}
      </View>
      <Text style={styles.stepIndicatorSubtext}>
        Step {currentStep} of {totalSteps}
      </Text>
    </View>
  );

  const renderStep1 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.sectionTitle}>Basic Information</Text>

      <Text style={styles.label}>Pet Name *</Text>
      <TextInput
        style={styles.input}
        value={formData.title}
        onChangeText={(text) => setFormData((prev) => ({ ...prev, title: text }))}
        placeholder="e.g., Golden Retriever Puppy"
        placeholderTextColor="#9ca3af"
      />

      <Text style={styles.label}>Category *</Text>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={formData.category}
          onValueChange={(val) =>
            setFormData((prev) => ({
              ...prev,
              category: val,
              breed: '', // Reset breed when category changes
            }))
          }
        >
          <Picker.Item label="Select a category" value="" color="#9ca3af" />
          <Picker.Item label="🐕 Dog" value="dog" />
          <Picker.Item label="🐱 Cat" value="cat" />
          <Picker.Item label="🐹 Small Pet" value="small-pet" />
        </Picker>
      </View>

      <Text style={styles.label}>Breed *</Text>
      <View style={[styles.pickerWrapper, !formData.category && styles.disabledPicker]}>
        <Picker
          enabled={!!formData.category}
          selectedValue={formData.breed}
          onValueChange={(val) => setFormData((prev) => ({ ...prev, breed: val }))}
        >
          <Picker.Item
            label={formData.category ? 'Select a breed' : 'Please select category first'}
            value=""
            color="#9ca3af"
          />
          {getAvailableBreeds().map((breed) => (
            <Picker.Item key={breed} label={breed} value={breed} />
          ))}
        </Picker>
      </View>

      <Text style={styles.label}>Gender *</Text>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={formData.gender}
          onValueChange={(val) => setFormData((prev) => ({ ...prev, gender: val }))}
        >
          <Picker.Item label="Select gender" value="" color="#9ca3af" />
          <Picker.Item label="Male" value="Male" />
          <Picker.Item label="Female" value="Female" />
        </Picker>
      </View>
    </View>
  );

  const renderStep2 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.sectionTitle}>Physical Details</Text>

      <Text style={styles.label}>Age (months) *</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={formData.age}
        onChangeText={(text) => setFormData((prev) => ({ ...prev, age: text }))}
        placeholder="Age in months"
        placeholderTextColor="#9ca3af"
      />

      <Text style={styles.label}>Weight (kg) *</Text>
      <TextInput
        style={styles.input}
        keyboardType="decimal-pad"
        value={formData.weight}
        onChangeText={(text) => setFormData((prev) => ({ ...prev, weight: text }))}
        placeholder="Weight in kg"
        placeholderTextColor="#9ca3af"
      />

      <Text style={styles.label}>Height (cm) *</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={formData.height}
        onChangeText={(text) => setFormData((prev) => ({ ...prev, height: text }))}
        placeholder="Height in cm"
        placeholderTextColor="#9ca3af"
      />

      <Text style={styles.label}>Life Expectancy (years) *</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={formData.maxLife}
        onChangeText={(text) => setFormData((prev) => ({ ...prev, maxLife: text }))}
        placeholder="Expected lifespan"
        placeholderTextColor="#9ca3af"
      />

      <Text style={styles.sectionSubTitle}>Health Status</Text>
      <View style={styles.switchRow}>
        <Text style={styles.switchLabel}>Vaccinated</Text>
        <Switch
          value={formData.vaccinated}
          onValueChange={(val) => setFormData((prev) => ({ ...prev, vaccinated: val }))}
          trackColor={{ false: '#e5e7eb', true: '#028d8f' }}
        />
      </View>

      <View style={styles.switchRow}>
        <Text style={styles.switchLabel}>KCP Registered</Text>
        <Switch
          value={formData.kcpRegistered}
          onValueChange={(val) => setFormData((prev) => ({ ...prev, kcpRegistered: val }))}
          trackColor={{ false: '#e5e7eb', true: '#FFAC0D' }}
        />
      </View>

      <Text style={styles.label}>Description *</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        multiline
        numberOfLines={4}
        value={formData.description}
        onChangeText={(text) => setFormData((prev) => ({ ...prev, description: text }))}
        placeholder="Describe your pet's personality, health status, and special requirements..."
        placeholderTextColor="#9ca3af"
        textAlignVertical="top"
      />
    </View>
  );

  const renderStep3 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.sectionTitle}>Location & Contact</Text>

      <Text style={styles.label}>Province *</Text>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={formData.province}
          onValueChange={(val) =>
            setFormData((prev) => ({
              ...prev,
              province: val,
              city: '', // Reset city when province changes
            }))
          }
        >
          <Picker.Item label="Select Province" value="" color="#9ca3af" />
          {pakistaniProvinces.map((prov) => (
            <Picker.Item key={prov} label={prov} value={prov} />
          ))}
        </Picker>
      </View>

      <Text style={styles.label}>City *</Text>
      <View style={[styles.pickerWrapper, !formData.province && styles.disabledPicker]}>
        <Picker
          enabled={!!formData.province}
          selectedValue={formData.city}
          onValueChange={(val) => setFormData((prev) => ({ ...prev, city: val }))}
        >
          <Picker.Item
            label={formData.province ? 'Select City' : 'Please select province first'}
            value=""
            color="#9ca3af"
          />
          {getAvailableCities().map((city) => (
            <Picker.Item key={city} label={city} value={city} />
          ))}
        </Picker>
      </View>

      <Text style={styles.label}>Price (₨) *</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={formData.price}
        onChangeText={(text) => setFormData((prev) => ({ ...prev, price: text }))}
        placeholder="Enter price"
        placeholderTextColor="#9ca3af"
      />

      <Text style={styles.label}>Contact Number *</Text>
      <TextInput
        style={styles.input}
        keyboardType="phone-pad"
        value={formData.contactNumber}
        onChangeText={(text) => setFormData((prev) => ({ ...prev, contactNumber: text }))}
        placeholder="Your contact number"
        placeholderTextColor="#9ca3af"
      />

      <Text style={styles.sectionTitle}>Suitable For</Text>
      <View style={styles.checkboxGrid}>
        {suitableForOptions.map((option) => {
          const isSelected = formData.suitableFor.includes(option);
          return (
            <TouchableOpacity
              key={option}
              style={[styles.checkboxTile, isSelected && styles.checkboxTileActive]}
              onPress={() => toggleSuitableOption(option)}
            >
              <Text style={[styles.checkboxText, isSelected && styles.checkboxTextActive]}>
                {option}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <Text style={styles.label}>Pet Images *</Text>
      {formData.images.length > 0 && (
        <View style={styles.imageGrid}>
          {formData.images.map((img, index) => (
            <View key={index} style={styles.imageWrapper}>
              <Image source={{ uri: img.uri }} style={styles.previewImage} />
              <TouchableOpacity style={styles.removeBadge} onPress={() => removeImage(index)}>
                <Text style={styles.removeBadgeText}>×</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}

      <TouchableOpacity style={styles.uploadBox} onPress={handleSelectImages}>
        <Text style={styles.uploadBoxTitle}>
          {formData.images.length > 0 ? 'Add More Photos' : 'Upload Photos'}
        </Text>
        <Text style={styles.uploadBoxSubtext}>PNG, JPG up to 10MB each</Text>
      </TouchableOpacity>
    </View>
  );

  const isCurrentStepValid = validateStep(currentStep);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          Step {currentStep} of {totalSteps}
        </Text>
        <Text style={styles.headerSub}>Fill in the details to post your pet ad</Text>
      </View>

      {renderStepIndicator()}

      {currentStep === 1 && renderStep1()}
      {currentStep === 2 && renderStep2()}
      {currentStep === 3 && renderStep3()}

      <View style={styles.navigationRow}>
        <TouchableOpacity
          style={[styles.btn, styles.prevBtn, currentStep === 1 && styles.disabledBtn]}
          disabled={currentStep === 1}
          onPress={handlePrevious}
        >
          <Text style={styles.prevBtnText}>Previous</Text>
        </TouchableOpacity>

        {currentStep < totalSteps ? (
          <TouchableOpacity
            style={[styles.btn, styles.nextBtn, !isCurrentStepValid && styles.disabledBtn]}
            disabled={!isCurrentStepValid}
            onPress={handleNext}
          >
            <Text style={styles.nextBtnText}>Next</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[
              styles.btn,
              styles.submitBtn,
              (!isCurrentStepValid || isSubmitting) && styles.disabledBtn,
            ]}
            disabled={!isCurrentStepValid || isSubmitting}
            onPress={handleSubmit}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#ffffff" size="small" />
            ) : (
              <Text style={styles.submitBtnText}>Create Advertisement</Text>
            )}
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#111827',
  },
  headerSub: {
    fontSize: 14,
    color: '#4b5563',
    marginTop: 4,
  },
  indicatorContainer: {
    marginBottom: 24,
    alignItems: 'center',
  },
  stepsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeCircle: {
    backgroundColor: '#028d8f',
  },
  inactiveCircle: {
    backgroundColor: '#e5e7eb',
  },
  stepText: {
    fontSize: 14,
    fontWeight: '600',
  },
  activeStepText: {
    color: '#ffffff',
  },
  inactiveStepText: {
    color: '#4b5563',
  },
  stepConnector: {
    width: 40,
    height: 3,
    marginHorizontal: 8,
  },
  activeConnector: {
    backgroundColor: '#028d8f',
  },
  inactiveConnector: {
    backgroundColor: '#e5e7eb',
  },
  stepIndicatorSubtext: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 8,
  },
  stepContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  sectionSubTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#374151',
    marginTop: 12,
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 6,
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: '#111827',
    backgroundColor: '#ffffff',
  },
  textArea: {
    minHeight: 100,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
  },
  disabledPicker: {
    backgroundColor: '#f3f4f6',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  switchLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  checkboxGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  checkboxTile: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#d1d5db',
    backgroundColor: '#f9fafb',
  },
  checkboxTileActive: {
    backgroundColor: '#028d8f',
    borderColor: '#028d8f',
  },
  checkboxText: {
    fontSize: 13,
    color: '#374151',
  },
  checkboxTextActive: {
    color: '#ffffff',
    fontWeight: '600',
  },
  imageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 8,
    marginBottom: 12,
  },
  imageWrapper: {
    position: 'relative',
  },
  previewImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
  },
  removeBadge: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: '#ef4444',
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeBadgeText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
    lineHeight: 16,
  },
  uploadBox: {
    borderWidth: 2,
    borderColor: '#d1d5db',
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fafafa',
    marginTop: 8,
  },
  uploadBoxTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#028d8f',
  },
  uploadBoxSubtext: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 4,
  },
  navigationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  btn: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    minWidth: 110,
    alignItems: 'center',
    justifyContent: 'center',
  },
  prevBtn: {
    backgroundColor: '#e5e7eb',
  },
  prevBtnText: {
    color: '#374151',
    fontWeight: '600',
  },
  nextBtn: {
    backgroundColor: '#028d8f',
  },
  nextBtnText: {
    color: '#ffffff',
    fontWeight: '600',
  },
  submitBtn: {
    backgroundColor: '#028d8f',
  },
  submitBtnText: {
    color: '#ffffff',
    fontWeight: '600',
  },
  disabledBtn: {
    backgroundColor: '#9ca3af',
    opacity: 0.6,
  },
});

function launchImageLibrary(arg0: {
  mediaType: string; selectionLimit: number; // 0 allows multiple selection
  quality: number;
}) {
  throw new Error('Function not implemented.');
}
