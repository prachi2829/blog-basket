const User=require('../models/user');
const jwt=require('jsonwebtoken');

//handle errors
const handleErrors=(err)=>{
    //err,code is for unique
    console.log(err.message,err.code);
    let errors={
        email:'',
        password:''
    }; 

    //incorrect email
    if(err.message==='incorrect email'){
        errors.email='that email is not registered';
    }
    if(err.message==='incorrect password'){
        errors.password='that password is incorrect';
    }

    //duplicate error code
    if(err.code===11000){
        errors.email='that email is already registered';
        return errors;
    }
    //validation errors
    if(err.message.includes('user validation failed')){
        Object.values(err.errors).forEach(({properties})=>{
            errors[properties.path]=properties.message;

        });
    }
    return errors;
}

const maxAge=3*24*60*60;
const createToken=(id)=>{
    return jwt.sign({id},'watermelon',{
        expiresIn:maxAge,
    });
}


function signup_get(req,res){
    res.render('signup');
}

function login_get(req,res){
    res.render('login');
}


async function signup_post(req,res){
    const {fullName,email,password}=req.body;

    try{
        const user=await User.create({fullName,email,password});
        const token=createToken(user._id);

        res.cookie('jwt',token,{
            httpOnly:true,
            maxAge:maxAge*1000
        })
        res.status(201).json({user:user._id});
    }
    catch(err){
        const errors=handleErrors(err);
        res.status(400).json({errors});
    }
}

async function login_post(req,res){
    const {email,password}=req.body;

    try{
        const user=await User.login(email,password);
        const token=createToken(user._id);

        res.cookie('jwt',token,{
            httpOnly:true,
            maxAge:maxAge*1000
        })
        res.status(200).json({user:user._id})
    }
    catch(err){
        const errors=handleErrors(err);
        res.status(400).json({errors});
    }
}

function logout_get(req,res){
    res.cookie('jwt','',{
        maxAge:1
    });
    res.redirect('/');
}

module.exports={
    signup_get,
    signup_post,
    login_get,
    login_post,
    logout_get,
}