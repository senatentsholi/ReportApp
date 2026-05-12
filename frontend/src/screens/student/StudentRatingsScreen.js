import React, { useEffect, useMemo, useState } from 'react';
import { Alert, Pressable, StyleSheet, View } from 'react-native';
import { TextInput } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../providers/AuthProvider';
import { useAppData } from '../../hooks/useAppData';
import { useSearch } from '../../hooks/useSearch';
import { ScreenContainer } from '../../components/layout/ScreenContainer';
import { ScreenHeader } from '../../components/layout/ScreenHeader';
import { GlassCard } from '../../components/ui/GlassCard';
import { GradientButton } from '../../components/ui/GradientButton';
import { SectionTitle } from '../../components/dashboard/SectionTitle';
import { InfoCard } from '../../components/dashboard/InfoCard';
import { EmptyState } from '../../components/common/EmptyState';
import { SearchBar } from '../../components/common/SearchBar';
import { OptionSelectorField } from '../../components/forms/OptionSelectorField';
import { appTheme } from '../../theme';
import { getUserClassRecords, getVisibleRatings } from '../../utils/appSelectors';

export function StudentRatingsScreen() {
  const { user } = useAuth();
  const { data, saveRating, updateRating, deleteRating } = useAppData();
  const [query, setQuery] = useState('');
  const classRecords = useMemo(() => getUserClassRecords(data.classes, data.courses, user), [data.classes, data.courses, user]);
  const studentCourses = useMemo(
    () =>
      data.courses.filter((course) =>
        classRecords.some((classRecord) => classRecord.courseId === course.id || classRecord.courseCode === course.courseCode)
      ),
    [classRecords, data.courses]
  );
  const ratings = getVisibleRatings(data.ratings, user);
  const [editingId, setEditingId] = useState(null);
  const [stars, setStars] = useState(4);
  const [comment, setComment] = useState('');
  const [courseCode, setCourseCode] = useState('');
  const [lecturerId, setLecturerId] = useState('');
  const filteredRatings = useSearch(
    ratings,
    query,
    (item) => `${item.lecturerName} ${item.courseCode} ${item.comment} ${item.stars}`
  );
  const selectedCourse = useMemo(
    () => studentCourses.find((item) => item.courseCode === courseCode) || studentCourses[0] || null,
    [courseCode, studentCourses]
  );
  const courseOptions = useMemo(
    () =>
      studentCourses.map((item) => ({
        value: item.courseCode,
        label: `${item.courseCode} - ${item.courseName}`,
      })),
    [studentCourses]
  );
  const lecturer = useMemo(() => {
    if (lecturerId) {
      return data.users.find((item) => item.uid === lecturerId) || null;
    }

    if (selectedCourse?.assignedLecturerId) {
      return data.users.find((item) => item.uid === selectedCourse.assignedLecturerId) || null;
    }

    return (
      data.users.find(
        (item) => item.role === 'lecturer' && item.fullName === selectedCourse?.assignedLecturerName
      ) || null
    );
  }, [data.users, lecturerId, selectedCourse]);
  const eligibleLecturers = useMemo(() => {
    const linkedIds = new Set(
      studentCourses.map((course) => course.assignedLecturerId).filter(Boolean)
    );

    return data.users.filter((item) => {
      if (item.role !== 'lecturer') {
        return false;
      }

      if (linkedIds.has(item.uid)) {
        return true;
      }

      return Boolean(user.streamName) && item.streamName === user.streamName;
    });
  }, [data.users, studentCourses, user.streamName]);
  const lecturerOptions = useMemo(
    () =>
      eligibleLecturers.map((item) => ({
        value: item.uid,
        label: `${item.fullName || item.name} - ${item.streamName || 'No stream'}`,
      })),
    [eligibleLecturers]
  );

  useEffect(() => {
    if (!editingId && !courseCode && studentCourses.length) {
      setCourseCode(studentCourses[0]?.courseCode || '');
    }
  }, [courseCode, editingId, studentCourses]);

  useEffect(() => {
    if (editingId) {
      return;
    }

    if (selectedCourse?.assignedLecturerId) {
      setLecturerId(selectedCourse.assignedLecturerId);
      return;
    }

    if (!lecturerId && eligibleLecturers.length) {
      setLecturerId(eligibleLecturers[0].uid);
    }
  }, [editingId, eligibleLecturers, lecturerId, selectedCourse]);

  const resetForm = () => {
    setEditingId(null);
    setStars(4);
    setComment('');
    setCourseCode(studentCourses[0]?.courseCode || '');
    setLecturerId(studentCourses[0]?.assignedLecturerId || eligibleLecturers[0]?.uid || '');
  };

  const submitRating = async () => {
    if (!selectedCourse || !lecturer) {
      Alert.alert('Course not ready', 'Make sure your class has an assigned course and lecturer before submitting a rating.');
      return;
    }

    const payload = {
      studentId: user.uid,
      studentName: user.fullName || user.name || '',
      lecturerId: lecturer.uid,
      lecturerName: lecturer.fullName || lecturer.name || '',
      facultyName: selectedCourse.facultyName || '',
      streamName: selectedCourse.streamName || user.streamName || '',
      className:
        classRecords.find((item) => item.courseId === selectedCourse.id || item.courseCode === selectedCourse.courseCode)?.className ||
        user.className ||
        '',
      courseCode: selectedCourse.courseCode,
      stars,
      comment: comment.trim(),
    };

    try {
      if (editingId) {
        await updateRating(editingId, payload);
        Alert.alert('Rating updated', 'Your rating has been updated.');
      } else {
        await saveRating(payload);
        Alert.alert('Rating submitted', 'Your rating has been submitted.');
      }

      resetForm();
    } catch (error) {
      Alert.alert('Rating not saved', error.message || 'Please check the form and try again.');
    }
  };

  const beginEdit = (rating) => {
    setEditingId(rating.id);
    setStars(Number(rating.stars));
    setComment(rating.comment);
    setCourseCode(rating.courseCode);
    setLecturerId(rating.lecturerId || '');
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
      <ScreenHeader title="Ratings" user={user} />
      <GlassCard>
        <SectionTitle title={editingId ? 'Update Rating' : 'Rate Lecturer'} />
        <OptionSelectorField
          label="Course"
          helperText="Only your assigned courses are shown here."
          options={courseOptions}
          selectedValue={courseCode}
          onChange={setCourseCode}
        />
        <OptionSelectorField
          label="Lecturer"
          helperText="Pick from lecturers connected to your stream and registered courses."
          options={lecturerOptions}
          selectedValue={lecturerId}
          onChange={setLecturerId}
        />
        {lecturer ? (
          <InfoCard
            title={lecturer.fullName || lecturer.name || lecturer.email}
            meta={lecturer.email || 'No email saved'}
            description={`Faculty: ${lecturer.facultyName || 'Not set'}. Department: ${lecturer.department || 'Not set'}. Stream: ${lecturer.streamName || 'Not set'}.`}
          />
        ) : null}
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
          theme={{ colors: { primary: appTheme.colors.primary, outline: appTheme.colors.border, onSurface: appTheme.colors.text } }}
        />
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <GradientButton label={editingId ? 'Update Rating' : 'Submit Rating'} onPress={submitRating} style={{ flex: 1 }} />
          <GradientButton label="Clear" onPress={resetForm} style={{ flex: 1 }} />
        </View>
      </GlassCard>

      <SearchBar value={query} onChangeText={setQuery} placeholder="Search ratings" />
      <SectionTitle title="Lecturer Directory" caption="Lecturers available for rating from your stream and classes" />
      {eligibleLecturers.length ? (
        eligibleLecturers.map((item) => (
          <InfoCard
            key={item.uid}
            title={item.fullName || item.name || item.email}
            meta={item.email || 'No email saved'}
            description={`Faculty: ${item.facultyName || 'Not set'}. Department: ${item.department || 'Not set'}. Stream: ${item.streamName || 'Not set'}.`}
          />
        ))
      ) : (
        <EmptyState title="No lecturers linked yet" description="Ask your program leader to assign courses and lecturers first." />
      )}
      <SectionTitle title="My Rating History" />
      {filteredRatings.length ? (
        filteredRatings.map((rating) => (
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
        <EmptyState title="No ratings yet" />
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

