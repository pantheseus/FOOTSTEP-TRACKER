import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, Dimensions, StatusBar } from 'react-native';
import { useTheme } from '../../theme';
import { Accelerometer, Pedometer } from 'expo-sensors';
import { ChevronLeft, Zap, Info, ShieldCheck, Activity } from 'lucide-react-native';

const { width } = Dimensions.get('window');

const DiagnosticScreen = ({ navigation }: any) => {
  const { colors, typography, isDark } = useTheme();
  
  const [accData, setAccData] = useState({ x: 0, y: 0, z: 0 });
  const [magnitude, setMagnitude] = useState(0);
  const [pedometerStatus, setPedometerStatus] = useState('Checking...');
  const [stepsDetected, setStepsDetected] = useState(0);
  const [history, setHistory] = useState<number[]>([]);

  useEffect(() => {
    let sub: any = null;
    
    Accelerometer.setUpdateInterval(100); // 10Hz is enough for walking
    
    sub = Accelerometer.addListener(data => {
      setAccData(data);
      const mag = Math.sqrt(data.x**2 + data.y**2 + data.z**2) * 9.8; // Convert to m/s^2 approx
      setMagnitude(mag);
      
      setHistory(prev => {
        const next = [...prev, mag];
        if (next.length > 50) next.shift();
        return next;
      });

      // Simple peak detection for diagnostic view
      if (mag > 12.5) { // Threshold for a "Step-like" event
          setStepsDetected(prev => prev + 1);
      }
    });

    Pedometer.isAvailableAsync().then(avail => {
      setPedometerStatus(avail ? 'Available 🟢' : 'NOT Available 🔴');
    });

    return () => sub && sub.remove();
  }, []);

  const styles = getStyles(colors, typography, isDark);

  const renderChart = () => {
    const maxVal = Math.max(...history, 15);
    const minVal = Math.min(...history, 5);
    const range = maxVal - minVal;

    return (
      <View style={styles.chartContainer}>
        {history.map((val, idx) => (
          <View 
            key={idx} 
            style={[
              styles.bar, 
              { 
                height: ((val - minVal) / (range || 1)) * 100,
                backgroundColor: val > 12.5 ? colors.primary : colors.textSecondary + '40'
              }
            ]} 
          />
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ChevronLeft size={28} color={colors.text} />
        </TouchableOpacity>
        <Text style={typography.h2}>Diagnostic Center</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.promoCard}>
          <Zap size={32} color={colors.white} />
          <Text style={styles.promoTitle}>Sensor Link Pulse</Text>
          <Text style={styles.promoSubtitle}>Shake your phone to see if the hardware is alive.</Text>
        </View>

        <View style={styles.section}>
          <View style={styles.statRow}>
             <Info size={16} color={colors.primary} />
             <Text style={styles.statLabel}>PEDOMETER ENGINE</Text>
             <Text style={styles.statValue}>{pedometerStatus}</Text>
          </View>
          <View style={styles.statRow}>
             <Activity size={16} color={colors.primary} />
             <Text style={styles.statLabel}>RAW ACCELEROMETER</Text>
             <Text style={styles.statValue}>X: {accData.x.toFixed(2)} Y: {accData.y.toFixed(2)} Z: {accData.z.toFixed(2)}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Motion Visualization (Magnitude)</Text>
          {renderChart()}
          <View style={styles.legend}>
             <Text style={styles.legendText}>Current: {magnitude.toFixed(2)} m/s²</Text>
             <Text style={styles.legendText}>Events Detected: {stepsDetected}</Text>
          </View>
        </View>

        <View style={styles.infoBox}>
           <ShieldCheck size={20} color={colors.primary} />
           <View style={{ flex: 1 }}>
              <Text style={styles.infoBoxTitle}>How to verify?</Text>
              <Text style={styles.infoBoxText}>If the bars jump and "Events Detected" increases when you shake the phone, your hardware is working! The Pedometer API may be failing on your specific Android version, and our app will now automatically use this raw data as a fallback.</Text>
           </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const getStyles = (colors: any, typography: any, isDark: boolean) => StyleSheet.create({
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
  promoCard: {
    backgroundColor: colors.primary,
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    alignItems: 'center',
  },
  promoTitle: { fontSize: 20, fontWeight: '800', color: colors.white, marginTop: 8 },
  promoSubtitle: { fontSize: 13, color: colors.white, opacity: 0.8, marginTop: 4, textAlign: 'center' },
  section: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: { fontSize: 11, fontWeight: '700', color: colors.textSecondary, marginBottom: 12, textTransform: 'uppercase' },
  statRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  statLabel: { fontSize: 11, fontWeight: '700', color: colors.textSecondary, flex: 1 },
  statValue: { fontSize: 13, fontWeight: '600', color: colors.text },
  chartContainer: {
    height: 120,
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 2,
    marginTop: 8,
  },
  bar: { flex: 1, borderRadius: 1 },
  legend: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 },
  legendText: { fontSize: 12, fontWeight: '600', color: colors.textSecondary },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    padding: 20,
    borderRadius: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  infoBoxTitle: { fontSize: 15, fontWeight: '700', color: colors.text, marginBottom: 4 },
  infoBoxText: { fontSize: 13, color: colors.textSecondary, lineHeight: 18 },
});

export default DiagnosticScreen;
