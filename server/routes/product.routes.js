const router = require('express').Router();
const multer = require('multer');
const {getProductById, deleteProduct, updateProduct, getProducts, createProducts} = require('../controllers/product.controller')

router.get('/', (req, res)=>{
    res.status(200).send("Product Route")
})

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/createProduct', upload.single('image'), createProducts);

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

router.get('/getProducts', getProducts)

router.patch('/update/:id', updateProduct)

router.delete('/delete/:id', deleteProduct)

router.get('/getproductbyid/:id', getProductById)

module.exports = router;