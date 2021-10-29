import express from "express";
import listEndpoints from "express-list-endpoints";
import cors from "cors"
import mediaRouter from "./services/media/index.js";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import { notFound, forbidden, catchAllErrorHandler } from "./errorHandlers.js";


const fileName = fileURLToPath(import.meta.url)
const publicDirname = dirname(fileName)
const publicDirectory = path.join(publicDirname, "../public")

const port = 3000

const server = express ()
server.use(cors())

server.use(express.json())

server.use(express.static(publicDirectory))

server.use("/media", mediaRouter)

server.use(notFound);

server.use(forbidden);

server.use(catchAllErrorHandler);

console.table(listEndpoints(server))

server.listen (port, console.log("server running on port: ", port))
