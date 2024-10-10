import { useState } from 'react';

const Towers = () => {
    const [items, setResponse] = useState([]);

    const handleClick = async () => {
        try {
            const res = await fetch('http://localhost:5000/send-udp');
            const data = await res.json();
            ///setResponse(data.message);
            setResponse(Array.isArray(data) ? data : []);
        } catch(error) {
            console.error("Error fetching data:", error);
        }
        
    };

    return (<div className='tower-main'>
                <h1>Towers</h1>
                <button  onClick={handleClick}>Discover</button>
                <ul className='ul-style'>
                    {Array.isArray(items) && items.map((item) => (
                    <li className = "tower-item" key={item.id}>{item}</li>
                    ))}
                </ul>
            </div>
    );
  };
  
  export default Towers;
  