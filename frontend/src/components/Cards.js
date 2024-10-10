import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, TextField, Button, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Select, MenuItem, Divider } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';

const Cards = () => {
  // State for WebSocket RFID data
  const [rfidData, setRfidData] = useState(null);

  // Separate state for the Add Card form
  const [addCardId, setAddCardId] = useState('');
  const [addKccId, setAddKccId] = useState('');
  const [addMaxAmount, setAddMaxAmount] = useState('');
  const [addCardStatus, setAddCardStatus] = useState('Active');
  const [addAccessStatus, setAddAccessStatus] = useState('Manager');

  // State for editing cards
  const [kccId, setKccId] = useState('');
  const [maxAmount, setMaxAmount] = useState('');
  const [cardStatus, setCardStatus] = useState('Active');
  const [accessStatus, setAccessStatus] = useState('Manager');
  const [cards, setCards] = useState([]);
  const [isEditing, setIsEditing] = useState('');

  // Connect to WebSocket to receive RFID data
  useEffect(() => {
    const ws = new WebSocket('ws://20.92.202.139:3600');

    ws.onopen = () => {
      console.log('Connected to WebSocket server');
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setRfidData(data);

      // Check if the unique_key is 'THAI' before setting the Card ID
      if (data.unique_key === 'THAI') {
        setAddCardId(data.decimal_value || ''); // Set Add Card form's Card ID with the RFID decimal value
      }
      
      console.log('Received data from WebSocket:', data);
    };

    ws.onclose = () => {
      console.log('WebSocket connection closed');
    };

    return () => {
      ws.close();
    };
  }, []);

  // Fetch available cards
  useEffect(() => {
    fetchAvailableCards();
  }, []);

  const fetchAvailableCards = async () => {
    try {
      const response = await axios.get('http://localhost:5000/getCards');
      setCards(response.data);
    } catch (error) {
      console.error('Error fetching available cards:', error);
    }
  };

  // Add Card
  const handleAddCard = async (e) => {
    e.preventDefault();
    if (!rfidData || !rfidData.decimal_value) {
      alert('No RFID data available. Please scan the card.');
      return;
    }
    const newCardDetails = {
      Card_Id: addCardId,
      kcc_Id: addKccId,
      Max_Amount: addMaxAmount,
      Card_Status: addCardStatus,
      Acces_Status: addAccessStatus,
    };
    try {
      await axios.post('http://localhost:5000/createCard', newCardDetails);
      // Clear Add Card form after submission
      setAddCardId('');
      setAddKccId('');
      setAddMaxAmount('');
      setAddCardStatus('Active');
      setAddAccessStatus('Manager');
      setRfidData(null);
      alert('Card details added successfully');
      fetchAvailableCards();
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || 'Error adding card');
    }
  };

  // Remove Card
  const handleRemoveCard = async (cardId) => {
    const confirmRemove = window.confirm("Are you sure you want to remove this card?");
    if (confirmRemove) {
      try {
        await axios.delete(`http://localhost:5000/deleteCard/${cardId}`);
        alert('Card removed successfully');
        fetchAvailableCards();
      } catch (error) {
        alert('Error removing card');
      }
    }
  };

  // Edit Card
  const handleEditCard = (card) => {
    setIsEditing(card.card_id);  // Start editing this card
    setKccId(card.kcc_id);       // Set edit form values
    setMaxAmount(card.max_amount);
    setCardStatus(card.card_status);
    setAccessStatus(card.acces_status);
  };

  // Save Edited Card
  const handleSaveCard = async (cardId) => {
    const updatedCardDetails = {
      Card_Id: cardId,
      kcc_Id: kccId,
      Max_Amount: maxAmount,
      Card_Status: cardStatus,
      Acces_Status: accessStatus,
    };

    try {
      await axios.put(`http://localhost:5000/updateCard`, updatedCardDetails);
      alert('Card details updated successfully');
      fetchAvailableCards();
      setIsEditing(null);  // Exit editing mode
    } catch (error) {
      alert(error.response?.data?.message || 'Error updating card');
    }
  };

  // Cancel Edit
  const handleCancelEdit = () => {
    setIsEditing(null);
    setKccId('');
    setMaxAmount('');
    setCardStatus('Active');
    setAccessStatus('Manager');
  };

  return (
    <Box sx={{ padding: '20px', backgroundColor: '#e0f7fa', minHeight: 'auto' }}>
      {/* Add Card Section */}
      <Box
        sx={{
          backgroundColor: '#fff',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
          maxWidth: '800px',
          margin: '0 auto',
          mb: 4
        }}
      >
        <Typography variant="h5" gutterBottom sx={{ color: '#00796b', fontWeight: 'bold' }}>
          Add Card Details
        </Typography>
        <form onSubmit={handleAddCard}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Card ID"
              variant="outlined"
              value={addCardId}
              disabled // disable card ID input
            />
            <TextField
              label="KCC ID"
              variant="outlined"
              value={addKccId}
              onChange={(e) => setAddKccId(e.target.value)}
              required
            />
            <TextField
              label="Max Amount"
              variant="outlined"
              value={addMaxAmount}
              onChange={(e) => setAddMaxAmount(e.target.value)}
              required
            />
            <Select
              value={addCardStatus}
              onChange={(e) => setAddCardStatus(e.target.value)}
              displayEmpty
              fullWidth
            >
              <MenuItem value="Active">Active</MenuItem>
              <MenuItem value="Inprocess">Inprocess</MenuItem>
              <MenuItem value="Deactive">Deactive</MenuItem>
            </Select>
            <Select
              value={addAccessStatus}
              onChange={(e) => setAddAccessStatus(e.target.value)}
              displayEmpty
              fullWidth
            >
              <MenuItem value="Manager">Manager</MenuItem>
              <MenuItem value="Customer">Customer</MenuItem>
              <MenuItem value="Guest">Guest</MenuItem>
            </Select>
            <Button type="submit" variant="contained" color="primary">
              Add Card
            </Button>
          </Box>
        </form>
      </Box>

      <Divider sx={{ my: 4 }} />

      {/* Available Cards Section */}
      <Box
        sx={{
          backgroundColor: '#fff',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
          maxWidth: '800px',
          margin: '0 auto'
        }}
      >
        <Typography variant="h5" gutterBottom sx={{ color: '#00796b', fontWeight: 'bold' }}>
          Available Cards
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Card ID</strong></TableCell>
                <TableCell><strong>KCC ID</strong></TableCell>
                <TableCell><strong>Max Amount</strong></TableCell>
                <TableCell><strong>Card Status</strong></TableCell>
                <TableCell><strong>Access Status</strong></TableCell>
                <TableCell><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {cards.map((card) => (
                <TableRow key={card.card_id}>
                  <TableCell>
                    {isEditing === card.card_id ? (
                      <TextField
                      value={addCardId || card.card_id} 
                        disabled
                      />
                    ) : (
                      card.card_id
                    )}
                  </TableCell>
                  <TableCell>
                    {isEditing === card.card_id ? (
                      <TextField
                        value={kccId}
                        onChange={(e) => setKccId(e.target.value)}
                      />
                    ) : (
                      card.kcc_id
                    )}
                  </TableCell>
                  <TableCell>
                    {isEditing === card.card_id ? (
                      <TextField
                        value={maxAmount}
                        onChange={(e) => setMaxAmount(e.target.value)}
                      />
                    ) : (
                      card.max_amount
                    )}
                  </TableCell>
                  <TableCell>
                    {isEditing === card.card_id ? (
                      <Select
                        value={cardStatus}
                        onChange={(e) => setCardStatus(e.target.value)}
                        displayEmpty
                      >
                        <MenuItem value="Active">Active</MenuItem>
                        <MenuItem value="Inprocess">Inprocess</MenuItem>
                        <MenuItem value="Deactive">Deactive</MenuItem>
                      </Select>
                    ) : (
                      card.card_status
                    )}
                  </TableCell>
                  <TableCell>
                    {isEditing === card.card_id ? (
                      <Select
                        value={accessStatus}
                        onChange={(e) => setAccessStatus(e.target.value)}
                        displayEmpty
                      >
                        <MenuItem value="Manager">Manager</MenuItem>
                        <MenuItem value="Customer">Customer</MenuItem>
                        <MenuItem value="Guest">Guest</MenuItem>
                      </Select>
                    ) : (
                      card.acces_status
                    )}
                  </TableCell>
                  <TableCell>
                    {isEditing === card.card_id ? (
                      <>
                        <IconButton onClick={() => handleSaveCard(card.card_id)} color="primary">
                          <SaveIcon />
                        </IconButton>
                        <IconButton onClick={handleCancelEdit} color="secondary">
                          <CancelIcon />
                        </IconButton>
                      </>
                    ) : (
                      <>
                        <IconButton onClick={() => handleEditCard(card)} color="primary">
                          <EditIcon />
                        </IconButton>
                        <IconButton onClick={() => handleRemoveCard(card.card_id)} color="secondary">
                          <DeleteIcon />
                        </IconButton>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};

export default Cards;
