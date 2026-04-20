import express, { urlencoded } from "express";
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './src/routes/authRoutes.js'
import connectDB from "./src/config/db.js";
import swaggerUi from 'swagger-ui-express'
import swaggerFile from "./swagger-output.json" with { type: "json" };
dotenv.config();

let swaggerDocument = {};
try {
    swaggerDocument = swaggerFile;

} catch (error) {
    console.log('Error loading Swagger document: ', err);
       
}

const app = express();

connectDB();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
const port = process.env.PORT || 3000;

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
 
app.get('/', (req, res) => {
    res.send("harsh");
})

app.use('/api/auth', authRoutes);


app.listen(port, () => {
    console.log(`Server is running at port : ${port}`);
    console.log(`Swagger docs available at http://localhost:${port}/api-docs`);
}) 
