const router = require('express').Router();
const Product = require('../models/product')
const multer = require('multer');


router.get('/', (req, res)=>{
    res.status(200).send("Product Route")
})

const storage = multer.memoryStorage();
const upload = multer({ storage });


router.post('/createProduct', upload.single('image'), async (req, res) => {
    try {
        console.log("BODY:", req.body);
        console.log("FILE:", req.file);

        const {
            name,
            description,
            category,
            price,
            quantity,
            active,
            attributes,
        } = req.body;

        const parsedAttributes = JSON.parse(attributes);

        const product = new Product({
            name,
            description,
            category,
            price: Number(price),
            quantity: Number(quantity),
            active: active === 'true',
            attributes: parsedAttributes,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        await product.save();

        return res.status(200).json({ message: 'Product Created Successfully' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Something went wrong' });
    }
});

router.post('/insertMany', async(req, res)=>{
    try{
        console.log("working")
        await Product.insertMany(req.body.data)
        res.status(200).send('Products Created')
    }catch(error){
        console.log(error)
        res.status(500).send('Something went wrong...')
    }
})

router.get('/getProducts', async(req, res)=>{
    try{
        const data = await Product.find({})
        res.status(200).json({data, message: 'Products fetched successfully'})
    }catch(error){
        console.log(error)
        res.status(500).send('Something went wrong...')
    }
})

module.exports = router;