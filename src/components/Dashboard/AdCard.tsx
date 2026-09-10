import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { useAdStore } from '@/../Store/AdsStore';

export interface Ad {
  _id: string;
  name?: string;
  title?: string;
  description: string;
  price: string;
  category: string;
  city?: string;
  location?: string;
  breed: string;
  age: string;
  gender: string;
  weight: string;
  height: string;
  maxLife: string;
  contactNumber: string;
  vaccinated: boolean;
  kcpRegistered: boolean;
  suitableFor: string;
  images: string[];
  isApproved: 'pending' | 'approved' | 'rejected';
}

interface AdCardProps {
  ad: Ad;
  onDelete: (adId: string) => void;
  onEdit: (ad: Ad) => void;
}

export default function AdCard({ ad, onDelete, onEdit }: AdCardProps) {
  const { deleteAd } = useAdStore();
  const [isDeletingThis, setIsDeletingThis] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const getImageUrl = (imagePath?: string) => {
    if (!imagePath) return 'https://via.placeholder.com/400x300?text=No+Image';

    if (
      imagePath.startsWith('http://') ||
      imagePath.startsWith('https://') ||
      imagePath.startsWith('file://')
    ) {
      return imagePath;
    }

    const API_BASE = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5000';
    const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
    const fullPath = cleanPath.startsWith('/uploads/') ? cleanPath : `/uploads${cleanPath}`;

    return `${API_BASE}${fullPath}`;
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Advertisement',
      'Are you sure you want to delete this advertisement?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            setIsDeletingThis(true);
            const success = await deleteAd(ad._id);
            if (success) {
              onDelete(ad._id);
            }
            setIsDeletingThis(false);
          },
        },
      ]
    );
  };

  const currentImage =
    ad.images && ad.images.length > 0 ? ad.images[activeImageIndex] || ad.images[0] : null;

  return (
    <View style={styles.card}>
      {/* Image Container */}
      <View style={styles.imageContainer}>
        {currentImage ? (
          <Image
            source={{ uri: getImageUrl(currentImage) }}
            style={styles.image}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.noImageContainer}>
            <Text style={styles.noImageText}>No Image Uploaded</Text>
          </View>
        )}

        {/* Category Badge */}
        <View style={styles.categoryBadgeContainer}>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>
              {ad.category ? ad.category : 'Pet'}
            </Text>
          </View>
        </View>

        {/* Status & Health Badges */}
        <View style={styles.statusBadgesContainer}>
          <View
            style={[
              styles.statusBadge,
              ad.isApproved === 'approved'
                ? styles.bgApproved
                : ad.isApproved === 'rejected'
                ? styles.bgRejected
                : styles.bgPending,
            ]}
          >
            <Text style={styles.badgeText}>
              {ad.isApproved === 'approved'
                ? '✓ Approved'
                : ad.isApproved === 'rejected'
                ? '✗ Rejected'
                : '⏳ Pending'}
            </Text>
          </View>

          {ad.vaccinated && (
            <View style={[styles.statusBadge, styles.bgVaccinated]}>
              <Text style={styles.smallBadgeText}>✓ Vaccinated</Text>
            </View>
          )}

          {ad.kcpRegistered && (
            <View style={[styles.statusBadge, styles.bgKcp]}>
              <Text style={styles.smallBadgeText}>✓ KCP Registered</Text>
            </View>
          )}
        </View>

        {/* Multiple Image Dots */}
        {ad.images && ad.images.length > 1 && (
          <View style={styles.dotsContainer}>
            {ad.images.map((_, imgIdx) => (
              <TouchableOpacity
                key={imgIdx}
                onPress={() => setActiveImageIndex(imgIdx)}
                style={[
                  styles.dot,
                  activeImageIndex === imgIdx ? styles.activeDot : styles.inactiveDot,
                ]}
              />
            ))}
          </View>
        )}
      </View>

      {/* Details Container */}
      <View style={styles.detailsContainer}>
        <View>
          {/* Header Row */}
          <View style={styles.headerRow}>
            <Text style={styles.title} numberOfLines={2}>
              {ad.name || ad.title || 'Untitled Pet'}
            </Text>
            <Text style={styles.price}>
              ₨ {Number(ad.price || 0).toLocaleString()}
            </Text>
          </View>

          {/* Description */}
          <Text style={styles.description} numberOfLines={2}>
            {ad.description || 'No description available'}
          </Text>

          {/* Info Grid */}
          <View style={styles.infoRow}>
            <Text style={styles.infoText} numberOfLines={1}>
              📍 {ad.city || ad.location || 'Location missing'}
            </Text>
            <Text style={[styles.infoText, styles.textRight]} numberOfLines={1}>
              🐾 {ad.breed || 'Breed missing'}
            </Text>
          </View>

          {/* Secondary Info */}
          {(ad.age || ad.gender) && (
            <View style={styles.subInfoRow}>
              {ad.age ? <Text style={styles.subInfoText}>Age: {ad.age} months</Text> : <View />}
              {ad.gender ? <Text style={styles.subInfoText}>Gender: {ad.gender}</Text> : <View />}
            </View>
          )}
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsRow}>
          <TouchableOpacity
            onPress={() => onEdit(ad)}
            disabled={isDeletingThis}
            style={[styles.button, styles.editButton]}
          >
            <Text style={styles.buttonText}>Edit</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleDelete}
            disabled={isDeletingThis}
            style={[styles.button, styles.deleteButton, isDeletingThis && styles.disabledButton]}
          >
            {isDeletingThis ? (
              <ActivityIndicator color="#ffffff" size="small" />
            ) : (
              <Text style={styles.buttonText}>Delete</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#f3f4f6',
    overflow: 'hidden',
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  imageContainer: {
    position: 'relative',
    height: 220,
    backgroundColor: '#f3f4f6',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  noImageContainer: {
    height: '100%',
    backgroundColor: '#e5e7eb',
    justifyContent: 'center',
    alignItems: 'center',
  },
  noImageText: {
    color: '#6b7280',
    fontSize: 14,
    fontWeight: '500',
  },
  categoryBadgeContainer: {
    position: 'absolute',
    top: 12,
    left: 12,
  },
  categoryBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  categoryText: {
    color: '#1f2937',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'capitalize',
  },
  statusBadgesContainer: {
    position: 'absolute',
    top: 12,
    right: 12,
    alignItems: 'flex-end',
    gap: 4,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  bgApproved: { backgroundColor: '#22c55e' },
  bgRejected: { backgroundColor: '#ef4444' },
  bgPending: { backgroundColor: '#f59e0b' },
  bgVaccinated: { backgroundColor: '#10b981' },
  bgKcp: { backgroundColor: '#3b82f6' },
  badgeText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  smallBadgeText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '600',
  },
  dotsContainer: {
    position: 'absolute',
    bottom: 12,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  activeDot: {
    width: 24,
    backgroundColor: '#ffffff',
  },
  inactiveDot: {
    width: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
  },
  detailsContainer: {
    padding: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    flex: 1,
    marginRight: 8,
  },
  price: {
    fontSize: 18,
    fontWeight: '700',
    color: '#028d8f',
  },
  description: {
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 20,
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 13,
    color: '#6b7280',
    flex: 1,
  },
  textRight: {
    textAlign: 'right',
  },
  subInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
    paddingTop: 8,
    marginBottom: 12,
  },
  subInfoText: {
    fontSize: 12,
    color: '#6b7280',
    textTransform: 'capitalize',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 4,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editButton: {
    backgroundColor: '#028d8f',
  },
  deleteButton: {
    backgroundColor: '#ef4444',
  },
  disabledButton: {
    backgroundColor: '#fca5a5',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '600',
  },
});