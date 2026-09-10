import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  Alert,
  StyleSheet,
} from 'react-native';

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

interface AdsGridProps {
  ads: Ad[];
  onDeleteAd: (adId: string) => void;
  onEditAd: (ad: Ad) => void;
}

const getFirstValidImage = (images?: string[]): string => {
  const valid = (images || []).find(
    (img) =>
      img?.startsWith('http://') ||
      img?.startsWith('https://') ||
      img?.startsWith('file://') ||
      img?.startsWith('blob:')
  );
  return valid || 'https://via.placeholder.com/150?text=No+Image';
};

export default function AdsGrid({ ads, onDeleteAd, onEditAd }: AdsGridProps) {
  const [expandedDescriptions, setExpandedDescriptions] = useState<{ [key: string]: boolean }>({});

  const toggleDescription = (adId: string) => {
    setExpandedDescriptions((prev) => ({
      ...prev,
      [adId]: !prev[adId],
    }));
  };

  const handleDeleteClick = (adId: string, adTitle: string) => {
    Alert.alert(
      'Delete Advertisement',
      `Are you sure you want to delete the ad "${adTitle}"?\n\nThis action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => onDeleteAd(adId),
        },
      ]
    );
  };

  const renderStatusBadge = (status: string) => {
    let badgeStyle = styles.badgePending;
    let badgeTextStyle = styles.badgeTextPending;

    if (status === 'approved') {
      badgeStyle = styles.badgeApproved;
      badgeTextStyle = styles.badgeTextApproved;
    } else if (status === 'rejected') {
      badgeStyle = styles.badgeRejected;
      badgeTextStyle = styles.badgeTextRejected;
    }

    const formattedStatus = status
      ? status.charAt(0).toUpperCase() + status.slice(1)
      : 'Pending';

    return (
      <View style={[styles.statusBadge, badgeStyle]}>
        <Text style={[styles.statusBadgeText, badgeTextStyle]}>{formattedStatus}</Text>
      </View>
    );
  };

  const renderItem = ({ item: ad }: { item: Ad }) => {
    const titleText = ad.name || ad.title || 'Untitled Pet';
    const locationText = ad.city || ad.location || 'Location not specified';
    const isExpanded = !!expandedDescriptions[ad._id];
    const isLongDescription = ad.description && ad.description.length > 50;

    return (
      <View style={styles.card}>
        {/* Top Header Row */}
        <View style={styles.topRow}>
          <Image
            source={{ uri: getFirstValidImage(ad.images) }}
            style={styles.thumbnail}
            resizeMode="cover"
          />
          <View style={styles.headerInfo}>
            <Text style={styles.title} numberOfLines={1}>
              {titleText}
            </Text>
            <Text style={styles.metaText}>
              {ad.breed || 'Breed N/A'} • {ad.gender || 'N/A'} • {ad.age ? `${ad.age} months` : 'Age N/A'}
            </Text>
            <View style={styles.badgeWrapper}>{renderStatusBadge(ad.isApproved)}</View>
          </View>
        </View>

        {/* Description Section */}
        {ad.description ? (
          <View style={styles.descriptionContainer}>
            <Text
              style={styles.descriptionText}
              numberOfLines={isExpanded ? undefined : 2}
            >
              {ad.description}
            </Text>
            {isLongDescription && (
              <TouchableOpacity onPress={() => toggleDescription(ad._id)}>
                <Text style={styles.toggleText}>
                  {isExpanded ? 'Show Less' : 'Read More'}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        ) : null}

        {/* Price & Location Row */}
        <View style={styles.infoRow}>
          <View>
            <Text style={styles.priceText}>
              ₨ {Number(ad.price || 0).toLocaleString()}
            </Text>
            <Text style={styles.categoryText}>{ad.category || 'Pet'}</Text>
          </View>

          <View style={styles.rightAlign}>
            <Text style={styles.locationText}>{locationText}</Text>
            <Text style={styles.contactText}>
              {ad.contactNumber || 'No contact'}
            </Text>
          </View>
        </View>

        {/* Health Badges */}
        {(ad.vaccinated || ad.kcpRegistered) && (
          <View style={styles.healthRow}>
            {ad.vaccinated && (
              <View style={[styles.healthBadge, styles.bgVaccinated]}>
                <Text style={styles.textVaccinated}>✓ Vaccinated</Text>
              </View>
            )}
            {ad.kcpRegistered && (
              <View style={[styles.healthBadge, styles.bgKcp]}>
                <Text style={styles.textKcp}>✓ KCP Registered</Text>
              </View>
            )}
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.actionsRow}>
          <TouchableOpacity
            onPress={() => onEditAd(ad)}
            style={styles.actionButton}
          >
            <Text style={styles.editText}>Edit</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleDeleteClick(ad._id, titleText)}
            style={styles.actionButton}
          >
            <Text style={styles.deleteText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionHeader}>Your Advertisements</Text>

      <FlatList
        data={ads}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No advertisements found.</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 16,
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
  },
  listContent: {
    paddingBottom: 16,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#f3f4f6',
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  thumbnail: {
    width: 64,
    height: 64,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#f9fafb',
  },
  headerInfo: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
  },
  metaText: {
    fontSize: 12,
    color: '#4b5563',
    marginTop: 2,
  },
  badgeWrapper: {
    marginTop: 6,
    alignSelf: 'flex-start',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  badgePending: { backgroundColor: '#fef3c7' },
  badgeTextPending: { color: '#92400e' },
  badgeApproved: { backgroundColor: '#dcfce7' },
  badgeTextApproved: { color: '#166534' },
  badgeRejected: { backgroundColor: '#fee2e2' },
  badgeTextRejected: { color: '#991b1b' },

  descriptionContainer: {
    marginTop: 8,
  },
  descriptionText: {
    fontSize: 12,
    color: '#6b7280',
    lineHeight: 18,
  },
  toggleText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#028d8f',
    marginTop: 2,
  },

  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
    paddingTop: 10,
    marginTop: 10,
  },
  priceText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
  categoryText: {
    fontSize: 11,
    color: '#6b7280',
    textTransform: 'capitalize',
  },
  rightAlign: {
    alignItems: 'flex-end',
  },
  locationText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#111827',
  },
  contactText: {
    fontSize: 11,
    color: '#6b7280',
  },

  healthRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 8,
  },
  healthBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  bgVaccinated: { backgroundColor: '#dcfce7' },
  textVaccinated: { color: '#166534', fontSize: 11, fontWeight: '500' },
  bgKcp: { backgroundColor: '#dbeafe' },
  textKcp: { color: '#1e40af', fontSize: 11, fontWeight: '500' },

  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 16,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
    paddingTop: 10,
    marginTop: 10,
  },
  actionButton: {
    paddingVertical: 2,
    paddingHorizontal: 4,
  },
  editText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#028d8f',
  },
  deleteText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#dc2626',
  },

  emptyContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#f3f4f6',
    paddingVertical: 32,
    alignItems: 'center',
  },
  emptyText: {
    color: '#6b7280',
    fontSize: 15,
  },
});