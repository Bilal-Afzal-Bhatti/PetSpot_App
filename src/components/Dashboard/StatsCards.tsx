import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export interface Ad {
  _id: string;
  isApproved: 'pending' | 'approved' | 'rejected';
  createdAt?: string;
}

interface StatsCardsProps {
  totalAds: number;
  ads?: Ad[];
}

const PRIMARY_GRADIENT = ['#028d8f', '#008080'] as const;

// Simple Progress Bar Component
const SimpleChart = ({ percentage }: { percentage: number }) => (
  <View style={styles.chartContainer}>
    <View style={styles.progressBarBackground}>
      <LinearGradient
        colors={PRIMARY_GRADIENT}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[
          styles.progressBarFill,
          { width: `${Math.min(Math.max(percentage, 0), 100)}%` },
        ]}
      />
    </View>
    <Text style={styles.percentageText}>{percentage.toFixed(0)}%</Text>
  </View>
);

export default function StatsCards({ totalAds, ads = [] }: StatsCardsProps) {
  const stats = useMemo(() => {
    const pendingAds = ads.filter((ad) => ad.isApproved === 'pending').length;
    const approvedAds = ads.filter((ad) => ad.isApproved === 'approved').length;
    const rejectedAds = ads.filter((ad) => ad.isApproved === 'rejected').length;

    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const thisMonthAds = ads.filter((ad) => {
      if (!ad.createdAt) return false;
      const adDate = new Date(ad.createdAt);
      return adDate.getMonth() === currentMonth && adDate.getFullYear() === currentYear;
    }).length;

    const pendingPercentage = totalAds > 0 ? (pendingAds / totalAds) * 100 : 0;
    const approvedPercentage = totalAds > 0 ? (approvedAds / totalAds) * 100 : 0;
    const rejectedPercentage = totalAds > 0 ? (rejectedAds / totalAds) * 100 : 0;
    const monthlyPercentage = totalAds > 0 ? (thisMonthAds / totalAds) * 100 : 0;

    return {
      pending: pendingAds,
      approved: approvedAds,
      rejected: rejectedAds,
      thisMonth: thisMonthAds,
      pendingPercentage,
      approvedPercentage,
      rejectedPercentage,
      monthlyPercentage,
    };
  }, [ads, totalAds]);

  const approvalRate = totalAds > 0 ? ((stats.approved / totalAds) * 100).toFixed(1) : '0';

  return (
    <View style={styles.container}>
      {/* Total Ads Card */}
      <View style={styles.card}>
        <View style={styles.mainRow}>
          <LinearGradient colors={PRIMARY_GRADIENT} style={styles.iconCircle}>
            <Feather name="file-text" size={28} color="#FFFFFF" />
          </LinearGradient>
          <View style={styles.textContainer}>
            <Text style={styles.cardLabel}>Total Advertisements</Text>
            <Text style={styles.primaryValueText}>{totalAds}</Text>
          </View>
        </View>
        <Text style={styles.subtext}>📈 Your complete pet advertisement portfolio</Text>
      </View>

      {/* Approval Rate Card */}
      <View style={styles.card}>
        <View style={styles.centerContent}>
          <View style={styles.smallIconCircle}>
            <Feather name="bar-chart-2" size={22} color="#028d8f" />
          </View>
          <Text style={styles.cardLabel}>Ads Approval Rate</Text>
          <Text style={styles.primaryValueText}>{approvalRate}%</Text>
        </View>
        <SimpleChart percentage={stats.approvedPercentage} />
      </View>

      {/* Status Grid */}
      <View style={styles.gridRow}>
        {/* Pending */}
        <View style={styles.gridCard}>
          <View style={styles.gridHeader}>
            <View style={styles.smallIconCircle}>
              <Feather name="clock" size={18} color="#028d8f" />
            </View>
            <View style={styles.gridTextContainer}>
              <Text style={styles.smallLabel}>Pending</Text>
              <Text style={styles.gridValueText}>{stats.pending}</Text>
            </View>
          </View>
          <SimpleChart percentage={stats.pendingPercentage} />
        </View>

        {/* Active */}
        <View style={styles.gridCard}>
          <View style={styles.gridHeader}>
            <View style={styles.smallIconCircle}>
              <Feather name="check-circle" size={18} color="#028d8f" />
            </View>
            <View style={styles.gridTextContainer}>
              <Text style={styles.smallLabel}>Active</Text>
              <Text style={styles.gridValueText}>{stats.approved}</Text>
            </View>
          </View>
          <SimpleChart percentage={stats.approvedPercentage} />
        </View>
      </View>

      <View style={styles.gridRow}>
        {/* Rejected */}
        <View style={styles.gridCard}>
          <View style={styles.gridHeader}>
            <View style={styles.smallIconCircle}>
              <Feather name="x-circle" size={18} color="#028d8f" />
            </View>
            <View style={styles.gridTextContainer}>
              <Text style={styles.smallLabel}>Rejected</Text>
              <Text style={styles.gridValueText}>{stats.rejected}</Text>
            </View>
          </View>
          <SimpleChart percentage={stats.rejectedPercentage} />
        </View>

        {/* This Month */}
        <View style={styles.gridCard}>
          <View style={styles.gridHeader}>
            <View style={styles.smallIconCircle}>
              <Feather name="trending-up" size={18} color="#028d8f" />
            </View>
            <View style={styles.gridTextContainer}>
              <Text style={styles.smallLabel}>This Month</Text>
              <Text style={styles.gridValueText}>{stats.thisMonth}</Text>
            </View>
          </View>
          <SimpleChart percentage={stats.monthlyPercentage} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    elevation: 3,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
  },
  mainRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  iconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  textContainer: {
    flex: 1,
  },
  cardLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4B5563',
    marginBottom: 2,
  },
  primaryValueText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#028d8f',
  },
  subtext: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  centerContent: {
    alignItems: 'center',
    marginBottom: 8,
  },
  smallIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E6F4F4',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  gridRow: {
    flexDirection: 'row',
    gap: 12,
  },
  gridCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    justifyContent: 'space-between',
    elevation: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
  },
  gridHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  gridTextContainer: {
    marginLeft: 8,
    flex: 1,
  },
  smallLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#6B7280',
  },
  gridValueText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#028d8f',
  },
  chartContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  progressBarBackground: {
    flex: 1,
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  percentageText: {
    marginLeft: 8,
    fontSize: 11,
    fontWeight: '600',
    color: '#028d8f',
  },
});