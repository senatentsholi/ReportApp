const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { notFound } = require('./middleware/notFound');
const { errorHandler } = require('./middleware/errorHandler');
const authRoutes = require('./routes/authRoutes');
const reportRoutes = require('./routes/reportRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const ratingRoutes = require('./routes/ratingRoutes');
const courseRoutes = require('./routes/courseRoutes');
const lecturerRoutes = require('./routes/lecturerRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.get('/api/health', (_request, response) => {
  response.json({
    success: true,
    message: 'LUCT reporting backend is running.',
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/ratings', ratingRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/lecturers', lecturerRoutes);
app.use('/api/feedback', feedbackRoutes);

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`LUCT reporting backend listening on port ${port}`);
});
