"use client"
import { useEffect, useState } from "react";
import { Eye, Trophy, Clock, Mail, User, FileText, Calendar } from "lucide-react";
import axiosClient from "@/utils/axiosClient";


function LoadingView() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-6 relative">
          <FileText className="w-10 h-10 text-blue-600" />
          <div className="absolute inset-0 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <h3 className="text-2xl font-bold text-gray-800 mb-3">
          Loading Submissions
        </h3>
        <p className="text-gray-600">
          Please wait while we fetch exam results...
        </p>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-12 text-center">
      <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
      <h3 className="text-xl font-semibold text-gray-600 mb-2">No Submissions Yet</h3>
      <p className="text-gray-500">Exam submissions will appear here once students complete tests</p>
    </div>
  );
}

export default function ExamSubmissionsPage() {
    const [submissions, setSubmissions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSubmissions = async () => {
            try {
                const { data } = await axiosClient.get("/exam-result");
                setSubmissions(data.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchSubmissions();
    }, []);

    if (loading) return <LoadingView />;

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 py-12">
            <div className="max-w-7xl mx-auto px-6">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                        <Trophy className="w-8 h-8 text-blue-600" />
                    </div>
                    <h1 className="text-4xl font-bold text-gray-800 mb-3">Exam Submissions</h1>
                    <p className="text-gray-600">View and manage all exam results and submissions</p>
                </div>

                {/* Stats Overview */}
                <div className="flex justify-center flex-wrap items-center gap-6 mb-8">
                    <div className="bg-white rounded-xl shadow-md border border-blue-100 p-6">
                        <div className="flex items-center gap-4">
                            <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full">
                                <FileText className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Total Submissions</p>
                                <p className="text-2xl font-bold text-gray-800">{submissions.length}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-md border border-purple-100 p-6">
                        <div className="flex items-center gap-4">
                            <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full">
                                <User className="w-6 h-6 text-purple-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Unique Students</p>
                                <p className="text-2xl font-bold text-gray-800">
                                    {new Set(submissions.map(s => s.User?.email)).size}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Submissions Table/Cards */}
                {submissions.length === 0 ? (
                    <EmptyState />
                ) : (
                    <>
                        {/* Desktop Table View */}
                        <div className="hidden lg:block bg-white rounded-2xl shadow-xl border border-blue-100 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-200">
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">S.N.</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Student</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Email</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Exam Set</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Score</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Duration</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {submissions.map((sub, idx) => (
                                            <tr 
                                                key={sub.id} 
                                                className="border-b border-gray-100 hover:bg-blue-50 transition-colors"
                                            >
                                                <td className="px-6 py-4">
                                                    <span className="inline-flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-700 font-semibold rounded-full text-sm">
                                                        {idx + 1}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="inline-flex items-center justify-center w-10 h-10 bg-purple-100 rounded-full">
                                                            <User className="w-5 h-5 text-purple-600" />
                                                        </div>
                                                        <span className="font-medium text-gray-800">{sub.User?.name}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2 text-gray-600">
                                                        <Mail className="w-4 h-4" />
                                                        <span className="text-sm">{sub.User?.email}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <FileText className="w-4 h-4 text-blue-600" />
                                                        <span className="font-medium text-gray-700">{sub.QuestionGroup?.title}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-50 to-green-100 px-3 py-1.5 rounded-full border border-green-200">
                                                        <Trophy className="w-4 h-4 text-green-600" />
                                                        <span className="font-bold text-green-700">{sub.totalScore}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2 text-gray-600">
                                                        <Clock className="w-4 h-4" />
                                                        <span className="text-sm">{sub.completedTimeframe}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <a
                                                        href={`/settings/exam-results/${sub.id}`}
                                                        className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                        View
                                                    </a>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Mobile Card View */}
                        <div className="lg:hidden space-y-4">
                            {submissions.map((sub, idx) => (
                                <div 
                                    key={sub.id}
                                    className="bg-white rounded-xl shadow-md border border-gray-100 p-6 hover:shadow-lg transition-all duration-200"
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <span className="inline-flex items-center justify-center w-10 h-10 bg-blue-100 text-blue-700 font-bold rounded-full">
                                                {idx + 1}
                                            </span>
                                            <div>
                                                <h3 className="font-bold text-gray-800">{sub.User?.name}</h3>
                                                <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                                                    <Mail className="w-3 h-3" />
                                                    {sub.User?.email}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-50 to-green-100 px-3 py-1.5 rounded-full border border-green-200">
                                            <Trophy className="w-4 h-4 text-green-600" />
                                            <span className="font-bold text-green-700">{sub.totalScore}%</span>
                                        </div>
                                    </div>

                                    <div className="space-y-3 mb-4">
                                        <div className="flex items-center gap-2 text-gray-700">
                                            <FileText className="w-4 h-4 text-blue-600" />
                                            <span className="text-sm font-medium">{sub.QuestionGroup?.title}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <Clock className="w-4 h-4" />
                                            <span className="text-sm">{sub.completedTimeframe}</span>
                                        </div>
                                    </div>

                                    <a
                                        href={`/settings/exam-results/${sub.id}`}
                                        className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2.5 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg w-full"
                                    >
                                        <Eye className="w-4 h-4" />
                                        View Details
                                    </a>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}