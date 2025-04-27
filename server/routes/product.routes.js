const router = require('express').Router();
const multer = require('multer');
const {
    getProductById,
    deleteProduct,
    updateProduct,
    getProducts,
    createProducts,
    addCategory,
    getCategories,
    updateisactive
} = require('../controllers/product.controller')
const getUserAuthentication = require('../middlewares/tokenAuth')

router.get('/', (req, res) => {
    res.status(200).send("Product Route")
})

const storage = multer.memoryStorage();
const upload = multer({storage});

router.post('/createProduct', getUserAuthentication, upload.array('image'), createProducts);

router.get('/getProducts', getProducts)

router.patch("/update/:id", getUserAuthentication, upload.array("imagesFile"), updateProduct);

router.delete('/delete/:id', getUserAuthentication, deleteProduct)

router.post('/getproductbyid', getProductById)

router.post('/addCategory', getUserAuthentication, addCategory)

router.get('/getCategories', getCategories)

router.post('/updateisactive' , updateisactive)

// router.delete('/deleteCategory', getUserAuthentication, deleteCategory)

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
