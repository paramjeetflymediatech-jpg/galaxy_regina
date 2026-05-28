import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FiSearch, FiTrash2, FiInbox, FiClock, FiCheckCircle } from 'react-icons/fi';
import Swal from 'sweetalert2';

const ITEMS_PER_PAGE = 10;

const STATUS_STYLES = {
    Pending:   { badge: 'bg-yellow-100 text-yellow-700', dot: 'bg-yellow-500' },
    Contacted: { badge: 'bg-blue-100 text-blue-700',    dot: 'bg-blue-500'   },
    Completed: { badge: 'bg-green-100 text-green-700',  dot: 'bg-green-500'  },
};

const QuotesManagement = () => {
    const [quotes, setQuotes]           = useState([]);
    const [search, setSearch]           = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [statusFilter, setStatusFilter] = useState('all');

    const fetchQuotes = async () => {
        try {
            const response = await axios.get('/api/quotes/all');
            setQuotes(response.data.data || []);
        } catch (error) {
            console.error(error);
            toast.error('Failed to fetch quotes');
        }
    };

    const deleteQuote = async (id) => {
        const result = await Swal.fire({
            title: 'Delete Quote?',
            text: 'This action cannot be undone.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#CC0336',
            cancelButtonColor: '#06056C',
            confirmButtonText: 'Yes, delete it',
            cancelButtonText: 'Cancel',
        });
        if (!result.isConfirmed) return;
        try {
            await axios.delete(`/api/quotes/delete/${id}`);
            toast.success('Quote deleted successfully');
            fetchQuotes();
        } catch (error) {
            console.error(error);
            toast.error('Failed to delete quote');
        }
    };

    const updateStatus = async (id, status) => {
        try {
            await axios.put(`/api/quotes/status/${id}`, { status });
            toast.success(`Status updated to ${status}`);
            fetchQuotes();
        } catch (error) {
            console.error(error);
            toast.error('Failed to update status');
        }
    };

    useEffect(() => { fetchQuotes(); }, []);

    // Filtering
    const filteredQuotes = quotes.filter((q) => {
        const matchesSearch =
            (q.full_name || '').toLowerCase().includes(search.toLowerCase()) ||
            (q.email     || '').toLowerCase().includes(search.toLowerCase()) ||
            (q.mobile    || '').toLowerCase().includes(search.toLowerCase());
        const matchesStatus = statusFilter === 'all' || q.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    // Pagination
    const totalPages    = Math.ceil(filteredQuotes.length / ITEMS_PER_PAGE);
    const paginatedQuotes = filteredQuotes.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const handleSearchChange = (e) => {
        setSearch(e.target.value);
        setCurrentPage(1);
    };

    const handleStatusFilterChange = (e) => {
        setStatusFilter(e.target.value);
        setCurrentPage(1);
    };

    const pendingCount   = quotes.filter(q => q.status === 'Pending').length;
    const contactedCount = quotes.filter(q => q.status === 'Contacted').length;
    const completedCount = quotes.filter(q => q.status === 'Completed').length;

    return (
        <div className="flex flex-col gap-6 w-full">

            {/* PAGE HEADER */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-1">Quote Requests</h1>
                <p className="text-gray-500 text-sm">View and manage all incoming quote requests from customers.</p>
            </div>

            {/* STATS CARDS */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm flex items-center gap-4">
                    <div className="bg-indigo-50 p-3 rounded-lg">
                        <FiInbox size={22} className="text-[#06056C]" />
                    </div>
                    <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total</p>
                        <p className="text-2xl font-bold text-gray-900">{quotes.length}</p>
                    </div>
                </div>
                <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm flex items-center gap-4">
                    <div className="bg-yellow-50 p-3 rounded-lg">
                        <FiClock size={22} className="text-yellow-600" />
                    </div>
                    <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Pending</p>
                        <p className="text-2xl font-bold text-yellow-600">{pendingCount}</p>
                    </div>
                </div>
                <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm flex items-center gap-4">
                    <div className="bg-blue-50 p-3 rounded-lg">
                        <FiInbox size={22} className="text-blue-600" />
                    </div>
                    <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Contacted</p>
                        <p className="text-2xl font-bold text-blue-600">{contactedCount}</p>
                    </div>
                </div>
                <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm flex items-center gap-4">
                    <div className="bg-green-50 p-3 rounded-lg">
                        <FiCheckCircle size={22} className="text-green-600" />
                    </div>
                    <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Completed</p>
                        <p className="text-2xl font-bold text-green-600">{completedCount}</p>
                    </div>
                </div>
            </div>

            {/* TABLE CARD */}
            <div className="overflow-hidden bg-white border border-gray-200 rounded-xl shadow-sm">

                {/* TABLE HEADER: search + filter */}
                <div className="p-5 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <span className="text-sm font-semibold text-gray-500 hidden md:block">
                            {filteredQuotes.length} found ({quotes.length} total)
                        </span>
                        <select
                            value={statusFilter}
                            onChange={handleStatusFilterChange}
                            className="border border-gray-300 bg-white text-sm px-3 py-2 rounded-lg outline-none focus:border-[#06056C] focus:ring-1 focus:ring-[#06056C] text-gray-700"
                        >
                            <option value="all">All Statuses</option>
                            <option value="Pending">Pending</option>
                            <option value="Contacted">Contacted</option>
                            <option value="Completed">Completed</option>
                        </select>
                    </div>
                    <div className="relative w-full sm:w-80">
                        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by name, email, or phone..."
                            value={search}
                            onChange={handleSearchChange}
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 text-sm outline-none bg-white text-gray-900 focus:border-[#06056C] focus:ring-1 focus:ring-[#06056C] rounded-lg shadow-sm"
                        />
                    </div>
                </div>

                {/* TABLE */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-sm">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200 text-gray-500">
                                <th className="py-3.5 px-5 font-semibold">#ID</th>
                                <th className="py-3.5 px-5 font-semibold">Customer</th>
                                <th className="py-3.5 px-5 font-semibold">Mobile</th>
                                <th className="py-3.5 px-5 font-semibold">Move Type</th>
                                <th className="py-3.5 px-5 font-semibold">Moving Date</th>
                                <th className="py-3.5 px-5 font-semibold">Status</th>
                                <th className="py-3.5 px-5 font-semibold text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedQuotes.length > 0 ? (
                                paginatedQuotes.map((quote, idx) => {
                                    const style = STATUS_STYLES[quote.status] || STATUS_STYLES['Pending'];
                                    return (
                                        <tr
                                            key={quote.id}
                                            className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}
                                        >
                                            <td className="py-4 px-5 font-mono text-xs text-gray-500 font-semibold">#{quote.id}</td>
                                            <td className="py-4 px-5">
                                                <div className="flex flex-col">
                                                    <span className="font-semibold text-gray-900">{quote.full_name}</span>
                                                    <span className="text-xs text-gray-400 mt-0.5">{quote.email}</span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-5 text-gray-700">{quote.mobile}</td>
                                            <td className="py-4 px-5">
                                                <span className="text-xs font-semibold bg-gray-100 text-gray-600 px-2 py-1 rounded">
                                                    {quote.move_type}
                                                </span>
                                            </td>
                                            <td className="py-4 px-5 text-gray-600">
                                                {quote.moving_date
                                                    ? new Date(quote.moving_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
                                                    : '—'}
                                            </td>
                                            <td className="py-4 px-5">
                                                <div className="flex items-center gap-2">
                                                    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${style.badge}`}>
                                                        <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`}></span>
                                                        {quote.status || 'Pending'}
                                                    </span>
                                                </div>
                                                <select
                                                    value={quote.status || 'Pending'}
                                                    onChange={(e) => updateStatus(quote.id, e.target.value)}
                                                    className="mt-1.5 border border-gray-200 bg-white text-xs px-2 py-1 rounded-lg outline-none focus:border-[#06056C] text-gray-700 w-full max-w-[130px]"
                                                >
                                                    <option value="Pending">Pending</option>
                                                    <option value="Contacted">Contacted</option>
                                                    <option value="Completed">Completed</option>
                                                </select>
                                            </td>
                                            <td className="py-4 px-5 text-right">
                                                <button
                                                    onClick={() => deleteQuote(quote.id)}
                                                    title="Delete Quote"
                                                    className="bg-white border border-gray-200 hover:border-[#CC0336] hover:bg-[#CC0336] hover:text-white text-[#CC0336] p-2 rounded-lg transition-all shadow-sm flex items-center justify-center ml-auto"
                                                >
                                                    <FiTrash2 size={15} />
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan="7" className="px-6 py-14 text-center text-gray-400">
                                        <FiInbox size={32} className="mx-auto mb-3 opacity-40" />
                                        <p className="font-semibold text-gray-500">No quotes found</p>
                                        <p className="text-xs mt-1">Try adjusting your search or filter</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* PAGINATION */}
                {totalPages > 1 && (
                    <div className="p-4 border-t border-gray-200 flex items-center justify-between bg-gray-50">
                        <span className="text-sm text-gray-500">
                            Showing{' '}
                            <span className="font-medium">
                                {filteredQuotes.length === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1}
                            </span>{' '}
                            to{' '}
                            <span className="font-medium">
                                {Math.min(currentPage * ITEMS_PER_PAGE, filteredQuotes.length)}
                            </span>{' '}
                            of <span className="font-medium">{filteredQuotes.length}</span> quotes
                        </span>
                        <div className="flex gap-2">
                            <button
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                className="px-3 py-1.5 border border-gray-300 rounded text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                Previous
                            </button>
                            <button
                                disabled={currentPage === totalPages || totalPages === 0}
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                className="px-3 py-1.5 border border-gray-300 rounded text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default QuotesManagement;