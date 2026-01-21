"use client";

import MockTestView from "@/component/mockTest";
import axiosClient from "@/utils/axiosClient";
import { Award, Clock, FileText, XCircle } from "lucide-react";
import { useEffect, useState } from "react";

function DashboardView({ loading, onStartTest }: { loading: boolean; onStartTest: () => void }) {
  const handleStart = () => {
    onStartTest();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="text-center mb-4">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-6">
            <FileText className="w-10 h-10 text-blue-600" />
          </div>
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            Mock Test Dashboard
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Test your knowledge and track your progress with our comprehensive mock tests
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 border border-blue-100">
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="text-center p-6 bg-blue-50 rounded-xl">
              <Clock className="w-8 h-8 text-blue-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-800 mb-1">Timed Test</h3>
              <p className="text-sm text-gray-600">Complete at your pace</p>
            </div>
            <div className="text-center p-6 bg-blue-50 rounded-xl">
              <FileText className="w-8 h-8 text-blue-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-800 mb-1">Multiple Topics</h3>
              <p className="text-sm text-gray-600">Diverse question bank</p>
            </div>
            <div className="text-center p-6 bg-blue-50 rounded-xl">
              <Award className="w-8 h-8 text-blue-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-800 mb-1">Instant Results</h3>
              <p className="text-sm text-gray-600">Get immediate feedback</p>
            </div>
          </div>

          <div className="text-center flex flex-col gap-4">
            <button
              onClick={handleStart}
              disabled={loading}
              className="bg-gradient-to-r cursor-pointer from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold px-10 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed text-lg"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Loading...
                </span>
              ) : (
                "Start Mock Test"
              )}
            </button>

            <p className="text-sm text-gray-500 mt-2">
              Click to begin your assessment or logout securely
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}


interface OptionType {
  id: number;
  text: string;
  isCorrect: boolean;
}

interface QuestionType {
  id: number;
  question: string;
  description: string;
  options: OptionType[];
}

interface GroupType {
  id: number;
  title: string;
  description: string;
  questions: QuestionType[];
}

function NoQuestionsView() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center">
      <div className="max-w-md mx-auto px-6">
        <div className="bg-white rounded-2xl shadow-xl p-12 border border-blue-100 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-6">
            <XCircle className="w-10 h-10 text-red-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-3">
            No Questions Available
          </h3>
          <p className="text-gray-600 mb-6">
            We couldn't find any questions for this test. Please try again later or contact support.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
          >
            Go Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}

function LoadingView() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center">
      <div className="max-w-md mx-auto px-6">
        <div className="bg-white rounded-2xl shadow-xl p-12 border border-blue-100 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-6 relative">
            <FileText className="w-10 h-10 text-blue-600" />
            <div className="absolute inset-0 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-3">
            Loading Nursing Questions Interface
          </h3>
          <p className="text-gray-600 mb-6">
            Please wait...
          </p>
          <div className="flex gap-2 justify-center">
            <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [mockGroup, setMockGroup] = useState<GroupType | null>(null);
  const [showTest, setShowTest] = useState(false);

  const startMockTest = async () => {
    setLoading(true);
    try {
      const res = await axiosClient.get("/questions/random-group");
      sessionStorage.setItem("mockTestQuestions", JSON.stringify(res.data))
      sessionStorage.setItem("takeMockTest", 'true');
      setShowTest(true);
      setMockGroup(res.data);
    } catch (error) {
      console.error("Failed to fetch mock test", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true)
    const takeMockTest = sessionStorage.getItem("takeMockTest");
    if (takeMockTest === 'true') {
      const mockTestQuestions = JSON.parse(sessionStorage.getItem("mockTestQuestions") || 'null');
      setShowTest(true);
      setMockGroup(mockTestQuestions);
    }
    setLoading(false)
  }, [])

  if (loading) {
    return <LoadingView />
  }

  if (showTest && !loading) {
    if (!mockGroup) {
      return <NoQuestionsView />
    }

    return <MockTestView setShowTest={setShowTest} group={mockGroup} startMockTest={startMockTest} />;
  }

  return <DashboardView loading={loading} onStartTest={startMockTest} />;
}