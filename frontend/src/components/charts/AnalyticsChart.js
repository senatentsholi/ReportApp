import React from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { appTheme } from '../../theme';

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
          backgroundColor: '#FFFFFF',
          backgroundGradientFrom: '#FFFFFF',
          backgroundGradientTo: '#F4F8FC',
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(63,169,245,${opacity})`,
          labelColor: (opacity = 1) => `rgba(22,50,79,${opacity})`,
          propsForDots: {
            r: '4',
            strokeWidth: '2',
            stroke: appTheme.colors.accent,
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
    borderRadius: 20,
    backgroundColor: appTheme.colors.surface,
    borderWidth: 1,
    borderColor: appTheme.colors.border,
    paddingVertical: 16,
    overflow: 'hidden',
  },
  title: {
    color: appTheme.colors.text,
    fontSize: 16,
    fontWeight: '800',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  chart: {
    borderRadius: 20,
  },
});

