import express from 'express';
import cors from "cors";

const app = express();

app.use(cors({
    origin: ["http://localhost:3000"],
    allowedHeaders: ['Authorization','Content-Type'],
    credentials: true,
}))

app.get('/', (req, res) => {
    res.send({ 'message': 'Hello from Auth Service'});
});

const port = process.env.PORT || 6001;

const server = app.listen(port, ()=> {
    console.log(`Auth service is running at port:${port}`)
})

server.on("error", (err) => {
    console.log("Server Error: ", err);
})