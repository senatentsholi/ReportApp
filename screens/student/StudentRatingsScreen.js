import React, { useMemo, useState } from 'react';
import { Alert, Pressable, StyleSheet, View } from 'react-native';
import { TextInput } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../src/providers/AuthProvider';
import { useAppData } from '../../hooks/useAppData';
import { ScreenContainer } from '../../components/layout/ScreenContainer';
import { ScreenHeader } from '../../components/layout/ScreenHeader';
import { GlassCard } from '../../components/ui/GlassCard';
import { GradientButton } from '../../components/ui/GradientButton';
import { SectionTitle } from '../../components/dashboard/SectionTitle';
import { InfoCard } from '../../components/dashboard/InfoCard';
import { EmptyState } from '../../components/common/EmptyState';
import { appTheme } from '../../src/theme';
import { getVisibleRatings } from '../../utils/appSelectors';

export function StudentRatingsScreen() {
  const { user } = useAuth();
  const { data, saveRating, updateRating, deleteRating } = useAppData();
  const lecturers = data.users.filter((item) => item.role === 'lecturer');
  const lecturer = lecturers[0];
  const ratings = getVisibleRatings(data.ratings, user);
  const [editingId, setEditingId] = useState(null);
  const [stars, setStars] = useState(4);
  const [comment, setComment] = useState('');
  const [courseCode, setCourseCode] = useState('');

  const lecturerCourses = useMemo(
    () => data.courses.filter((item) => item.assignedLecturerId === lecturer?.uid),
    [data.courses, lecturer?.uid]
  );

  const resetForm = () => {
    setEditingId(null);
    setStars(4);
    setComment('');
    setCourseCode(lecturerCourses[0]?.courseCode || '');
  };

  const submitRating = async () => {
    if (!lecturer) {
      Alert.alert('Lecturer not found', 'Create a lecturer account first so ratings can be linked correctly.');
      return;
    }

    const payload = {
      studentId: user.uid,
      studentName: user.fullName,
      lecturerId: lecturer.uid,
      lecturerName: lecturer.fullName,
      className: user.className || '',
      courseCode,
      stars,
      comment,
    };

    try {
      if (editingId) {
        await updateRating(editingId, payload);
        Alert.alert('Rating updated', 'Your rating has been updated successfully.');
      } else {
        await saveRating(payload);
        Alert.alert('Rating saved', 'Your lecturer evaluation has been submitted.');
      }

      resetForm();
    } catch (error) {
      Alert.alert('Unable to save rating', error.message || 'Please review the rating form and try again.');
    }
  };

  const beginEdit = (rating) => {
    setEditingId(rating.id);
    setStars(Number(rating.stars));
    setComment(rating.comment);
    setCourseCode(rating.courseCode);
  };

  const handleDelete = (rating) => {
    Alert.alert('Delete rating', `Delete your ${rating.courseCode} rating?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await deleteRating(rating.id);
          if (editingId === rating.id) {
            resetForm();
          }
        },
      },
    ]);
  };

  return (
    <ScreenContainer>
      <ScreenHeader title="Ratings" subtitle="Evaluate your lecturer professionally" user={user} />
      <GlassCard>
        <SectionTitle title={editingId ? 'Update Rating' : 'Rate Lecturer'} caption="Share clear and professional feedback" />
        <TextInput
          mode="outlined"
          label="Course Code"
          value={courseCode}
          onChangeText={setCourseCode}
          style={styles.input}
          theme={{ colors: { primary: appTheme.colors.primary, outline: appTheme.colors.border, onSurface: '#FFFFFF' } }}
        />
        <View style={styles.starRow}>
          {[1, 2, 3, 4, 5].map((item) => (
            <Pressable key={item} onPress={() => setStars(item)}>
              <Ionicons name={item <= stars ? 'star' : 'star-outline'} size={30} color="#FFB648" />
            </Pressable>
          ))}
        </View>
        <TextInput
          mode="outlined"
          label="Comment"
          value={comment}
          onChangeText={setComment}
          multiline
          style={styles.input}
          theme={{ colors: { primary: appTheme.colors.primary, outline: appTheme.colors.border, onSurface: '#FFFFFF' } }}
        />
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <GradientButton label={editingId ? 'Update Rating' : 'Submit Rating'} onPress={submitRating} style={{ flex: 1 }} />
          <GradientButton label="Clear" onPress={resetForm} style={{ flex: 1 }} />
        </View>
      </GlassCard>

      <SectionTitle title="My Rating History" caption={lecturerCourses.length ? `Lecturer modules: ${lecturerCourses.map((item) => item.courseCode).join(', ')}` : 'Saved rating history'} />
      {ratings.length ? (
        ratings.map((rating) => (
          <InfoCard
            key={rating.id}
            title={`${rating.lecturerName} - ${rating.courseCode}`}
            meta={`${rating.stars} stars`}
            description={rating.comment}
            rightNode={
              <View style={{ gap: 8 }}>
                <GradientButton label="Edit" onPress={() => beginEdit(rating)} />
                <GradientButton label="Delete" onPress={() => handleDelete(rating)} />
              </View>
            }
          />
        ))
      ) : (
        <EmptyState title="No ratings yet" description="Your lecturer ratings will appear here after submission." />
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  starRow: {
    flexDirection: 'row',
    gap: 10,
    marginVertical: 14,
  },
  input: {
    backgroundColor: 'transparent',
    marginTop: 12,
    marginBottom: 4,
  },
});
