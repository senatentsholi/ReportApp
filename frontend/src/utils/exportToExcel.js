import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import { Platform } from 'react-native';
import * as XLSX from 'xlsx';

export async function exportReportsToExcel(reports) {
  const formattedRows = reports.map((report) => ({
    Faculty: report.facultyName,
    Class: report.className,
    Week: report.week,
    Date: report.date,
    Course: report.courseName,
    'Course Code': report.courseCode,
    Lecturer: report.lecturerName,
    'Students Present': report.studentsPresent,
    'Registered Students': report.totalStudents,
    Venue: report.venue,
    'Lecture Time': report.time,
    Topic: report.topic,
    'Learning Outcomes': report.learningOutcomes,
    Recommendations: report.recommendations,
    Feedback: report.feedback || '',
  }));

  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet(formattedRows);
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Reports');
  const workbookBinary = XLSX.write(workbook, { type: 'base64', bookType: 'xlsx' });

  if (Platform.OS === 'web' && typeof document !== 'undefined') {
    const link = document.createElement('a');
    link.href = `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${workbookBinary}`;
    link.download = 'luct-reports.xlsx';
    link.click();
    return;
  }

  const fileUri = `${FileSystem.cacheDirectory}luct-reports.xlsx`;
  await FileSystem.writeAsStringAsync(fileUri, workbookBinary, {
    encoding: FileSystem.EncodingType.Base64,
  });

  if (await Sharing.isAvailableAsync()) {
    await Sharing.shareAsync(fileUri);
  }
}
