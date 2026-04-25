function sortByNewest(items, field = 'createdAt') {
  return [...items].sort((a, b) => new Date(b[field] || 0).getTime() - new Date(a[field] || 0).getTime());
}

function groupCount(items, keyBuilder) {
  return items.reduce((accumulator, item) => {
    const key = keyBuilder(item);
    accumulator[key] = (accumulator[key] || 0) + 1;
    return accumulator;
  }, {});
}

export function getUnreadNotifications(notifications, userId) {
  return notifications.filter((item) => item.userId === userId && !item.read);
}

export function getVisibleNotifications(notifications, userId) {
  return sortByNewest(notifications.filter((item) => item.userId === userId));
}

export function getUserClassRecords(classes, courses, user) {
  if (!user) return [];

  if (user.role === 'student') {
    return classes.filter((item) => item.className === user.className);
  }

  if (user.role === 'lecturer') {
    const courseIds = courses.filter((course) => course.assignedLecturerId === user.uid).map((course) => course.id);
    return classes.filter((item) => courseIds.includes(item.courseId) || item.lecturerId === user.uid);
  }

  if (user.role === 'prl') {
    return classes.filter((item) => !item.principalLecturerId || item.principalLecturerId === user.uid);
  }

  return classes;
}

export function getVisibleReports(reports, classes, courses, user) {
  if (!user) return [];

  if (user.role === 'student') {
    return sortByNewest(reports.filter((report) => report.className === user.className));
  }

  if (user.role === 'lecturer') {
    return sortByNewest(reports.filter((report) => report.createdBy === user.uid || report.lecturerId === user.uid));
  }

  if (user.role === 'prl') {
    const courseIds = courses.filter((course) => course.principalLecturerId === user.uid).map((course) => course.id);
    const classIds = classes.filter((item) => courseIds.includes(item.courseId)).map((item) => item.id);
    return sortByNewest(reports.filter((report) => classIds.includes(report.classId)));
  }

  return sortByNewest(reports);
}

export function getVisibleCourses(courses, user) {
  if (!user) return [];

  if (user.role === 'lecturer') {
    return courses.filter((course) => course.assignedLecturerId === user.uid);
  }

  if (user.role === 'prl') {
    return courses.filter((course) => course.principalLecturerId === user.uid);
  }

  return courses;
}

export function getVisibleAttendance(attendance, classes, user) {
  if (!user) return [];

  if (user.role === 'student') {
    return sortByNewest(attendance.filter((entry) => entry.studentId === user.uid), 'date');
  }

  if (user.role === 'lecturer') {
    const classIds = classes.map((item) => item.id);
    return sortByNewest(attendance.filter((entry) => classIds.includes(entry.classId)), 'date');
  }

  return sortByNewest(attendance, 'date');
}

export function getVisibleRatings(ratings, user) {
  if (!user) return [];

  if (user.role === 'student') {
    return sortByNewest(ratings.filter((rating) => rating.studentId === user.uid));
  }

  if (user.role === 'lecturer') {
    return sortByNewest(ratings.filter((rating) => rating.lecturerId === user.uid));
  }

  return sortByNewest(ratings);
}

export function getVisibleMonitoring(monitoring, user) {
  if (!user) return [];

  if (user.role === 'student') {
    return sortByNewest(monitoring.filter((item) => item.className === user.className));
  }

  if (user.role === 'lecturer') {
    return sortByNewest(monitoring.filter((item) => item.ownerId === user.uid));
  }

  return sortByNewest(monitoring);
}

export function buildDashboardMetrics({ reports, attendance, ratings, classes, user }) {
  const presentCount = attendance.filter((entry) => entry.status === 'Present').length;
  const attendanceRate = attendance.length ? Math.round((presentCount / attendance.length) * 100) : 0;
  const ratingAverage = ratings.length
    ? (ratings.reduce((sum, rating) => sum + Number(rating.stars || 0), 0) / ratings.length).toFixed(1)
    : '0.0';

  return {
    reports: reports.length,
    classes: classes.length,
    attendanceRate: `${attendanceRate}%`,
    ratingAverage,
    greeting: user?.name || user?.fullName || 'LUCT User',
  };
}

export function buildAttendanceChart(attendance) {
  if (!attendance.length) {
    return { labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'], data: [0, 0, 0, 0, 0] };
  }

  const grouped = groupCount(attendance, (item) => item.date);
  const labels = Object.keys(grouped).sort().slice(-5).map((value) => value.slice(5));
  const data = Object.keys(grouped)
    .sort()
    .slice(-5)
    .map((date) => {
      const daily = attendance.filter((item) => item.date === date);
      const present = daily.filter((item) => item.status === 'Present').length;
      return Math.round((present / daily.length) * 100);
    });

  return { labels, data };
}

export function buildReportWeeklyChart(reports) {
  if (!reports.length) {
    return { labels: ['W1', 'W2', 'W3', 'W4'], data: [0, 0, 0, 0] };
  }

  const grouped = groupCount(reports, (item) => item.week || 'Week');
  const labels = Object.keys(grouped).slice(-5);
  const data = labels.map((label) => grouped[label]);
  return { labels, data };
}

export function buildParticipationChart(attendance) {
  if (!attendance.length) {
    return { labels: ['Present', 'Late', 'Absent'], data: [0, 0, 0] };
  }

  const grouped = groupCount(attendance, (item) => item.status);
  const labels = ['Present', 'Late', 'Absent'];
  const data = labels.map((label) => grouped[label] || 0);
  return { labels, data };
}
