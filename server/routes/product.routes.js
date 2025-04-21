const router = require('express').Router();
const multer = require('multer');
const {getProductById, deleteProduct, updateProduct, getProducts, createProducts , addCategory, getCategories} = require('../controllers/product.controller')
const jwt = require('jsonwebtoken');


//Only Checking for expiry of token
const secretKey = process.env.SECRET_KEY;
const getUserAuthentication = (req, res, next) => {
    try {
        console.log(req.cookies)
        const token = req.cookies.access_token;
        if (!token) return res.status(404).send("User not found")
        jwt.verify(token, secretKey)
        next()
    }catch(error){
        console.log(error)
        res.status(404).json({message:"Token Expired or Invalid", error})
    }
}


router.get('/', (req, res)=>{
    res.status(200).send("Product Route")
})

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/createProduct',getUserAuthentication, upload.array('image'), createProducts);

router.get('/getProducts',getUserAuthentication, getProducts)

router.patch("/update/:id",getUserAuthentication, upload.single("image"), updateProduct);

router.delete('/delete/:id',getUserAuthentication, deleteProduct)

router.get('/getproductbyid/:id', getUserAuthentication,getProductById)

router.post('/addCategory',getUserAuthentication, addCategory)

router.get('/getCategories',getUserAuthentication, getCategories)


module.exports = router;



// router.post('/insertMany', async(req, res)=>{
//     try{
//         console.log("working")
//         await Product.insertMany(req.body.data)
//         res.status(200).send('Products Created')
//     }catch(error){
//         console.log(error)
//         res.status(500).send('Something went wrong...')
//     }
// })
