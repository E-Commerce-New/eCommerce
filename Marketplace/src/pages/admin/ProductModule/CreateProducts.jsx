import {CirclePlus, CircleX} from "lucide-react";
import {useEffect, useState, useRef} from "react";
import {z} from "zod";
import Swal from "sweetalert2";
import swal from "sweetalert2";
import axios from 'axios';

const CreateProducts = ({
                            categories,
                            showAddProduct,
                            setShowAddProduct,
                            setProducts
                        }) => {

    const [form, setForm] = useState({
        name: "",
        description: "",
        category: "",
        price: "",
        quantity: "",
        image: null,
        about: "",
        length: "",
        height: "",
        breadth: "",
        weight: "",
        active: true,
        attributes: [{key: "", value: ""}],
    });

    const [images, setImages] = useState([])
    const [singleFile, setSingleFile] = useState([]);
    const fileInputRef = useRef(null)

    const [errors, setErrors] = useState({})

    const uploadSingleFiles = (e) => {
        // console.log('e.target.files ', e.target.files)
        if (e.target?.files?.length > 0) {
            for (let i = 0; i < e.target.files.length; i++) {
                //For Frontend
                const url = URL.createObjectURL(e.target.files[i])
                setSingleFile(prev => [...prev, url])

                //For Backend
                setImages(prev => [...prev, e.target.files[i]])
                // console.log("SingleFileURLs 0", singleFile)
                // console.log("Images 0", images)
            }
        }
    };

    const removeImage = (index) => {
        // console.log("remove");
        setSingleFile([
            ...singleFile.slice(0, index),
            ...singleFile.slice(index + 1, singleFile.length)
        ]);
        setImages(images.filter((image, ind) => index !== ind));
        // console.log("Images after removing image: ", images[0]);
    };

    const handleChange = (e) => {
        const {name, value, type, checked, files} = e.target;
        // console.log("handleChange ", e.target)
        setForm((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : type === "file" ? files : value,
        }));
    };

    const handleAttributeChange = (index, field, value) => {
        const updated = [...form.attributes];
        updated[index][field] = value;
        setForm((prev) => ({...prev, attributes: updated}));
    };

    const addAttribute = (e) => {
        e.preventDefault();
        setForm((prev) => ({
            ...prev,
            attributes: [...prev.attributes, {key: "", value: ""}],
        }));
    };

    const numberField = (label, opts = {}) =>
        z.preprocess(
            (val) => (val === "" || val === null || val === undefined ? NaN : Number(val)),
            opts.positive
                ? z.number({ invalid_type_error: `${label} must be a number` }).positive(`${label} must be greater than 0`)
                : z.number({ invalid_type_error: `${label} must be a number` }).nonnegative(`${label} cannot be negative`)
        ).refine((val) => !isNaN(val), { message: `${label} is required` });

    const schema = z.object({
        name: z.string().min(1, "Name is required"),
        description: z.string().min(1, "Description is required"),
        category: z.string().min(1, "Category is required"),
        price: numberField("Price", { positive: true }),
        quantity: numberField("Quantity"),
        about: z.string().min(1, "About field is required"),
        length: numberField("Length"),
        height: numberField("Height"),
        breadth: numberField("Breadth"),
        weight: numberField("Weight", { positive: true }),
        active: z.boolean(),
        // attributes: z
        //     .array(
        //         z.object({
        //             key: z.string().min(1, "Key is required"),
        //             value: z.string().min(1, "Value is required"),
        //         })
        //     )
        //     .nonempty("At least one attribute is required"),
    });

    const onSubmit = async (e) => {
        e.preventDefault();
        const result = schema.safeParse(form)
        // console.log(errors)
        if (!result.success) {
            setErrors(result.error.flatten().fieldErrors);
            swal.close()
            return
        } else {
            setErrors({});
        }
        Swal.fire({
            title: 'Adding this Product in your Inventory',
            allowOutsideClick: false,
            allowEscapeKey: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        try {
            const formData = new FormData();
            formData.append("name", form.name);
            formData.append("description", form.description);
            formData.append("category", form.category);
            formData.append("price", form.price);
            formData.append("quantity", form.quantity);
            formData.append("active", form.active);
            formData.append("attributes", JSON.stringify(form.attributes));
            formData.append("about", form.about);
            formData.append("length", form.length);
            formData.append("height", form.height);
            formData.append("breadth", form.breadth);
            formData.append("weight", form.weight);
            if (images?.length > 0) {
                for (let i = 0; i < images.length; i++) {
                    formData.append('image', images[i])
                }
            }

            const res = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/product/createProduct`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                withCredentials: true
            });

            // console.log(res.data.product)
            setProducts(prev => [...prev, res.data.savedProduct]);

            swal.close()

            if(res.status === 200) {
            Swal.fire({
                icon: 'success',
                title: 'Product Added',
                text: res.data.message || 'Product has been successfully added!',
            });
            }

            setForm({
                name: "",
                description: "",
                category: "",
                price: "",
                quantity: "",
                image: null,
                active: false,
                attributes: [{key: "", value: ""}],
            });
            fileInputRef.current.value = "";
        } catch (error) {
            swal.close();
            console.log("error: ", error)
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: error.response?.data?.message || 'Something went wrong!',
            });
        } finally {
            setShowAddProduct(!showAddProduct);
        }
    };


    const handleEscapeKey = (event) => {
        if (event.key === 'Escape' || event.keyCode === 27) {
            setShowAddProduct(false); // Update the state when Escape is pressed
        }
    }

    // console.log(errors)
    useEffect(() => {
        document.addEventListener('keydown', handleEscapeKey);

        // Clean up the event listener when the component unmounts
        return () => {
            document.removeEventListener('keydown', handleEscapeKey);
        };
    }, []);
    return (<>
        <div className={`
    fixed top-1/2 left-1/2 z-50
    transform -translate-x-1/2 -translate-y-1/2
    w-[70%] h-[80vh] overflow-y-scroll scrollbar-hide
    border rounded-2xl bg-white/30 backdrop-blur-lg border-white/20
    shadow-2xl transition-all duration-500 ease-out
    ${showAddProduct ? "opacity-100 scale-100" : "opacity-0 scale-50 pointer-events-none"}
        `}>


            <form onSubmit={onSubmit} encType="multipart/form-data"
                  className="flex flex-col gap-2 p-4">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-mono font-bold">Add Product</h1>
                    <p className="text-xl px-4 py-1 font-mono border rounded-lg bg-red-100"
                       onClick={() => setShowAddProduct(!showAddProduct)}
                    >Cancel</p>
                </div>
                <div className="flex flex-col gap-2">
                    <label>Product Name</label>
                    <input
                        type="text"
                        name="name"
                        value={form?.name}
                        onChange={handleChange}
                        placeholder="Enter Product Name here..."
                        className="border-b-2 border-black p-2 focus:outline-0"
                    />
                    {errors.name && <p className="text-red-500 text-sm">{errors?.name[0]}</p>}
                </div>

                <div className="flex flex-col gap-2">
                    <label>Description</label>
                    <input
                        type="text"
                        name="description"
                        value={form?.description}
                        onChange={handleChange}
                        placeholder="Enter About Product here..."
                        className="border-b-2 border-black p-2 focus:outline-0"
                    />
                    {errors.description && <p className="text-red-500 text-sm">{errors?.description[0]}</p>}
                </div>

                <div>
                    <select
                        name="category"
                        value={form.category}
                        onChange={handleChange}
                        className="p-2 border-b-2 border-black bg-transparent focus:outline-0"
                    >
                        <option value="">Select Category</option>
                        {categories.map((cate) => (<option key={cate._id} value={cate._id} placeholder={cate.category}>
                            {cate.category}
                        </option>))}

                    </select>
                    {errors.category && <p className="text-red-500 text-sm">{errors?.category[0]}</p>}
                </div>

                <div className="flex flex-col gap-2">
                    <label>Price</label>
                    <input
                        type="number"
                        name="price"
                        value={form.price}
                        onChange={handleChange}
                        placeholder="Enter Product Price here..."
                        className="border-b-2 border-black p-2 focus:outline-0"
                    />
                    {errors.price && <p className="text-red-500 text-sm">{errors?.price[0]}</p>}
                </div>

                <div className="flex flex-col gap-2">
                    <label>Quantity in Stock</label>
                    <input
                        type="number"
                        name="quantity"
                        value={form.quantity}
                        onChange={handleChange}
                        placeholder="Enter Product Quantity here..."
                        className="border-b-2 border-black p-2 focus:outline-0"
                    />
                    {errors.quantity && <p className="text-red-500 text-sm">{errors?.quantity[0]}</p>}
                </div>

                <div className='bg-indigo-100 p-4'>
                    {singleFile.length > 0 ?
                        <p className='text-red-500'>**First selected image will be used as preview image of your
                            product**</p> : ""}
                    <div className='flex flex-wrap gap-2 '>
                        {singleFile.length !== 0 && singleFile.map((url, index) => (

                            <div
                                className={`img-block bg-gray w-[400px] h-[400px] relative bg-gray-500 flex flex-row border-4 mb-4 items-center ${index === 0 ? ' border-green-500 ' : 'border-black'}`}>
                                <img className="object-contain w-[400px] h-[400px]"
                                     src={url} alt="..."/>
                                <span
                                    className="absolute top-2 right-2 cursor-pointer"
                                    onClick={() => removeImage(index)}
                                >
                                                    <CircleX
                                                        className='bg-red-500 text-white text-2xl rounded-full w-10 h-10'/>
                                            </span>
                            </div>))}
                    </div>

                    <div className=''>
                        <label htmlFor="imgUploader"
                               className='bg-gray-400 p-2 rounded hover:cursor-pointer hover:bg-green-500'><CirclePlus
                            className='inline-block bg-green-500 rounded-full  text-white'/> Select
                            Images</label>
                        <p className=' ml-4 inline-block'>{singleFile.length} Files Selected</p>
                        <input
                            type="file"
                            name="myfile"
                            multiple
                            id='imgUploader'
                            accept="image/*"
                            onChange={uploadSingleFiles}
                            className='hidden'
                            ref={fileInputRef}
                        />
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    <label>Attributes </label>
                    <div id="attr" className="flex flex-col gap-2">
                        {form.attributes.map((attr, index) => (<div key={index} className="flex gap-3 items-center">
                            <input
                                type="text"
                                placeholder="Key"
                                className="border-b-2 border-black p-2 focus:outline-0"
                                value={attr.key}
                                onChange={(e) => handleAttributeChange(index, "key", e.target.value)}
                            />
                            <input
                                type="text"
                                placeholder="Value"
                                className="border-b-2 border-black p-2 focus:outline-0"
                                value={attr.value}
                                onChange={(e) => handleAttributeChange(index, "value", e.target.value)}
                            />
                            {index === form.attributes.length - 1 && (<button
                                className="border-2 border-black bg-sky-200 p-2 rounded-[50%] font-bold"
                                onClick={addAttribute}
                            >
                                +
                            </button>)}
                        </div>))}
                    </div>
                </div>

                <div>
                    <label>About Product</label>
                    <div id="attr" className="flex flex-col gap-2">
                        <textarea
                            name='about' rows="4"
                            className="border-b-2 border-black p-2 focus:outline-0"
                            placeholder="About Product ..."
                            onChange={handleChange}
                            value={form.about}
                        ></textarea>
                        {errors.about && <p className="text-red-500 text-sm">{errors?.about[0]}</p>}
                    </div>
                </div>

                <div>
                    <label>Product Dimensions and Weight <span className='text-red-500 text-[14px] font-bold float-end'>**Will not be visible to users**</span></label>
                    <div>
                        <div className="flex gap-3 items-center">
                            <input
                                name='length'
                                type="number"
                                placeholder="Length (in cm)"
                                className="border-b-2 border-black p-2 focus:outline-0"
                                onChange={handleChange}
                                value={form.length}
                            />
                            <input
                                name='breadth'
                                type="number"
                                placeholder="Width (in cm)"
                                className="border-b-2 border-black p-2 focus:outline-0"
                                onChange={handleChange}
                                value={form.breadth}
                            />
                            <input
                                name='height'
                                type="number"
                                placeholder="Height (in cm)"
                                className="border-b-2 border-black p-2 focus:outline-0"
                                onChange={handleChange}
                                value={form.height}
                            />
                            <input
                                name='weight'
                                type="number"
                                placeholder="Weight (in Kg)"
                                className="border-b-2 border-black p-2 focus:outline-0"
                                onChange={handleChange}
                                value={form.weight}
                            />
                        </div>
                        {errors.length && <p className="text-red-500 text-sm">{errors?.length[0]}</p>}
                        {errors.breadth && <p className="text-red-500 text-sm">{errors?.breadth[0]}</p>}
                        {errors.height && <p className="text-red-500 text-sm">{errors?.height[0]}</p>}
                        {errors.weight && <p className="text-red-500 text-sm">{errors?.weight[0]}</p>}
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <label htmlFor="active">Active</label>
                    <input
                        type="checkbox"
                        id="active"
                        name="active"
                        checked={form.active}
                        onChange={handleChange}
                        className="border-2 border-black"
                    />
                </div>

                <input
                    type="submit"
                    className="border-b-2 border-black p-2 font-medium hover:bg-gray-200"
                    value="Add Product"
                />
            </form>
        </div>
    </>)
}

export default CreateProducts;
