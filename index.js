import dotenv from 'dotenv'
dotenv.config();
import express from 'express'
import connectDB from './database/ConnectDB.js';
import authRoutes from './routes/auth.route.js'
import cookieParser from "cookie-parser";
import userRoutes from './routes/user.route.js'
import adminRoutes from './routes/admin.route.js'
import cors from 'cors'


const app = express();

connectDB();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: process.env.WHITE_LISTID_ORIGIN,
    credentials: true,
}))
const PORT = process.env.PORT || 3000

app.get('/',(req,res) => {
    res.json("Hello World");
})

app.use('/api/auth',authRoutes);
app.use('/api/user',userRoutes);
app.use('/api/admin',adminRoutes);

app.listen(PORT,() => {
    console.log(`Server is running on the port ${PORT}`)

})