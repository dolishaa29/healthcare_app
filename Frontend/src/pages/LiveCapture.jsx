import React, { useRef, useState, useEffect } from 'react';
import { Video, VideoOff, Camera, Scan, Loader2, Sparkles } from 'lucide-react';

const LiveCapture = () => {

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const intervalRef = useRef(null);
  const analysisTimerRef = useRef(null);

  const [isStreaming, setIsStreaming] = useState(false);
  const [frameCount, setFrameCount] = useState(0);
  const [error, setError] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const captureFrame = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || video.readyState < 2) return null;
    const ctx = canvas.getContext('2d');
    canvas.width = 640;
    canvas.height = 360;
    ctx.drawImage(video, 0, 0, 640, 360);
    return canvas.toDataURL('image/jpeg', 0.7);
  };

  const analyzeSkin = async () => {
    const frame = captureFrame();
    if (!frame) return;
    setIsAnalyzing(true);
    try {
      const res = await fetch('http://localhost:5000/skin-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ frame }),
      });
      const data = await res.json();
      setAnalysis(data.success ? data.analysis : 'Analysis failed: ' + data.message);
    } catch (err) {
      console.error('Skin analysis fetch error:', err);
      setAnalysis('Could not reach server. Make sure backend is running.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const startCamera = async () => {
    setError(null);
    setAnalysis(null);
    try {
      const cameraStream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: 'user' },
        audio: false,
      });
      streamRef.current = cameraStream;
      videoRef.current.srcObject = cameraStream;
      videoRef.current.play();
      setIsStreaming(true);

      intervalRef.current = setInterval(() => {
        if (videoRef.current?.readyState >= 2) setFrameCount(p => p + 1);
      }, 100);

      analysisTimerRef.current = setInterval(() => analyzeSkin(), 5000);

      setTimeout(() => analyzeSkin(), 1000);

    } catch (err) {
      if (err.name === 'NotAllowedError') setError('Camera permission denied.');
      else if (err.name === 'NotFoundError') setError('No camera found on this device.');
      else setError('Could not open camera: ' + err.message);
    }
  };

  const stopCamera = () => {
    clearInterval(intervalRef.current);
    clearInterval(analysisTimerRef.current);
    intervalRef.current = null;
    analysisTimerRef.current = null;
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    videoRef.current.srcObject = null;
    setIsStreaming(false);
    setFrameCount(0);
  };

  useEffect(() => {
    return () => {
      clearInterval(intervalRef.current);
      clearInterval(analysisTimerRef.current);
      if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
    };
  }, []);

  
  const renderAnalysis = (text) => {
    return text.split('\n').map((line, i) => {
      if (line.startsWith('**') && line.endsWith('**')) {
        return <p key={i} className="text-slate-900 font-bold text-sm mt-3 first:mt-0">{line.replace(/\*\*/g, '')}</p>;
      }
      if (line.startsWith('- ')) {
        return <p key={i} className="text-slate-600 text-sm pl-3 border-l-2 border-indigo-100 my-1">{line.slice(2)}</p>;
      }
      if (line.trim() === '') return null;
      return <p key={i} className="text-slate-700 text-sm my-1">{line}</p>;
    });
  };



  return (
    <div className="h-full overflow-hidden bg-[#f8fafc] p-6 flex flex-col gap-5">

      <div className="flex items-center gap-3 shrink-0">
        <div className="p-2.5 bg-indigo-600 rounded-xl">
          <Camera size={20} className="text-white" />
        </div>
        <div>
          <h1 className="text-xl font-black tracking-tight text-slate-900">Live Skin Analysis</h1>
          <p className="text-xs text-slate-400 font-medium">Real-time camera · Gemini AI · auto-analyzes every 5s</p>
        </div>
      </div>

      <div className="flex gap-5 flex-1 min-h-0">

        <div className="flex flex-col gap-3 flex-3 min-w-0">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col flex-1">

            <div className="relative bg-slate-950 flex-1 flex items-center justify-center">
              <video
                ref={videoRef}
                className={`w-full h-full object-cover ${isStreaming ? 'block' : 'hidden'}`}
                playsInline
                muted
              />

              {!isStreaming && (
                <div className="flex flex-col items-center gap-3 text-slate-500">
                  <VideoOff size={48} className="opacity-30" />
                  <span className="text-sm font-medium opacity-50">Camera is off</span>
                </div>
              )}

              {isStreaming && (
                <div className="absolute top-4 left-4 flex items-center gap-2 bg-black/50 backdrop-blur-sm px-3 py-1.5 rounded-full">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  <span className="text-white text-xs font-bold tracking-wider">LIVE</span>
                </div>
              )}

              {isAnalyzing && (
                <div className="absolute top-4 right-4 flex items-center gap-2 bg-indigo-600/80 backdrop-blur-sm px-3 py-1.5 rounded-full">
                  <Loader2 size={12} className="text-white animate-spin" />
                  <span className="text-white text-xs font-bold">Analyzing...</span>
                </div>
              )}
            </div>

            <canvas ref={canvasRef} className="hidden" />

            <div className="px-5 py-4 flex items-center justify-between border-t border-slate-50">
              <span className="text-xs text-slate-400 font-medium">
                {isStreaming
                  ? <>Frames: <span className="text-indigo-600 font-bold">{frameCount.toLocaleString()}</span></>
                  : 'Click Start to begin'
                }
              </span>

              <div className="flex items-center gap-2">
                {isStreaming && (
                  <button
                    onClick={analyzeSkin}
                    disabled={isAnalyzing}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs bg-emerald-500 hover:bg-emerald-600 text-white transition-all active:scale-95 disabled:opacity-50"
                  >
                    <Scan size={14} />
                    Analyze Now
                  </button>
                )}

                <button
                  onClick={isStreaming ? stopCamera : startCamera}
                  className={`flex items-center gap-2 px-5 py-2 rounded-xl font-bold text-xs transition-all active:scale-95
                    ${isStreaming
                      ? 'bg-red-500 hover:bg-red-600 text-white'
                      : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                    }`}
                >
                  {isStreaming ? <VideoOff size={14} /> : <Video size={14} />}
                  {isStreaming ? 'Stop' : 'Start Camera'}
                </button>
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-100 rounded-2xl px-4 py-3 text-red-600 text-xs font-medium shrink-0">
              {error}
            </div>
          )}
        </div>

        <div className="flex-2 min-w-0 bg-white rounded-3xl border border-slate-100 shadow-sm flex flex-col overflow-hidden">

          <div className="px-5 py-4 border-b border-slate-50 flex items-center gap-2 shrink-0">
            <Sparkles size={16} className="text-indigo-500" />
            <span className="text-sm font-black text-slate-800">AI Skin Analysis</span>
            {isAnalyzing && (
              <Loader2 size={13} className="ml-auto text-indigo-400 animate-spin" />
            )}
          </div>

          <div className="flex-1 overflow-y-auto p-5">

            {!analysis && !isAnalyzing && (
              <div className="h-full flex flex-col items-center justify-center gap-3 text-center">
                <div className="p-4 bg-slate-50 rounded-2xl">
                  <Scan size={32} className="text-slate-300" />
                </div>
                <p className="text-slate-400 text-xs font-medium leading-relaxed">
                  {isStreaming
                    ? 'First analysis in a moment...'
                    : 'Start the camera to begin skin analysis'
                  }
                </p>
              </div>
            )}

            {isAnalyzing && !analysis && (
              <div className="h-full flex flex-col items-center justify-center gap-3">
                <Loader2 size={28} className="text-indigo-400 animate-spin" />
                <p className="text-slate-400 text-xs font-medium">Sending frame to Gemini AI...</p>
              </div>
            )}

            {analysis && (
              <div className="space-y-1">
                {renderAnalysis(analysis)}
                {isAnalyzing && (
                  <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-50">
                    <Loader2 size={12} className="text-indigo-400 animate-spin" />
                    <span className="text-xs text-slate-400">Re-analyzing...</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {analysis && (
            <div className="px-5 py-3 border-t border-slate-50 shrink-0">
              <p className="text-xs text-slate-300 font-medium">Updates every 5s · Powered by Gemini</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default LiveCapture;
