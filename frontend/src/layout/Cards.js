import React, { useEffect, useState } from 'react';
import axios from 'axios';

const App = () => {
  const [rfidData, setRfidData] = useState({});
  const [cardId, setCardId] = useState('');
  const [kccId, setKccId] = useState(22);
  const [MaxAmount, setMaxAmount] = useState('');
  const [cardStatus, setCardStatus] = useState('Active');
  const [accessStatus, setAccessStatus] = useState('Manager');
  const [cards, setCards] = useState([]); // State to hold available cards
  const [selectedCard, setSelectedCard] = useState(null); // State for selected card
  const [isEditing, setIsEditing] = useState(false); // State to toggle edit mode

  // Function to fetch RFID data from Flask server
  const fetchRfidData = async () => {
    try {
      const response = await axios.get('http://192.168.1.10:8000/get_rfid');
      setRfidData(response.data);
      console.log('RFID Data:', response.data);
    } catch (error) {
      console.error('Error fetching RFID data:', error);
    }
  };

  // Function to fetch available cards
  const fetchAvailableCards = async () => {
    try {
      const response = await axios.get('http://localhost:5000/getCards');
      setCards(response.data);
      console.log('Fetched Cards:', response.data); 
    } catch (error) {
      console.error('Error fetching available cards:', error);
    }
  };
  

  const handleAddCard = async (e) => {
    e.preventDefault(); // Prevent default form submission

    if (!rfidData.decimal_value) {
      alert('No RFID data available. Please scan the card.');
      return;
    }
    const newCardDetails = {
      Card_Id: rfidData.decimal_value, // Use the scanned RFID data
      kcc_Id: kccId,
      Max_Amount : MaxAmount,
      Card_Status: cardStatus,
      Acces_Status: accessStatus,
    };

    try {
      await axios.post('http://localhost:5000/createCard', newCardDetails);
      setCardId('');
      setKccId('');
      setMaxAmount('')
      setCardStatus('Active');
      setAccessStatus('Manager');
      setRfidData({}); // Clear the RFID data after adding the card
      alert('Card details added successfully');
      fetchAvailableCards(); // Refresh card list after adding
    } 
    catch (error) {
      if (error.response && error.response.data.message) {
        alert(error.response.data.message); // Show backend error message
      } else {
        alert('Error adding card');
      }
    }
};


  // Function to remove a card with confirmation
  const handleRemoveCard = async (cardId) => {
    const confirmRemove = window.confirm("Are you sure you want to remove this card?");
    if (confirmRemove) {
      try {
        await axios.delete(`http://localhost:5000/deleteCard/${cardId}`); // Delete endpoint
        alert('Card removed successfully');
        fetchAvailableCards(); // Refresh card list after removing
      } catch (error) {
        alert('Error removing card:', error);
      }
    }
  };

  // Function to enable editing of selected card details
  const handleEditCard = (card) => {
    setSelectedCard(card);
    setCardId(card.Card_Id);
    setKccId(card.kcc_Id); 
    setMaxAmount(card.Max_Amount);
    setCardStatus(card.Card_Status);
    setAccessStatus(card.Acces_Status);
    setIsEditing(true); // Enable edit mode
  };
  

  // Function to save the updated card details
  const handleSaveCard = async () => {
    if (!selectedCard) return;

    const updatedCardDetails = {
      Card_Id: selectedCard.Card_Id,
      kcc_Id: kccId,
      Max_Amount:MaxAmount,
      Card_Status: cardStatus,
      Acces_Status: accessStatus,
    };

    try {
      await axios.put('http://localhost:5000/updateCard', updatedCardDetails); // Update endpoint
      alert('Card details updated successfully');
      fetchAvailableCards(); // Refresh card list after updating
      setIsEditing(false); // Disable edit mode
    } catch (error) {
      if (error.response && error.response.data.message) {
        alert(error.response.data.message); // Show backend error message
      } else {
        alert('Error Updating card');
      }
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      fetchRfidData();
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (rfidData.decimal_value) {
      setCardId(rfidData.decimal_value);
    }
  }, [rfidData]);

  useEffect(() => {
    fetchAvailableCards(); // Fetch cards on component mount
  }, []);

  return (
    <div>
      <h2>Add Card Details</h2>
      <form onSubmit={handleAddCard}>
        <div>
          <label>
            Card ID:
            <input
              type="text"
              value={cardId}
              onChange={(e) => setCardId(e.target.value)}
              required
              disabled={isEditing} // Disable input when in edit mode
            />
          </label>
        </div>
        <div>
          <label>
            KCC ID:
            <input
              type="text"
              value={kccId}
              onChange={(e) => setKccId(e.target.value)}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Max Amount:
            <input
              type="text"
              value={MaxAmount}
              onChange={(e) => setMaxAmount(e.target.value)}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Card Status:
            <select
              value={cardStatus}
              onChange={(e) => setCardStatus(e.target.value)}
            >
              <option value="Active">Active</option>
              <option value="Inprocess">Inprocess</option>
              <option value="Deactive">Deactive</option>
            </select>
          </label>
        </div>
        <div>
          <label>
            Access Status:
            <select
              value={accessStatus}
              onChange={(e) => setAccessStatus(e.target.value)}
            >
              <option value="Manager">Manager</option>
              <option value="Customer">Customer</option>
              <option value="Guest">Guest</option>
            </select>
          </label>
        </div>
        <button type="submit" disabled={isEditing}>Add Card</button>
      </form>

      <h2>Available Cards</h2>
      <table>
        <thead>
          <tr>
            <th>Card ID</th>
            <th>KCC ID</th>
            <th>Max Amount</th>
            <th>Card Status</th>
            <th>Access Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {cards.map((card) => (
            <tr key={card.Card_Id}>
              <td>{card.Card_Id}</td>
              <td>
                <input
                  type="text"
                  defaultValue={card.Kcc_Id}
                  onChange={(e) => setKccId(e.target.value)}
                  disabled={!isEditing || selectedCard?.Card_Id !== card.Card_Id} // Disable when not editing
                />
              </td>
              <td>
                <input
                  type="text"
                  defaultValue={card.Max_Amount}
                  onChange={(e) => setMaxAmount(e.target.value)}
                  disabled={!isEditing || selectedCard?.Card_Id !== card.Card_Id} // Disable when not editing
                />
              </td>
              <td>
                <select
                  defaultValue={card.Card_Status}
                  onChange={(e) => setCardStatus(e.target.value)}
                  disabled={!isEditing || selectedCard?.Card_Id !== card.Card_Id} // Disable when not editing
                >
                  <option value="Active">Active</option>
                  <option value="Inprocess">Inprocess</option>
                  <option value="Deactive">Deactive</option>
                </select>
              </td>
              <td>
                <select
                  defaultValue={card.Acces_Status}
                  onChange={(e) => setAccessStatus(e.target.value)}
                  disabled={!isEditing || selectedCard?.Card_Id !== card.Card_Id} // Disable when not editing
                >
                  <option value="Manager">Manager</option>
                  <option value="Customer">Customer</option>
                  <option value="Guest">Guest</option>
                </select>
              </td>
              <td>
                <button onClick={() => handleEditCard(card)}>
                  {isEditing && selectedCard?.Card_Id === card.Card_Id ? 'Editing' : 'Edit'}
                </button>
                {isEditing && selectedCard?.Card_Id === card.Card_Id && (
                  <button onClick={handleSaveCard}>Save</button>
                )}
                <button onClick={() => handleRemoveCard(card.Card_Id)}>Remove</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default App;
