import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Colors, Spacing } from '../constants/theme';
import { hp } from '../constants/Responsive';

interface StepBarProps {
  total?: number;
  current: number;
}

export default function StepBar({ total = 3, current }: StepBarProps) {
  return (
    <View style={styles.row}>
      {Array.from({ length: total }).map((_, i) => (
        <View
          key={i}
          style={[
            styles.segment,
            i < current ? styles.done : styles.pending,
            i < total - 1 && { marginRight: Spacing.xs },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flex: 1,
    flexDirection: 'row',
  },
  segment: {
    flex: 1,
    height: hp(4),
    borderRadius: hp(2),
  },
  done:    { backgroundColor: Colors.stepDone },
  pending: { backgroundColor: Colors.stepPending },
});