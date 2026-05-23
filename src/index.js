import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import compression from 'compression';
import helmet from 'helmet';
import{json, urlencoded} from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import session from 'express-session';
import passport from './config/passport/index.js';
// import multer from 'multer';
import fs from 'fs';
import routes from './api/routes/index.js'
// import {upload} from './multer.js';


const app = express();

app.use(helmet());
app.use(compression());
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(cors());

// Session middleware for Passport
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session()); 


app.get('/', (_req, res) => {
  res.status(200).json({ message: 'Welcome! Get ready to shop with Shoppy Cart' });
})
routes(app);

// 404 Error Handling
app.use((_req,res) => {
  res.status(404).json({
    status: 'error',
    message: 'Resource not found'
  })
});


// internal server error, Error Handling
app.use((_req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'Ooooops! Something broke somewhere, we will look into it, contact us'
  })
})

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`)
});
export default app;
