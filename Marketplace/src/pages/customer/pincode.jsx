import React, { useState, useEffect, useRef } from 'react';

const PincodeInput = () => {
    const [pincode, setPincode] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const socketRef = useRef(null);

    useEffect(() => {
        // CreateProducts WebSocket connection when component mounts
        socketRef.current = new WebSocket('ws://localhost:8080');

        socketRef.current.onopen = () => {
            console.log('Connected to WebSocket server');
        };

        socketRef.current.onmessage = (event) => {
            const data = JSON.parse(event.data);
            setSuggestions(data.suggestions);
            console.log(data.suggestions);
        };

        socketRef.current.onclose = () => {
            console.log('WebSocket connection closed');
        };

        return () => {
            // Cleanup WebSocket when component unmounts
            socketRef.current.close();
        };
    }, []);

    // Handle input change and send pincode to server
    const handleInputChange = (e) => {
        const value = e.target.value;
        setPincode(value);

        if (socketRef.current.readyState === WebSocket.OPEN) {
            socketRef.current.send(value);
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: 'auto', paddingTop: '50px' }}>
            <input
                type="text"
                value={pincode}
                onChange={handleInputChange}
                placeholder="Enter pincode..."
                style={{ width: '100%', padding: '8px', fontSize: '16px' }}
            />
            <ul style={{ listStyle: 'none', padding: 0, marginTop: '10px' }}>
                {suggestions.map((suggestion, index) => (
                    <li key={index} style={{ padding: '5px 0', borderBottom: '1px solid #ccc' }}>
                        {suggestion}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default PincodeInput;
