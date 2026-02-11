import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  Alert,
  TextInput,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { subscriptionAPI } from '../services/api';

const SubscriptionsScreen = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [filteredSubscriptions, setFilteredSubscriptions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('all');

  useEffect(() => {
    loadSubscriptions();
  }, []);

  useEffect(() => {
    filterSubscriptions();
  }, [subscriptions, searchQuery, selectedFilter]);

  const loadSubscriptions = async () => {
    try {
      const data = await subscriptionAPI.getMySubscriptions();
      setSubscriptions(data);
    } catch (error) {
      console.error('Error loading subscriptions:', error);
      Alert.alert('Error', 'Failed to load subscriptions');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const filterSubscriptions = () => {
    let filtered = subscriptions;

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(sub =>
        sub.subscription_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sub.plan_name?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply status filter
    if (selectedFilter !== 'all') {
      filtered = filtered.filter(sub => sub.status === selectedFilter);
    }

    setFilteredSubscriptions(filtered);
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadSubscriptions();
  };

  const handleCancelSubscription = (subscriptionId) => {
    Alert.alert(
      'Cancel Subscription',
      'Are you sure you want to cancel this subscription?',
      [
        { text: 'No', style: 'cancel' },
        { 
          text: 'Yes', 
          style: 'destructive',
          onPress: () => cancelSubscription(subscriptionId)
        },
      ]
    );
  };

  const cancelSubscription = async (subscriptionId) => {
    try {
      await subscriptionAPI.cancelSubscription(subscriptionId);
      Alert.alert('Success', 'Subscription cancelled successfully');
      loadSubscriptions();
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      Alert.alert('Error', 'Failed to cancel subscription');
    }
  };

  const FilterModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={filterModalVisible}
      onRequestClose={() => setFilterModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Filter Subscriptions</Text>
            <TouchableOpacity onPress={() => setFilterModalVisible(false)}>
              <Icon name="close" size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <View style={styles.filterOptions}>
            {[
              { key: 'all', label: 'All Subscriptions' },
              { key: 'active', label: 'Active Only' },
              { key: 'cancelled', label: 'Cancelled Only' },
              { key: 'expired', label: 'Expired Only' },
            ].map((option) => (
              <TouchableOpacity
                key={option.key}
                style={[
                  styles.filterOption,
                  selectedFilter === option.key && styles.filterOptionSelected
                ]}
                onPress={() => {
                  setSelectedFilter(option.key);
                  setFilterModalVisible(false);
                }}
              >
                <Text style={[
                  styles.filterOptionText,
                  selectedFilter === option.key && styles.filterOptionTextSelected
                ]}>
                  {option.label}
                </Text>
                {selectedFilter === option.key && (
                  <Icon name="check" size={20} color="#4F46E5" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </Modal>
  );

  const SubscriptionItem = ({ item }) => (
    <View style={styles.subscriptionCard}>
      <View style={styles.cardHeader}>
        <View style={styles.subscriptionInfo}>
          <Text style={styles.subscriptionName}>{item.subscription_name}</Text>
          <Text style={styles.planName}>{item.plan_name}</Text>
        </View>
        <View style={[
          styles.statusBadge,
          { backgroundColor: getStatusColor(item.status) }
        ]}>
          <Text style={styles.statusText}>{item.status?.toUpperCase()}</Text>
        </View>
      </View>

      <View style={styles.cardContent}>
        <View style={styles.detailRow}>
          <Icon name="account-balance-wallet" size={16} color="#6B7280" />
          <Text style={styles.detailText}>₹{item.amount}</Text>
        </View>

        {item.start_date && (
          <View style={styles.detailRow}>
            <Icon name="event" size={16} color="#6B7280" />
            <Text style={styles.detailText}>
              Started: {new Date(item.start_date).toLocaleDateString()}
            </Text>
          </View>
        )}

        {item.end_date && (
          <View style={styles.detailRow}>
            <Icon name="event-busy" size={16} color="#6B7280" />
            <Text style={styles.detailText}>
              Ends: {new Date(item.end_date).toLocaleDateString()}
            </Text>
          </View>
        )}
      </View>

      {item.status === 'active' && (
        <View style={styles.cardActions}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => handleCancelSubscription(item.id)}
          >
            <Icon name="cancel" size={16} color="#DC2626" />
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return '#10B981';
      case 'cancelled': return '#F59E0B';
      case 'expired': return '#EF4444';
      default: return '#6B7280';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <Icon name="search" size={20} color="#6B7280" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search subscriptions..."
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setFilterModalVisible(true)}
        >
          <Icon name="filter-list" size={20} color="#4F46E5" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredSubscriptions}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => <SubscriptionItem item={item} />}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="subscriptions" size={64} color="#D1D5DB" />
            <Text style={styles.emptyText}>
              {searchQuery.trim() || selectedFilter !== 'all' 
                ? 'No subscriptions match your criteria'
                : 'No subscriptions yet'
              }
            </Text>
            <Text style={styles.emptySubtext}>
              {searchQuery.trim() || selectedFilter !== 'all'
                ? 'Try adjusting your search or filter'
                : 'Add your first subscription to get started'
              }
            </Text>
          </View>
        }
        style={styles.list}
        contentContainerStyle={filteredSubscriptions.length === 0 ? styles.emptyList : null}
      />

      <FilterModal />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: '#1F2937',
  },
  filterButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#EEF2FF',
  },
  list: {
    flex: 1,
  },
  emptyList: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  subscriptionCard: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    marginBottom: 8,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  subscriptionInfo: {
    flex: 1,
  },
  subscriptionName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  planName: {
    fontSize: 14,
    color: '#6B7280',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 12,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  cardContent: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#6B7280',
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 12,
  },
  cancelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#FEF2F2',
  },
  cancelButtonText: {
    marginLeft: 4,
    color: '#DC2626',
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6B7280',
    marginTop: 16,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 8,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 34, // Safe area padding
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  filterOptions: {
    padding: 20,
  },
  filterOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  filterOptionSelected: {
    backgroundColor: '#EEF2FF',
  },
  filterOptionText: {
    fontSize: 16,
    color: '#1F2937',
  },
  filterOptionTextSelected: {
    color: '#4F46E5',
    fontWeight: '600',
  },
});

export default SubscriptionsScreen;