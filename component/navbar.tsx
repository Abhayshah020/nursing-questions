"use client";

import axiosClient from "@/utils/axiosClient";
import { LogOut, Menu, X, LayoutDashboard, FileText, BarChart3 } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

type User = {
    role?: string;
    name?: string;
};

const Navbar: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (typeof window !== "undefined") {
            const storedUser = sessionStorage.getItem("user");
            if (storedUser) {
                setUser(JSON.parse(storedUser));
            } else {
                // Mock user for demonstration
                setUser({ role: "admin", name: "John Doe" });
            }
        }
    }, []);

    const handleLogout = async () => {
        try {
            await axiosClient.post("/authentication/logout");

            sessionStorage.clear();

            document.cookie.split(";").forEach((c) => {
                document.cookie = c
                    .replace(/^ +/, "")
                    .replace(/=.*/, `=;expires=${new Date(0).toUTCString()};path=/`);
            });

            router.push("/");
            console.log("Navigating to home page");
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    const handleNavigation = (path: string) => {
        setIsMenuOpen(false);
        router.push(path);
    };

    const isAdmin = user?.role === "admin" || user?.role === "superadmin";

    return (
        <>
            <nav className="w-full bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16 sm:h-20">
                        {/* Logo Section */}
                        <div
                            className="flex cursor-pointer items-center gap-2 sm:gap-3 flex-shrink-0"
                            onClick={() => handleNavigation("/dashboard")}
                        >
                            <div className="relative">
                                <div className="absolute inset-0 bg-blue-400 blur-lg opacity-30 rounded-full"></div>
                                <img
                                    src="/smsTrades.png"
                                    alt="Logo"
                                    className="h-10 w-10 sm:h-12 sm:w-12 object-contain rounded-lg relative z-10 shadow-md"
                                />
                            </div>
                            <span className="hidden md:block text-lg lg:text-xl font-bold text-gray-800">
                                SMS Skills & Trades Institute
                            </span>
                            <span className="md:hidden text-base font-bold text-gray-800">
                                SMS Trades
                            </span>
                        </div>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center gap-3">
                            <button
                                onClick={() => handleNavigation("/dashboard")}
                                className="flex cursor-pointer items-center gap-2 text-gray-700 hover:text-blue-600 font-medium px-4 py-2 rounded-lg hover:bg-blue-50 transition-all duration-200"
                            >
                                <LayoutDashboard className="w-5 h-5" />
                                <span>Dashboard</span>
                            </button>

                            {isAdmin && (
                                <>
                                    <button
                                        onClick={() => handleNavigation("/settings/exam-results")}
                                        className="flex cursor-pointer items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold px-4 py-2 rounded-xl shadow-md hover:shadow-lg transition-all duration-200"
                                    >
                                        <BarChart3 className="w-5 h-5" />
                                        <span>Results</span>
                                    </button>
                                    <button
                                        onClick={() => handleNavigation("/settings/questions-group")}
                                        className="flex cursor-pointer items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold px-4 py-2 rounded-xl shadow-md hover:shadow-lg transition-all duration-200"
                                    >
                                        <FileText className="w-5 h-5" />
                                        <span>Questions</span>
                                    </button>
                                </>
                            )}

                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold px-4 py-2 rounded-xl shadow-md hover:shadow-lg transition-all duration-200"
                            >
                                <LogOut className="w-5 h-5" />
                                <span>Logout</span>
                            </button>
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
                            aria-label="Toggle menu"
                        >
                            {isMenuOpen ? (
                                <X className="w-6 h-6 text-gray-700" />
                            ) : (
                                <Menu className="w-6 h-6 text-gray-700" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                <div
                    className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${isMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                        }`}
                >
                    <div className="px-4 pt-2 pb-4 space-y-2 bg-gray-50 border-t border-gray-200">
                        <button
                            onClick={() => handleNavigation("/dashboard")}
                            className="flex items-center gap-3 w-full text-left text-gray-700 hover:text-blue-600 font-medium px-4 py-3 rounded-lg hover:bg-white transition-all duration-200"
                        >
                            <LayoutDashboard className="w-5 h-5" />
                            <span>Dashboard</span>
                        </button>

                        {isAdmin && (
                            <>
                                <button
                                    onClick={() => handleNavigation("/settings/exam-results")}
                                    className="flex items-center gap-3 w-full text-left bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold px-4 py-3 rounded-xl shadow-md transition-all duration-200"
                                >
                                    <BarChart3 className="w-5 h-5" />
                                    <span>Results</span>
                                </button>
                                <button
                                    onClick={() => handleNavigation("/settings/questions-group")}
                                    className="flex items-center gap-3 w-full text-left bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold px-4 py-3 rounded-xl shadow-md transition-all duration-200"
                                >
                                    <FileText className="w-5 h-5" />
                                    <span>Questions</span>
                                </button>
                            </>
                        )}

                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 w-full text-left bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold px-4 py-3 rounded-xl shadow-md transition-all duration-200"
                        >
                            <LogOut className="w-5 h-5" />
                            <span>Logout</span>
                        </button>
                    </div>
                </div>
            </nav>

            {/* Overlay for mobile menu */}
            {isMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-40 p-4 md:hidden"
                    onClick={() => setIsMenuOpen(false)}
                />
            )}
        </>
    );
};

export default Navbar;