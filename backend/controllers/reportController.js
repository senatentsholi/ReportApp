const { asyncHandler } = require('../utils/asyncHandler');
const { validateReport } = require('../utils/validators');
const {
  createRecord,
  deleteRecord,
  listRecords,
  updateRecord,
} = require('../services/firestoreService');

const listReports = asyncHandler(async (_request, response) => {
  const reports = await listRecords('reports');
  response.json({ success: true, data: reports });
});

const createReport = asyncHandler(async (request, response) => {
  validateReport(request.body);
  const report = await createRecord('reports', request.body);
  response.status(201).json({ success: true, data: report });
});

const updateReportById = asyncHandler(async (request, response) => {
  const report = await updateRecord('reports', request.params.id, request.body);
  response.json({ success: true, data: report });
});

const deleteReportById = asyncHandler(async (request, response) => {
  await deleteRecord('reports', request.params.id);
  response.json({ success: true, message: 'Report deleted successfully.' });
});

module.exports = {
  listReports,
  createReport,
  updateReportById,
  deleteReportById,
};
