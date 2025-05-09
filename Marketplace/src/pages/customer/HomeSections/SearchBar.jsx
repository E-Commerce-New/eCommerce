import {useState} from "react";
import {useNavigate} from "react-router-dom";

const SearchBar = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    const handleSearch = () => {
        if (searchTerm.trim()) {
            navigate(`/search?query=${encodeURIComponent(searchTerm)}`);
        }
    };

    return(
        <>
            <div className="flex justify-end mb-3">
            <div className="flex w-1/3">
                <input
                    type="text"
                    placeholder="Search products..."
                    className="p-2 border rounded-l w-full"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button
                    onClick={handleSearch}
                    className="bg-blue-600 p-2 rounded-r text-white"
                >
                    Search
                </button>
            </div>
            </div>
        </>
    )
}

export default SearchBar