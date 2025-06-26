const Blog=require('../models/blog');
const User=require('../models/user');
const Comment=require('../models/comment');
function add_get(req,res){
    return res.render('addBlog',{
        user:req.user,
    });
}

async function add_post(req,res){
    const {title,body}=req.body;
    const blogData={
        title,
        body,
        createdBy:req.user._id,
    };
    if(req.file){
        blogData.coverImageURL=`/uploads/${req.file.filename}`;
    }
    
    const blog=await Blog.create(blogData);

    return res.redirect('/my-blogs');
}

async function my_blogs(req,res){
    try{
        const blogs=await Blog.find({createdBy:req.user._id}).sort({createdAt:-1});
        res.render('myBlogs',{
            user:req.user,
            blogs:blogs
        });
    }
    catch(err){
        console.log(err);
        res.status(500).send("Something went wrong");
    }
}

async function blog_details(req,res){
    try{
        const blog=await Blog.findById(req.params.id).populate('createdBy');
        const comments = await Comment.find({ blogId: blog._id })
      .populate('author')
      .sort({ createdAt: -1 });
        if(!blog){
            return res.send(400).send('Blog not found');
        }

        res.render('blogDetails',{
            blog:blog,
            user:req.user,
            comments,
        });
    }catch(err){
        console.log(err);
        res.status(500).send("Internal server error");
    }
}

async function all_blogs(req,res){
    const page=parseInt(req.query.page) || 1;
    const blogsPerPage=15;

    try{
        const totalBlogs=await Blog.countDocuments();
        const blogs=await Blog.find()
        .sort({createdAt:-1})
        .skip((page-1)*blogsPerPage)
        .limit(blogsPerPage);
        
        const hasMore=page*blogsPerPage<totalBlogs;

        res.render('allBlogs',{
            user:req.user,
            blogs,
            currentPage:page,
            hasMore,
        });
    }catch(err){
        console.log(err);
        res.status(500).send("Something went wrong.");
    }
}

async function delete_blog(req, res) {
    try {
        const blog = await Blog.findById(req.params.id);

        if (!blog) return res.status(404).send("Blog not found");

        if (blog.createdBy.toString() !== req.user._id.toString()) {
            return res.status(403).send("Unauthorized");
        }

        await Blog.deleteOne({ _id: blog._id });
        res.redirect('/my-blogs');
    } catch (err) {
        console.log(err);
        res.status(500).send("Error deleting blog");
    }
}


async function add_comment(req,res){
    const {content}=req.body;
    const blogId=req.params.id;

    try{
        await Comment.create({
            blogId,
            author:req.user._id,
            content,
        });
        res.redirect(`/blogs/${blogId}`);
    }
    catch(err){
        console.log(err);
        res.status(500).send('Comment failed');
    }
}

async function toggle_like(req,res){
    const blog=await Blog.findById(req.params.id);
    const userId=req.user._id;

    const index=blog.likes.indexOf(userId);

    if(index===-1){
        blog.likes.push(userId);
    }
    else{
        blog.likes.splice(index,1);
    }

    await blog.save();
    res.redirect(`/blogs/${req.params.id}`);
}


module.exports={
    add_get,
    add_post,
    my_blogs,
    blog_details,
    all_blogs,
    delete_blog,
    add_comment,
    toggle_like,
}