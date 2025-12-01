import express from 'express';
import cors from 'cors';
import health from './routes/health.js';
import {supabaseAdmin} from './config/supabaseAdmin.js'

const port = process.env.PORT || 3000


const app = express();
app.use(cors({
    origin: '*',
    methods: ["GET", "POST"],
}))

// supabaseAdmin.auth.admin.createUser()
app.use(health)

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})
