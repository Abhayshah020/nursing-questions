"use client";

import { useEffect, useState } from "react";
import { Eye, Edit, Trash2, Plus, FolderOpen, X } from "lucide-react";
import axiosClient from "@/utils/axiosClient";
import { useRouter } from "next/navigation";

interface Group {
  id: number;
  title: string;
  description: string;
}

function DeleteConfirmModal({
  group,
  onConfirm,
  onCancel
}: {
  group: Group;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 border border-red-100">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
          <Trash2 className="w-8 h-8 text-red-600" />
        </div>
        <h3 className="text-2xl font-bold text-gray-800 mb-3">Delete Group?</h3>
        <p className="text-gray-600 mb-2">
          Are you sure you want to delete <span className="font-semibold">"{group.title}"</span>?
        </p>
        <p className="text-sm text-red-600 mb-6">
          This action cannot be undone and will remove all questions in this group.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 bg-gray-200 cursor-pointer hover:bg-gray-300 text-gray-800 font-semibold px-6 py-3 rounded-xl transition-all duration-200"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 bg-gradient-to-r cursor-pointer from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-200"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

function EditModal({
  group,
  onSave,
  onCancel
}: {
  group: Group;
  onSave: (title: string, description: string) => void;
  onCancel: () => void;
}) {
  const [title, setTitle] = useState(group.title);
  const [description, setDescription] = useState(group.description);

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8 border border-blue-100">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full">
              <Edit className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800">Edit Group</h3>
          </div>
          <button
            onClick={onCancel}
            className="text-gray-400 cursor-pointer hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Group Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-blue-500 focus:outline-none transition-colors"
              placeholder="Enter group title"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-blue-500 focus:outline-none transition-colors resize-none"
              placeholder="Enter group description"
            />
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 cursor-pointer bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold px-6 py-3 rounded-xl transition-all duration-200"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(title, description)}
            disabled={!title.trim()}
            className="flex-1 cursor-pointer bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

export default function GroupsPage() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [deleteModal, setDeleteModal] = useState<Group | null>(null);
  const [editModal, setEditModal] = useState<Group | null>(null);

  const router = useRouter();

  const fetchGroups = async () => {
    try {
      const res = await axiosClient.get("/group-questions");
      setGroups(res.data);
    } catch (error) {
      console.error("Failed to fetch groups", error);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  const createGroup = async () => {
    if (!title.trim()) {
      alert("Group title is required");
      return;
    }

    try {
      setLoading(true);
      await axiosClient.post("/group-questions", {
        title,
        description,
      });

      setTitle("");
      setDescription("");
      fetchGroups();
    } catch (error) {
      console.error("Create group error", error);
      alert("Failed to create group");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (groupId: number, newTitle: string, newDescription: string) => {
    try {
      await axiosClient.put(`/group-questions/${groupId}`, {
        title: newTitle,
        description: newDescription,
      });
      setEditModal(null);
      fetchGroups();
    } catch (error) {
      console.error("Failed to update group", error);
      alert("Failed to update group");
    }
  };

  const handleDelete = async (groupId: number) => {
    try {
      await axiosClient.delete(`/group-questions/${groupId}`);
      setDeleteModal(null);
      fetchGroups();
    } catch (error) {
      console.error("Failed to delete group", error);
      alert("Failed to delete group");
    }
  };

  const handleView = (groupId: number) => {
    // Router push would go here in actual implementation
    // console.log(`Viewing group ${groupId}`);
    router.push(`/settings/questions-group/${groupId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 py-12">
      {deleteModal && (
        <DeleteConfirmModal
          group={deleteModal}
          onConfirm={() => handleDelete(deleteModal.id)}
          onCancel={() => setDeleteModal(null)}
        />
      )}

      {editModal && (
        <EditModal
          group={editModal}
          onSave={(title, description) => handleEdit(editModal.id, title, description)}
          onCancel={() => setEditModal(null)}
        />
      )}

      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <FolderOpen className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-3">Question Groups</h1>
          <p className="text-gray-600">Organize your questions into manageable groups</p>
        </div>

        {/* Create Group Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-10 border border-blue-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="inline-flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full">
              <Plus className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Create New Group</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Group Title *
              </label>
              <input
                type="text"
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-blue-500 focus:outline-none transition-colors"
                placeholder="e.g., General Knowledge, Mathematics, Science"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Description
              </label>
              <textarea
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-blue-500 focus:outline-none transition-colors resize-none"
                placeholder="Describe what this group contains..."
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <button
              onClick={createGroup}
              disabled={loading}
              className="bg-gradient-to-r cursor-pointer from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Creating...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  Create Group
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Groups Grid */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">All Groups</h2>
          {groups.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-12 text-center">
              <FolderOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No groups yet</h3>
              <p className="text-gray-500">Create your first group to get started</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {groups.map((group) => (
                <div
                  key={group.id}
                  className="bg-white rounded-xl shadow-md border border-gray-100 p-6 hover:shadow-xl transition-all duration-200 group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="font-bold text-xl text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
                        {group.title}
                      </h3>
                      <p className="text-gray-600 text-sm line-clamp-2">
                        {group.description || "No description provided"}
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleView(group.id);
                      }}
                      className="flex-1 cursor-pointer flex items-center justify-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium px-4 py-2 rounded-lg transition-all duration-200"
                      title="View Group"
                    >
                      <Eye className="w-4 h-4" />
                      <span className="text-sm">View</span>
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditModal(group);
                      }}
                      className="flex-1 flex cursor-pointer items-center justify-center gap-2 bg-green-50 hover:bg-green-100 text-green-700 font-medium px-4 py-2 rounded-lg transition-all duration-200"
                      title="Edit Group"
                    >
                      <Edit className="w-4 h-4" />
                      <span className="text-sm">Edit</span>
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteModal(group);
                      }}
                      className="flex items-center cursor-pointer justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-700 font-medium px-4 py-2 rounded-lg transition-all duration-200"
                      title="Delete Group"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}