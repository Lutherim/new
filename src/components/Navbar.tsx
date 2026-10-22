import React, { useState } from "react";
import {
    SearchIcon,
    MapPinIcon,
    UserIcon,
    LogInIcon,
    LogOutIcon,
    DatabaseIcon,
    CloseIcon,
    HardHatIcon,
    BriefcaseIcon,
    SunIcon,
    MoonIcon,
} from "../icons";
import { User } from "../types";
import { LocationSelector } from "./LocationSelector";

interface NavbarProps {
    currentUser: User | null;
    onOpenAuth: () => void;
    onLogout: () => void;
    onOpenSupabase: () => void;
    onNavigateHome: () => void;
    onNavigateArtisans: () => void;
    onNavigateDashboard: () => void;
    searchQuery: string;
    setSearchQuery: (q: string) => void;
    selectedLocation: string;
    setSelectedLocation: (loc: string) => void;
    locations: string[];
    onNotification?: (msg: string) => void;
    isDark?: boolean;
    onToggleTheme?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
    currentUser,
    onOpenAuth,
    onLogout,
    onOpenSupabase,
    onNavigateHome,
    onNavigateArtisans,
    onNavigateDashboard,
    searchQuery,
    setSearchQuery,
    selectedLocation,
    setSelectedLocation,
    locations,
    onNotification,
    isDark = false,
    onToggleTheme,
}) => {
    const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

    return (
        <header className="sticky top-0 z-40 bg-[#FBF9F5]/90 dark:bg-[#1C1816]/90 backdrop-blur-md border-b border-[#78866B]/20 dark:border-[#78866B]/30 transition-colors duration-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* DESKTOP NAVBAR ROW (md:flex) */}
                <div className="hidden md:flex items-center justify-between h-16 gap-4">
                    {/* ZONE 1: Brand Wordmark (Aligned with Search Bar) */}
                    <div className="flex items-center shrink-0">
                        <button
                            onClick={onNavigateHome}
                            className="flex items-center text-left focus:outline-none"
                            aria-label="SkillFinder Home"
                        >
                            <span className="font-display text-2xl font-bold tracking-tight bg-gradient-to-r from-[#D97736] via-[#78866B] to-[#0891B2] bg-clip-text text-transparent select-none leading-none">
                                SkillFinder
                            </span>
                        </button>
                    </div>

                    {/* ZONE 2: Search Bar & Filters */}
                    <div className="flex-1 max-w-xl mx-2">
                        <div className="flex items-center gap-2 bg-[#F5F2EB] dark:bg-[#2B2522] rounded-xl px-3 py-1.5 border border-[#78866B]/40 dark:border-[#78866B]/40 focus-within:border-[#D97736] focus-within:ring-2 focus-within:ring-[#D97736]/20 transition-all">
                            <SearchIcon className="w-4 h-4 text-[#78866B] dark:text-[#A3B19F] shrink-0" />
                            <input
                                type="text"
                                placeholder="Search trades (e.g. cabinetry, solar electrician, plumber)..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-transparent text-sm text-[#3B2F2F] dark:text-[#F5F2EB] placeholder-[#5A4E4D]/60 dark:placeholder-[#A3B19F]/60 focus:outline-none"
                            />

                            {/* Location Selector */}
                            <div className="pl-2 border-l border-[#78866B]/30 dark:border-[#78866B]/30 shrink-0">
                                <LocationSelector
                                    selectedLocation={selectedLocation}
                                    onSelectLocation={setSelectedLocation}
                                    locations={locations}
                                    onNotification={onNotification}
                                    isCompact={true}
                                />
                            </div>

                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery("")}
                                    className="p-1 text-[#78866B] hover:text-[#3B2F2F] dark:text-[#A3B19F] dark:hover:text-[#F5F2EB] rounded-full"
                                    aria-label="Clear search"
                                >
                                    <CloseIcon className="w-3.5 h-3.5" />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* ZONE 3: Actions & Theme Toggle */}
                    <div className="flex items-center gap-3 shrink-0">
                        {/* Dark Mode Toggle */}
                        <button
                            onClick={onToggleTheme}
                            className="p-2 rounded-xl bg-[#F5F2EB] dark:bg-[#2B2522] border border-[#78866B]/30 dark:border-[#78866B]/40 text-[#3B2F2F] dark:text-[#F5F2EB] hover:bg-[#EAE4D7] dark:hover:bg-[#362F2C] transition-colors"
                            title={
                                isDark
                                    ? "Switch to Warm Linen Light Mode"
                                    : "Switch to Warm Charcoal Dark Mode"
                            }
                            aria-label="Toggle dark mode theme"
                        >
                            {isDark ? (
                                <SunIcon className="w-4 h-4 text-[#D97736]" />
                            ) : (
                                <MoonIcon className="w-4 h-4 text-[#78866B]" />
                            )}
                        </button>

                        {/* User Session / Role Controls */}
                        {currentUser ? (
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={onNavigateDashboard}
                                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#78866B]/15 dark:bg-[#78866B]/25 hover:bg-[#78866B]/25 border border-[#78866B]/30 text-xs font-medium text-[#3B2F2F] dark:text-[#F5F2EB] transition-colors"
                                >
                                    {currentUser.role === "artisan" ? (
                                        <HardHatIcon className="w-3.5 h-3.5 text-[#D97736]" />
                                    ) : (
                                        <BriefcaseIcon className="w-3.5 h-3.5 text-[#0891B2]" />
                                    )}
                                    <span className="font-semibold">
                                        {currentUser.name}
                                    </span>
                                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-white dark:bg-[#1C1816] text-[#3B2F2F] dark:text-[#F5F2EB] border border-stone-200 dark:border-stone-700 uppercase font-bold tracking-wider">
                                        {currentUser.role}
                                    </span>
                                </button>

                                <button
                                    onClick={onLogout}
                                    className="p-2 rounded-lg text-[#5A4E4D] dark:text-[#A3B19F] hover:text-[#3B2F2F] dark:hover:text-[#F5F2EB] hover:bg-stone-200/50 dark:hover:bg-stone-800/50 transition-colors"
                                    title="Sign Out"
                                >
                                    <LogOutIcon className="w-4 h-4" />
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={onOpenAuth}
                                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#D97736] hover:bg-[#C86D3B] text-[#FBF9F5] font-semibold text-xs sm:text-sm shadow-sm transition-all whitespace-nowrap active:scale-95"
                            >
                                <LogInIcon className="w-4 h-4" />
                                <span>Sign In / Join</span>
                            </button>
                        )}
                    </div>
                </div>

                {/* MOBILE NAVBAR ROW (md:hidden) WITH 30% TO 100% EXPANDING SEARCH BAR */}
                <div className="md:hidden flex items-center justify-between h-16 gap-2 w-full">
                    {/* Brand Wordmark (smoothly collapses when search expands to 100%) */}
                    <div
                        className={`flex items-center shrink-0 transition-all duration-300 ease-in-out ${
                            mobileSearchOpen
                                ? "w-0 opacity-0 overflow-hidden pointer-events-none -mr-2"
                                : "w-auto opacity-100"
                        }`}
                    >
                        <button
                            onClick={onNavigateHome}
                            className="flex items-center text-left focus:outline-none"
                            aria-label="SkillFinder Home"
                        >
                            <span className="font-display text-xl font-bold bg-gradient-to-r from-[#D97736] via-[#78866B] to-[#0891B2] bg-clip-text text-transparent select-none leading-none">
                                SkillFinder
                            </span>
                        </button>
                    </div>

                    {/* Search Bar with CSS Transition Expanding Width from 30% to 100% */}
                    <div
                        style={{ width: mobileSearchOpen ? "100%" : "30%" }}
                        className="transition-[width] duration-300 ease-in-out min-w-[95px] max-w-full"
                    >
                        <div
                            onClick={() => {
                                if (!mobileSearchOpen)
                                    setMobileSearchOpen(true);
                            }}
                            className={`flex items-center gap-1.5 bg-[#F5F2EB] dark:bg-[#2B2522] rounded-xl px-2.5 py-2 border-2 border-[#78866B] shadow-xs transition-all duration-300 ${
                                mobileSearchOpen
                                    ? "w-full shadow-md"
                                    : "cursor-pointer hover:bg-[#EAE4D7] dark:hover:bg-[#362F2C] active:scale-98"
                            }`}
                        >
                            {/* Search Icon (Clicking triggers expansion) */}
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setMobileSearchOpen(true);
                                }}
                                className="p-0.5 rounded text-[#78866B] dark:text-[#A3B19F] hover:text-[#3B2F2F] shrink-0 focus:outline-none"
                                aria-label="Expand Search Bar"
                            >
                                <SearchIcon className="w-4 h-4 text-[#78866B] dark:text-[#A3B19F]" />
                            </button>

                            {mobileSearchOpen ? (
                                <>
                                    <input
                                        type="text"
                                        autoFocus
                                        placeholder="Search trades, artisans..."
                                        value={searchQuery}
                                        onChange={(e) =>
                                            setSearchQuery(e.target.value)
                                        }
                                        className="w-full bg-transparent text-xs text-[#3B2F2F] dark:text-[#F5F2EB] placeholder-[#5A4E4D]/70 dark:placeholder-[#A3B19F]/70 focus:outline-none"
                                    />

                                    {/* Location Selector inside 100% expanded bar */}
                                    <div className="border-l border-[#78866B]/30 pl-1 shrink-0">
                                        <LocationSelector
                                            selectedLocation={selectedLocation}
                                            onSelectLocation={
                                                setSelectedLocation
                                            }
                                            locations={locations}
                                            onNotification={onNotification}
                                            isCompact={true}
                                        />
                                    </div>

                                    {searchQuery && (
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setSearchQuery("");
                                            }}
                                            className="p-1 text-[#78866B] dark:text-[#A3B19F] hover:text-[#3B2F2F] rounded-full shrink-0"
                                            aria-label="Clear query"
                                        >
                                            <CloseIcon className="w-3.5 h-3.5" />
                                        </button>
                                    )}

                                    {/* Close button to collapse back from 100% to 30% */}
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setMobileSearchOpen(false);
                                        }}
                                        className="p-1 text-[#78866B] dark:text-[#A3B19F] hover:text-[#3B2F2F] rounded-full shrink-0"
                                        aria-label="Collapse search bar"
                                    >
                                        <CloseIcon className="w-4 h-4" />
                                    </button>
                                </>
                            ) : (
                                <span className="text-xs text-[#5A4E4D]/80 dark:text-[#C4BDB5] font-medium truncate select-none">
                                    {searchQuery ? searchQuery : "Search"}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Mobile Actions: Dark Mode Toggle & User Controls */}
                    <div
                        className={`flex items-center gap-1.5 shrink-0 transition-all duration-300 ease-in-out ${
                            mobileSearchOpen
                                ? "w-0 opacity-0 overflow-hidden pointer-events-none -ml-2"
                                : "w-auto opacity-100"
                        }`}
                    >
                        {/* Theme Toggle */}
                        <button
                            onClick={onToggleTheme}
                            className="p-2 rounded-xl bg-[#F5F2EB] dark:bg-[#2B2522] border border-[#78866B]/30 text-[#3B2F2F] dark:text-[#F5F2EB]"
                            aria-label="Toggle theme"
                        >
                            {isDark ? (
                                <SunIcon className="w-4 h-4 text-[#D97736]" />
                            ) : (
                                <MoonIcon className="w-4 h-4 text-[#78866B]" />
                            )}
                        </button>

                        {currentUser ? (
                            <button
                                onClick={onNavigateDashboard}
                                className="p-2 rounded-xl bg-[#78866B]/15 dark:bg-[#78866B]/25 border border-[#78866B]/30 text-[#3B2F2F] dark:text-[#F5F2EB]"
                                aria-label="Dashboard"
                            >
                                {currentUser.role === "artisan" ? (
                                    <HardHatIcon className="w-4 h-4 text-[#D97736]" />
                                ) : (
                                    <BriefcaseIcon className="w-4 h-4 text-[#0891B2]" />
                                )}
                            </button>
                        ) : (
                            <button
                                onClick={onOpenAuth}
                                className="px-2.5 py-2 rounded-xl bg-[#D97736] text-[#FBF9F5] font-bold text-xs shadow-xs whitespace-nowrap active:scale-95"
                            >
                                Sign In
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};
