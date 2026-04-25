const { onDocumentCreated } = require('firebase-functions/v2/firestore');
const { initializeApp } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

initializeApp();

exports.onReportCreated = onDocumentCreated('reports/{reportId}', async (event) => {
  const report = event.data.data();
  const db = getFirestore();

  await db.collection('notifications').add({
    title: 'New lecture report submitted',
    message: `${report.courseCode} for ${report.className} is ready for review.`,
    facultyName: report.facultyName,
    streamName: report.streamName,
    reportId: event.params.reportId,
    createdAt: new Date().toISOString(),
  });
});
