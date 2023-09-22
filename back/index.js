import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'
import express from 'express'
import initApp from './src/index.router.js'
import './src/utilis/cloudinary.js';
// import './src/utils/scheduler.js'

//set directory dirname 
const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.join(__dirname, './config/.env') })


const app = express()

import { createHandler } from 'graphql-http/lib/use/express';
import { schema } from './graphQL/schema.js'


app.all('/graphql', createHandler({ schema }));
// setup port and the baseUrl
const port = process.env.PORT || 5000
initApp(app, express)
app.listen(port, () => console.log(`Example app listening on port ${port}!`))