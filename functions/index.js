const { onDocumentCreated } = require('firebase-functions/v2/firestore');
const { initializeApp } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

initializeApp();

exports.onReportCreated = onDocumentCreated('reports/{reportId}', async (event) => {
  const report = event.data.data();
  const db = getFirestore();
  const usersSnapshot = await db.collection('users').get();
  const recipients = usersSnapshot.docs
    .map((document) => ({ id: document.id, ...document.data() }))
    .filter((user) => {
      if (user.role === 'pl') {
        return true;
      }

      if (user.role === 'prl') {
        return user.streamName && user.streamName === report.streamName;
      }

      return false;
    });

  await Promise.all(
    recipients.map((recipient) =>
      db.collection('notifications').add({
        userId: recipient.id,
        title: 'New lecture report submitted',
        message: `${report.courseCode} for ${report.className} is ready for review.`,
        facultyName: report.facultyName,
        streamName: report.streamName,
        reportId: event.params.reportId,
        read: false,
        createdAt: new Date().toISOString(),
      })
    )
  );
});

exports.onFeedbackCreated = onDocumentCreated('feedback/{feedbackId}', async (event) => {
  const feedback = event.data.data();
  const db = getFirestore();
  const reportSnapshot = await db.collection('reports').doc(feedback.reportId).get();

  if (!reportSnapshot.exists) {
    return;
  }

  const report = reportSnapshot.data();

  await db.collection('notifications').add({
    userId: report.lecturerId,
    title: 'PRL feedback received',
    message: `${report.courseCode} now has academic feedback ready for review.`,
    facultyName: report.facultyName,
    streamName: report.streamName,
    reportId: feedback.reportId,
    read: false,
    createdAt: new Date().toISOString(),
  });
});
