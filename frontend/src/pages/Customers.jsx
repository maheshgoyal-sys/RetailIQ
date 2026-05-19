import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Upload, 
  Filter, 
  Edit, 
  Trash2, 
  Eye, 
  X,
  ChevronLeft,
  ChevronRight,
  UserPlus
} from 'lucide-react';
import { customerAPI } from '../services/api';
import toast from 'react-hot-toast';

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [search, setSearch] = useState('');
  const [city, setCity] = useState('');
  const [gender, setGender] = useState('');
  const [loading, setLoading] = useState(false);

  // Modal States
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formAge, setFormAge] = useState('');
  const [formGender, setFormGender] = useState('Male');
  const [formCity, setFormCity] = useState('');
  const [formSpend, setFormSpend] = useState('0');
  const [formOrders, setFormOrders] = useState('0');
  const [formCategories, setFormCategories] = useState('');

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const data = await customerAPI.getCustomers(page, 10, search, city, gender);
      setCustomers(data.content);
      setTotalPages(data.totalPages);
      setTotalElements(data.totalElements);
    } catch (error) {
      toast.error('Failed to load customers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [page, search, city, gender]);

  const handleOpenAddModal = () => {
    setSelectedCustomer(null);
    setFormName('');
    setFormEmail('');
    setFormPhone('');
    setFormAge('');
    setFormGender('Male');
    setFormCity('');
    setFormSpend('0');
    setFormOrders('0');
    setFormCategories('');
    setModalOpen(true);
  };

  const handleOpenEditModal = (c) => {
    setSelectedCustomer(c);
    setFormName(c.name);
    setFormEmail(c.email);
    setFormPhone(c.phone || '');
    setFormAge(String(c.age));
    setFormGender(c.gender);
    setFormCity(c.city);
    setFormSpend(String(c.totalSpend));
    setFormOrders(String(c.purchaseCount));
    setFormCategories(c.productCategories?.join(', ') || '');
    setModalOpen(true);
  };

  const handleSaveCustomer = async (e) => {
    e.preventDefault();
    const payload = {
      name: formName,
      email: formEmail,
      phone: formPhone,
      age: parseInt(formAge) || 30,
      gender: formGender,
      city: formCity,
      totalSpend: parseFloat(formSpend) || 0,
      purchaseCount: parseInt(formOrders) || 0,
      productCategories: formCategories.split(',').map(s => s.trim()).filter(Boolean),
      lastPurchaseDate: new Date().toISOString().split('T')[0]
    };

    try {
      if (selectedCustomer) {
        await customerAPI.updateCustomer(selectedCustomer.id, payload);
        toast.success('Customer updated successfully!');
      } else {
        await customerAPI.createCustomer(payload);
        toast.success('Customer added successfully!');
      }
      setModalOpen(false);
      fetchCustomers();
    } catch (error) {
      toast.error('Failed to save customer data');
    }
  };

  const handleDeleteCustomer = async (id) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      try {
        await customerAPI.deleteCustomer(id);
        toast.success('Customer deleted successfully');
        fetchCustomers();
      } catch (error) {
        toast.error('Failed to delete customer');
      }
    }
  };

  const handleCsvUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const loader = toast.loading('Uploading and parsing CSV...');
    try {
      const res = await customerAPI.bulkImport(file);
      toast.success(res.message || `Successfully imported customers!`, { id: loader });
      fetchCustomers();
    } catch (error) {
      toast.error('CSV import failed', { id: loader });
    }
  };

  // Get segment color class helper
  const getSegmentBadgeClass = (segment) => {
    const s = segment?.toLowerCase() || '';
    if (s.includes('high') || s.includes('premium')) return 'bg-purple-100 text-purple-700 border-purple-200';
    if (s.includes('regular') || s.includes('active')) return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    if (s.includes('risk') || s.includes('watch')) return 'bg-amber-100 text-amber-700 border-amber-200';
    if (s.includes('new')) return 'bg-rose-100 text-rose-700 border-rose-200';
    return 'bg-slate-100 text-slate-700 border-slate-200';
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">Customers</h2>
          <p className="text-slate-500 text-sm mt-1">Manage, search, and import your retail audience details.</p>
        </div>
        <div className="flex items-center gap-3">
          {/* CSV Bulk Upload Button */}
          <label className="glow-btn flex items-center gap-2 cursor-pointer bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-4 py-2.5 rounded-xl text-sm font-bold shadow-sm transition-all duration-300">
            <Upload className="h-4 w-4" />
            <span>Upload CSV</span>
            <input type="file" accept=".csv" onChange={handleCsvUpload} className="hidden" />
          </label>

          {/* Add Customer Button */}
          <button
            onClick={handleOpenAddModal}
            className="glow-btn flex items-center gap-2 bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-500 hover:to-indigo-500 text-white px-4 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-primary-500/20 transition-all duration-300 animate-fade-in"
          >
            <UserPlus className="h-4 w-4" />
            <span>Add Customer</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-card p-4 rounded-2xl border border-slate-100 flex flex-col md:flex-row gap-4 items-center justify-between shadow-premium">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(0); }}
            className="w-full bg-slate-50 border border-slate-200/80 focus:border-primary-500 rounded-xl py-2.5 pl-10 pr-4 text-slate-800 text-sm outline-none transition-all duration-200"
          />
        </div>

        {/* Filters */}
        <div className="flex gap-3 w-full md:w-auto flex-wrap md:flex-nowrap">
          {/* City Filter */}
          <select
            value={city}
            onChange={(e) => { setCity(e.target.value); setPage(0); }}
            className="bg-slate-50 border border-slate-200/80 focus:border-primary-500 rounded-xl py-2.5 px-4 text-slate-700 text-sm outline-none transition-all duration-200 min-w-[120px] flex-1 md:flex-none"
          >
            <option value="">All Cities</option>
            <option value="Delhi">Delhi</option>
            <option value="Mumbai">Mumbai</option>
            <option value="Bangalore">Bangalore</option>
            <option value="Pune">Pune</option>
            <option value="Hyderabad">Hyderabad</option>
            <option value="Ahmedabad">Ahmedabad</option>
          </select>

          {/* Gender Filter */}
          <select
            value={gender}
            onChange={(e) => { setGender(e.target.value); setPage(0); }}
            className="bg-slate-50 border border-slate-200/80 focus:border-primary-500 rounded-xl py-2.5 px-4 text-slate-700 text-sm outline-none transition-all duration-200 min-w-[120px] flex-1 md:flex-none"
          >
            <option value="">All Genders</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>
      </div>

      {/* Customer Data Table */}
      <div className="glass-card rounded-2xl border border-slate-100 shadow-premium overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 text-[10px] font-extrabold uppercase tracking-wider">
                <th className="py-4 px-6">Name</th>
                <th className="py-4 px-6">City</th>
                <th className="py-4 px-6">Segment</th>
                <th className="py-4 px-6">Total Spent</th>
                <th className="py-4 px-6">Orders</th>
                <th className="py-4 px-6">Last Purchase</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm font-semibold text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-slate-400 font-medium">
                    <span className="animate-pulse">Loading customer directory...</span>
                  </td>
                </tr>
              ) : customers.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-slate-400 font-medium">
                    No customers found matching filters.
                  </td>
                </tr>
              ) : (
                customers.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/50 transition-colors duration-150">
                    <td className="py-4 px-6 flex flex-col">
                      <span className="text-slate-900 font-bold">{c.name}</span>
                      <span className="text-xs text-slate-400 font-normal">{c.email}</span>
                    </td>
                    <td className="py-4 px-6 text-slate-500">{c.city}</td>
                    <td className="py-4 px-6">
                      <span className={`text-[10px] font-extrabold px-3 py-1 rounded-full border tracking-wide uppercase ${getSegmentBadgeClass(c.segment)}`}>
                        {c.segment || 'New Customer'}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-slate-900 font-bold">Rs {c.totalSpend.toLocaleString()}</td>
                    <td className="py-4 px-6 text-slate-500">{c.purchaseCount}</td>
                    <td className="py-4 px-6 text-slate-400 text-xs font-normal">
                      {c.lastPurchaseDate ? `${c.lastPurchaseDate} (mock)` : 'No purchase'}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEditModal(c)}
                          className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all duration-200"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteCustomer(c.id)}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between flex-wrap gap-4 text-xs font-semibold text-slate-500">
          <span>Showing {customers.length} of {totalElements} customers</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(p => Math.max(0, p - 1))}
              disabled={page === 0}
              className="p-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span>Page {page + 1} of {totalPages}</span>
            <button
              onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
              disabled={page === totalPages - 1}
              className="p-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* CRUD Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-100 w-full max-w-lg rounded-3xl p-6 shadow-2xl animate-scale-in text-left flex flex-col gap-5">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-xl font-extrabold text-slate-900">
                {selectedCustomer ? 'Edit Customer Details' : 'Add New Retail Customer'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 hover:bg-slate-100 rounded-xl text-slate-400 hover:text-slate-600 transition-all"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCustomer} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Full Name</label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="Ravi Kumar"
                    className="w-full bg-slate-50 border border-slate-200/80 focus:border-primary-500 rounded-xl py-2 px-3 text-slate-800 text-sm outline-none transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Email Address</label>
                  <input
                    type="email"
                    required
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    placeholder="ravi@gmail.com"
                    className="w-full bg-slate-50 border border-slate-200/80 focus:border-primary-500 rounded-xl py-2 px-3 text-slate-800 text-sm outline-none transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Age</label>
                  <input
                    type="number"
                    required
                    value={formAge}
                    onChange={(e) => setFormAge(e.target.value)}
                    placeholder="34"
                    className="w-full bg-slate-50 border border-slate-200/80 focus:border-primary-500 rounded-xl py-2 px-3 text-slate-800 text-sm outline-none transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Gender</label>
                  <select
                    value={formGender}
                    onChange={(e) => setFormGender(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200/80 focus:border-primary-500 rounded-xl py-2 px-3 text-slate-800 text-sm outline-none transition-all"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">City</label>
                  <input
                    type="text"
                    required
                    value={formCity}
                    onChange={(e) => setFormCity(e.target.value)}
                    placeholder="Delhi"
                    className="w-full bg-slate-50 border border-slate-200/80 focus:border-primary-500 rounded-xl py-2 px-3 text-slate-800 text-sm outline-none transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1.5 col-span-1">
                  <label className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Phone</label>
                  <input
                    type="text"
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    placeholder="+91 999999"
                    className="w-full bg-slate-50 border border-slate-200/80 focus:border-primary-500 rounded-xl py-2 px-3 text-slate-800 text-sm outline-none transition-all"
                  />
                </div>
                <div className="space-y-1.5 col-span-1">
                  <label className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Total Spent (Rs)</label>
                  <input
                    type="number"
                    value={formSpend}
                    onChange={(e) => setFormSpend(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200/80 focus:border-primary-500 rounded-xl py-2 px-3 text-slate-800 text-sm outline-none transition-all"
                  />
                </div>
                <div className="space-y-1.5 col-span-1">
                  <label className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Orders</label>
                  <input
                    type="number"
                    value={formOrders}
                    onChange={(e) => setFormOrders(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200/80 focus:border-primary-500 rounded-xl py-2 px-3 text-slate-800 text-sm outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Product Categories (Comma separated)</label>
                <input
                  type="text"
                  value={formCategories}
                  onChange={(e) => setFormCategories(e.target.value)}
                  placeholder="Electronics, Apparel, Beauty"
                  className="w-full bg-slate-50 border border-slate-200/80 focus:border-primary-500 rounded-xl py-2 px-3 text-slate-800 text-sm outline-none transition-all"
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-3 justify-end pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-bold transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="glow-btn px-6 py-2 bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-500 hover:to-indigo-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-primary-500/20 transition-all duration-200"
                >
                  {selectedCustomer ? 'Save Changes' : 'Create Customer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
