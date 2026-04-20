import { useState } from 'react';
import MapDashboard from './components/MapDashboard';
import IngestionPanel from './components/IngestionPanel';
import { Shield, Activity, Database, Radar } from 'lucide-react';

const mockInitialData = [
    {
        id: 'osint-mongo-1',
        source: 'OSINT',
        title: 'Suspicious Domain Registered',
        description: 'A new domain closely resembling secure-logins.gov was registered in the region.',
        location: [35.5, 65.0],
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        reliabilityScore: 8
    },
    {
        id: 's3-imint-1',
        source: 'IMINT',
        title: 'Satellite Pass: Sector Charlie',
        description: 'High-res satellite pass shows increased vehicular movement associated with unnamed facilities.',
        location: [33.1, 66.5],
        timestamp: new Date(Date.now() - 86400000).toISOString(),
        imageUrl: 'https://images.unsplash.com/photo-1541888056-11f44aa7d976?auto=format&fit=crop&q=80',
        reliabilityScore: 9
    },
    {
        id: 'humint-1',
        source: 'HUMINT',
        title: 'Field Operative Report 44A',
        description: 'Informant reports unmarked cargo transports observed at coordinate location during nocturnal hours.',
        location: [34.8, 64.2],
        timestamp: new Date(Date.now() - 43200000).toISOString(),
        reliabilityScore: 6
    }
];

function App() {
    const [data, setData] = useState(mockInitialData);

    const handleDataIngested = (newData) => {
        setData((prev) => [...prev, ...newData]);
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 font-sans flex flex-col">
            <header className="bg-slate-900 border-b border-slate-800 p-4 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="bg-blue-500 p-2 rounded-lg">
                            <Radar className="text-white" size={24} />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-white tracking-tight">Strategic Fusion</h1>
                            <p className="text-xs text-blue-400 font-medium tracking-widest uppercase">Multi-Source Intelligence Dashboard</p>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <div className="flex items-center gap-2 bg-slate-800 px-3 py-1.5 rounded-full border border-slate-700">
                            <Activity size={14} className="text-green-400" />
                            <span className="text-sm font-medium text-slate-300">System Nominal</span>
                        </div>
                        <div className="flex items-center gap-2 bg-slate-800 px-3 py-1.5 rounded-full border border-slate-700">
                            <Database size={14} className="text-blue-400" />
                            <span className="text-sm font-medium text-slate-300">{data.length} Nodes</span>
                        </div>
                        <div className="flex items-center gap-2 bg-slate-800 px-3 py-1.5 rounded-full border border-slate-700">
                            <Shield size={14} className="text-red-400" />
                            <span className="text-sm font-medium text-slate-300">Classified</span>
                        </div>
                    </div>
                </div>
            </header>

            <main className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-1 flex flex-col gap-6">
                    <IngestionPanel onDataIngested={handleDataIngested} />

                    <div className="bg-slate-900 border border-slate-700 rounded-xl p-4 shadow-xl flex-1 flex flex-col">
                        <h3 className="text-lg font-semibold mb-4 text-slate-100 border-b border-slate-800 pb-2">Recent Intel Stream</h3>
                        <div className="flex flex-col gap-3 overflow-y-auto flex-1 pr-2">
                            {[...data].reverse().map(item => (
                                <div key={item.id} className="p-3 bg-slate-800/50 rounded border border-slate-700/50 hover:border-slate-600 transition-colors cursor-default">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className={`text-[10px] font-bold uppercase rounded px-1.5 py-0.5 ${item.source === 'OSINT' ? 'text-blue-400 bg-blue-400/10 border border-blue-400/20' :
                                                item.source === 'HUMINT' ? 'text-red-400 bg-red-400/10 border border-red-400/20' :
                                                    'text-yellow-400 bg-yellow-400/10 border border-yellow-400/20'
                                            }`}>{item.source}</span>
                                        <span className="text-[10px] text-slate-500">{new Date(item.timestamp).toLocaleTimeString()}</span>
                                    </div>
                                    <h4 className="text-sm font-medium text-slate-200 leading-tight mb-1">{item.title}</h4>
                                    <p className="text-xs text-slate-400 truncate">{item.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-3">
                    <MapDashboard data={data} />
                </div>
            </main>
        </div>
    );
}

export default App;
