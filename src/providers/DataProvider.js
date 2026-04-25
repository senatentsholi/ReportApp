import React, { createContext, useEffect, useMemo, useState } from 'react';
import { appDataService } from '../../services/appDataService';
import { createEmptyData } from '../../services/initialData';
import { authService } from '../../services/authService';
import {
  validateAttendance,
  validateClassRecord,
  validateCourse,
  validateMonitoring,
  validateRating,
  validateReport,
} from '../../utils/validation';

export const DataContext = createContext(null);

function prependRecord(list, record) {
  return [record, ...list.filter((item) => item.id !== record.id)];
}

function replaceRecord(list, recordId, payload) {
  return list.map((item) => (item.id === recordId ? { ...item, ...payload } : item));
}

function removeRecord(list, recordId) {
  return list.filter((item) => item.id !== recordId);
}

export function DataProvider({ children }) {
  const [data, setData] = useState(createEmptyData());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = appDataService.subscribeAll({
      onData({ data: nextData }) {
        setData(nextData);
        setLoading(false);
      },
      onError(error) {
        console.error('Firestore subscription failed:', error);
        setData(createEmptyData());
        setLoading(false);
      },
    });

    return () => {
      unsubscribe?.();
    };
  }, []);

  const value = useMemo(
    () => ({
      data,
      loading,
      async refresh() {
        setLoading(true);
      },
      async saveReport(report) {
        validateReport(report);
        const response = await appDataService.createReport(report);
        setData((current) => ({
          ...current,
          reports: prependRecord(current.reports, { ...report, id: response.id }),
        }));
      },
      async updateReport(reportId, payload) {
        await appDataService.updateReport(reportId, payload);
        setData((current) => ({
          ...current,
          reports: replaceRecord(current.reports, reportId, payload),
        }));
      },
      async deleteReport(reportId) {
        await appDataService.deleteReport(reportId);
        setData((current) => ({
          ...current,
          reports: removeRecord(current.reports, reportId),
        }));
      },
      async saveAttendance(entry) {
        validateAttendance(entry);
        const response = await appDataService.addAttendance(entry);
        setData((current) => ({
          ...current,
          attendance: prependRecord(current.attendance, { ...entry, id: response.id }),
        }));
      },
      async updateAttendance(attendanceId, payload) {
        validateAttendance(payload);
        await appDataService.updateAttendance(attendanceId, payload);
        setData((current) => ({
          ...current,
          attendance: replaceRecord(current.attendance, attendanceId, payload),
        }));
      },
      async deleteAttendance(attendanceId) {
        await appDataService.deleteAttendance(attendanceId);
        setData((current) => ({
          ...current,
          attendance: removeRecord(current.attendance, attendanceId),
        }));
      },
      async saveRating(rating) {
        validateRating(rating);
        const response = await appDataService.addRating(rating);
        setData((current) => ({
          ...current,
          ratings: prependRecord(current.ratings, { ...rating, id: response.id }),
        }));
      },
      async updateRating(ratingId, payload) {
        validateRating(payload);
        await appDataService.updateRating(ratingId, payload);
        setData((current) => ({
          ...current,
          ratings: replaceRecord(current.ratings, ratingId, payload),
        }));
      },
      async deleteRating(ratingId) {
        await appDataService.deleteRating(ratingId);
        setData((current) => ({
          ...current,
          ratings: removeRecord(current.ratings, ratingId),
        }));
      },
      async saveCourse(course) {
        validateCourse(course);
        const response = await appDataService.addCourse(course);
        setData((current) => ({
          ...current,
          courses: prependRecord(current.courses, { ...course, id: response.id }),
        }));
      },
      async updateCourse(courseId, payload) {
        validateCourse(payload);
        await appDataService.updateCourse(courseId, payload);
        setData((current) => ({
          ...current,
          courses: replaceRecord(current.courses, courseId, payload),
        }));
      },
      async deleteCourse(courseId) {
        await appDataService.deleteCourse(courseId);
        setData((current) => ({
          ...current,
          courses: removeRecord(current.courses, courseId),
        }));
      },
      async saveClass(classRecord) {
        validateClassRecord(classRecord);
        const response = await appDataService.addClass(classRecord);
        setData((current) => ({
          ...current,
          classes: prependRecord(current.classes, { ...classRecord, id: response.id }),
        }));
      },
      async updateClass(classId, payload) {
        validateClassRecord(payload);
        await appDataService.updateClass(classId, payload);
        setData((current) => ({
          ...current,
          classes: replaceRecord(current.classes, classId, payload),
        }));
      },
      async deleteClass(classId) {
        await appDataService.deleteClass(classId);
        setData((current) => ({
          ...current,
          classes: removeRecord(current.classes, classId),
        }));
      },
      async saveMonitoring(item) {
        validateMonitoring(item);
        const response = await appDataService.addMonitoring(item);
        setData((current) => ({
          ...current,
          monitoring: prependRecord(current.monitoring, { ...item, id: response.id }),
        }));
      },
      async updateMonitoring(monitoringId, payload) {
        validateMonitoring(payload);
        await appDataService.updateMonitoring(monitoringId, payload);
        setData((current) => ({
          ...current,
          monitoring: replaceRecord(current.monitoring, monitoringId, payload),
        }));
      },
      async deleteMonitoring(monitoringId) {
        await appDataService.deleteMonitoring(monitoringId);
        setData((current) => ({
          ...current,
          monitoring: removeRecord(current.monitoring, monitoringId),
        }));
      },
      async updateProfile(userId, payload) {
        await appDataService.updateProfile(userId, payload);
        setData((current) => ({
          ...current,
          users: replaceRecord(current.users, userId, { uid: userId, ...payload }),
        }));
      },
      async markNotificationRead(notificationId) {
        await appDataService.markNotificationRead(notificationId);
        setData((current) => ({
          ...current,
          notifications: replaceRecord(current.notifications, notificationId, { read: true }),
        }));
      },
      async uploadProfilePhoto() {
        return authService.pickProfileImage?.();
      },
    }),
    [data, loading]
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}
