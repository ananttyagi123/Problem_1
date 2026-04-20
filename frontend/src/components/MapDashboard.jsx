import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { Layers } from 'lucide-react';

// Fix for default marker icons in react-leaflet not showing up properly due to webpack/vite module resolution
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
    iconUrl,
    iconRetinaUrl,
    shadowUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    tooltipAnchor: [16, -28],
    shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// Custom Icons for different sources to make it a high-fidelity visual experience
const createCustomIcon = (color) => {
    return L.divIcon({
        className: 'custom-icon',
        html: `<div style="background-color: ${color}; width: 14px; height: 14px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 10px ${color};"></div>`,
        iconSize: [20, 20],
        iconAnchor: [10, 10],
        popupAnchor: [0, -10]
    });
};

const osintIcon = createCustomIcon('#3b82f6'); // blue
const humintIcon = createCustomIcon('#ef4444'); // red
const imintIcon = createCustomIcon('#eab308'); // yellow

export default function MapDashboard({ data }) {

    const getIcon = (source) => {
        switch (source) {
            case 'OSINT': return osintIcon;
            case 'HUMINT': return humintIcon;
            case 'IMINT': return imintIcon;
            default: return DefaultIcon;
        }
    };

    const getSourceColor = (source) => {
        switch (source) {
            case 'OSINT': return 'text-blue-400 border-blue-400/30 bg-blue-400/10';
            case 'HUMINT': return 'text-red-400 border-red-400/30 bg-red-400/10';
            case 'IMINT': return 'text-yellow-400 border-yellow-400/30 bg-yellow-400/10';
            default: return 'text-slate-400 border-slate-400/30 bg-slate-400/10';
        }
    };

    return (
        <div className="relative w-full h-[calc(100vh-2rem)] rounded-xl overflow-hidden border border-slate-700 shadow-2xl">
            <div className="absolute top-4 left-4 z-[400] bg-slate-900/90 backdrop-blur-md p-3 rounded-lg border border-slate-700 shadow-xl pointer-events-none">
                <h2 className="text-white font-semibold flex items-center gap-2">
                    <Layers size={18} className="text-blue-400" />
                    Tactical View
                </h2>
                <div className="mt-2 flex gap-3 text-xs">
                    <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-blue-500 border border-white"></div> OSINT</div>
                    <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-red-500 border border-white"></div> HUMINT</div>
                    <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-yellow-500 border border-white"></div> IMINT</div>
                </div>
            </div>

            <MapContainer
                center={[34.05, 65.2]}
                zoom={5}
                style={{ height: "100%", width: "100%" }}
                className="z-0"
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                />

                {data.map((item) => (
                    <Marker
                        key={item.id}
                        position={item.location}
                        icon={getIcon(item.source)}
                    >
                        <Popup className="intelligence-popup">
                            <div className="p-1 min-w-[220px]">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-bold text-slate-800 text-base leading-tight">{item.title}</h3>
                                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${getSourceColor(item.source)}`}>
                                        {item.source}
                                    </span>
                                </div>

                                <p className="text-xs text-slate-500 mb-3">{new Date(item.timestamp).toLocaleString()}</p>

                                {item.imageUrl && (
                                    <div className="w-full h-32 mb-3 rounded overflow-hidden">
                                        <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                                    </div>
                                )}

                                <p className="text-sm text-slate-700 leading-relaxed max-w-[280px]">
                                    {item.description}
                                </p>

                                {item.reliabilityScore && (
                                    <div className="mt-3 pt-2 border-t border-slate-200 flex justify-between items-center">
                                        <span className="text-xs text-slate-500 font-medium">Reliability</span>
                                        <div className="flex items-center gap-1">
                                            <span className="text-sm font-bold text-slate-800">{item.reliabilityScore}</span>
                                            <span className="text-xs text-slate-400">/ 10</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>

            {/* Global override for leaflet popups to match our dark/light theme */}
            <style>{`
        .leaflet-popup-content-wrapper {
          border-radius: 12px;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
        }
        .leaflet-popup-content {
          margin: 12px;
        }
      `}</style>
        </div>
    );
}
