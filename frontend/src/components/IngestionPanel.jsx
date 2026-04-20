import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, FileJson, Image as ImageIcon, FileSpreadsheet } from 'lucide-react';

export default function IngestionPanel({ onDataIngested }) {
    const [uploading, setUploading] = useState(false);

    const onDrop = useCallback((acceptedFiles) => {
        setUploading(true);
        // Mock processing of files
        setTimeout(() => {
            const mockNewData = acceptedFiles.map((file, i) => ({
                id: `uploaded-${Date.now()}-${i}`,
                source: file.type.includes('image') ? 'IMINT' : 'HUMINT',
                title: file.name,
                description: `Manually ingested file of size: ${(file.size / 1024).toFixed(2)} KB.`,
                location: [
                    (Math.random() * 10) + 30, // Mock lat
                    (Math.random() * 10) + 60  // Mock lng
                ],
                timestamp: new Date().toISOString(),
                imageUrl: file.type.includes('image') ? URL.createObjectURL(file) : undefined,
                reliabilityScore: Math.floor(Math.random() * 5) + 5
            }));
            onDataIngested(mockNewData);
            setUploading(false);
        }, 1000);
    }, [onDataIngested]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

    return (
        <div className="bg-slate-900 border border-slate-700 rounded-xl p-4 shadow-xl">
            <h2 className="text-xl font-semibold mb-4 text-slate-100 flex items-center gap-2">
                <UploadCloud className="text-blue-400" />
                Data Ingestion
            </h2>

            <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${isDragActive ? 'border-blue-500 bg-blue-500/10' : 'border-slate-600 hover:border-slate-500 hover:bg-slate-800'
                    }`}
            >
                <input {...getInputProps()} />
                <div className="flex justify-center mb-4 gap-3 text-slate-400">
                    <FileJson size={32} />
                    <FileSpreadsheet size={32} />
                    <ImageIcon size={32} />
                </div>
                {isDragActive ? (
                    <p className="text-blue-400 font-medium">Drop the files here ...</p>
                ) : (
                    <div>
                        <p className="text-slate-300 font-medium">Drag & drop files here, or click to select files</p>
                        <p className="text-slate-500 text-sm mt-2">Supports CSV, JSON, Excel, and JPG/JPEG imagery</p>
                    </div>
                )}
                {uploading && <p className="text-green-400 mt-4 animate-pulse">Processing files...</p>}
            </div>

            <div className="mt-6">
                <h3 className="text-sm font-medium text-slate-400 mb-2 uppercase tracking-wider">Live Integrations</h3>
                <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 bg-slate-800 rounded border border-slate-700">
                        <span className="text-sm text-slate-200">MongoDB (OSINT)</span>
                        <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">Connected</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-slate-800 rounded border border-slate-700">
                        <span className="text-sm text-slate-200">AWS S3 (OSINT)</span>
                        <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">Connected</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
