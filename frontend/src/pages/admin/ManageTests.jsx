import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../contexts/AuthContext";
import { ToastContext } from "../../contexts/ToastContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pencil, Trash2, PlusCircle } from "lucide-react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
export default function ManageTests() {
  const { token } = useContext(AuthContext);
  const { user } = useContext(AuthContext);
  const { addToast } = useContext(ToastContext);
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", description: "", price: "", reportTime: "" });
  const [editingId, setEditingId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTests();
  }, []);

  const fetchTests = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/tests`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTests(res.data);
    } catch (err) {
      addToast("Failed to load tests", "error");
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`${import.meta.env.VITE_API_URL}/tests/${editingId}`, form, {
          headers: { Authorization: `Bearer ${token}` },
        });
        addToast("Test updated", "success");
      } else {
        await axios.post(`${import.meta.env.VITE_API_URL}/tests`, form, {
          headers: { Authorization: `Bearer ${token}` },
        });
        addToast("Test added", "success");
      }
      setOpen(false);
      setForm({ name: "", description: "", price: "", reportTime: "" });
      setEditingId(null);
      fetchTests();
    } catch (err) {
      addToast("Failed to save test", "error");
    }
  };

  const handleEdit = (t) => {
    setForm({ name: t.name, description: t.description, price: t.price, reportTime: t.reportTime });
    setEditingId(t._id);
    setOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this test?")) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/tests/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      addToast("Test deleted", "success");
      fetchTests();
    } catch (err) {
      addToast("Failed to delete", "error");
    }
  };

  return (
    <div className="p-6">
       {/* Back Button */}
      <div className="mb-6">
        <button
          onClick={() => navigate(user?.role === 'lab' ? '/lab' : '/admin')}
          className="flex items-center gap-2 text-gray-700 hover:text-primary transition-colors bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 px-3 py-2 rounded-full shadow-sm"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="hidden sm:inline text-sm font-medium">Back to Dashboard</span>
        </button>
      </div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Manage Tests</h2>
        <Button onClick={() => setOpen(true)} className="flex items-center gap-2">
          <PlusCircle size={18} /> Add Test
        </Button>
      </div>

      <Card className="shadow-lg rounded-2xl border border-gray-200">
        <CardHeader>
          <CardTitle className="text-lg font-medium">Available Tests</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-10 text-gray-500">Loading tests...</div>
          ) : tests.length === 0 ? (
            <div className="text-center py-10 text-gray-500">No tests available.</div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Report Time</TableHead>
                    <TableHead className="text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tests.map((t) => (
                    <TableRow key={t._id}>
                      <TableCell className="font-medium">{t.name}</TableCell>
                      <TableCell className="text-gray-600">{t.description}</TableCell>
                      <TableCell>₹{t.price}</TableCell>
                      <TableCell>{t.reportTime || "24-48 hrs"}</TableCell>
                      <TableCell className="flex justify-center gap-3">
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-blue-600 hover:bg-blue-100"
                          onClick={() => handleEdit(t)}
                        >
                          <Pencil size={16} className="mr-1" /> Edit
                        </Button>
                        <Button
                          variant="outline"
                      size="sm"
                      className="flex items-center text-red-600 border-red-300 hover:bg-red-50"
                          onClick={() => handleDelete(t._id)}
                          
                        >
                          <Trash2 size={16} className="mr-1" /> Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Test Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
  <DialogContent
    className="sm:max-w-lg bg-white/80 dark:bg-gray-900/70 backdrop-blur-xl 
               border border-gray-200 dark:border-gray-700 shadow-2xl 
               rounded-2xl transition-all duration-300 animate-in fade-in-50 zoom-in-95"
  >
    <DialogHeader className="border-b border-gray-200 dark:border-gray-700 pb-3">
      <DialogTitle className="text-xl font-bold bg-gradient-to-r from-sky-600 to-blue-500 bg-clip-text text-transparent">
        {editingId ? "Edit Test" : "Add New Test"}
      </DialogTitle>
    </DialogHeader>

    <form onSubmit={handleSubmit} className="space-y-4 mt-4">
      {/* Test Name */}
      <div>
        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1 block">
          Test Name
        </label>
        <Input
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="Enter test name"
          required
          className="bg-white/90 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 
                     rounded-lg focus:ring-2 focus:ring-sky-400 dark:focus:ring-sky-600 
                     shadow-sm text-gray-800 dark:text-gray-100 transition-all"
        />
      </div>

      {/* Description */}
      <div>
        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1 block">
          Description
        </label>
        <Textarea
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          placeholder="Enter test description"
          className="bg-white/90 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 
                     rounded-lg focus:ring-2 focus:ring-sky-400 dark:focus:ring-sky-600 
                     shadow-sm text-gray-800 dark:text-gray-100 transition-all"
        />
      </div>

      {/* Price + Report Time */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1 block">
            Price (₹)
          </label>
          <Input
            type="number"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            placeholder="Enter price"
            required
            className="bg-white/90 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 
                       rounded-lg focus:ring-2 focus:ring-sky-400 dark:focus:ring-sky-600 
                       shadow-sm text-gray-800 dark:text-gray-100 transition-all"
          />
        </div>

        <div>
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1 block">
            Report Time
          </label>
          <Input
            value={form.reportTime}
            onChange={(e) => setForm({ ...form, reportTime: e.target.value })}
            placeholder="e.g. 24-48 hrs"
            className="bg-white/90 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 
                       rounded-lg focus:ring-2 focus:ring-sky-400 dark:focus:ring-sky-600 
                       shadow-sm text-gray-800 dark:text-gray-100 transition-all"
          />
        </div>
      </div>

      {/* Footer */}
      <DialogFooter className="mt-6 flex justify-end gap-3">
        <Button
          variant="outline"
          onClick={() => setOpen(false)}
          className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 
                     hover:bg-gray-100 dark:hover:bg-gray-800 transition-all rounded-lg"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 
                     text-white font-semibold shadow-md hover:shadow-lg transition-all rounded-lg"
        >
          {editingId ? "Update" : "Save"}
        </Button>
      </DialogFooter>
    </form>
  </DialogContent>
</Dialog>

    </div>
  );
}
