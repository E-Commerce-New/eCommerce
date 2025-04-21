const router = require('express').Router();
const multer = require('multer');
const {getProductById, deleteProduct, updateProduct, getProducts, createProducts , addCategory, getCategories} = require('../controllers/product.controller')

router.get('/', (req, res)=>{
    res.status(200).send("Product Route")
})

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/createProduct', upload.single('image'), createProducts);

router.get('/getProducts', getProducts)

router.patch("/update/:id", upload.single("image"), updateProduct);

router.delete('/delete/:id', deleteProduct)

router.get('/getproductbyid/:id', getProductById)

router.post('/addCategory', addCategory)

router.get('/getCategories', getCategories)

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
