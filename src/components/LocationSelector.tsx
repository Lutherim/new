import React, { useState, useRef, useEffect } from 'react';
import { 
  MapPinIcon, 
  LocateFixedIcon, 
  Loader2Icon, 
  ChevronDownIcon, 
  CheckIcon 
} from '../icons';

interface LocationSelectorProps {
  selectedLocation: string;
  onSelectLocation: (loc: string) => void;
  locations: string[];
  onNotification?: (msg: string) => void;
  isCompact?: boolean;
}

// Known coordinate hubs for city proximity matching
const CITY_COORDINATES: Record<string, { lat: number; lon: number }> = {
  'Midrand': { lat: -25.9992, lon: 28.1263 },
  'Johannesburg': { lat: -26.2041, lon: 28.0473 },
  'Sandton': { lat: -26.1076, lon: 28.0567 },
  'Pretoria': { lat: -25.7479, lon: 28.2293 },
  'Centurion': { lat: -25.8603, lon: 28.1895 },
  'Cape Town': { lat: -33.9249, lon: 18.4241 },
  'Durban': { lat: -29.8587, lon: 31.0218 },
};

function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export const LocationSelector: React.FC<LocationSelectorProps> = ({
  selectedLocation,
  onSelectLocation,
  locations,
  onNotification,
  isCompact = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Use browser Geolocation API
  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      onNotification?.('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          // Attempt reverse geocoding to resolve exact city / locality name
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 4000);

          let detectedCityName = '';

          try {
            const res = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10&addressdetails=1`,
              {
                signal: controller.signal,
                headers: {
                  'Accept-Language': 'en'
                }
              }
            );
            clearTimeout(timeoutId);

            if (res.ok) {
              const data = await res.json();
              const addr = data.address || {};
              detectedCityName =
                addr.city ||
                addr.town ||
                addr.municipality ||
                addr.suburb ||
                addr.county ||
                '';
            }
          } catch (e) {
            // Reverse geocode timed out or blocked - fall back to proximity distance
          }

          // Check if detected city matches our directory locations
          const matchedLocation = locations.find(
            (loc) =>
              loc !== 'All Locations' &&
              detectedCityName.toLowerCase().includes(loc.toLowerCase())
          );

          if (matchedLocation) {
            onSelectLocation(matchedLocation);
            onNotification?.(`📍 Location detected: ${matchedLocation}`);
            setIsOpen(false);
            setIsLocating(false);
            return;
          }

          // Find closest supported hub by geographic coordinates
          let closestCity = 'Johannesburg';
          let minDistance = Infinity;

          Object.entries(CITY_COORDINATES).forEach(([city, coords]) => {
            const distance = calculateDistanceKm(latitude, longitude, coords.lat, coords.lon);
            if (distance < minDistance) {
              minDistance = distance;
              closestCity = city;
            }
          });

          onSelectLocation(closestCity);
          const distanceMsg = minDistance < 50 
            ? `📍 Located near ${closestCity}` 
            : `📍 Nearest artisan hub: ${closestCity} (${Math.round(minDistance)}km)`;
          onNotification?.(distanceMsg);
          setIsOpen(false);
        } catch (err) {
          onNotification?.('Unable to determine location name. Selected Johannesburg.');
          onSelectLocation('Johannesburg');
        } finally {
          setIsLocating(false);
        }
      },
      (error) => {
        setIsLocating(false);
        let errorMsg = 'Could not retrieve your location.';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMsg = 'Location permission was denied. Please select your city manually.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMsg = 'Location information is unavailable.';
            break;
          case error.TIMEOUT:
            errorMsg = 'Location request timed out. Please try again.';
            break;
        }
        onNotification?.(errorMsg);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      
      {/* Dropdown Trigger */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-1.5 rounded-lg text-xs font-semibold transition-all focus:outline-none ${
          isCompact
            ? 'px-2 py-1 bg-transparent hover:bg-[#F5F2EB] dark:hover:bg-[#2B2522] text-[#3B2F2F] dark:text-[#F5F2EB]'
            : 'px-2.5 py-1.5 bg-[#F5F2EB] dark:bg-[#2B2522] hover:bg-[#EAE4D7] dark:hover:bg-[#362F2C] border border-[#78866B]/30 dark:border-[#78866B]/40 text-[#3B2F2F] dark:text-[#F5F2EB]'
        }`}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <MapPinIcon className="w-3.5 h-3.5 text-[#0891B2] shrink-0" />
        <span className="truncate max-w-[110px] sm:max-w-[140px]">
          {selectedLocation}
        </span>
        <ChevronDownIcon
          className={`w-3.5 h-3.5 text-[#78866B] dark:text-[#A3B19F] transition-transform duration-200 shrink-0 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 sm:left-0 sm:right-auto mt-2 w-64 rounded-2xl bg-[#FBF9F5] dark:bg-[#231F1D] border border-[#78866B]/30 dark:border-[#78866B]/40 shadow-xl z-50 overflow-hidden animate-fadeIn">
          
          {/* Action: Use Current Location */}
          <div className="p-2 border-b border-[#78866B]/15 dark:border-[#78866B]/30 bg-[#F5F2EB]/60 dark:bg-[#2B2522]/60">
            <button
              type="button"
              onClick={handleUseCurrentLocation}
              disabled={isLocating}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold text-[#0891B2] hover:bg-[#0891B2]/10 transition-colors group text-left disabled:opacity-60"
            >
              {isLocating ? (
                <Loader2Icon className="w-4 h-4 text-[#0891B2] animate-spin shrink-0" />
              ) : (
                <div className="w-6 h-6 rounded-lg bg-[#0891B2]/15 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <LocateFixedIcon className="w-3.5 h-3.5 text-[#0891B2]" />
                </div>
              )}
              <div className="flex flex-col">
                <span className="leading-tight">
                  {isLocating ? 'Detecting your city...' : 'Use current location'}
                </span>
                <span className="text-[10px] font-normal text-[#5A4E4D] dark:text-[#A3B19F]">
                  {isLocating ? 'Querying GPS...' : 'Auto-filter nearest artisans'}
                </span>
              </div>
            </button>
          </div>

          {/* City List Header */}
          <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#78866B] dark:text-[#A3B19F] bg-[#FBF9F5] dark:bg-[#231F1D]">
            Select Location
          </div>

          {/* Cities List */}
          <div className="max-h-60 overflow-y-auto p-1.5 space-y-0.5">
            {locations.map((loc) => {
              const isSelected = selectedLocation === loc;
              return (
                <button
                  key={loc}
                  type="button"
                  onClick={() => {
                    onSelectLocation(loc);
                    setIsOpen(false);
                    onNotification?.(
                      loc === 'All Locations'
                        ? 'Showing artisans from all regions'
                        : `Filtered to ${loc}`
                    );
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors text-left ${
                    isSelected
                      ? 'bg-[#3B2F2F] dark:bg-[#D97736] text-[#FBF9F5]'
                      : 'text-[#3B2F2F] dark:text-[#F5F2EB] hover:bg-[#F5F2EB] dark:hover:bg-[#2B2522]'
                  }`}
                >
                  <span className="truncate">{loc}</span>
                  {isSelected && (
                    <CheckIcon className="w-3.5 h-3.5 text-[#0891B2] dark:text-white shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

        </div>
      )}

    </div>
  );
};
