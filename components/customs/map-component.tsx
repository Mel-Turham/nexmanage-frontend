'use client';
import type React from 'react';
import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface IconDefaultWithPrivate extends L.Icon.Default {
  _getIconUrl?: () => string;
}

delete (L.Icon.Default.prototype as IconDefaultWithPrivate)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface MapMarker {
  position: [number, number];
  popup?: string;
  icon?: L.Icon;
}

interface MapComponentProps {
  center: [number, number];
  zoom?: number;
  markers?: MapMarker[];
  onMapClick?: (coordinates: [number, number]) => void;
  className?: string;
  height?: string;
}

const MapComponent: React.FC<MapComponentProps> = ({
  center,
  zoom = 13,
  markers = [],
  onMapClick,
  className = '',
  height = '300px',
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const [mapReady, setMapReady] = useState(false);

  // 🔥 CORRECTION PRINCIPALE: Initialisation de la carte avec meilleure gestion
  useEffect(() => {
    if (!mapRef.current) {
      console.log('❌ Référence du conteneur carte non disponible');
      return;
    }

    // Nettoyer la carte existante
    if (mapInstanceRef.current) {
      console.log('🧹 Nettoyage de la carte existante');
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
      setMapReady(false);
    }

    // Vérifier que le center est valide
    if (
      !center ||
      center.length !== 2 ||
      isNaN(center[0]) ||
      isNaN(center[1])
    ) {
      console.error('❌ Centre de carte invalide:', center);
      return;
    }

    try {
      console.log('🗺️ Initialisation de la carte avec centre:', center);

      // Petit délai pour s'assurer que le DOM est prêt
      const initMap = () => {
        if (!mapRef.current) return;

        const map = L.map(mapRef.current, {
          center: center,
          zoom: zoom,
          zoomControl: true,
          scrollWheelZoom: true,
          dragging: true,
          touchZoom: true,
          doubleClickZoom: true,
          // 🔥 CORRECTION: Options d'interaction améliorées
          boxZoom: true,
          keyboard: true,
        });

        // 🔥 CORRECTION: Couche de tuiles avec gestion d'erreur
        const tileLayer = L.tileLayer(
          'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
          {
            attribution:
              '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            maxZoom: 19,
            errorTileUrl:
              'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==', // Pixel transparent
          }
        );

        tileLayer.addTo(map);

        // 🔥 CORRECTION: Gestionnaire de clic avec validation
        if (onMapClick) {
          map.on('click', (e: L.LeafletMouseEvent) => {
            const coordinates: [number, number] = [e.latlng.lat, e.latlng.lng];
            console.log('🖱️ Clic sur la carte:', coordinates);

            // Validation des coordonnées avant callback
            if (!isNaN(coordinates[0]) && !isNaN(coordinates[1])) {
              onMapClick(coordinates);
            } else {
              console.error('❌ Coordonnées invalides du clic:', coordinates);
            }
          });
        }

        // 🔥 CORRECTION: Événements de debug
        map.on('zoomend', () => {
          console.log('🔍 Zoom changé:', map.getZoom());
        });

        map.on('moveend', () => {
          console.log('📍 Centre changé:', map.getCenter());
        });

        map.on('ready', () => {
          console.log('✅ Carte prête');
          setMapReady(true);
        });

        map.on('error', (error) => {
          console.error('❌ Erreur carte:', error);
        });

        mapInstanceRef.current = map;

        // 🔥 CORRECTION: Redimensionnement avec retry
        const resizeMap = () => {
          if (mapInstanceRef.current) {
            try {
              mapInstanceRef.current.invalidateSize();
              console.log('✅ Carte redimensionnée');
              setMapReady(true);
            } catch (error) {
              console.error('❌ Erreur redimensionnement:', error);
            }
          }
        };

        // Plusieurs tentatives de redimensionnement
        setTimeout(resizeMap, 100);
        setTimeout(resizeMap, 500);
        setTimeout(resizeMap, 1000);
      };

      // Petite temporisation pour l'initialisation
      setTimeout(initMap, 50);
    } catch (error) {
      console.error("❌ Erreur lors de l'initialisation de la carte:", error);
    }

    return () => {
      // Cleanup
      console.log('🧹 Nettoyage des ressources carte');

      markersRef.current.forEach((marker) => {
        try {
          if (mapInstanceRef.current) {
            mapInstanceRef.current.removeLayer(marker);
          }
        } catch (error) {
          console.error('❌ Erreur suppression marker:', error);
        }
      });
      markersRef.current = [];

      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.remove();
        } catch (error) {
          console.error('❌ Erreur suppression carte:', error);
        }
        mapInstanceRef.current = null;
      }
      setMapReady(false);
    };
  }, []); // Pas de center dans les dépendances pour éviter les re-créations

  // 🔥 CORRECTION: Effet séparé pour mettre à jour le centre et le zoom
  useEffect(() => {
    if (!mapInstanceRef.current || !mapReady) {
      console.log('⏳ Carte pas encore prête pour mise à jour centre');
      return;
    }

    if (
      center &&
      center.length === 2 &&
      !isNaN(center[0]) &&
      !isNaN(center[1])
    ) {
      console.log('🎯 Mise à jour du centre de la carte:', center);

      try {
        mapInstanceRef.current.setView(center, zoom, {
          animate: true,
          duration: 0.5,
        });

        // Forcer le redimensionnement après changement de vue
        setTimeout(() => {
          if (mapInstanceRef.current) {
            mapInstanceRef.current.invalidateSize();
          }
        }, 100);
      } catch (error) {
        console.error('❌ Erreur mise à jour centre:', error);
      }
    } else {
      console.warn('⚠️ Centre invalide pour mise à jour:', center);
    }
  }, [center, zoom, mapReady]);

  // 🔥 CORRECTION: Gestion des markers avec validation renforcée
  useEffect(() => {
    if (!mapInstanceRef.current || !mapReady) {
      console.log('⏳ Carte pas encore prête pour markers');
      return;
    }

    console.log('📍 Mise à jour des markers:', markers);

    // Supprimer les anciens markers
    markersRef.current.forEach((marker) => {
      try {
        mapInstanceRef.current?.removeLayer(marker);
      } catch (error) {
        console.error('❌ Erreur suppression marker:', error);
      }
    });
    markersRef.current = [];

    // Ajouter les nouveaux markers
    markers.forEach((markerData, index) => {
      if (
        mapInstanceRef.current &&
        markerData.position &&
        markerData.position.length === 2
      ) {
        const [lat, lng] = markerData.position;
        if (!isNaN(lat) && !isNaN(lng)) {
          try {
            const marker = L.marker([lat, lng], {
              icon: markerData.icon || new L.Icon.Default(),
            }).addTo(mapInstanceRef.current);

            if (markerData.popup) {
              marker.bindPopup(markerData.popup);
            }

            markersRef.current.push(marker);
            console.log(`✅ Marker ${index + 1} ajouté:`, [lat, lng]);
          } catch (error) {
            console.error(`❌ Erreur ajout marker ${index + 1}:`, error);
          }
        } else {
          console.warn(
            `⚠️ Coordonnées invalides pour marker ${index + 1}:`,
            markerData.position
          );
        }
      }
    });
  }, [markers, mapReady]);

  // 🔥 CORRECTION: Observer les changements de taille avec debounce
  useEffect(() => {
    if (!mapInstanceRef.current || !mapRef.current) return;

    let resizeTimeout: NodeJS.Timeout;

    const resizeObserver = new ResizeObserver(() => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        if (mapInstanceRef.current) {
          try {
            mapInstanceRef.current.invalidateSize();
            console.log('📏 Carte redimensionnée via observer');
          } catch (error) {
            console.error('❌ Erreur redimensionnement observer:', error);
          }
        }
      }, 100);
    });

    resizeObserver.observe(mapRef.current);

    return () => {
      clearTimeout(resizeTimeout);
      resizeObserver.disconnect();
    };
  }, [mapReady]);

  return (
    <div className='relative'>
      {/* 🔥 AJOUT: Indicateur de statut */}
      {!mapReady && (
        <div className='absolute inset-0 bg-gray-100 flex items-center justify-center z-10 rounded-lg'>
          <div className='text-gray-500 text-sm'>Chargement de la carte...</div>
        </div>
      )}

      <div
        ref={mapRef}
        className={className}
        style={{
          height,
          width: '100%',
          minHeight: '200px',
          position: 'relative',
          zIndex: 1,
          // 🔥 CORRECTION: Styles pour assurer la visibilité
          backgroundColor: '#f5f5f5',
        }}
      />

      {/* 🔥 AJOUT: Debug info en mode développement */}
      {process.env.NODE_ENV === 'development' && (
        <div className='absolute top-2 right-2 bg-black bg-opacity-75 text-white text-xs p-2 rounded z-20'>
          <div>Prête: {mapReady ? '✅' : '❌'}</div>
          <div>
            Centre: {center[0].toFixed(4)}, {center[1].toFixed(4)}
          </div>
          <div>Markers: {markers.length}</div>
        </div>
      )}
    </div>
  );
};

export default MapComponent;
