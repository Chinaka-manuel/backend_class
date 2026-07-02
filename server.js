import express from "express"
import dotenv from "dotenv"
import userRouter from "./routes/userRoutes.js"
import productsRouter from "./routes/productsRoutes.js"
import morgan from "morgan"
import connect from "./utils/db.js"



dotenv.config({
    path: "./.env"
})


const app = express();
// this is used to retrieve or parse the data in the request body
app.use(express.json())  
app.use(morgan('dev'))
app.use("/api/v1/user", userRouter)
app.use("/api/v1", productsRouter)



connect();
// creating a server using express
let PORT = process.env.PORT
app.listen(PORT, ()=>{
    console.log(`Server connected on port: ${PORT}`)
})


