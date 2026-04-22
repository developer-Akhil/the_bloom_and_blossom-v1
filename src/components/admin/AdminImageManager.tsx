import React, { useState } from 'react';
import { useMediaManager, MediaFolder, MediaAsset } from '../../lib/mediaManager';
import { Folder, FolderPlus, Upload, Trash2, ShieldAlert, Image as ImageIcon, CheckCircle2, ChevronRight, X } from 'lucide-react';
import { OptimizedImage } from '../common/OptimizedImage';

export function AdminImageManager() {
  const { folders, allAssets, createFolder, deleteFolder, uploadImage, toggleImageActive } = useMediaManager();
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [newFolderName, setNewFolderName] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const activeFolderData = folders.find(f => f.id === selectedFolder);
  const currentAssets = allAssets.filter(a => a.folder_id === selectedFolder);

  const handleCreateFolder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;
    try {
      await createFolder(newFolderName, 'collections');
      setNewFolderName('');
      setErrorMsg(null);
    } catch (err: any) {
      setErrorMsg(err.message);
    }
  };

  const handleDeleteFolder = async (folderId: string) => {
    try {
      await deleteFolder(folderId);
      if (selectedFolder === folderId) setSelectedFolder(null);
      setErrorMsg(null);
    } catch (err: any) {
      setErrorMsg(err.message);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!selectedFolder) return;
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Quick validation
    if (!file.type.startsWith('image/')) {
       setErrorMsg("Please upload a valid image file.");
       return;
    }

    try {
      await uploadImage(selectedFolder, file);
      setErrorMsg(null);
    } catch (err: any) {
      setErrorMsg(err.message);
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-8 bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 min-h-[600px]">
      
      {/* Sidebar: Folder Structure */}
      <div className="w-full md:w-1/3 border-r border-gray-100 pr-6 space-y-6">
        <h3 className="font-serif text-xl font-bold">Media Library</h3>
        
        <div className="space-y-4">
           {/* Render Top Level Folders */}
           {folders.filter(f => !f.parent).map(baseFolder => (
             <div key={baseFolder.id} className="space-y-1">
               <button 
                 onClick={() => setSelectedFolder(baseFolder.id)}
                 className={`w-full flex items-center space-x-2 px-3 py-2 rounded-xl transition-all ${selectedFolder === baseFolder.id ? 'bg-bloom-rose text-white shadow-md' : 'hover:bg-gray-50 text-gray-700'}`}
               >
                 <Folder size={16} />
                 <span className="font-medium text-sm flex-1 text-left">{baseFolder.name}</span>
               </button>

               {/* Render Subfolders if target is 'collections' */}
               {baseFolder.id === 'collections' && (
                 <div className="pl-6 space-y-1 mt-1 border-l-2 border-gray-100 ml-4">
                   {folders.filter(f => f.parent === 'collections').map(subFolder => (
                     <div key={subFolder.id} className="flex items-center group">
                       <button 
                         onClick={() => setSelectedFolder(subFolder.id)}
                         className={`w-full flex items-center space-x-2 px-3 py-1.5 rounded-lg transition-all ${selectedFolder === subFolder.id ? 'bg-bloom-pink text-bloom-rose' : 'hover:bg-gray-50 text-gray-600'}`}
                       >
                         <ChevronRight size={14} className="opacity-50" />
                         <span className="text-xs font-medium flex-1 text-left">{subFolder.name}</span>
                       </button>
                       {!subFolder.isSystem && (
                         <button 
                           onClick={() => handleDeleteFolder(subFolder.id)}
                           className="p-1.5 text-red-400 opacity-0 group-hover:opacity-100 hover:bg-red-50 rounded transition-all"
                           title="Delete subfolder"
                         >
                           <Trash2 size={12} />
                         </button>
                       )}
                     </div>
                   ))}
                   
                   {/* Create new subfolder input */}
                   <form onSubmit={handleCreateFolder} className="mt-2 flex items-center px-3 space-x-2">
                     <FolderPlus size={14} className="text-gray-400" />
                     <input 
                       value={newFolderName}
                       onChange={e => setNewFolderName(e.target.value)}
                       placeholder="New folder..."
                       className="w-full text-xs bg-transparent border-b border-gray-200 outline-none pb-1 focus:border-bloom-rose"
                     />
                   </form>
                 </div>
               )}
             </div>
           ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="w-full md:w-2/3 flex flex-col">
        {errorMsg && (
          <div className="flex items-center space-x-2 p-3 bg-red-50 text-red-600 rounded-xl text-sm mb-6 border border-red-100">
            <ShieldAlert size={16} />
            <span>{errorMsg}</span>
            <button className="ml-auto" onClick={() => setErrorMsg(null)}><X size={14} /></button>
          </div>
        )}

        {!selectedFolder ? (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400 space-y-4">
            <Folder size={48} className="opacity-20" />
            <p>Select a folder to view and manage media</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-between items-end pb-4 border-b border-gray-100">
              <div>
                <h4 className="font-serif flex items-center space-x-2 text-xl font-bold">
                  <span>{activeFolderData?.parent ? `${activeFolderData.parent} / ` : ''}</span>
                  <span className="text-bloom-rose">{activeFolderData?.name}</span>
                </h4>
                <p className="text-sm text-gray-500 mt-1">
                  {activeFolderData?.isSystem ? 'System Folder (Structure Locked)' : 'Custom Collection Folder'}
                </p>
              </div>

              <div>
                <input 
                  type="file" 
                  id="media-upload" 
                  className="hidden" 
                  accept="image/*"
                  onChange={handleFileUpload}
                />
                <label 
                  htmlFor="media-upload" 
                  className="flex items-center space-x-2 px-4 py-2 bg-bloom-rose text-white rounded-full font-medium text-sm hover:bg-bloom-rose/90 transition-all cursor-pointer shadow-sm"
                >
                  <Upload size={16} />
                  <span>Upload Image</span>
                </label>
              </div>
            </div>

            {/* Asset Grid */}
            {currentAssets.length === 0 ? (
              <div className="py-20 text-center text-gray-400 border-2 border-dashed border-gray-100 rounded-3xl">
                <ImageIcon size={32} className="mx-auto mb-3 opacity-30" />
                <p>No images in this folder yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {currentAssets.map(asset => (
                  <div key={asset.id} className={`group relative aspect-square rounded-2xl overflow-hidden border-2 transition-all ${asset.is_active ? 'border-transparent hover:border-gray-200' : 'border-red-200 bg-red-50 opacity-60'}`}>
                    <img 
                      src={asset.file_url} 
                      alt={asset.file_name} 
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Overlay controls */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3">
                      <div className="flex justify-end">
                        <button 
                          onClick={() => toggleImageActive(asset.id)}
                          className={`p-2 rounded-full shadow cursor-pointer transition-colors ${asset.is_active ? 'bg-white text-red-500 hover:bg-red-50' : 'bg-green-500 text-white hover:bg-green-600'}`}
                          title={asset.is_active ? "Soft Delete (Deactivate)" : "Restore Asset"}
                        >
                          {asset.is_active ? <Trash2 size={16} /> : <CheckCircle2 size={16} />}
                        </button>
                      </div>
                      <div>
                        {/* Status badge */}
                        <div className="inline-block px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded bg-black/50 text-white backdrop-blur-md">
                          {asset.is_active ? 'Active' : 'Soft Deleted'}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
