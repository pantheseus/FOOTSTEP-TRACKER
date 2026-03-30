import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, Linking, StatusBar } from 'react-native';
import { useTheme } from '../../theme';
import { ChevronLeft, Mail, Globe, Info, MessageSquare } from 'lucide-react-native';

const HelpCenterScreen = ({ navigation }: any) => {
  const { colors, typography, isDark } = useTheme();

  const HelpItem = ({ icon: Icon, label, onPress, description }: any) => (
    <TouchableOpacity style={styles.item} onPress={onPress}>
      <View style={styles.iconContainer}>
        <Icon size={20} color={colors.primary} />
      </View>
      <View style={styles.itemText}>
        <Text style={styles.itemLabel}>{label}</Text>
        {description && <Text style={styles.itemDescription}>{description}</Text>}
      </View>
      <Text style={styles.arrow}>›</Text>
    </TouchableOpacity>
  );

  const styles = getStyles(colors, typography);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ChevronLeft size={28} color={colors.text} />
        </TouchableOpacity>
        <Text style={typography.h2}>Help Center</Text>
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
              description="Version 1.0.0 (Apple Edition)"
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

const getStyles = (colors: any, typography: any) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backBtn: { padding: 4 },
  scrollContent: { padding: 16 },
  section: { marginBottom: 24 },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
    marginLeft: 16,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  card: {
    backgroundColor: colors.card,
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
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  itemText: { flex: 1 },
  itemLabel: { fontSize: 17, color: colors.text },
  itemDescription: { fontSize: 13, color: colors.textSecondary, marginTop: 2 },
  arrow: { fontSize: 20, color: colors.textSecondary, fontWeight: '300', opacity: 0.5 },
  divider: { height: 1, backgroundColor: colors.background, marginLeft: 60 },
  branding: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 40,
  },
  brandingText: { fontSize: 13, fontWeight: '600', color: colors.textSecondary },
  brandingSubText: { fontSize: 11, color: colors.textSecondary, opacity: 0.5, marginTop: 4 },
});

export default HelpCenterScreen;
