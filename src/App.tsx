/**
 * SkillFinder Main Application Entry Point
 * Implements 60-30-10 palette, Fraunces + Plus Jakarta Sans typography,
 * YouTube-style top loader, 2-second shifting artisan carousel,
 * dual-role customer/artisan views, and Supabase integration.
 */

import React, { useState, useEffect, useCallback } from "react";
import { User, Artisan, BookingRequest, Review, Message } from "./types";
import { skillFinderService } from "./services/storage";
import { TRADE_CATEGORIES, LOCATIONS } from "./data/artisans";

// Components
import { TopLoader } from "./components/TopLoader";
import { Navbar } from "./components/Navbar";
import { ArtisanCarousel } from "./components/ArtisanCarousel";
import { TradeFilter } from "./components/TradeFilter";
import { ArtisanCard } from "./components/ArtisanCard";
import { ArtisanProfile } from "./components/ArtisanProfile";
import { CustomerDashboard } from "./components/CustomerDashboard";
import {
    ArtisanDashboard,
    LocationCustomer,
} from "./components/ArtisanDashboard";
import { BookingModal } from "./components/BookingModal";
import { MessagingDrawer } from "./components/MessagingDrawer";
import { AuthModal } from "./components/AuthModal";
import { SupabaseModal } from "./components/SupabaseModal";
import { LocationSelector } from "./components/LocationSelector";

// Icons
import {
    SearchIcon,
    MapPinIcon,
    ShieldCheckIcon,
    BadgeCheckIcon,
    SparklesIcon,
    CheckCircleIcon,
    HardHatIcon,
    BriefcaseIcon,
} from "./icons";

export default function App() {
    // App state
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [currentView, setCurrentView] = useState<
        "explore" | "profile" | "dashboard"
    >("explore");
    const [selectedArtisan, setSelectedArtisan] = useState<Artisan | null>(
        null,
    );
    const [artisans, setArtisans] = useState<Artisan[]>([]);
    const [topArtisans, setTopArtisans] = useState<Artisan[]>([]);
    const [activeReviews, setActiveReviews] = useState<Review[]>([]);
    const [userBookings, setUserBookings] = useState<BookingRequest[]>([]);
    const [locationBookings, setLocationBookings] = useState<BookingRequest[]>(
        [],
    );
    const [locationCustomers, setLocationCustomers] = useState<
        LocationCustomer[]
    >([]);
    const [localArtisansForCustomer, setLocalArtisansForCustomer] = useState<
        Artisan[]
    >([]);
    const [chatMessages, setChatMessages] = useState<Message[]>([]);

    // Search & Filter state
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedTrade, setSelectedTrade] = useState("all");
    const [selectedLocation, setSelectedLocation] = useState("All Locations");

    // Modals & Drawers state
    const [authModalOpen, setAuthModalOpen] = useState(false);
    const [supabaseModalOpen, setSupabaseModalOpen] = useState(false);
    const [bookingModalArtisan, setBookingModalArtisan] =
        useState<Artisan | null>(null);
    const [chatArtisan, setChatArtisan] = useState<Artisan | null>(null);
    const [chatDrawerOpen, setChatDrawerOpen] = useState(false);

    // Global YouTube-style loader
    const [isLoading, setIsLoading] = useState(false);

    // Dark mode theme state
    const [isDark, setIsDark] = useState<boolean>(() => {
        if (typeof window !== "undefined") {
            const saved = localStorage.getItem("skillfinder_theme");
            if (saved) return saved === "dark";
            return window.matchMedia("(prefers-color-scheme: dark)").matches;
        }
        return false;
    });

    useEffect(() => {
        if (isDark) {
            document.documentElement.classList.add("dark");
            localStorage.setItem("skillfinder_theme", "dark");
        } else {
            document.documentElement.classList.remove("dark");
            localStorage.setItem("skillfinder_theme", "light");
        }
    }, [isDark]);

    const toggleTheme = () => {
        setIsDark((prev) => {
            const next = !prev;
            showToast(
                next
                    ? "Switched to Warm Dark mode"
                    : "Switched to Warm Linen Light mode",
            );
            return next;
        });
    };

    // Toast notification
    const [toastMessage, setToastMessage] = useState<string | null>(null);

    const showToast = (msg: string) => {
        setToastMessage(msg);
        setTimeout(() => setToastMessage(null), 3000);
    };

    // Trigger YouTube-style loader during async state changes
    const runWithLoader = async <T,>(
        action: () => Promise<T>,
    ): Promise<T | undefined> => {
        setIsLoading(true);
        try {
            return await action();
        } catch (e) {
            showToast(
                e instanceof Error
                    ? e.message
                    : "Something went wrong. Please try again.",
            );
        } finally {
            setTimeout(() => setIsLoading(false), 280);
        }
    };

    // Helper to load role & location specific data
    const loadUserContext = useCallback(async (user: User | null) => {
        if (!user) {
            setUserBookings([]);
            setLocationBookings([]);
            setLocationCustomers([]);
            setLocalArtisansForCustomer([]);
            return;
        }

        if (user.role === "artisan") {
            const [direct, locBookings, locCusts] = await Promise.all([
                skillFinderService.getArtisanBookings(user.id),
                skillFinderService.getLocationBookings(user.location),
                skillFinderService.getCustomersInLocation(user.location),
            ]);
            setUserBookings(direct);
            setLocationBookings(locBookings);
            setLocationCustomers(locCusts);
        } else {
            const [myBookings, locals] = await Promise.all([
                skillFinderService.getCustomerBookings(user.id),
                skillFinderService.getArtisans("all", user.location),
            ]);
            setUserBookings(myBookings);
            setLocalArtisansForCustomer(locals);
            // Auto-filter directory to customer's location
            setSelectedLocation(user.location);
        }
    }, []);

    // Initial data load
    useEffect(() => {
        const initialize = async () => {
            runWithLoader(async () => {
                const user = await skillFinderService.getCurrentUser();
                setCurrentUser(user);

                const allArtisans = await skillFinderService.getArtisans();
                setArtisans(allArtisans);
                setTopArtisans(allArtisans.filter((a) => a.rating >= 4.9));

                if (user) {
                    await loadUserContext(user);
                }
            });
        };
        initialize();
    }, [loadUserContext]);

    // Filter artisans on search/trade/location change
    const refreshArtisans = useCallback(() => {
        runWithLoader(async () => {
            const results = await skillFinderService.getArtisans(
                selectedTrade,
                selectedLocation,
                searchQuery,
            );
            setArtisans(results);
        });
    }, [selectedTrade, selectedLocation, searchQuery]);

    useEffect(() => {
        const timeout = setTimeout(() => {
            refreshArtisans();
        }, 180);
        return () => clearTimeout(timeout);
    }, [refreshArtisans]);

    // Auth actions
    const handleLogin = async (email: string, password: string) => {
        await runWithLoader(async () => {
            const user = await skillFinderService.login(email, password);
            setCurrentUser(user);
            setAuthModalOpen(false);
            showToast(`Welcome back, ${user.name}!`);
            await loadUserContext(user);
            setCurrentView(user.role === "artisan" ? "dashboard" : "explore");
        });
    };

    const handleRegister = async (
        userData: Omit<User, "id" | "createdAt"> & { password: string },
    ) => {
        await runWithLoader(async () => {
            const user = await skillFinderService.registerOneWay(userData);
            setAuthModalOpen(false);
            if (!user) {
                showToast(
                    "Check your email to confirm your account, then sign in.",
                );
                return;
            }
            setCurrentUser(user);
            showToast(
                `Welcome to SkillFinder, ${user.name} (${user.location})!`,
            );
            await loadUserContext(user);
            setCurrentView(user.role === "artisan" ? "dashboard" : "explore");
        });
    };

    const handleLogout = async () => {
        await runWithLoader(async () => {
            await skillFinderService.logout();
            setCurrentUser(null);
            await loadUserContext(null);
            setSelectedLocation("All Locations");
            setCurrentView("explore");
            showToast("Signed out successfully");
        });
    };

    // Navigation handlers
    const handleSelectArtisan = async (artisan: Artisan) => {
        await runWithLoader(async () => {
            setSelectedArtisan(artisan);
            const reviews = await skillFinderService.getArtisanReviews(
                artisan.id,
            );
            setActiveReviews(reviews);
            setCurrentView("profile");
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    };

    const handleBackToExplore = () => {
        setCurrentView("explore");
        setSelectedArtisan(null);
    };

    // Booking handlers
    const handleOpenBooking = (artisan: Artisan) => {
        setBookingModalArtisan(artisan);
    };

    const handleSubmitBooking = async (bookingData: {
        serviceType: string;
        preferredDate: string;
        description: string;
        estimatedPrice: number;
        customerName: string;
        customerEmail: string;
        customerPhone: string;
        customerLocation: string;
    }) => {
        if (!bookingModalArtisan) return;
        if (!currentUser) {
            showToast("Please sign in to request a quote.");
            setAuthModalOpen(true);
            return;
        }

        await runWithLoader(async () => {
            await skillFinderService.createBooking({
                customerId: currentUser?.id || "guest-cust",
                customerName: bookingData.customerName,
                customerEmail: bookingData.customerEmail,
                customerPhone: bookingData.customerPhone,
                customerLocation: bookingData.customerLocation,
                artisanId: bookingModalArtisan.id,
                artisanName: bookingModalArtisan.name,
                trade: bookingModalArtisan.trade,
                serviceType: bookingData.serviceType,
                preferredDate: bookingData.preferredDate,
                description: bookingData.description,
                estimatedPrice: bookingData.estimatedPrice,
            });

            // Reload bookings & location lists
            if (currentUser) {
                await loadUserContext(currentUser);
            }

            showToast(`Quote request sent to ${bookingModalArtisan.name}!`);
        });
    };

    // Status updates for artisan
    const handleUpdateBookingStatus = async (
        bookingId: string,
        status: BookingRequest["status"],
    ) => {
        await runWithLoader(async () => {
            await skillFinderService.updateBookingStatus(bookingId, status);
            if (currentUser) {
                await loadUserContext(currentUser);
            }
            showToast(`Request marked as ${status}`);
        });
    };

    // Review submission
    const handleAddReview = async (reviewData: {
        rating: number;
        projectType: string;
        comment: string;
    }) => {
        if (!selectedArtisan) return;
        if (!currentUser) {
            showToast("Please sign in to leave a review.");
            setAuthModalOpen(true);
            return;
        }

        await runWithLoader(async () => {
            await skillFinderService.addReview({
                artisanId: selectedArtisan.id,
                customerId: currentUser?.id || "demo-customer-1",
                customerName: currentUser?.name || "Verified Client",
                customerAvatar:
                    currentUser?.avatar ||
                    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
                rating: reviewData.rating,
                projectType: reviewData.projectType,
                comment: reviewData.comment,
                verifiedPurchase: true,
            });

            const updatedReviews = await skillFinderService.getArtisanReviews(
                selectedArtisan.id,
            );
            setActiveReviews(updatedReviews);
            showToast("Your review has been verified and posted!");
        });
    };

    // Chat / Messaging
    const handleOpenChat = async (artisan: Artisan) => {
        setChatArtisan(artisan);
        const convId = `${artisan.id}_${currentUser?.id || "guest-cust"}`;
        const msgs = await skillFinderService.getConversation(convId);
        setChatMessages(msgs);
        setChatDrawerOpen(true);
    };

    const handleSendMessage = async (text: string) => {
        if (!chatArtisan) return;
        if (!currentUser) {
            showToast("Please sign in to message an artisan.");
            setAuthModalOpen(true);
            return;
        }
        const convId = `${chatArtisan.id}_${currentUser?.id || "guest-cust"}`;

        try {
            const newMsg = await skillFinderService.sendMessage({
                conversationId: convId,
                senderId: currentUser?.id || "guest-cust",
                senderName: currentUser?.name || "Guest Client",
                senderRole: currentUser?.role || "customer",
                recipientId: chatArtisan.id,
                text,
            });

            setChatMessages((prev) => [...prev, newMsg]);
        } catch (e) {
            showToast(e instanceof Error ? e.message : "Message not sent.");
        }
    };

    const carouselArtisans =
        searchQuery ||
        selectedTrade !== "all" ||
        selectedLocation !== "All Locations"
            ? artisans
            : topArtisans.length > 0
              ? topArtisans
              : artisans;

    return (
        <div className="min-h-screen bg-[#FBF9F5] dark:bg-[#1C1816] text-[#3B2F2F] dark:text-[#F5F2EB] flex flex-col font-body selection:bg-[#D97736]/20 selection:text-[#3B2F2F] transition-colors duration-200">
            {/* YouTube-style Top Progress Bar */}
            <TopLoader isLoading={isLoading} />

            {/* Global Navigation Bar */}
            <Navbar
                currentUser={currentUser}
                onOpenAuth={() => setAuthModalOpen(true)}
                onLogout={handleLogout}
                onOpenSupabase={() => setSupabaseModalOpen(true)}
                onNavigateHome={handleBackToExplore}
                onNavigateArtisans={() => setCurrentView("explore")}
                onNavigateDashboard={() => setCurrentView("dashboard")}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                selectedLocation={selectedLocation}
                setSelectedLocation={setSelectedLocation}
                locations={LOCATIONS}
                onNotification={showToast}
                isDark={isDark}
                onToggleTheme={toggleTheme}
            />

            {/* Toast Notification Banner */}
            {toastMessage && (
                <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-[#3B2F2F] dark:bg-[#2B2522] text-[#FBF9F5] px-4 py-3 rounded-2xl shadow-xl text-xs font-semibold animate-slideUp border border-[#78866B]/30 dark:border-[#78866B]/50">
                    <CheckCircleIcon className="w-4 h-4 text-[#0891B2]" />
                    <span>{toastMessage}</span>
                </div>
            )}

            {/* MAIN VIEW CONTROLLER */}
            <main className="flex-1">
                {/* VIEW 1: EXPLORE / HOME VIEW */}
                {currentView === "explore" && (
                    <div className="space-y-8 pb-16">
                        {/* HERO SECTION WITH GLASSY BLURRY BACKDROP */}
                        <section className="relative overflow-hidden pt-8 pb-12 sm:pb-16 px-4 sm:px-6 lg:px-8 border-b border-[#78866B]/20 dark:border-[#78866B]/30">
                            {/* Blurry Glassy Canvas Layer */}
                            <div className="absolute inset-0 bg-gradient-to-br from-[#F5F2EB]/95 dark:from-[#231F1D]/95 via-[#FBF9F5]/80 dark:via-[#1C1816]/90 to-[#EAE4D7]/70 dark:to-[#181513]/85 backdrop-blur-xl -z-10" />

                            {/* Decorative Subtle Ambient Orbs */}
                            <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-[#0891B2]/10 dark:bg-[#0891B2]/5 blur-3xl -z-10 pointer-events-none" />
                            <div className="absolute top-1/2 -right-24 w-96 h-96 rounded-full bg-[#D97736]/10 dark:bg-[#D97736]/5 blur-3xl -z-10 pointer-events-none" />

                            <div className="max-w-7xl mx-auto">
                                <div className="max-w-3xl mb-8">
                                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F5F2EB] dark:bg-[#2B2522] border border-[#78866B]/30 dark:border-[#78866B]/40 text-xs font-semibold text-[#78866B] dark:text-[#A3B19F] mb-3">
                                        <SparklesIcon className="w-3.5 h-3.5 text-[#0891B2]" />
                                        <span>
                                            South Africa’s Verified Guild &
                                            Trades Network
                                        </span>
                                    </div>

                                    <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-[#3B2F2F] dark:text-[#F5F2EB] leading-tight text-balance">
                                        Find Trusted Artisans Near You{" "}
                                        <br className="hidden sm:inline" />
                                        Ready to Build & Fix
                                    </h1>

                                    <p className="mt-3 text-sm sm:text-base text-[#5A4E4D] dark:text-[#C4BDB5] leading-relaxed max-w-2xl">
                                        Connect directly with verified master
                                        carpenters, certified plumbers,
                                        wireman-licensed electricians, and
                                        masonry specialists. Review past
                                        portfolios and request custom quotes
                                        with transparent rates.
                                    </p>
                                </div>

                                {/* 2-SECOND AUTO-SHIFTING TOP ARTISAN CAROUSEL */}
                                <div className="rounded-3xl p-4 sm:p-6 bg-white/60 dark:bg-[#231F1D]/75 backdrop-blur-md border border-[#78866B]/20 dark:border-[#78866B]/35 shadow-xs">
                                    <ArtisanCarousel
                                        artisans={carouselArtisans}
                                        onSelectArtisan={handleSelectArtisan}
                                    />
                                </div>
                            </div>
                        </section>

                        {/* DIRECTORY SECTION: TRADES FILTER + RESULTS GRID */}
                        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            {/* Trades Bar */}
                            <div className="mb-6">
                                {currentUser?.role === "customer" && (
                                    <div className="mb-4 p-3.5 rounded-2xl bg-[#0891B2]/10 dark:bg-[#0891B2]/15 border border-[#0891B2]/30 flex flex-wrap items-center justify-between gap-3 text-xs">
                                        <div className="flex items-center gap-2 text-[#0E7490] dark:text-[#22D3EE] font-semibold">
                                            <MapPinIcon className="w-4 h-4 shrink-0" />
                                            <span>
                                                Showing verified artisans in
                                                your location:{" "}
                                                <strong>
                                                    {currentUser.location}
                                                </strong>
                                            </span>
                                        </div>
                                        {selectedLocation !==
                                            "All Locations" && (
                                            <button
                                                onClick={() =>
                                                    setSelectedLocation(
                                                        "All Locations",
                                                    )
                                                }
                                                className="text-xs font-bold text-[#D97736] hover:underline"
                                            >
                                                View all South African regions
                                            </button>
                                        )}
                                    </div>
                                )}

                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
                                    <h2 className="font-display text-xl sm:text-2xl font-bold text-[#3B2F2F] dark:text-[#F5F2EB]">
                                        Explore by Trade
                                    </h2>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-[#78866B] dark:text-[#A3B19F]">
                                            Location:
                                        </span>
                                        <LocationSelector
                                            selectedLocation={selectedLocation}
                                            onSelectLocation={
                                                setSelectedLocation
                                            }
                                            locations={LOCATIONS}
                                            onNotification={showToast}
                                            isCompact={false}
                                        />
                                    </div>
                                </div>

                                <TradeFilter
                                    categories={TRADE_CATEGORIES}
                                    selectedTrade={selectedTrade}
                                    onSelectTrade={setSelectedTrade}
                                />
                            </div>

                            {/* Search count & results info */}
                            <div className="flex items-center justify-between py-3 border-b border-[#78866B]/20 dark:border-[#78866B]/30 mb-6 text-xs text-[#5A4E4D] dark:text-[#C4BDB5]">
                                <span>
                                    Showing{" "}
                                    <strong className="text-[#3B2F2F] dark:text-[#F5F2EB]">
                                        {artisans.length}
                                    </strong>{" "}
                                    available master artisans
                                </span>
                                {(searchQuery ||
                                    selectedTrade !== "all" ||
                                    selectedLocation !== "All Locations") && (
                                    <button
                                        onClick={() => {
                                            setSearchQuery("");
                                            setSelectedTrade("all");
                                            setSelectedLocation(
                                                "All Locations",
                                            );
                                        }}
                                        className="text-[#D97736] font-semibold hover:underline"
                                    >
                                        Reset all filters
                                    </button>
                                )}
                            </div>

                            {/* Artisan Cards Grid */}
                            {artisans.length === 0 ? (
                                <div className="py-16 text-center space-y-3 bg-[#F5F2EB]/50 dark:bg-[#231F1D]/50 rounded-3xl border border-[#78866B]/20 dark:border-[#78866B]/35">
                                    <SearchIcon className="w-8 h-8 text-[#78866B] dark:text-[#A3B19F] mx-auto opacity-60" />
                                    <h3 className="font-display text-lg font-bold text-[#3B2F2F] dark:text-[#F5F2EB]">
                                        No artisans found in this location
                                    </h3>
                                    <p className="text-xs text-[#5A4E4D] dark:text-[#C4BDB5] max-w-sm mx-auto">
                                        Try broadening your search query or
                                        selecting "All Locations" to discover
                                        craftspeople nearby.
                                    </p>
                                    <button
                                        onClick={() => {
                                            setSelectedLocation(
                                                "All Locations",
                                            );
                                            setSelectedTrade("all");
                                            setSearchQuery("");
                                        }}
                                        className="px-4 py-2 rounded-xl bg-[#3B2F2F] dark:bg-[#D97736] text-xs font-bold text-white shadow-xs"
                                    >
                                        View All Tradespeople
                                    </button>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                                    {artisans.map((artisan) => (
                                        <ArtisanCard
                                            key={artisan.id}
                                            artisan={artisan}
                                            onSelect={handleSelectArtisan}
                                            onRequestQuote={handleOpenBooking}
                                        />
                                    ))}
                                </div>
                            )}
                        </section>
                    </div>
                )}

                {/* VIEW 2: ARTISAN PROFILE DETAIL VIEW */}
                {currentView === "profile" && selectedArtisan && (
                    <ArtisanProfile
                        artisan={selectedArtisan}
                        reviews={activeReviews}
                        currentUser={currentUser}
                        onBack={handleBackToExplore}
                        onRequestQuote={() =>
                            handleOpenBooking(selectedArtisan)
                        }
                        onOpenChat={() => handleOpenChat(selectedArtisan)}
                        onAddReview={handleAddReview}
                    />
                )}

                {/* VIEW 3: DUAL-ROLE DASHBOARD */}
                {currentView === "dashboard" && (
                    <div>
                        {currentUser?.role === "artisan" ? (
                            <ArtisanDashboard
                                currentUser={currentUser}
                                directBookings={userBookings}
                                locationBookings={locationBookings}
                                locationCustomers={locationCustomers}
                                onUpdateStatus={handleUpdateBookingStatus}
                                onOpenChatWithCustomer={(custId) => {
                                    if (selectedArtisan)
                                        handleOpenChat(selectedArtisan);
                                    else if (artisans[0])
                                        handleOpenChat(artisans[0]);
                                }}
                            />
                        ) : currentUser ? (
                            <CustomerDashboard
                                currentUser={currentUser}
                                bookings={userBookings}
                                localArtisans={localArtisansForCustomer}
                                onSelectArtisan={handleSelectArtisan}
                                onBrowseArtisans={() =>
                                    setCurrentView("explore")
                                }
                                onOpenChatWithArtisan={(artisanId) => {
                                    const art =
                                        artisans.find(
                                            (a) => a.id === artisanId,
                                        ) || artisans[0];
                                    if (art) handleOpenChat(art);
                                }}
                            />
                        ) : (
                            <div className="max-w-md mx-auto py-20 px-4 text-center space-y-4">
                                <h2 className="font-display text-2xl font-bold text-[#3B2F2F] dark:text-[#F5F2EB]">
                                    Please Sign In
                                </h2>
                                <p className="text-xs text-[#5A4E4D] dark:text-[#C4BDB5]">
                                    Sign in or register to access your customer
                                    quote requests or artisan workshop leads.
                                </p>
                                <button
                                    onClick={() => setAuthModalOpen(true)}
                                    className="px-5 py-2.5 rounded-xl bg-[#D97736] text-xs font-bold text-white shadow-xs"
                                >
                                    Sign In / Register
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </main>

            {/* FOOTER */}
            <footer className="bg-[#F5F2EB] dark:bg-[#181513] border-t border-[#78866B]/25 dark:border-[#78866B]/30 py-10 px-4 sm:px-6 lg:px-8 mt-auto transition-colors">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex flex-col">
                        <span className="font-display font-bold text-xl bg-gradient-to-r from-[#D97736] via-[#78866B] to-[#0891B2] bg-clip-text text-transparent">
                            SkillFinder
                        </span>
                        <p className="text-xs text-[#5A4E4D] dark:text-[#C4BDB5] mt-0.5">
                            Connecting homeowners with verified master artisans
                            across South Africa.
                        </p>
                    </div>

                    <div className="flex items-center gap-6 text-xs font-semibold text-[#5A4E4D] dark:text-[#C4BDB5]">
                        <button
                            onClick={handleBackToExplore}
                            className="hover:text-[#3B2F2F] dark:hover:text-[#F5F2EB] transition-colors"
                        >
                            Browse Artisans
                        </button>
                        <button
                            onClick={() => setAuthModalOpen(true)}
                            className="hover:text-[#D97736] transition-colors"
                        >
                            Artisan Sign-Up
                        </button>
                    </div>

                    <p className="text-xs text-[#78866B] dark:text-[#A3B19F]">
                        © {new Date().getFullYear()} SkillFinder. Built with
                        craft & precision.
                    </p>
                </div>
            </footer>

            {/* MODALS & DRAWERS */}

            {/* Auth Modal (One-Way Registration & Demo Sign-In) */}
            <AuthModal
                isOpen={authModalOpen}
                onClose={() => setAuthModalOpen(false)}
                onLogin={handleLogin}
                onRegister={handleRegister}
            />

            {/* Booking & Quote Request Modal */}
            {bookingModalArtisan && (
                <BookingModal
                    artisan={bookingModalArtisan}
                    currentUser={currentUser}
                    onClose={() => setBookingModalArtisan(null)}
                    onSubmit={handleSubmitBooking}
                />
            )}

            {/* Real-time Customer-Artisan Chat Drawer */}
            <MessagingDrawer
                isOpen={chatDrawerOpen}
                onClose={() => setChatDrawerOpen(false)}
                currentUser={currentUser}
                targetArtisan={chatArtisan}
                messages={chatMessages}
                onSendMessage={handleSendMessage}
            />

            {/* Supabase Schema Modal */}
            <SupabaseModal
                isOpen={supabaseModalOpen}
                onClose={() => setSupabaseModalOpen(false)}
            />
        </div>
    );
}
