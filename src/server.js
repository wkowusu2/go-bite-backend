import express from 'express';
import cors from 'cors';
import health from './routes/health.js';
import {supabaseAdmin} from './config/supabaseAdmin.js'
import router from './routes/otp.js';
import { logger } from '../logger.js';

const port = process.env.PORT || 3000


const app = express();
app.use(cors({
    origin: '*',
    methods: ["GET", "POST"],
}))

app.use(express.json())

// supabaseAdmin.auth.admin.createUser()
app.use('/api/availability',health)
app.use('/api/v1/', router)

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})

