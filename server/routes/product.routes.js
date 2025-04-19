const router = require('express').Router();
const Product = require('../models/product')


router.get('/', (req, res)=>{
    res.status(200).send("Product Route")
})

router.post('/createProduct', async(req, res)=>{

    try {
        const product = new Product(req.body)
        if(await product.save()){
            res.status(200).send('Product Created Successfully')
        }
        else{
            res.status(500).json({message:"Could not create product"})
        }
    }catch(error){
        console.log(error)
        res.status(500).send('Something went wrong...')
    }
})

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

module.exports = router;

