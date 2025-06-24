'use client';

import type React from 'react';
import { useState, useEffect, useRef } from 'react';
import { X, Loader2, ChevronDown, MapPin } from 'lucide-react';

interface LocationSuggestion {
  display_name: string;
  lat: string;
  lon: string;
  place_id: string;
  type: string;
  importance: number;
  class?: string;
}

interface LocationSelectorProps {
  value: string;
  onSelect: (name: string, coordinates: number[]) => void;
  onBlur?: () => void;
  placeholder?: string;
  className?: string;
  name?: string;
  disabled?: boolean;
}

const LocationSelector: React.FC<LocationSelectorProps> = ({
  value,
  onSelect,
  onBlur,
  placeholder = 'Rechercher une ville ou un pays...',
  className = '',
  name,
  disabled = false,
}) => {
  const [query, setQuery] = useState<string>(value);
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // API Nominatim améliorée pour recherche globale
  const searchLocations = async (
    searchQuery: string
  ): Promise<LocationSuggestion[]> => {
    if (!searchQuery.trim() || searchQuery.length < 2) return [];

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?` +
          new URLSearchParams({
            q: searchQuery,
            format: 'json',
            addressdetails: '1',
            limit: '10',
            'accept-language': 'fr,en',
            countrycodes: '',
          })
      );

      if (!response.ok) throw new Error('Erreur réseau');

      const data: LocationSuggestion[] = await response.json();

      return data
        .filter((item) => {
          const displayName = item.display_name.toLowerCase();
          const itemType = item.type?.toLowerCase() || '';
          const itemClass = item.class?.toLowerCase() || '';

          return (
            itemType === 'city' ||
            itemType === 'town' ||
            itemType === 'village' ||
            itemType === 'municipality' ||
            itemType === 'administrative' ||
            itemType === 'hamlet' ||
            itemType === 'suburb' ||
            itemType === 'county' ||
            itemType === 'state' ||
            itemClass === 'place' ||
            itemClass === 'boundary' ||
            displayName.includes('city') ||
            displayName.includes('ville') ||
            displayName.includes('town')
          );
        })
        .sort((a, b) => {
          const importanceA = Number.parseFloat(
            a.importance?.toString() || '0'
          );
          const importanceB = Number.parseFloat(
            b.importance?.toString() || '0'
          );

          if (importanceB !== importanceA) {
            return importanceB - importanceA;
          }

          const priorityA = getPriority(a.type);
          const priorityB = getPriority(b.type);

          return priorityB - priorityA;
        })
        .slice(0, 8);
    } catch (error) {
      console.error('Erreur lors de la recherche de localisation:', error);
      return [];
    }
  };

  const getPriority = (type: string): number => {
    const typePriorities: { [key: string]: number } = {
      city: 10,
      town: 9,
      municipality: 8,
      village: 7,
      administrative: 6,
      county: 5,
      state: 4,
      hamlet: 3,
      suburb: 2,
    };
    return typePriorities[type?.toLowerCase()] || 1;
  };

  // Debounce de la recherche
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (query.trim().length >= 2) {
      setIsLoading(true);
      debounceRef.current = setTimeout(async () => {
        const results = await searchLocations(query);
        setSuggestions(results);
        setIsLoading(false);
        setShowSuggestions(true);
      }, 300);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
      setIsLoading(false);
    }

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [query]);

  // Synchroniser query avec value prop
  useEffect(() => {
    setQuery(value);
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setQuery(newValue);
    setSelectedIndex(-1);
  };

  // 🔥 CORRECTION PRINCIPALE: Gestion améliorée du clic sur suggestion
  const handleSuggestionClick = (suggestion: LocationSuggestion) => {
    // Conversion des coordonnées en nombres
    const lat = parseFloat(suggestion.lat);
    const lon = parseFloat(suggestion.lon);

    // Vérification de la validité des coordonnées
    if (isNaN(lat) || isNaN(lon)) {
      console.error('Coordonnées invalides:', suggestion.lat, suggestion.lon);
      return;
    }

    const coordinates = [lat, lon];
    const locationName = suggestion.display_name.split(',')[0].trim();

    console.log('🎯 Sélection de lieu:', {
      name: locationName,
      coordinates: coordinates,
      original: suggestion,
    });

    // Mise à jour de l'état local
    setQuery(locationName);
    setShowSuggestions(false);
    setSelectedIndex(-1);

    // Appel du callback avec les bonnes coordonnées
    onSelect(locationName, coordinates);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          handleSuggestionClick(suggestions[selectedIndex]);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const handleClear = () => {
    setQuery('');
    setSuggestions([]);
    setShowSuggestions(false);
    setSelectedIndex(-1);
    inputRef.current?.focus();
  };

  // 🔥 CORRECTION: Gestion améliorée du onBlur
  const handleBlur = () => {
    // Délai pour permettre le clic sur les suggestions
    setTimeout(() => {
      setShowSuggestions(false);
      setSelectedIndex(-1);
      onBlur?.();
    }, 200);
  };

  const formatDisplayName = (displayName: string) => {
    const parts = displayName.split(',').map((part) => part.trim());
    const mainLocation = parts[0];

    let context = '';
    if (parts.length > 1) {
      const contextParts = parts
        .slice(1, 4)
        .filter((part) => !part.match(/^\d/) && part.length > 2);
      context = contextParts.join(', ');
    }

    return {
      main: mainLocation,
      context: context,
    };
  };

  const getLocationIcon = (type: string, className: string) => {
    const iconClass = `${className} flex-shrink-0`;

    switch (type?.toLowerCase()) {
      case 'city':
      case 'town':
      case 'municipality':
        return <MapPin size={16} className={`${iconClass} text-blue-500`} />;
      case 'village':
      case 'hamlet':
        return <MapPin size={16} className={`${iconClass} text-green-500`} />;
      case 'administrative':
      case 'county':
      case 'state':
        return <MapPin size={16} className={`${iconClass} text-purple-500`} />;
      default:
        return <MapPin size={16} className={`${iconClass} text-gray-400`} />;
    }
  };

  return (
    <div className='relative w-full'>
      <div className='relative'>
        <input
          ref={inputRef}
          type='text'
          name={name}
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
          onBlur={handleBlur}
          placeholder={placeholder}
          disabled={disabled}
          className={`
            w-full h-11 pl-10 pr-10 py-2 
            border rounded-lg
            focus:outline-none transition-colors
            disabled:bg-gray-100 disabled:cursor-not-allowed
            border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20
            ${className}
          `}
          autoComplete='off'
        />

        <MapPin
          size={16}
          className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400'
        />

        <div className='absolute right-3 top-1/2 transform -translate-y-1/2'>
          {isLoading ? (
            <Loader2 size={16} className='animate-spin text-gray-400' />
          ) : query ? (
            <button
              type='button'
              onClick={handleClear}
              className='p-1 hover:bg-gray-100 rounded-full transition-colors'
            >
              <X size={14} className='text-gray-400 hover:text-gray-600' />
            </button>
          ) : (
            <ChevronDown size={16} className='text-gray-400' />
          )}
        </div>
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <div className='absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-80 overflow-y-auto'>
          {suggestions.map((suggestion, index) => {
            const { main, context } = formatDisplayName(
              suggestion.display_name
            );
            const isSelected = index === selectedIndex;

            return (
              <div
                key={suggestion.place_id}
                ref={(el) => {
                  suggestionRefs.current[index] = el;
                }}
                className={`
                  px-4 py-3 cursor-pointer transition-colors
                  flex items-start gap-3
                  ${
                    isSelected
                      ? 'bg-blue-50 border-l-2 border-blue-500'
                      : 'hover:bg-gray-50'
                  }
                  ${
                    index === suggestions.length - 1
                      ? ''
                      : 'border-b border-gray-100'
                  }
                `}
                onClick={() => handleSuggestionClick(suggestion)}
                // 🔥 CORRECTION: Empêcher la propagation du blur
                onMouseDown={(e) => e.preventDefault()}
              >
                {getLocationIcon(suggestion.type, 'mt-0.5')}
                <div className='flex-1 min-w-0'>
                  <div className='font-medium text-gray-900 truncate'>
                    {main}
                  </div>
                  {context && (
                    <div className='text-sm text-gray-500 truncate'>
                      {context}
                    </div>
                  )}
                  {suggestion.type && (
                    <div className='text-xs text-gray-400 mt-1 capitalize'>
                      {suggestion.type === 'administrative'
                        ? 'Région'
                        : suggestion.type === 'city'
                        ? 'Ville'
                        : suggestion.type === 'town'
                        ? 'Ville'
                        : suggestion.type === 'village'
                        ? 'Village'
                        : suggestion.type === 'county'
                        ? 'Comté'
                        : suggestion.type === 'state'
                        ? 'État'
                        : suggestion.type}
                    </div>
                  )}
                  {/* 🔥 AJOUT: Affichage des coordonnées pour debug */}
                  <div className='text-xs text-gray-300 mt-1'>
                    {parseFloat(suggestion.lat).toFixed(4)},{' '}
                    {parseFloat(suggestion.lon).toFixed(4)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showSuggestions &&
        suggestions.length === 0 &&
        query.length >= 2 &&
        !isLoading && (
          <div className='absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg'>
            <div className='px-4 py-3 text-sm text-gray-500 text-center'>
              Aucun lieu trouvé pour &apos;{query}&apos;
            </div>
          </div>
        )}
    </div>
  );
};

export default LocationSelector;
