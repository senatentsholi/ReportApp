import React from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

const width = Dimensions.get('window').width - 64;

export function AnalyticsChart({ title, labels, data, suffix = '' }) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <LineChart
        data={{
          labels,
          datasets: [{ data }],
        }}
        width={Math.max(width, 280)}
        height={220}
        yAxisSuffix={suffix}
        withInnerLines={false}
        withOuterLines={false}
        chartConfig={{
          backgroundColor: '#11233A',
          backgroundGradientFrom: '#11233A',
          backgroundGradientTo: '#172D4A',
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(63,169,245,${opacity})`,
          labelColor: (opacity = 1) => `rgba(255,255,255,${opacity})`,
          propsForDots: {
            r: '4',
            strokeWidth: '2',
            stroke: '#9B5CFF',
          },
        }}
        bezier
        style={styles.chart}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.06)',
    paddingVertical: 16,
    overflow: 'hidden',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  chart: {
    borderRadius: 28,
  },
});
