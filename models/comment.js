const {Schema,model}=require('mongoose');

const commentSchema=new Schema({
    blogId:{
        type:Schema.Types.ObjectId,
        ref:'blog',
        required:true,
    },
    author:{
        type:Schema.Types.ObjectId,
        ref:'user',
        required:true,
    },
    content:{
        type:String,
        required:true,
    },
    createdAt:{
        type:Date,
        default:Date.now,
    }
});

const Comment=model('comment',commentSchema);

module.exports=Comment;