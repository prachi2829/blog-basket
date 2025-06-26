const {Router}=require('express');
const router=Router();
const blogController=require('../controllers/blogControllers');
const {requireAuth}=require('../middleware/authMiddleware');
const multer=require('multer');
const path=require('path');

const storage=multer.diskStorage({
    destination: function(req,file,cb){
        cb(null,path.resolve(`./public/uploads/`));
    },
    filename:function(req,file,cb){
        const fileName=`${Date.now()}-${file.originalname}`;
        cb(null,fileName);
    },
});

const upload=multer({storage:storage});

router.get('/add',blogController.add_get);
router.post('/add',requireAuth,upload.single('coverImage'),blogController.add_post);
router.get('/my-blogs',requireAuth,blogController.my_blogs);
router.get('/blogs/:id',requireAuth,blogController.blog_details);
router.get('/blogs',requireAuth,blogController.all_blogs);
router.post('/blogs/:id/delete', requireAuth,blogController.delete_blog);

router.post('/blogs/:id/like',blogController.toggle_like);
router.post('/blogs/:id/comments',blogController.add_comment);

module.exports=router;