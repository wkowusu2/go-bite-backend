import express from 'express';
import cors from 'cors';
import health from './routes/health.js';
import router from './routes/otp.js';
import { logger } from '../logger.js';
import { closeDb, dbConnect } from './config/db.config.js'
import customerProfile from './routes/profile.js'
import riderProfile from './routes/riderProfile.js'

const port = process.env.PORT || 3000;

async function startServer() {
  try {
    await dbConnect();

    const app = express();

    app.use(cors({
      origin: '*',
      methods: ["GET", "POST", "DELETE", "PUT", "PATCH"],
    }));

    app.use(express.json());
    app.use(logger);

    app.use('/api/availability', health);
    app.use('/api/v1/customer-profiles', customerProfile);
    app.use('/api/v1/rider-profiles', riderProfile);
    app.use('/api/v1/', router);

    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });

  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
}

startServer();

// graceful shutdown
process.on("SIGINT", async () => {
  await closeDb();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  await closeDb();
  process.exit(0);
});
