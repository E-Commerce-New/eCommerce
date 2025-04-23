import {CirclePlus, CircleX} from "lucide-react";

const AddProduct = ({
                        onSubmit,
                        addAttribute,
                        handleAttributeChange,
                        handleChange,
                        removeImage,
                        uploadSingleFiles,
                        categories,
                        form,
                        singleFile
                    }) => {
    return (
        <>
                <form onSubmit={onSubmit} encType="multipart/form-data"
                      className="flex flex-col gap-2 p-4 border-2 border-black">
                    <h1 className="text-2xl font-mono font-bold">Add Product</h1>
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
                            {categories.map((cate) => (
                                <option key={cate._id} value={cate.category}>
                                    {cate.category}
                                </option>
                            ))}

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

                    <div className='bg-indigo-100 p-4'>
                        {singleFile.length > 0 ? <p className='text-red-500'>**First selected image will be used as preview image of your product**</p> : ""}
                        <div className='flex flex-wrap gap-2 '>
                            {singleFile.length !== 0 &&
                                singleFile.map((url, index) => (

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
                                    </div>
                                ))}
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
                                        onChange={(e) =>
                                            handleAttributeChange(index, "key", e.target.value)
                                        }
                                    />
                                    <input
                                        type="text"
                                        placeholder="Value"
                                        className="border-b-2 border-black p-2"
                                        value={attr.value}
                                        onChange={(e) =>
                                            handleAttributeChange(index, "value", e.target.value)
                                        }
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
                        value="Add Product"
                    />
                </form>
        </>
    )
}

export default AddProduct;