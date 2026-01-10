"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix for default marker icons in Next.js
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
    iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

interface Location {
    id: string;
    lat: number;
    lng: number;
    name: string;
    type?: "driver" | "accident" | "hub";
}

interface MapProps {
    locations: Location[];
    center?: [number, number];
    zoom?: number;
    className?: string;
}

const LeafletMap = ({ locations, center = [20.5937, 78.9629], zoom = 5, className = "h-full w-full" }: MapProps) => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <div className={`flex items-center justify-center bg-[#0a0a0a] text-[#333] ${className}`}>
                <span className="animate-pulse">LOADING_MAP_DATA...</span>
            </div>
        );
    }

    // Tech/Dark Map Style (CartoDB Dark Matter)
    return (
        <MapContainer center={center} zoom={zoom} scrollWheelZoom={false} className={`${className} z-0`}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            />

            {locations.map((loc) => (
                <div key={loc.id}>
                    {loc.type === 'accident' && (
                        <Circle
                            center={[loc.lat, loc.lng]}
                            radius={500}
                            pathOptions={{ color: '#ef4444', fillColor: '#ef4444', fillOpacity: 0.2 }}
                        />
                    )}
                    <Marker position={[loc.lat, loc.lng]}>
                        <Popup>
                            <div className="font-mono text-xs">
                                <strong>{loc.name}</strong>
                                <br />
                                TYPE: {loc.type?.toUpperCase() || 'UNKNOWN'}
                                <br />
                                LAT: {loc.lat.toFixed(4)}
                                <br />
                                LNG: {loc.lng.toFixed(4)}
                            </div>
                        </Popup>
                    </Marker>
                </div>
            ))}
        </MapContainer>
    );
};

export default LeafletMap;
