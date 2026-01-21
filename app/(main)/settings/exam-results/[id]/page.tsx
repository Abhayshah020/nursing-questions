"use client"

import { useEffect, useState } from "react";
import { ArrowLeft, User, Mail, Calendar, Trophy, Clock, FileText, CheckCircle, XCircle, Award } from "lucide-react";
import axiosClient from "@/utils/axiosClient";
import { useParams, useRouter } from "next/navigation";

function LoadingView() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center">
            <div className="text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-6 relative">
                    <FileText className="w-10 h-10 text-blue-600" />
                    <div className="absolute inset-0 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3">
                    Loading Submission
                </h3>
                <p className="text-gray-600">
                    Please wait while we fetch the details...
                </p>
            </div>
        </div>
    );
}

function NotFoundView({ onBack }: { onBack: () => void }) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center">
            <div className="max-w-md mx-auto px-6">
                <div className="bg-white rounded-2xl shadow-xl p-12 border border-red-100 text-center">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-6">
                        <XCircle className="w-10 h-10 text-red-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-3">
                        Submission Not Found
                    </h3>
                    <p className="text-gray-600 mb-6">
                        We couldn't find the submission you're looking for.
                    </p>
                    <button
                        onClick={onBack}
                        className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function ExamSubmissionDetail() {
    const { id } = useParams(); // This would come from useParams() in actual implementation
    const [submission, setSubmission] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    useEffect(() => {
        const fetchSubmission = async () => {
            try {
                const { data } = await axiosClient.get(`/exam-result/${id}`);
                setSubmission(data.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchSubmission();
    }, [id]);

    const handleBack = () => {
        router.replace("/settings/exam-results");
    };

    if (loading) return <LoadingView />;
    if (!submission) return <NotFoundView onBack={handleBack} />;

    const correctAnswers = submission.answers.filter((ans: any) => ans.isCorrect).length;
    const totalQuestions = submission.answers.length;
    const incorrectAnswers = totalQuestions - correctAnswers;

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 py-12">
            <div className="max-w-6xl mx-auto px-6">
                {/* Back Button */}
                <button
                    onClick={handleBack}
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium mb-6 transition-colors group"
                >
                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    Back to Submissions
                </button>

                {/* Header Section */}
                <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-blue-100">
                    <div className="flex items-start justify-between mb-6">
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-100 rounded-full">
                                    <FileText className="w-7 h-7 text-blue-600" />
                                </div>
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-800">{submission.QuestionGroup.title}</h1>
                                    <p className="text-gray-500 text-sm mt-1">Exam Submission Details</p>
                                </div>
                            </div>

                            {/* Student Info */}
                            <div className="flex flex-wrap gap-6 mt-6 pt-6 border-t border-gray-100">
                                <div className="flex items-center gap-3">
                                    <div className="inline-flex items-center justify-center w-10 h-10 bg-purple-100 rounded-full">
                                        <User className="w-5 h-5 text-purple-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Student Name</p>
                                        <p className="font-semibold text-gray-800">{submission.User.name}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="inline-flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full">
                                        <Mail className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Email</p>
                                        <p className="font-semibold text-gray-800">{submission.User.email}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="inline-flex items-center justify-center w-10 h-10 bg-green-100 rounded-full">
                                        <Calendar className="w-5 h-5 text-green-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Submitted At</p>
                                        <p className="font-semibold text-gray-800">
                                            {new Date(submission.answeredAt).toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-xl shadow-md border border-blue-100 p-6">
                        <div className="flex items-center justify-between mb-3">
                            <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full">
                                <Trophy className="w-6 h-6 text-blue-600" />
                            </div>
                            <span className="text-3xl font-bold text-blue-700">{submission.totalScore}%</span>
                        </div>
                        <p className="text-sm font-semibold text-gray-600">Total Score</p>
                    </div>

                    <div className="bg-white rounded-xl shadow-md border border-purple-100 p-6">
                        <div className="flex items-center justify-between mb-3">
                            <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full">
                                <Clock className="w-6 h-6 text-purple-600" />
                            </div>
                            <span className="text-3xl font-bold text-purple-700">{submission.completedTimeframe}</span>
                        </div>
                        <p className="text-sm font-semibold text-gray-600">Completion Time</p>
                    </div>

                    <div className="bg-white rounded-xl shadow-md border border-green-100 p-6">
                        <div className="flex items-center justify-between mb-3">
                            <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-full">
                                <CheckCircle className="w-6 h-6 text-green-600" />
                            </div>
                            <span className="text-3xl font-bold text-green-700">{correctAnswers}</span>
                        </div>
                        <p className="text-sm font-semibold text-gray-600">Correct Answers</p>
                    </div>

                    <div className="bg-white rounded-xl shadow-md border border-red-100 p-6">
                        <div className="flex items-center justify-between mb-3">
                            <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-red-100 to-red-200 rounded-full">
                                <XCircle className="w-6 h-6 text-red-600" />
                            </div>
                            <span className="text-3xl font-bold text-red-700">{incorrectAnswers}</span>
                        </div>
                        <p className="text-sm font-semibold text-gray-600">Incorrect Answers</p>
                    </div>
                </div>

                {/* Answers Section */}
                <div className="bg-white rounded-2xl shadow-xl p-8 border border-blue-100">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full">
                            <Award className="w-6 h-6 text-blue-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800">Detailed Answers</h2>
                    </div>

                    <div className="space-y-6">
                        {submission.answers.map((ans: any, idx: number) => {
                            const question = ans.Question;
                            const selectedOption = question.options.find((o: any) => String(o.id) === String(ans.selectedOption));
                            const correctOption = question.options.find((o: any) => o.isCorrect);

                            return (
                                <div
                                    key={ans.id}
                                    className="bg-gray-50 rounded-xl p-6 border-2 border-gray-100 hover:shadow-md transition-all duration-200"
                                >
                                    <div className="flex items-start gap-3 mb-4">
                                        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${ans.isCorrect ? "bg-green-100" : "bg-red-100"
                                            }`}>
                                            {ans.isCorrect ? (
                                                <CheckCircle className="w-5 h-5 text-green-600" />
                                            ) : (
                                                <XCircle className="w-5 h-5 text-red-600" />
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-bold text-lg text-gray-800 mb-2">
                                                {idx + 1}. {question.question}
                                            </h3>

                                            {question.description && (
                                                <div className="mb-4">
                                                    <p className="text-sm text-gray-600 bg-blue-50 rounded-lg p-3 border-l-4 border-blue-500">
                                                        {question.description}
                                                    </p>
                                                </div>
                                            )}

                                            <div className="space-y-3">
                                                <div className={`flex items-start gap-2 p-3 rounded-lg ${ans.isCorrect ? "bg-green-50 border-l-4 border-green-500" : "bg-red-50 border-l-4 border-red-500"
                                                    }`}>
                                                    <span className="text-sm font-medium text-gray-600 min-w-[100px]">Your answer:</span>
                                                    <span className={`text-sm font-semibold ${ans.isCorrect ? "text-green-700" : "text-red-700"
                                                        }`}>
                                                        {selectedOption ? selectedOption.text : "Skipped"}
                                                    </span>
                                                </div>

                                                {!ans.isCorrect && (
                                                    <div className="flex items-start gap-2 p-3 rounded-lg bg-green-50 border-l-4 border-green-500">
                                                        <span className="text-sm font-medium text-gray-600 min-w-[100px]">Correct answer:</span>
                                                        <span className="text-sm font-semibold text-green-700">
                                                            {correctOption?.text}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Back to Top Button */}
                <div className="mt-8 text-center">
                    <button
                        onClick={handleBack}
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Back to All Submissions
                    </button>
                </div>
            </div>
        </div>
    );
}