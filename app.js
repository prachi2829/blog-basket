require('dotenv').config();

const express=require('express');
const mongoose=require('mongoose');
const authRoutes=require('./routes/authRoutes');
const blogRoutes=require('./routes/blogRoutes');
const cookieParser=require('cookie-parser');
const {requireAuth,checkUser}=require('./middleware/authMiddleware');

const app=express();
const PORT=process.env.PORT ||3000;

app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.set('view engine','ejs');

const dbURI=process.env.MONGO_URL;
mongoose.connect(dbURI)
.then((result)=>app.listen(PORT))
.catch((err)=>console.log(err));

app.use(checkUser);
app.get('/',(req,res)=>res.render('home'));
app.get('/add',requireAuth,(req,res)=>res.render('addBlog'));
app.use(authRoutes);
app.use(blogRoutes);