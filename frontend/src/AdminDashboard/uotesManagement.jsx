// src/AdminDashboard/QuotesManagement.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './css/QuotesTable.css';

const QuotesManagement = () => {
    const [quotes, setQuotes] = useState([]);
    const [search, setSearch] = useState('');

    // Fetch All Quotes
    const fetchQuotes = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/quotes/all');
            setQuotes(response.data.data);
        } catch (error) {
            console.error(error);
        }
    };

    // Delete Quote
    const deleteQuote = async (id) => {
        if (!window.confirm('Are you sure you want to delete this quote?')) return;
        
        try {
            await axios.delete(`http://localhost:5000/api/quotes/delete/${id}`);
            fetchQuotes();
        } catch (error) {
            console.error(error);
        }
    };

    // Update Status
    const updateStatus = async (id, status) => {
        try {
            await axios.put(`http://localhost:5000/api/quotes/status/${id}`, { status });
            fetchQuotes();
        } catch (error) {
            console.error(error);
        }
    };

    const filteredQuotes = quotes.filter((quote) =>
        quote.full_name.toLowerCase().includes(search.toLowerCase()) ||
        quote.email.toLowerCase().includes(search.toLowerCase())
    );

    useEffect(() => {
        fetchQuotes();
    }, []);

    return (
        <>
            {/* STATS */}
            <div className="stats-container">
                <div className="stats-card">
                    <div>
                        <h3>Total Quotes</h3>
                        <h1>{quotes.length}</h1>
                    </div>
                    <div className="stats-icon">📦</div>
                </div>

                <div className="stats-card">
                    <div>
                        <h3>Pending</h3>
                        <h1>{quotes.filter(q => q.status === 'Pending').length}</h1>
                    </div>
                    <div className="stats-icon pending-bg">⏳</div>
                </div>

                <div className="stats-card">
                    <div>
                        <h3>Completed</h3>
                        <h1>{quotes.filter(q => q.status === 'Completed').length}</h1>
                    </div>
                    <div className="stats-icon completed-bg">✅</div>
                </div>
            </div>

            {/* TABLE */}
            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Customer</th>
                            <th>Mobile</th>
                            <th>Move Type</th>
                            <th>Moving Date</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredQuotes.length > 0 ? (
                            filteredQuotes.map((quote) => (
                                <tr key={quote.id}>
                                    <td>#{quote.id}</td>
                                    <td>
                                        <div className="customer-info">
                                            <strong>{quote.full_name}</strong>
                                            <span>{quote.email}</span>
                                        </div>
                                    </td>
                                    <td>{quote.mobile}</td>
                                    <td>{quote.move_type}</td>
                                    <td>
                                        {new Date(quote.moving_date).toLocaleDateString('en-IN', {
                                            day: 'numeric',
                                            month: 'short',
                                            year: 'numeric'
                                        })}
                                    </td>
                                    <td>
                                        <select
                                            value={quote.status || 'Pending'}
                                            onChange={(e) => updateStatus(quote.id, e.target.value)}
                                            className="status-select"
                                        >
                                            <option value="Pending">Pending</option>
                                            <option value="Contacted">Contacted</option>
                                            <option value="Completed">Completed</option>
                                        </select>
                                    </td>
                                    <td>
                                        <button onClick={() => deleteQuote(quote.id)} className="delete-btn">
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" className="no-data">No Quotes Found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default QuotesManagement;