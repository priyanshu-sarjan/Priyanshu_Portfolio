import React, { useState, useEffect } from "react";
import { Briefcase, Plus, Trash2, Edit3, Save, X, Calendar, MapPin, Layers } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

interface Experience {
  id: number;
  title: string;
  company: string;
  location?: string;
  startDate: string;
  endDate?: string;
  description: string;
  techStack: string[];
  order: number;
}

export default function AdminExperiencePage() {
  const { token } = useAuth();
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    startDate: "",
    endDate: "Present",
    description: "",
    techStack: "",
    order: 0,
  });

  const fetchExperiences = async () => {
    try {
      const res = await fetch("/api/experiences");
      if (res.ok) {
        const data = await res.json();
        setExperiences(data);
      }
    } catch (err) {
      console.error("Failed to fetch experiences", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExperiences();
  }, []);

  const openCreateModal = () => {
    setFormData({
      title: "",
      company: "",
      location: "",
      startDate: "",
      endDate: "Present",
      description: "",
      techStack: "",
      order: experiences.length + 1,
    });
    setEditingId(null);
    setShowModal(true);
  };

  const openEditModal = (exp: Experience) => {
    setFormData({
      title: exp.title,
      company: exp.company,
      location: exp.location || "",
      startDate: exp.startDate,
      endDate: exp.endDate || "Present",
      description: exp.description,
      techStack: exp.techStack ? exp.techStack.join(", ") : "",
      order: exp.order || 0,
    });
    setEditingId(exp.id);
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const techStackArray = formData.techStack
      ? formData.techStack.split(",").map((s) => s.trim()).filter(Boolean)
      : [];

    const payload = {
      ...formData,
      techStack: techStackArray,
      order: Number(formData.order),
    };

    const url = editingId ? `/api/experiences/${editingId}` : "/api/experiences";
    const method = editingId ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setShowModal(false);
        fetchExperiences();
      } else {
        alert("Failed to save experience entry");
      }
    } catch (err) {
      console.error("Error saving experience", err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this experience entry?")) return;

    try {
      const res = await fetch(`/api/experiences/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        fetchExperiences();
      }
    } catch (err) {
      console.error("Error deleting experience", err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
            <Briefcase className="w-6 h-6 text-cyan-400" /> Experience & Roles CMS
          </h1>
          <p className="text-sm text-slate-400 mt-1">Manage work history, internships, and key roles displayed on your portfolio</p>
        </div>
        <button
          onClick={openCreateModal}
          className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold px-4 py-2.5 rounded-xl shadow-lg shadow-cyan-500/20 flex items-center gap-2 transition-all cursor-pointer text-sm"
        >
          <Plus className="w-4 h-4" /> Add Experience
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-slate-400">Loading experiences...</div>
      ) : experiences.length === 0 ? (
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-12 text-center text-slate-400">
          <Briefcase className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <p className="font-medium text-slate-300">No experiences added yet</p>
          <p className="text-xs text-slate-500 mt-1">Click "Add Experience" to create your first entry</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {experiences.map((exp) => (
            <div
              key={exp.id}
              className="bg-slate-900/60 border border-slate-800 hover:border-slate-700 rounded-2xl p-6 transition-all flex flex-col md:flex-row md:items-start justify-between gap-4"
            >
              <div className="space-y-2 max-w-3xl">
                <div className="flex items-center gap-3 flex-wrap">
                  <h2 className="text-lg font-semibold text-white">{exp.title}</h2>
                  <span className="text-sm font-medium text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-3 py-0.5 rounded-full">
                    {exp.company}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-xs text-slate-400 flex-wrap">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    {exp.startDate} - {exp.endDate}
                  </span>
                  {exp.location && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-500" />
                      {exp.location}
                    </span>
                  )}
                </div>
                <p className="text-sm text-slate-300 leading-relaxed pt-1">{exp.description}</p>
                {exp.techStack && exp.techStack.length > 0 && (
                  <div className="flex items-center gap-1.5 flex-wrap pt-2">
                    <Layers className="w-3.5 h-3.5 text-slate-500 mr-1" />
                    {exp.techStack.map((tech, idx) => (
                      <span
                        key={idx}
                        className="text-xs bg-slate-800/80 text-slate-300 border border-slate-700/50 px-2.5 py-0.5 rounded-md"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 self-end md:self-start pt-2 md:pt-0">
                <button
                  onClick={() => openEditModal(exp)}
                  className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors cursor-pointer"
                  title="Edit Experience"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(exp.id)}
                  className="p-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-lg transition-colors cursor-pointer"
                  title="Delete Experience"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Experience Create / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl p-6 shadow-2xl space-y-5 relative">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="text-lg font-bold text-white">
                {editingId ? "Edit Experience Entry" : "Create New Experience Entry"}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Job / Role Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Full Stack Developer Intern"
                    className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl py-2 px-3 text-sm text-white outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Company / Organization *</label>
                  <input
                    type="text"
                    required
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="e.g. Tech Innovation Labs"
                    className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl py-2 px-3 text-sm text-white outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Start Date *</label>
                  <input
                    type="text"
                    required
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    placeholder="e.g. Jan 2026"
                    className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl py-2 px-3 text-sm text-white outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">End Date</label>
                  <input
                    type="text"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    placeholder="e.g. Present"
                    className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl py-2 px-3 text-sm text-white outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Location</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g. Remote / Vidisha"
                    className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl py-2 px-3 text-sm text-white outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Tech Stack (comma separated)</label>
                <input
                  type="text"
                  value={formData.techStack}
                  onChange={(e) => setFormData({ ...formData, techStack: e.target.value })}
                  placeholder="e.g. React, TypeScript, Node.js, Express, PostgreSQL"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl py-2 px-3 text-sm text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Description & Key Achievements *</label>
                <textarea
                  required
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe your responsibilities, key achievements, and impact..."
                  className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl py-2 px-3 text-sm text-white outline-none resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-sm rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-lg shadow-cyan-500/20"
                >
                  <Save className="w-4 h-4" /> Save Experience
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
