import express from 'express';
import cors from "cors";
import { errorMiddleware } from '../../../packages/error-handler/error-handler';
import cookieParser from 'cookie-parser';


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

app.use(errorMiddleware);

const server = app.listen(port, () => {
    console.log(`Auth service running on port ${port}`);
});

server.on("error", (err) => {
    console.log("Server Error:", err);
})

