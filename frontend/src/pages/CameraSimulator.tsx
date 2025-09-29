import { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import IPhoneCameraSimulator from '../components/iPhoneCameraSimulator';
import { motion } from 'framer-motion';
import {
  AiOutlineCamera,
  AiOutlineBook
} from 'react-icons/ai';
import { 
  MdFlashOff,
  MdFlashAuto,
  MdPhotoLibrary
} from 'react-icons/md';

export default function CameraSimulator() {
  const [activeTab, setActiveTab] = useState<'simulator' | 'tips'>('simulator');

  const cameraTips = [
    {
      icon: <MdFlashOff className="text-2xl" />,
      title: "Flash Magic",
      description: "Off = natural vibes, On = bright fill, Auto = smart mode",
      color: "text-yellow-400"
    },
    {
      icon: <AiOutlineCamera className="text-2xl" />,
      title: "ISO Power",
      description: "Low ISO = clean shots, High ISO = bright in darkness",
      color: "text-blue-400"
    },
    {
      icon: <MdPhotoLibrary className="text-2xl" />,
      title: "Aperture Art",
      description: "Low f-number = dreamy blur, High f-number = sharp focus",
      color: "text-green-400"
    },
    {
      icon: <MdFlashAuto className="text-2xl" />,
      title: "Exposure Control",
      description: "Plus = brighter mood, Minus = darker vibes",
      color: "text-purple-400"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      <Navbar />
      
      {/* Hero Section */}
      <div className="pt-25 pb-8">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              iPhone Camera Simulator
            </h1>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto mb-8">
              Don't have your iPhone with you? No excuses, here is an iPhone simulator for you!
            </p>
          </motion.div>


          {/* Tab Navigation */}
          <div className="flex justify-center mb-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-1 border border-white/20">
              <div className="flex gap-2">
                {[
                  { id: 'simulator', label: 'Simulator', icon: <AiOutlineCamera /> },
                  { id: 'tips', label: 'Tips', icon: <AiOutlineBook /> }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
                      activeTab === tab.id 
                        ? 'bg-white text-black' 
                        : 'text-gray-300 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {tab.icon}
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="max-w-7xl mx-auto">
            {activeTab === 'simulator' && (
              <motion.div
                key="simulator"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <IPhoneCameraSimulator />
              </motion.div>
            )}

            {activeTab === 'tips' && (
              <motion.div
                key="tips"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {cameraTips.map((tip, index) => (
                  <motion.div
                    key={index}
                    className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ scale: 1.02, y: -5 }}
                  >
                    <div className={`${tip.color} mb-4`}>
                      {tip.icon}
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">
                      {tip.title}
                    </h3>
                    <p className="text-gray-300 text-sm">
                      {tip.description}
                    </p>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}