"use client";

import { useState, useEffect } from "react";
import { BookOpen, Package, ShoppingCart, Plus, Minus, DollarSign, TrendingUp, Edit2, Trash2 } from "lucide-react";

interface Journal {
  id: string;
  name: string;
  type: string;
  size: string;
  color: string;
  price: number;
  stock: number;
  sold: number;
}

export default function AdminPanel() {
  const [journals, setJournals] = useState<Journal[]>([]);
  const [activeTab, setActiveTab] = useState<"inventory" | "sales">("inventory");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    type: "Classic",
    size: "Large",
    color: "",
    price: "",
    stock: "",
  });

  useEffect(() => {
    const stored = localStorage.getItem("journals");
    if (stored) {
      setJournals(JSON.parse(stored));
    } else {
      const initial: Journal[] = [
        { id: "1", name: "Classic Notebook", type: "Classic", size: "Large", color: "Black", price: 24.99, stock: 45, sold: 23 },
        { id: "2", name: "Pocket Journal", type: "Cahier", size: "Pocket", color: "Red", price: 12.99, stock: 78, sold: 56 },
        { id: "3", name: "Art Plus Sketchbook", type: "Art Plus", size: "A4", color: "Blue", price: 34.99, stock: 32, sold: 18 },
        { id: "4", name: "Professional Planner", type: "Professional", size: "Large", color: "Green", price: 29.99, stock: 21, sold: 41 },
      ];
      setJournals(initial);
      localStorage.setItem("journals", JSON.stringify(initial));
    }
  }, []);

  const saveToStorage = (data: Journal[]) => {
    localStorage.setItem("journals", JSON.stringify(data));
  };

  const handleAddJournal = () => {
    if (!formData.name || !formData.color || !formData.price || !formData.stock) return;

    const newJournal: Journal = {
      id: Date.now().toString(),
      name: formData.name,
      type: formData.type,
      size: formData.size,
      color: formData.color,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock),
      sold: 0,
    };

    const updated = [...journals, newJournal];
    setJournals(updated);
    saveToStorage(updated);
    resetForm();
  };

  const handleUpdateJournal = () => {
    if (!editingId) return;

    const updated = journals.map(j =>
      j.id === editingId
        ? {
            ...j,
            name: formData.name,
            type: formData.type,
            size: formData.size,
            color: formData.color,
            price: parseFloat(formData.price),
            stock: parseInt(formData.stock),
          }
        : j
    );

    setJournals(updated);
    saveToStorage(updated);
    resetForm();
  };

  const handleDelete = (id: string) => {
    const updated = journals.filter(j => j.id !== id);
    setJournals(updated);
    saveToStorage(updated);
  };

  const startEdit = (journal: Journal) => {
    setEditingId(journal.id);
    setFormData({
      name: journal.name,
      type: journal.type,
      size: journal.size,
      color: journal.color,
      price: journal.price.toString(),
      stock: journal.stock.toString(),
    });
    setShowAddForm(true);
  };

  const resetForm = () => {
    setFormData({ name: "", type: "Classic", size: "Large", color: "", price: "", stock: "" });
    setShowAddForm(false);
    setEditingId(null);
  };

  const adjustStock = (id: string, delta: number) => {
    const updated = journals.map(j =>
      j.id === id ? { ...j, stock: Math.max(0, j.stock + delta) } : j
    );
    setJournals(updated);
    saveToStorage(updated);
  };

  const recordSale = (id: string, quantity: number) => {
    const updated = journals.map(j =>
      j.id === id
        ? { ...j, stock: Math.max(0, j.stock - quantity), sold: j.sold + quantity }
        : j
    );
    setJournals(updated);
    saveToStorage(updated);
  };

  const totalRevenue = journals.reduce((sum, j) => sum + (j.price * j.sold), 0);
  const totalStock = journals.reduce((sum, j) => sum + j.stock, 0);
  const totalSold = journals.reduce((sum, j) => sum + j.sold, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100">
      <div className="max-w-7xl mx-auto p-6">
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <BookOpen className="w-10 h-10 text-amber-800" />
            <h1 className="text-4xl font-bold text-amber-900">Moleskin Admin Panel</h1>
          </div>
          <p className="text-amber-700">Manage your journal inventory and track sales</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Stock</p>
                <p className="text-3xl font-bold text-gray-800">{totalStock}</p>
              </div>
              <Package className="w-12 h-12 text-blue-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Sold</p>
                <p className="text-3xl font-bold text-gray-800">{totalSold}</p>
              </div>
              <ShoppingCart className="w-12 h-12 text-green-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Revenue</p>
                <p className="text-3xl font-bold text-gray-800">${totalRevenue.toFixed(2)}</p>
              </div>
              <DollarSign className="w-12 h-12 text-purple-500" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab("inventory")}
                className={`px-6 py-2 rounded-lg font-semibold transition ${
                  activeTab === "inventory"
                    ? "bg-amber-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Inventory
              </button>
              <button
                onClick={() => setActiveTab("sales")}
                className={`px-6 py-2 rounded-lg font-semibold transition ${
                  activeTab === "sales"
                    ? "bg-amber-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Sales
              </button>
            </div>

            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold transition"
            >
              <Plus className="w-5 h-5" />
              Add Journal
            </button>
          </div>

          {showAddForm && (
            <div className="bg-amber-50 rounded-lg p-6 mb-6 border-2 border-amber-200">
              <h3 className="text-xl font-bold mb-4 text-amber-900">
                {editingId ? "Edit Journal" : "Add New Journal"}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <input
                  type="text"
                  placeholder="Journal Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                >
                  <option>Classic</option>
                  <option>Cahier</option>
                  <option>Art Plus</option>
                  <option>Professional</option>
                  <option>Volant</option>
                </select>
                <select
                  value={formData.size}
                  onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                >
                  <option>Pocket</option>
                  <option>Large</option>
                  <option>A4</option>
                  <option>A5</option>
                </select>
                <input
                  type="text"
                  placeholder="Color"
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
                <input
                  type="number"
                  placeholder="Price"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
                <input
                  type="number"
                  placeholder="Stock"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>
              <div className="flex gap-2 mt-4">
                <button
                  onClick={editingId ? handleUpdateJournal : handleAddJournal}
                  className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-2 rounded-lg font-semibold transition"
                >
                  {editingId ? "Update" : "Add"}
                </button>
                <button
                  onClick={resetForm}
                  className="bg-gray-400 hover:bg-gray-500 text-white px-6 py-2 rounded-lg font-semibold transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {activeTab === "inventory" && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100 border-b-2 border-gray-300">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Type</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Size</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Color</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Price</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Stock</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {journals.map((journal) => (
                    <tr key={journal.id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-800">{journal.name}</td>
                      <td className="px-4 py-3 text-gray-600">{journal.type}</td>
                      <td className="px-4 py-3 text-gray-600">{journal.size}</td>
                      <td className="px-4 py-3 text-gray-600">{journal.color}</td>
                      <td className="px-4 py-3 text-gray-600">${journal.price.toFixed(2)}</td>
                      <td className="px-4 py-3">
                        <span className={`font-semibold ${journal.stock < 20 ? 'text-red-600' : 'text-green-600'}`}>
                          {journal.stock}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button
                            onClick={() => adjustStock(journal.id, 1)}
                            className="p-1 bg-green-100 hover:bg-green-200 rounded text-green-700"
                            title="Add stock"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => adjustStock(journal.id, -1)}
                            className="p-1 bg-red-100 hover:bg-red-200 rounded text-red-700"
                            title="Remove stock"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => startEdit(journal)}
                            className="p-1 bg-blue-100 hover:bg-blue-200 rounded text-blue-700"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(journal.id)}
                            className="p-1 bg-gray-100 hover:bg-gray-200 rounded text-gray-700"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === "sales" && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100 border-b-2 border-gray-300">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Price</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Units Sold</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Revenue</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Stock Left</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Quick Sale</th>
                  </tr>
                </thead>
                <tbody>
                  {journals.map((journal) => (
                    <tr key={journal.id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-800">{journal.name}</td>
                      <td className="px-4 py-3 text-gray-600">${journal.price.toFixed(2)}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="w-4 h-4 text-green-600" />
                          <span className="font-semibold text-gray-800">{journal.sold}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 font-semibold text-purple-600">
                        ${(journal.price * journal.sold).toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-gray-600">{journal.stock}</td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => recordSale(journal.id, 1)}
                          disabled={journal.stock === 0}
                          className={`px-4 py-1 rounded-lg font-semibold transition ${
                            journal.stock === 0
                              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                              : "bg-green-600 hover:bg-green-700 text-white"
                          }`}
                        >
                          Sell 1
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
