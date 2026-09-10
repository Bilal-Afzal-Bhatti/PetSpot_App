import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Modal,
  StyleSheet,
  StatusBar,
  Platform,
  Animated,
  Dimensions,
  PanResponder,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

import { useAuthStore } from '@/../Store/authStore';
import { useAdStore } from '@/../Store/AdsStore';

import DashboardHeader from '@/components/Dashboard/DashboardHeader';
import StatsCards from '@/components/Dashboard/StatsCards';
import AdsGrid from '@/components/Dashboard/AdsGrid';
import EditAdModal from '@/components/Dashboard/EditAdModal';
import CreateAdForm from '@/components/Dashboard/CreateAdForm';
import EmptyState from '@/components/Dashboard/EmptyState';
import ProfileScreen from '@/components/Dashboard/profile';

export interface Ad {
  _id: string;
  title?: string;
  description?: string;
  price?: string;
  category?: string;
  location?: string;
  breed?: string;
  age?: string;
  gender?: string;
  weight?: string;
  height?: string;
  maxLife?: string;
  contactNumber?: string;
  vaccinated?: boolean;
  kcpRegistered?: boolean;
  suitableFor?: string;
  images?: string[];
  isApproved: 'pending' | 'approved' | 'rejected';
}

type MenuTab = 'overview' | 'ads' | 'create-ad' | 'profile';

const PRIMARY_GRADIENT = ['#028d8f', '#008080'] as const;
const DRAWER_WIDTH = 280;

export default function DashboardScreen() {
  const router = useRouter();
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);

  // Auth & Ad Store hooks
  const { authUser, isCheckingAuth, checkAuth } = useAuthStore() as any;
  const { postAd, updateAd, deleteAd, getUserAds, isPosting, isUpdating } = useAdStore() as any;

  // UI States
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingAd, setEditingAd] = useState<Ad | null>(null);
  const [activeMenu, setActiveMenu] = useState<MenuTab>('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Animation values
  const slideAnim = useRef(new Animated.Value(-DRAWER_WIDTH)).current;
  const backdropAnim = useRef(new Animated.Value(0)).current;

  // Open & Close Animation Triggers
  useEffect(() => {
    if (isSidebarOpen) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(backdropAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: -DRAWER_WIDTH,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(backdropAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isSidebarOpen]);

  const closeDrawer = () => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: -DRAWER_WIDTH,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(backdropAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => setIsSidebarOpen(false));
  };

  // PanResponder to allow swipe-left gesture on drawer to close
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => Math.abs(gestureState.dx) > 10,
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx < -50) {
          closeDrawer();
        }
      },
    })
  ).current;

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (isCheckingAuth) return;

    if (!authUser) {
      router.replace('/(auth)/login');
      return;
    }

    fetchUserAds();
  }, [authUser, isCheckingAuth]);

  const fetchUserAds = async () => {
    setLoading(true);
    try {
      const fetchedAds = await getUserAds();
      setAds(fetchedAds || []);
    } catch (error) {
      console.error('Error fetching ads:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdSubmit = async (formData: FormData): Promise<boolean> => {
    const success = await postAd(formData);
    if (success) {
      setActiveMenu('ads');
      fetchUserAds();
    }
    return success;
  };

  const handleAdUpdate = async (adId: string, formData: FormData) => {
    const success = await updateAd(adId, formData);
    if (success) {
      setShowEditModal(false);
      setEditingAd(null);
      fetchUserAds();
    }
  };

  const handleDeleteAd = async (adId: string) => {
    const success = await deleteAd(adId);
    if (success) {
      setAds((prev) => prev.filter((ad) => ad._id !== adId));
      fetchUserAds();
    }
  };

  const handleEditAd = (ad: Ad) => {
    setEditingAd(ad);
    setShowEditModal(true);
  };

  const navItems: { key: MenuTab; label: string; icon: keyof typeof Feather.glyphMap }[] = [
    { key: 'overview', label: 'Overview', icon: 'pie-chart' },
    { key: 'create-ad', label: 'Create Ad', icon: 'plus-circle' },
    { key: 'ads', label: 'My Ads', icon: 'grid' },
    { key: 'profile', label: 'Profile Settings', icon: 'user' },
  ];

  if (isCheckingAuth || loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#028d8f" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#028d8f" />

      {/* Top Banner Header */}
      <LinearGradient colors={PRIMARY_GRADIENT} style={styles.headerHero}>
        <TouchableOpacity style={styles.menuIconButton} onPress={() => setIsSidebarOpen(true)}>
          <Feather name="menu" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.heroTitle}>Dashboard</Text>
        <View style={{ width: 36 }} />
      </LinearGradient>

      {/* Main Content View */}
      <View style={styles.mainContainer}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {(activeMenu === 'overview' || activeMenu === 'ads') && (
            <DashboardHeader onCreateAd={() => setActiveMenu('create-ad')} />
          )}

          {activeMenu === 'overview' && (
            <View style={styles.sectionGap}>
              <StatsCards totalAds={ads.length} ads={ads} />
            </View>
          )}

          {activeMenu === 'ads' && (
            <View style={styles.sectionGap}>
              {ads.length > 0 ? (
                <AdsGrid
                  ads={ads.map((ad) => ({
                    ...ad,
                    description: ad.description || '',
                    price: ad.price || '',
                    title: ad.title || '',
                    category: ad.category || '',
                    location: ad.location || '',
                    breed: ad.breed || '',
                    age: ad.age || '',
                    gender: ad.gender || '',
                    weight: ad.weight || '',
                    height: ad.height || '',
                    maxLife: ad.maxLife || '',
                    contactNumber: ad.contactNumber || '',
                    suitableFor: ad.suitableFor || '',
                    vaccinated: ad.vaccinated ?? false,
                    kcpRegistered: ad.kcpRegistered ?? false,
                    images: ad.images || [],
                    isApproved: ad.isApproved || 'pending',
                  }))}
                  onDeleteAd={handleDeleteAd}
                  onEditAd={(ad) => handleEditAd(ad)}
                />
              ) : (
                <EmptyState onCreateAd={() => setActiveMenu('create-ad')} />
              )}
            </View>
          )}

          {activeMenu === 'create-ad' && (
            <View style={styles.cardWrapper}>
              <CreateAdForm onSubmit={handleAdSubmit} isSubmitting={isPosting} />
            </View>
          )}

          {activeMenu === 'profile' && (
            <View style={styles.cardWrapper}>
              <ProfileScreen />
            </View>
          )}
        </ScrollView>
      </View>

      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        activeOpacity={0.8}
        onPress={() => setIsSidebarOpen(true)}
      >
        <LinearGradient colors={PRIMARY_GRADIENT} style={styles.fabGradient}>
          <Feather name="menu" size={24} color="#FFF" />
        </LinearGradient>
      </TouchableOpacity>

      {/* Animated Left Navigation Drawer Modal */}
      <Modal visible={isSidebarOpen} transparent animationType="none" onRequestClose={closeDrawer}>
        <View style={styles.drawerOverlay}>
          {/* Animated Fade Backdrop */}
          <Animated.View style={[styles.backdrop, { opacity: backdropAnim }]}>
            <TouchableOpacity style={styles.backdropPressable} activeOpacity={1} onPress={closeDrawer} />
          </Animated.View>

          {/* Animated Slide-in Drawer */}
          <Animated.View
            {...panResponder.panHandlers}
            style={[
              styles.drawerContainer,
              {
                transform: [{ translateX: slideAnim }],
              },
            ]}
          >
            <View style={styles.drawerHeader}>
              <Text style={styles.drawerTitle}>Navigation</Text>
              <TouchableOpacity onPress={closeDrawer} style={styles.closeDrawerBtn}>
                <Feather name="x" size={22} color="#374151" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.backHomeBtn}
              onPress={() => {
                closeDrawer();
                router.push('/(tabs)/home');
              }}
            >
              <Feather name="arrow-left" size={18} color="#028d8f" />
              <Text style={styles.backHomeText}>Back to home</Text>
            </TouchableOpacity>

            <View style={styles.menuList}>
              {navItems.map((item) => {
                const isActive = activeMenu === item.key;
                return (
                  <TouchableOpacity
                    key={item.key}
                    onPress={() => {
                      setActiveMenu(item.key);
                      closeDrawer();
                    }}
                    style={[styles.menuItem, isActive && styles.activeMenuItem]}
                  >
                    <Feather
                      name={item.icon}
                      size={20}
                      color={isActive ? '#FFFFFF' : '#4B5563'}
                      style={styles.menuIcon}
                    />
                    <Text style={[styles.menuText, isActive && styles.activeMenuText]}>
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </Animated.View>
        </View>
      </Modal>

      {/* Edit Ad Modal */}
      <EditAdModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setEditingAd(null);
        }}
        onSubmit={handleAdUpdate}
        isSubmitting={isUpdating}
        ad={editingAd}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F0FDFA',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  headerHero: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  heroTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  menuIconButton: {
    padding: 6,
  },
  mainContainer: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 90,
  },
  sectionGap: {
    gap: 16,
  },
  cardWrapper: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    borderRadius: 28,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
  },
  fabGradient: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  drawerOverlay: {
    flex: 1,
    flexDirection: 'row',
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  backdropPressable: {
    flex: 1,
  },
  drawerContainer: {
    width: DRAWER_WIDTH,
    backgroundColor: '#FFF',
    height: '100%',
    padding: 20,
    elevation: 16,
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  drawerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  drawerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  closeDrawerBtn: {
    padding: 4,
  },
  backHomeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#E6F4F1',
    marginBottom: 20,
  },
  backHomeText: {
    color: '#028d8f',
    fontWeight: '600',
    fontSize: 14,
  },
  menuList: {
    gap: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
  },
  activeMenuItem: {
    backgroundColor: '#028d8f',
  },
  menuIcon: {
    marginRight: 12,
  },
  menuText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#374151',
  },
  activeMenuText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});