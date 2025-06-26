const jwt= require('jsonwebtoken');
const User=require('../models/user');
const requireAuth=(req,res,next)=>{
    const token=req.cookies.jwt;

    if(token){
        jwt.verify(token,'watermelon',(err,decodedToken)=>{
            if(err){
                console.log(err.message);
                res.redirect('/login');
            }
            else{
                console.log(decodedToken);
                next();
            }
        });
    }
    else{
        res.redirect('/login');
    }
}


const checkUser=(req,res,next)=>{
    const token=req.cookies.jwt;

    if(token){
        jwt.verify(token,'watermelon',async(err,decodedToken)=>{
            if(err){
                console.log(err.message);
                res.locals.user=null;
                req.user=null;
                next();
            }
            else{
                console.log(decodedToken);
                let user= await User.findById(decodedToken.id);
                res.locals.user = user;//passing users into the views
                req.user=user;
                next();
            }
        })
    }
    else{
        res.locals.user=null;
        req.user=null;
        next();
    }
}
module.exports={requireAuth,checkUser};
