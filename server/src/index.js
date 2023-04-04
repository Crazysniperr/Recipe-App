import express from "express";
import cors from "cors";
import mongoose from "mongoose";

import {UserRouter} from './routes/users.js';
import { recipesRouter } from "./routes/recipes.js";
const path = require('path');
const app = express();

app.use(express.json());

app.use(cors());
app.use(express.static(path.join(__dirname, '../../client/build')))

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../client/build/index.html'));
})

app.use("/auth", UserRouter);
app.use("/recipes",recipesRouter);

mongoose.connect("mongodb+srv://crazysniperr:A30955903s@recipes.txojsgq.mongodb.net/recipes?retryWrites=true&w=majority")

app.listen(3001,()=> console.log("SERVER STARTED"));