const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const mailRoutes = require('./routes/mail.routes');
const sseRoutes = require('./routes/sse.routes');

const app = express();

// Middleware
app.use(cors());
// Raw parser for ingest route
app.use('/app/v1/mail/ingest', express.raw({ type: 'application/octet-stream', limit: '25mb' }));
// JSON parser for others
app.use(express.json({ limit: '25mb' }));

// Health Check
app.get('/actuator/health', (req, res) => {
  res.status(200).json({ status: 'UP' });
});

// Routes
// Note: Frontend uses /user/create, /user/verify, /public/login
app.use('/app/v1', authRoutes);
app.use('/app/v1/users', userRoutes);
app.use('/app/v1/mail', mailRoutes);
app.use('/app/v1/sse', sseRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err);
  res.status(500).json({
    message: 'Internal Server Error',
    data: err.message,
    status: 'INTERNAL_SERVER_ERROR'
  });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`MailForge Gateway running on port ${PORT}`);
});
