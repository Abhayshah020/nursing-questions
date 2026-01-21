'use client'

import { useEffect, useState } from "react";
import { Edit, Trash2, Plus, X, CheckCircle, Circle, ArrowLeft, FileQuestion } from "lucide-react";
import axiosClient from "@/utils/axiosClient";
import { useParams } from "next/navigation";

interface Option {
  id?: number;
  text: string;
  isCorrect: boolean;
}

interface Question {
  id?: number;
  question: string;
  description?: string;
  options: Option[];
}


function DeleteConfirmModal({
  onConfirm,
  onCancel
}: {
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 border border-red-100">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
          <Trash2 className="w-8 h-8 text-red-600" />
        </div>
        <h3 className="text-2xl font-bold text-gray-800 mb-3">Delete Question?</h3>
        <p className="text-gray-600 mb-2">
          Are you sure you want to delete this question?
        </p>
        <p className="text-sm text-red-600 mb-6">
          This action cannot be undone.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 cursor-pointer bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold px-6 py-3 rounded-xl transition-all duration-200"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 cursor-pointer bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-200"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default function GroupDetailPage() {
  const { id: groupId } = useParams();
  const [group, setGroup] = useState<any>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [deleteModal, setDeleteModal] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);

  const initialQuestionState: Question = {
    question: "",
    description: "",
    options: [
      { text: "", isCorrect: false },
      { text: "", isCorrect: false },
      { text: "", isCorrect: false },
      { text: "", isCorrect: false },
    ],
  };
  const [newQuestion, setNewQuestion] = useState<Question>(initialQuestionState);

  const fetchGroup = async () => {
    try {
      const res = await axiosClient.get(`/group-questions/${groupId}`);
      if (res.status == 200) {
        setGroup(res.data);
      }
    } catch (error) {
      console.log("Error fetching group:", error);
    }
  };

  const fetchQuestions = async () => {
    try {
      const res = await axiosClient.get("/questions/get-questions", {
        params: { groupId },
      });
      setQuestions(res.data);
    } catch (error) {
      console.log("🚀 ~ fetchQuestions ~ error:", error)
    }
  };

  useEffect(() => {
    const load = async () => {
      try {
        fetchGroup();
        fetchQuestions();
      } catch (error) {
        console.error("Failed to load group detail", error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [groupId]);

  const handleSaveQuestion = async () => {
    try {
      if (editingIndex !== null && questions[editingIndex].id) {
        await axiosClient.put(`/questions/update-question/${questions[editingIndex].id}`, {
          question: newQuestion.question,
          description: newQuestion.description,
          options: newQuestion.options,
          groupId,
        });
      } else {
        await axiosClient.post("/questions/upload-questions", {
          groupId,
          questions: [newQuestion],
        });
      }

      setNewQuestion(initialQuestionState);
      setEditingIndex(null);
      setShowForm(false);
      fetchQuestions();
    } catch (error: any) {
      console.error("Error saving question:", error.response?.data || error);
    }
  };

  const handleDeleteQuestion = async (id?: number) => {
    if (!id) return;
    try {
      await axiosClient.delete(`/questions/delete-question/${id}`);
      setDeleteModal(null);
      fetchQuestions();
    } catch (error) {
      console.error("Error deleting question:", error);
    }
  };

  const handleEditQuestion = (index: number) => {
    setEditingIndex(index);
    setNewQuestion({ ...questions[index] });
    setShowForm(true);
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setNewQuestion(initialQuestionState);
    setEditingIndex(null);
    setShowForm(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading questions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 py-12">
      {deleteModal !== null && (
        <DeleteConfirmModal
          onConfirm={() => handleDeleteQuestion(deleteModal)}
          onCancel={() => setDeleteModal(null)}
        />
      )}

      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => window.history.back()}
            className="flex cursor-pointer items-center gap-2 text-blue-600 hover:text-blue-700 font-medium mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Groups
          </button>

          <div className="bg-white rounded-2xl shadow-lg p-8 border border-blue-100">
            <div className="flex items-center gap-4 mb-3">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full">
                <FileQuestion className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">{group?.title}</h1>
                <p className="text-gray-600 mt-1">{group?.description}</p>
              </div>
            </div>

            <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-100">
              <div className="text-sm text-gray-600">
                <span className="font-semibold text-gray-800">{questions.length}</span> question{questions.length !== 1 ? 's' : ''} in this group
              </div>

              {!showForm && (
                <button
                  onClick={() => setShowForm(true)}
                  className="flex cursor-pointer items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <Plus className="w-5 h-5" />
                  Add Question
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Questions List */}
        <div className="space-y-6 mb-8">
          {questions.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-12 text-center">
              <FileQuestion className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No questions yet</h3>
              <p className="text-gray-500 mb-6">Start by adding your first question to this group</p>
              {!showForm && (
                <button
                  onClick={() => setShowForm(true)}
                  className="inline-flex cursor-pointer items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <Plus className="w-5 h-5" />
                  Add First Question
                </button>
              )}
            </div>
          ) : (
            questions.map((q, index) => (
              <div key={q.id} className="bg-white rounded-xl shadow-md border border-gray-100 p-6 hover:shadow-lg transition-all duration-200">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-start gap-3 mb-3">
                      <span className="inline-flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-700 font-bold rounded-full flex-shrink-0 text-sm">
                        {index + 1}
                      </span>
                      <h3 className="font-bold text-lg text-gray-800">{q.question}</h3>
                    </div>

                    {q.description && (
                      <div className="ml-11 mb-4">
                        <p className="text-gray-600 text-sm bg-blue-50 rounded-lg p-3 border-l-4 border-blue-500">
                          {q.description}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => handleEditQuestion(index)}
                      className="flex cursor-pointer items-center gap-1 bg-green-50 hover:bg-green-100 text-green-700 font-medium px-3 py-2 rounded-lg transition-all duration-200"
                      title="Edit Question"
                    >
                      <Edit className="w-4 h-4" />
                      <span className="text-sm hidden sm:inline">Edit</span>
                    </button>
                    <button
                      onClick={() => setDeleteModal(q.id || null)}
                      className="flex cursor-pointer items-center gap-1 bg-red-50 hover:bg-red-100 text-red-700 font-medium px-3 py-2 rounded-lg transition-all duration-200"
                      title="Delete Question"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span className="text-sm hidden sm:inline">Delete</span>
                    </button>
                  </div>
                </div>

                <div className="ml-11 space-y-2">
                  {q.options.map((opt, oIndex) => (
                    <div
                      key={oIndex}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg border-2 transition-all ${opt.isCorrect
                          ? "bg-green-50 border-green-500"
                          : "bg-gray-50 border-gray-200"
                        }`}
                    >
                      {opt.isCorrect ? (
                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                      ) : (
                        <Circle className="w-5 h-5 text-gray-400 flex-shrink-0" />
                      )}
                      <span className={`text-sm ${opt.isCorrect ? "font-semibold text-green-800" : "text-gray-700"}`}>
                        {opt.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Add / Edit Question Form */}
        {showForm && (
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-blue-100">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full">
                  {editingIndex !== null ? (
                    <Edit className="w-6 h-6 text-blue-600" />
                  ) : (
                    <Plus className="w-6 h-6 text-blue-600" />
                  )}
                </div>
                <h2 className="text-2xl font-bold text-gray-800">
                  {editingIndex !== null ? "Edit Question" : "Add New Question"}
                </h2>
              </div>
              <button
                onClick={handleCancelEdit}
                className="text-gray-400 cursor-pointer hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Question *
                </label>
                <input
                  type="text"
                  placeholder="Enter your question here..."
                  value={newQuestion.question}
                  onChange={(e) => setNewQuestion({ ...newQuestion, question: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description (Optional)
                </label>
                <textarea
                  placeholder="Add additional context or explanation..."
                  value={newQuestion.description}
                  onChange={(e) => setNewQuestion({ ...newQuestion, description: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-colors resize-none"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Answer Options * (Select the correct answer)
                </label>
                <div className="space-y-3">
                  {newQuestion.options.map((opt, oIndex) => (
                    <div key={oIndex} className="flex items-center gap-3">
                      <input
                        type="text"
                        placeholder={`Option ${oIndex + 1}`}
                        value={opt.text}
                        onChange={(e) => {
                          const opts = [...newQuestion.options];
                          opts[oIndex].text = e.target.value;
                          setNewQuestion({ ...newQuestion, options: opts });
                        }}
                        className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-colors"
                      />
                      <label className={`flex items-center gap-2 px-4 py-3 rounded-xl cursor-pointer transition-all ${opt.isCorrect ? "bg-green-100 border-2 border-green-500" : "bg-gray-100 border-2 border-gray-200"
                        }`}>
                        <input
                          type="radio"
                          checked={opt.isCorrect}
                          onChange={() => {
                            const opts = newQuestion.options.map((o, idx) => ({ ...o, isCorrect: idx === oIndex }));
                            setNewQuestion({ ...newQuestion, options: opts });
                          }}
                          className="w-5 h-5 accent-green-600"
                        />
                        <span className={`font-medium text-sm whitespace-nowrap ${opt.isCorrect ? "text-green-700" : "text-gray-600"}`}>
                          Correct
                        </span>
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleCancelEdit}
                  className="flex-1 cursor-pointer bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold px-6 py-3 rounded-xl transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveQuestion}
                  disabled={!newQuestion.question.trim() || !newQuestion.options.some(o => o.isCorrect && o.text.trim())}
                  className="flex-1 cursor-pointer bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {editingIndex !== null ? "Update Question" : "Add Question"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}