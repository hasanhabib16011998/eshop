import express from 'express';
import cors from "cors";
import { errorMiddleware } from '@packages/error-handler/error-handler';
import cookieParser from 'cookie-parser';
import router from './routes/auth.router';
import swaggerUI from "swagger-ui-express";



const swaggerDocument = require("./swagger-output.json");
const port = process.env.PORT || 6001;

const app = express();

app.use(cors({
    origin: ["http://localhost:3000"],
    allowedHeaders: ["Authorization", "Content-Type"],
    credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

app.get('/', (req, res) => {
    res.send({ 'message': 'Hello API'});
});

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocument));
app.get("/docs-json", (req,res)=>{
    res.json(swaggerDocument);
})

//Routes
app.use("/api",router);

app.use(errorMiddleware);

const server = app.listen(port, () => {
    console.log(`Auth service running on port ${port}`);
    console.log(`swagger Docs are available at http://localhost:${port}/docs`)
});

server.on("error", (err) => {
    console.log("Server Error:", err);
})

