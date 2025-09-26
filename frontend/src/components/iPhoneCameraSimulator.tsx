import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AiOutlineZoomIn,
  AiOutlineZoomOut
} from 'react-icons/ai';
import { 
  MdFlashOff,
  MdFlashOn,
  MdFlashAuto
} from 'react-icons/md';
import { 
  HiOutlineCog
} from 'react-icons/hi';
import bg1Image from '../assets/images/bg1.webp';

interface CameraSettings {
  iso: number;
  aperture: number;
  exposure: number;
  zoom: number;
  flashMode: 'off' | 'on' | 'auto';
}

interface CapturedPhoto {
  id: string;
  imageUrl: string;
  settings: CameraSettings;
  timestamp: Date;
}

const defaultSettings: CameraSettings = {
  iso: 500,
  aperture: 2.5,
  exposure: 0,
  zoom: 1,
  flashMode: 'off'
};

export default function IPhoneCameraSimulator() {
  const [settings, setSettings] = useState<CameraSettings>(defaultSettings);
  const [showControls, setShowControls] = useState(true);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [customBackground, setCustomBackground] = useState<string | null>(null);
  const [photoGallery, setPhotoGallery] = useState<CapturedPhoto[]>([]);
  const [fullscreenPhoto, setFullscreenPhoto] = useState<CapturedPhoto | null>(null);

  // Calculate image effects based on settings
  const getImageEffects = () => {
    const brightness = Math.max(0.3, Math.min(1.5, 1 + (settings.exposure * 0.3)));
    const blur = settings.aperture < 2.0 ? 2 : 0;
    const noise = settings.iso > 400 ? Math.min(0.3, (settings.iso - 400) / 1000) : 0;
    
    return {
      filter: `brightness(${brightness}) blur(${blur}px)`,
      opacity: Math.max(0.5, Math.min(1, 1 - noise))
    };
  };

  const updateSetting = (key: keyof CameraSettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const takePhoto = () => {
    setCapturedPhoto('/sample-captured-photo.jpg');
    
    // Create a canvas to capture the image with camera effects
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      if (ctx) {
        canvas.width = img.width;
        canvas.height = img.height;
        
        // Apply the same effects as the camera viewfinder
        const effects = getImageEffects();
        ctx.filter = effects.filter;
        ctx.globalAlpha = effects.opacity;
        ctx.drawImage(img, 0, 0);
        
        // Convert to data URL for storage
        const processedImageUrl = canvas.toDataURL('image/jpeg', 0.9);
        
        // Add to photo gallery with processed image
        const newPhoto: CapturedPhoto = {
          id: Date.now().toString(),
          imageUrl: processedImageUrl,
          settings: { ...settings },
          timestamp: new Date()
        };
        setPhotoGallery(prev => [newPhoto, ...prev]);
      }
    };
    
    // Load the current background image
    img.src = customBackground || bg1Image;
    
    setTimeout(() => setCapturedPhoto(null), 2000);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert('Image too large! Please choose an image smaller than 10MB.');
        return;
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file.');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setCustomBackground(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const resetBackground = () => {
    setCustomBackground(null);
  };

  const resetToAuto = () => {
    setSettings(defaultSettings);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-lg">


      <div className="flex flex-col xl:flex-row gap-6 p-4 lg:p-6 max-w-7xl mx-auto">
        
        {/* iPhone Frame */}
        <div className="flex-1 flex justify-center">
          <motion.div 
            className="relative bg-black rounded-[2.5rem] p-2 shadow-2xl"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6 }}
            style={{ 
              width: window.innerWidth < 768 ? '280px' : '320px', 
              height: window.innerWidth < 768 ? '560px' : '640px' 
            }}
          >
          {/* iPhone Screen */}
          <div className="w-full h-full bg-black rounded-[2rem] overflow-hidden relative">
            
            {/* Dynamic Island */}
            <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-32 h-8 bg-black rounded-full z-50"></div>
            
            {/* Camera Viewfinder */}
            <div className="relative w-full h-full">
                    {/* Background Image with Camera Effects */}
                    <div 
                      className="absolute inset-0 bg-cover bg-center transition-all duration-300"
                      style={{
                        backgroundImage: `url(${customBackground || bg1Image})`,
                        ...getImageEffects()
                      }}
                    >
                {/* Camera Grid Lines (Rule of Thirds) - Always same color */}
                {showControls && (
                  <div className="absolute inset-0 pointer-events-none">
                    {/* Vertical lines */}
                    <div className="absolute left-1/3 top-0 w-px h-full bg-white/30"></div>
                    <div className="absolute left-2/3 top-0 w-px h-full bg-white/30"></div>
                    {/* Horizontal lines */}
                    <div className="absolute top-1/3 left-0 w-full h-px bg-white/30"></div>
                    <div className="absolute top-2/3 left-0 w-full h-px bg-white/30"></div>
                  </div>
                )}
              </div>

              {/* Camera UI Overlay */}
              <div className="absolute inset-0 pointer-events-none">
                
                {/* Top Controls */}
                <div className="absolute top-12 left-0 right-0 flex justify-between items-center px-6 z-40">
                  <motion.button 
                    className="p-2 bg-black/30 rounded-full backdrop-blur-sm pointer-events-auto"
                    whileTap={{ scale: 0.9 }}
                    onClick={() => updateSetting('flashMode', 
                      settings.flashMode === 'off' ? 'auto' : 
                      settings.flashMode === 'auto' ? 'on' : 'off'
                    )}
                  >
                    {settings.flashMode === 'off' && <MdFlashOff className="text-xl text-white/60" />}
                    {settings.flashMode === 'auto' && <MdFlashAuto className="text-xl text-yellow-400" />}
                    {settings.flashMode === 'on' && <MdFlashOn className="text-xl text-yellow-400" />}
                  </motion.button>
                  
                <div className="text-white text-sm font-medium bg-black/30 px-3 py-1 rounded-full backdrop-blur-sm">
                  PHOTO
                </div>
                  
                  <motion.button 
                    className="p-2 bg-black/30 rounded-full backdrop-blur-sm pointer-events-auto"
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowControls(!showControls)}
                  >
                    <HiOutlineCog className="text-xl text-white" />
                  </motion.button>
                </div>


                {/* Capture Button */}
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 pointer-events-auto">
                  <motion.button
                    className="w-20 h-20 bg-white rounded-full shadow-lg relative overflow-hidden"
                    whileTap={{ scale: 0.9 }}
                    onClick={takePhoto}
                  >
                    <div className="w-full h-full border-4 border-gray-300 rounded-full flex items-center justify-center">
                      <div className="w-12 h-12 bg-gray-100 rounded-full"></div>
                    </div>
                  </motion.button>
                </div>

                        {/* Zoom Controls - Disabled */}
                        <div className="absolute bottom-8 right-6 flex flex-col space-y-2 pointer-events-auto">
                          <motion.button
                            className="p-2 bg-black/30 rounded-full backdrop-blur-sm opacity-50 cursor-not-allowed"
                            disabled
                          >
                            <AiOutlineZoomIn className="text-white text-lg" />
                          </motion.button>
                          <motion.button
                            className="p-2 bg-black/30 rounded-full backdrop-blur-sm opacity-50 cursor-not-allowed"
                            disabled
                          >
                            <AiOutlineZoomOut className="text-white text-lg" />
                          </motion.button>
                        </div>
              </div>

              {/* Photo Capture Flash Effect */}
              <AnimatePresence>
                {capturedPhoto && (
                  <motion.div
                    className="absolute inset-0 bg-white z-50"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 1, 0] }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>

        {/* Controls Panel */}
        <div className="w-full xl:w-80 space-y-4">
          
          {/* Quick Settings */}
          <motion.div 
            className="bg-gradient-to-br from-base-100 to-base-300 backdrop-blur-sm rounded-xl p-4 border border-white/20"
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className="text-lg font-bold text-white mb-4 text-center">Camera Settings</h3>
            
            {/* ISO Control */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-white font-medium text-sm">ISO</span>
                <span className="text-primary font-bold text-base">{settings.iso}</span>
              </div>
              <input
                type="range"
                min="100"
                max="3200"
                step="100"
                value={settings.iso}
                onChange={(e) => updateSetting('iso', parseInt(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>100</span>
                <span>3200</span>
              </div>
            </div>

            {/* Aperture Control */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-white font-medium text-sm">Aperture</span>
                <span className="text-primary font-bold text-base">f/{settings.aperture}</span>
              </div>
              <input
                type="range"
                min="1.4"
                max="5.6"
                step="0.1"
                value={settings.aperture}
                onChange={(e) => updateSetting('aperture', parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>f/1.4</span>
                <span>f/5.6</span>
              </div>
            </div>

            {/* Exposure Control */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-white font-medium text-sm">Exposure</span>
                <span className="text-primary font-bold text-base">
                  {settings.exposure > 0 ? '+' : ''}{settings.exposure}
                </span>
              </div>
              <input
                type="range"
                min="-2"
                max="2"
                step="0.1"
                value={settings.exposure}
                onChange={(e) => updateSetting('exposure', parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>-2</span>
                <span>+2</span>
              </div>
            </div>

                    {/* Flash Control */}
                    <div className="mb-4">
                      <div className="text-center mb-2">
                        <span className="text-white font-medium text-sm">Flash</span>
                      </div>
                      <div className="flex justify-center">
                        <div className="flex bg-gray-800 rounded-full p-1">
                          {(['off', 'auto', 'on'] as const).map((mode) => (
                            <button
                              key={mode}
                              onClick={() => updateSetting('flashMode', mode)}
                              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                                settings.flashMode === mode 
                                  ? 'bg-yellow-400 text-black' 
                                  : 'text-white hover:bg-gray-700'
                              }`}
                            >
                              {mode === 'off' ? 'Off' : mode === 'auto' ? 'Auto' : 'On'}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Auto Reset Button */}
                    <div className="flex justify-center mb-4">
                      <button
                        onClick={resetToAuto}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-bold text-sm transition-all duration-300 hover:scale-105 shadow-lg"
                      >
                        ⚡ Auto Mode
                      </button>
                    </div>

            {/* Background Image Upload */}
            <div className="border-t border-white/20 pt-4">
              <h4 className="text-white font-medium mb-3 text-center text-sm">Background Image</h4>
              <div className="space-y-2">
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/heic,image/heif,image/png,image/webp"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="background-upload"
                />
                <label
                  htmlFor="background-upload"
                  className="block w-full bg-blue-600 hover:bg-blue-700 text-white text-center py-2 px-3 rounded-lg cursor-pointer transition-colors text-sm"
                >
                  📸 Upload Photo
                </label>
                {customBackground && (
                  <button
                    onClick={resetBackground}
                    className="w-full bg-gray-600 hover:bg-gray-700 text-white py-1.5 px-3 rounded-lg transition-colors text-sm"
                  >
                    🔄 Reset
                  </button>
                )}
                <p className="text-xs text-gray-400 text-center">
                  Max 10MB • JPEG, HEIC, PNG, WebP
                </p>
              </div>
            </div>
          </motion.div>

        </div>
      </div>

      {/* Photo Gallery */}
      {photoGallery.length > 0 && (
        <div className="bg-gray-800 p-6">
          <h3 className="text-white text-xl font-bold mb-4 text-center">Photo Gallery</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {photoGallery.map((photo) => (
              <div key={photo.id} className="relative group">
                <img
                  src={photo.imageUrl}
                  alt="Captured photo"
                  className="w-full h-24 object-cover rounded-lg cursor-pointer hover:scale-105 transition-transform"
                  onClick={() => setFullscreenPhoto(photo)}
                />
                <div className="absolute bottom-1 left-1 right-1 bg-black/70 text-white text-xs p-1 rounded">
                  <div className="text-center">
                    <div>ISO {photo.settings.iso}</div>
                    <div>f/{photo.settings.aperture}</div>
                    <div>{photo.settings.exposure > 0 ? '+' : ''}{photo.settings.exposure}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Fullscreen Photo Modal */}
      <AnimatePresence>
        {fullscreenPhoto && (
          <motion.div
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setFullscreenPhoto(null)}
          >
            <motion.div
              className="relative max-w-4xl max-h-full"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={fullscreenPhoto.imageUrl}
                alt="Fullscreen photo"
                className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
              />
              <div className="absolute bottom-4 left-4 right-4 bg-black/70 text-white p-4 rounded-lg">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-sm text-gray-300">ISO</div>
                    <div className="text-lg font-bold">{fullscreenPhoto.settings.iso}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-300">Aperture</div>
                    <div className="text-lg font-bold">f/{fullscreenPhoto.settings.aperture}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-300">Exposure</div>
                    <div className="text-lg font-bold">
                      {fullscreenPhoto.settings.exposure > 0 ? '+' : ''}{fullscreenPhoto.settings.exposure}
                    </div>
                  </div>
                </div>
              </div>
              <button
                className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                onClick={() => setFullscreenPhoto(null)}
              >
                ✕
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
