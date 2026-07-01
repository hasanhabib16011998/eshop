import express from 'express';
import cors from "cors";
import { errorMiddleWare } from '@packages/error-handler/error-middleware';
import cookieParser from 'cookie-parser';
import router from './routes/product.router';
import "./jobs/product-cronjob"
// import swaggerUI from 'swagger-ui-express';
// const swaggerDocument = require("./swagger-output.json");

const app = express();

app.use(cors({
    origin: ["http://localhost:3000"],
    allowedHeaders: ['Authorization','Content-Type'],
    credentials: true,
}))

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(cookieParser());

app.get('/', (req, res) => {
    res.send({ 'message': 'Hello from Product Service'});
});

// app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocument));
// app.get("/docs-json", (req,res) => {
//     res.json(swaggerDocument);
// })

app.use("/api", router);

app.use(errorMiddleWare);

const port = process.env.PORT || 6002;

const server = app.listen(port, ()=> {
    console.log(`Product service is running at port:${port}`)
})

server.on("error", (err) => {
    console.log("Server Error: ", err);
})