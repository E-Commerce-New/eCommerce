import {useParams} from "react-router-dom";

const ProductInfo = () => {
    const id = useParams();
    console.log(id)
    return (
        <>
            {id.id}
        </>
    )
}

export default ProductInfo;