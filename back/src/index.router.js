import connectDB from '../DB/connection.js'
import authRouter from './modules/auth/auth.router.js'
import userRouter from './modules/user/user.router.js'
import chatRouter from './modules/chat/chat.router.js'
import { globalErrorHandling } from './utilis/errorHandling.js'
import cors from 'cors'


const initApp = (app, express) => {
    app.set('case sensitive routing', false);
    // allow access
    var whitelist = ['http://example1.com', 'http://example2.com']
    var corsOptions = {
        origin: function (origin, callback) {
            if (whitelist.indexOf(origin) !== -1) {
                callback(null, true)
            } else {
                callback(new Error('Not allowed by CORS'))
            }
        }
    }
    app.use(cors())
    //convert Buffer Data
    app.use((req, res, next) => {
        if (req.originalUrl == '/order/webhook') {
            next();
        }
        else {
            express.json({})(req, res, next);
        }
    })

    //Setup API Routing 
    app.get("/", (req, res, next) => {
        return res.json({ message: 'Welcome to E-Commerce' })
    })
    app.use(`/auth`, authRouter)
    app.use(`/user`, userRouter)
    app.use(`/chat`, chatRouter)
    app.all('*', (req, res, next) => {
        res.status(404).send("In-valid Routing Plz check url  or  method")
    })
    app.use(globalErrorHandling)
    connectDB()
}



export default initApp
