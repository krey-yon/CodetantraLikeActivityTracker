"use client";

import { useState, useEffect, useRef } from 'react';

// --- SVG Icons (embedded for simplicity) ---
const MouseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l5-2 2 5z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7.5 7.5S10 2 16.5 2s9 6.5 9 6.5-5.5 9-12 9S7.5 7.5 7.5 7.5z" />
  </svg>
);

const KeyboardIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2h-3m-4 0V1m0 2v2m0-2h4m-4 0H9m4 0h4m-4 4v4m0 0v4m0-4h4m-4 0H9" />
  </svg>
);

const WifiIcon = ({ online }: { online: boolean }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${online ? 'text-green-400' : 'text-red-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    {online ? (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.556A5.5 5.5 0 0112 15c1.445 0 2.803.556 3.889 1.556M12 12c2.485 0 4.847.94 6.667 2.667M5.333 14.667C7.153 12.94 9.515 12 12 12c2.485 0 4.847.94 6.667 2.667" />
    ) : (
      <>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636a9 9 0 010 12.728M5.636 5.636a9 9 0 0112.728 0" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 12a5 5 0 015 5" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2 2l20 20" />
      </>
    )}
  </svg>
);

const EyeIcon = ({ visible }: { visible: boolean }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${visible ? 'text-green-400' : 'text-yellow-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        {visible ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.879 9.879l4.242 4.242M9.879 9.879L6 6m3.879 3.879l-1.826-1.826" />
        )}
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.522 5 12 5c1.554 0 3.042.42 4.399 1.165M19.542 12c-1.274 4.057-5.064 7-9.542 7-1.554 0-3.042-.42-4.399-1.165" />
    </svg>
);


// --- Main Dashboard Component ---
type LogEntry = {
  timestamp: string;
  type: string;
  data: string;
  icon: '🖱️' | '⌨️' | '🌐' | '👁️' | '🖥️' | '🚀' | '⚠️';
};

export default function ProctoringDashboard() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [lastKeyPressed, setLastKeyPressed] = useState<string>('None');
  const [isOnline, setIsOnline] = useState(true);
  const [isPageVisible, setIsPageVisible] = useState(true);
  const [screenResolution, setScreenResolution] = useState('0x0');
  const [isSessionActive, setIsSessionActive] = useState(false);

  const logContainerRef = useRef<HTMLDivElement>(null);

  const addLog = (icon: LogEntry['icon'], type: string, data: string) => {
    const newLog: LogEntry = {
      timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
      icon,
      type,
      data,
    };
    setLogs(prevLogs => [newLog, ...prevLogs.slice(0, 100)]);
  };

  const handleEnterFullscreen = () => {
    const element = document.documentElement;
    if (element.requestFullscreen) {
        element.requestFullscreen();
    } 
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
        const isFullscreen = !!document.fullscreenElement;
        if (isFullscreen && !isSessionActive) {
            setIsSessionActive(true);
            addLog('🚀', 'System', 'Session started in fullscreen mode.');
        } else if (!isFullscreen && isSessionActive) {
            setIsSessionActive(false);
            addLog('⚠️', 'System', 'CRITICAL: Fullscreen mode exited.');
        }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);

    if (!isSessionActive) return;

    // --- Initial System Logs ---
    if (navigator.userAgent) {
        addLog('🖥️', 'System', `User Agent: ${navigator.userAgent.substring(0, 40)}...`);
    }
    
    // --- Event Listeners ---
    const handleMouseMove = (event: MouseEvent) => {
      setMousePos({ x: event.clientX, y: event.clientY });
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      let key = event.key;
      if (key === ' ') key = 'Space';
      if (key.length > 1) key = key.charAt(0).toUpperCase() + key.slice(1);
      setLastKeyPressed(key);
      addLog('⌨️', 'Keyboard', `Pressed '${key}'`);
    };

    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const targetTag = target.tagName.toLowerCase();
      const targetIdentifier = target.id ? `#${target.id}` : (target.className && typeof target.className === 'string' ? `.${target.className.split(' ')[0]}` : '');
      addLog('🖱️', 'Mouse', `Clicked <${targetTag}${targetIdentifier}> at (${event.clientX}, ${event.clientY})`);
    };

    const handleVisibilityChange = () => {
      const visible = document.visibilityState === 'visible';
      setIsPageVisible(visible);
      addLog('👁️', 'Visibility', `Tab became ${visible ? 'active' : 'hidden'}`);
    };

    const updateOnlineStatus = () => {
      const online = navigator.onLine;
      setIsOnline(online);
      addLog('🌐', 'Network', `Connection is now ${online ? 'online' : 'offline'}`);
    };

    const updateScreenResolution = () => {
        const res = `${window.innerWidth}x${window.innerHeight} (Screen: ${window.screen.width}x${window.screen.height})`;
        setScreenResolution(res);
        addLog('🖥️', 'Screen', `Viewport resized to ${res}`);
    };


    // --- Attach Listeners ---
    document.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('click', handleClick);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
    window.addEventListener('resize', updateScreenResolution);

    // --- Initial State ---
    setIsOnline(navigator.onLine);
    setIsPageVisible(document.visibilityState === 'visible');
    updateScreenResolution();


    // --- Cleanup ---
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('click', handleClick);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
      window.removeEventListener('resize', updateScreenResolution);
    };
  }, [isSessionActive]);

  return (
    <main className="bg-gray-900 text-gray-200 min-h-screen font-sans">
        {!isSessionActive && (
            <div className="fixed inset-0 bg-gray-900 bg-opacity-90 flex items-center justify-center z-50">
                <div className="bg-gray-800 border border-gray-700 rounded-xl p-8 text-center max-w-md mx-4">
                    <h2 className="text-2xl font-bold text-white mb-4">Monitoring Required</h2>
                    <p className="text-gray-400 mb-6">To begin your session, you must enter fullscreen mode. This ensures a controlled and monitored environment.</p>
                    <button 
                        onClick={handleEnterFullscreen}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                    >
                        Enter Fullscreen & Start Session
                    </button>
                    <p className="text-xs text-gray-500 mt-4">Exiting fullscreen at any time will be logged and may invalidate your session.</p>
                </div>
            </div>
        )}

      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-white tracking-tight">Activity Dashboard</h1>
          <p className="text-gray-400 mt-1">Real-time monitoring of browser and user events.</p>
        </header>

        {/* --- Top Status Cards --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-5 flex items-center space-x-4 shadow-lg border border-gray-700/50">
            <MouseIcon />
            <div>
              <p className="text-sm text-gray-400">Mouse Position</p>
              <p className="text-lg font-semibold text-white">{mousePos.x}, {mousePos.y}</p>
            </div>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-5 flex items-center space-x-4 shadow-lg border border-gray-700/50">
            <KeyboardIcon />
            <div>
              <p className="text-sm text-gray-400">Last Key Press</p>
              <p className="text-lg font-semibold text-white">{lastKeyPressed}</p>
            </div>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-5 flex items-center space-x-4 shadow-lg border border-gray-700/50">
            <WifiIcon online={isOnline} />
            <div>
              <p className="text-sm text-gray-400">Network</p>
              <p className={`text-lg font-semibold ${isOnline ? 'text-green-400' : 'text-red-400'}`}>
                {isOnline ? 'Online' : 'Offline'}
              </p>
            </div>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-5 flex items-center space-x-4 shadow-lg border border-gray-700/50">
            <EyeIcon visible={isPageVisible} />
            <div>
              <p className="text-sm text-gray-400">Page Visibility</p>
              <p className={`text-lg font-semibold ${isPageVisible ? 'text-green-400' : 'text-yellow-400'}`}>
                {isPageVisible ? 'Active' : 'Hidden'}
              </p>
            </div>
          </div>
        </div>

        {/* --- Main Content Area --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* --- Live Activity Log --- */}
          <div className="lg:col-span-2 bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-lg border border-gray-700/50">
            <h2 className="text-lg font-semibold text-white p-4 border-b border-gray-700">Live Activity Log</h2>
            <div ref={logContainerRef} className="h-[60vh] overflow-y-auto p-4 space-y-3 font-mono text-sm">
              {logs.map((log, index) => (
                <div key={index} className={`flex items-start animate-fade-in ${log.type === 'System' && log.icon === '⚠️' ? 'text-red-400' : ''}`}>
                  <span className="text-gray-500 mr-3">{log.timestamp}</span>
                  <span className="mr-2">{log.icon}</span>
                  <span className={`font-bold w-24 shrink-0 ${log.type === 'System' && log.icon === '⚠️' ? 'text-red-400' : 'text-cyan-400'}`}>{log.type}</span>
                  <p className="text-gray-300 break-all">{log.data}</p>
                </div>
              ))}
            </div>
          </div>

          {/* --- System & Screen Info --- */}
          <div className="space-y-8">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-700/50">
              <h3 className="text-md font-semibold text-white mb-3">System & Screen</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Viewport</span>
                  <span className="font-medium text-white">{screenResolution.split(' ')[0]}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Full Screen</span>
                  <span className="font-medium text-white">{screenResolution.split(' ')[2]}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Platform</span>
                  <span className="font-medium text-white">{typeof navigator !== 'undefined' ? navigator.platform : 'N/A'}</span>
                </div>
                 <div className="flex justify-between">
                  <span className="text-gray-400">Cookies</span>
                  <span className="font-medium text-white">{typeof navigator !== 'undefined' && navigator.cookieEnabled ? 'Enabled' : 'Disabled'}</span>
                </div>
              </div>
            </div>
             <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-gray-700/50 text-xs text-gray-500">
                <h4 className="font-bold text-gray-400 mb-2">Browser Sandbox Limitations</h4>
                <p>This dashboard captures client-side browser events only. It cannot access the file system, other applications, or system-level resources due to browser security restrictions.</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
