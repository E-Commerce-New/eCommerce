import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import GoBack from "../../../components/reUsable/Goback.jsx";
import swal from "sweetalert2";
import {CirclePlus, CircleX} from "lucide-react";

const UpdateProduct = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [form, setForm] = useState({
        name: "",
        description: "",
        category: "",
        price: "",
        quantity: "",
        image: null,
        active: false,
        attributes: [{ key: "", value: "" }],
    });
    const [prevImages, setPrevImages] = useState([])
    const [newImages, setNewImages] = useState([])
    const [newImageFile, setNewImageFile] = useState([]);

    // const removeImage = (index) => {
    //     // console.log("remove");
    //     setSingleFile([
    //         ...singleFile.slice(0, index),
    //         ...singleFile.slice(index + 1, singleFile.length)
    //     ]);
    //     setPrevImages(prevImages.filter((image, ind) => index !== ind));
    //     // console.log("Images after removing image: ", images[0]);
    // };
    // console.log("IMages ", prevImages ,"Single File ",  singleFile)
    //
    const uploadNewImages = async (e) => {
        // console.log('e.target.files ', e.target.files)
        if (e.target?.files?.length > 0) {
            for (let i = 0; i < e.target.files.length; i++) {
                //For Frontend
                const url = URL.createObjectURL(e.target.files[i])
                await setNewImages(prev => [...prev, url])

                //For Backend
                await setNewImageFile(prev => [...prev, e.target.files[i]])
            }
            // console.log("New Images Files : ", newImageFile)
            // console.log("New ImageS " , newImages)
        }
    };

    // console.log("New Image FIles : ", newImageFile)
    const removePrevImage = (index) => {
        setPrevImages(prevImages.filter((image, ind) => index !== ind));
    }
    const removeNewImage = (index) => {
        setNewImages(newImages.filter((image, ind) => index !== ind));
        setNewImageFile(newImageFile.filter((image, ind) => index !== ind));
        // console.log("New Images inside new removeNewImage ", newImages, newImageFile)
    }


    useEffect(() => {
        Swal.fire({
            title: 'Loading...',
            allowOutsideClick: false,
            allowEscapeKey: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });
        const fetchProduct = async () => {
            try {
                const res = await axios.post(`http://localhost:3000/api/product/getproductbyid`, {id : id}, {
                    withCredentials: true
                });
                const fetchedProduct = res.data.data;
                setProduct(fetchedProduct);
                setForm({
                    name: fetchedProduct.name || "",
                    description: fetchedProduct.description || "",
                    category: fetchedProduct.category || "",
                    price: fetchedProduct.price || "",
                    quantity: fetchedProduct.quantity || "",
                    image: null,
                    active: fetchedProduct.active || false,
                    attributes: fetchedProduct.attributes || [{ key: "", value: "" }],
                });
                setPrevImages(res.data.data.images)
            } catch (err) {
                console.error("Error fetching product:", err);
            } finally {
                Swal.close();
            }
        };

        fetchProduct();
    }, [id]);

    const handleChange = (e) => {
        const { name, value, type, checked, files } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : type === "file" ? files[0] : value,
        }));
    };

    const addAttribute = (e) => {
        e.preventDefault();
        setForm((prev) => ({
            ...prev,
            attributes: [...prev.attributes, { key: "", value: "" }],
        }));
    };

    const handleAttributeChange = (index, field, value) => {
        const updated = [...form.attributes];
        updated[index][field] = value;
        setForm((prev) => ({ ...prev, attributes: updated }));
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        Swal.fire({
            title: 'Updating this Product',
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
            // if (prevImages) {
            //     prevImages.forEach(image => {
            //     formData.append("imagesArr", image); // or just "imagesArr"
            // });}
            // console.log("Prev Images :",typeof prevImages, prevImages)
            formData.append('imagesArr', JSON.stringify(prevImages))
            if(newImageFile?.length>0){
                for(let i = 0; i<newImageFile.length; i++){
                    formData.append('imagesFile', newImageFile[i])
                }
            }
            // formData.append('imagesFile', JSON.stringify(newImageFile));
            formData.append("attributes", JSON.stringify(form.attributes));

            const res = await axios.patch(`http://localhost:3000/api/product/update/${id}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                withCredentials: true
            });

            Swal.close();
            Swal.fire({
                icon: 'success',
                title: 'Product Updated',
                text: res.data.message || 'Product has been successfully updated!',
            }).then((result) => {
                if(result.isConfirmed) {
                    history.back()
                }
            })
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: error.response?.data?.message || 'Something went wrong!',
            });
        }
    };

    return (
        <>
            {product ? (
                <>
                    <div className="flex gap-2 items-center">
                        <GoBack />
                        <h1 className="text-2xl">You are Updating <span className="font-bold">{product.name}</span></h1>
                    </div>

                    <div className="m-4">
                        <form
                            onSubmit={onSubmit}
                            // onSubmit={(e)=>{console.log('Prev Files : ', prevImages, 'New Files : ', newImageFile)
                            //     e.preventDefault();
                            // }}
                            encType="multipart/form-data" className="flex flex-col gap-2 p-4 border-2 border-black">
                            <h1 className="text-2xl font-mono font-bold">Update Product</h1>

                            <div className="flex flex-col gap-2">
                                <label>Product Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={form.name}
                                    onChange={handleChange}
                                    placeholder="Enter Product Name here..."
                                    className="border-b-2 border-black p-2"
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <label>Description</label>
                                <input
                                    type="text"
                                    name="description"
                                    value={form.description}
                                    onChange={handleChange}
                                    placeholder="Enter About Product here..."
                                    className="border-b-2 border-black p-2"
                                />
                            </div>

                            <div>
                                <select
                                    name="category"
                                    value={form.category}
                                    onChange={handleChange}
                                    className="p-2 border-b-2 border-black bg-transparent"
                                >
                                    <option value="">Select Category</option>
                                    <option value="Computer">Computer</option>
                                    <option value="Electronics">Electronics</option>
                                    <option value="Clothing">Clothing</option>
                                </select>
                            </div>

                            <div className="flex flex-col gap-2">
                                <label>Price</label>
                                <input
                                    type="number"
                                    name="price"
                                    value={form.price}
                                    onChange={handleChange}
                                    placeholder="Enter Product Price here..."
                                    className="border-b-2 border-black p-2"
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <label>Quantity in Stock</label>
                                <input
                                    type="number"
                                    name="quantity"
                                    value={form.quantity}
                                    onChange={handleChange}
                                    placeholder="Enter Product Quantity here..."
                                    className="border-b-2 border-black p-2"
                                />
                            </div>

                            {/*<input*/}
                            {/*    type="file"*/}
                            {/*    name="image"*/}
                            {/*    accept="image/png"*/}
                            {/*    onChange={handleChange}*/}
                            {/*/>*/}


                            <div className='bg-indigo-100 p-4'>
                                {prevImages.length > 0 ? <div><p className='text-red-500'>**First selected image will be used as preview image of your product**</p><p className='bg-red-500 text-center font-bold text-white'>Previous Images</p> </div>: ""}
                                <div className='flex flex-wrap gap-2 bg-gray-300'>
                                    {prevImages.length !== 0 &&
                                        prevImages.map((url, index) => (
                                            <div key={url}
                                                className={`img-block bg-gray w-[400px] h-[400px] relative bg-gray-500 flex flex-row border-4 mb-4 items-center ${index === 0 ? ' border-green-500 ' : 'border-black'}`}>
                                                <img className="object-contain w-[400px] h-[400px]"
                                                     src={'https://ik.imagekit.io/0Shivams/'+url} alt="..."/>
                                                <span
                                                    className="absolute top-2 right-2 cursor-pointer"
                                                    onClick={() => removePrevImage(index)}
                                                >
                                                    <CircleX
                                                        className='bg-red-500 text-white text-2xl rounded-full w-10 h-10'/>
                                            </span>
                                            </div>
                                        ))}
                                </div>

                                <div className='mt-4'>
                                    <p className='bg-red-500 text-center font-bold text-white'>Upload More Images</p>
                                    {newImages.length !== 0 &&
                                        newImages.map((url, index) => (
                                            <div key={url}
                                                className={`img-block bg-gray w-[400px] h-[400px] relative bg-gray-500 flex flex-row border-4 mb-4 items-center ${index === 0 ? ' border-green-500 ' : 'border-black'}`}>
                                                <img className="object-contain w-[400px] h-[400px]"
                                                     src={url} alt="..."/>
                                                <span
                                                    className="absolute top-2 right-2 cursor-pointer"
                                                    onClick={() => removeNewImage(index)}
                                                >
                                                    <CircleX
                                                        className='bg-red-500 text-white text-2xl rounded-full w-10 h-10'/>
                                            </span>
                                            </div>
                                        ))}
                                </div>

                                <div className=''>
                                    <label htmlFor="imgUploader"
                                           className='bg-gray-400 p-2 rounded hover:cursor-pointer hover:bg-green-500'><CirclePlus
                                        className='inline-block bg-green-500 rounded-full  text-white'/> Select
                                        Images</label>
                                    <p className=' ml-4 inline-block'>{prevImages.length + newImages.length} Files Selected</p>
                                    <input
                                        type="file"
                                        name="myfile"
                                        multiple
                                        id='imgUploader'
                                        accept="image/*"
                                        onChange={uploadNewImages}
                                        className='hidden'
                                    />
                                </div>


                            </div>

                            <div className="flex flex-col gap-2">
                                <label>Attributes</label>
                                <div id="attr" className="flex flex-col gap-2">
                                    {form.attributes.map((attr, index) => (
                                        <div key={index} className="flex gap-3 items-center">
                                            <input
                                                type="text"
                                                placeholder="Key"
                                                className="border-b-2 border-black p-2"
                                                value={attr.key}
                                                onChange={(e) => handleAttributeChange(index, "key", e.target.value)}
                                            />
                                            <input
                                                type="text"
                                                placeholder="Value"
                                                className="border-b-2 border-black p-2"
                                                value={attr.value}
                                                onChange={(e) => handleAttributeChange(index, "value", e.target.value)}
                                            />
                                            {index === form.attributes.length - 1 && (
                                                <button
                                                    className="border-2 border-black bg-sky-200 p-2 rounded-[50%] font-bold"
                                                    onClick={addAttribute}
                                                >
                                                    +
                                                </button>
                                            )}
                                        </div>
                                    ))}
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
                                value="Update Product"
                            />
                        </form>
                    </div>
                </>
            ) : (
                <p>Loading product...</p>
            )}
        </>
    );
};

export default UpdateProduct;
