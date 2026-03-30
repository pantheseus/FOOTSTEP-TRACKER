import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, Linking } from 'react-native';
import { Colors, Typography } from '../../theme';
import { ChevronLeft, Mail, Globe, Info, MessageSquare } from 'lucide-react-native';

const HelpCenterScreen = ({ navigation }: any) => {
  const HelpItem = ({ icon: Icon, label, onPress, description }: any) => (
    <TouchableOpacity style={styles.item} onPress={onPress}>
      <View style={styles.iconContainer}>
        <Icon size={20} color={Colors.primary} />
      </View>
      <View style={styles.itemText}>
        <Text style={styles.itemLabel}>{label}</Text>
        {description && <Text style={styles.itemDescription}>{description}</Text>}
      </View>
      <Text style={styles.arrow}>›</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ChevronLeft size={28} color={Colors.text} />
        </TouchableOpacity>
        <Text style={Typography.h2}>Help Center</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          <View style={styles.card}>
            <HelpItem 
              icon={MessageSquare} 
              label="FAQ" 
              description="Frequently Asked Questions"
              onPress={() => {}}
            />
            <View style={styles.divider} />
            <HelpItem 
              icon={Mail} 
              label="Contact Us" 
              description="support@footstepapp.com"
              onPress={() => Linking.openURL('mailto:support@footstepapp.com')}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <View style={styles.card}>
            <HelpItem 
              icon={Info} 
              label="About Footstep Tracker" 
              description="Version 1.0.0 (Metric Edition)"
              onPress={() => {}}
            />
            <View style={styles.divider} />
            <HelpItem 
              icon={Globe} 
              label="Privacy Policy" 
              onPress={() => {}}
            />
          </View>
        </View>

        <View style={styles.branding}>
          <Text style={styles.brandingText}>Made for your friends & family.</Text>
          <Text style={styles.brandingSubText}>Privacy First. No GPS. Pure Motion.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F2F2F7' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  backBtn: { padding: 4 },
  scrollContent: { padding: 16 },
  section: { marginBottom: 24 },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#8E8E93',
    marginLeft: 16,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#F2F2F7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  itemText: { flex: 1 },
  itemLabel: { fontSize: 17, color: Colors.text },
  itemDescription: { fontSize: 13, color: '#8E8E93', marginTop: 2 },
  arrow: { fontSize: 20, color: '#C7C7CC', fontWeight: '300' },
  divider: { height: 1, backgroundColor: '#F2F2F7', marginLeft: 60 },
  branding: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 40,
  },
  brandingText: { fontSize: 13, fontWeight: '600', color: '#8E8E93' },
  brandingSubText: { fontSize: 11, color: '#C7C7CC', marginTop: 4 },
});

export default HelpCenterScreen;
