import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Cookies from 'js-cookie';
import { Mic, MicOff, Video, VideoOff, PhoneOff, Loader2, User } from 'lucide-react';
import { getSocket } from '../socket';

const ICE_SERVERS = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] };

const Meeting = () => {
  const { appointmentId } = useParams();
  const navigate = useNavigate();

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const pcRef = useRef(null);
  const localStreamRef = useRef(null);

  const [status, setStatus] = useState('connecting'); // connecting | waiting | connected | ended | error
  const [errorMsg, setErrorMsg] = useState('');
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);

  const cleanup = useCallback(() => {
    if (pcRef.current) {
      pcRef.current.close();
      pcRef.current = null;
    }
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((t) => t.stop());
      localStreamRef.current = null;
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    const token = Cookies.get('token') || Cookies.get('emstoken');
    const role = Cookies.get('token') ? 'user' : Cookies.get('emstoken') ? 'doctor' : null;

    if (!token || !role) {
      queueMicrotask(() => {
        setStatus('error');
        setErrorMsg('You must be signed in to join this meeting.');
      });
      return undefined;
    }

    const socket = getSocket(token, role);

    const createPeerConnection = () => {
      const pc = new RTCPeerConnection(ICE_SERVERS);

      pc.onicecandidate = (e) => {
        if (e.candidate) {
          socket.emit('signal', { appointmentId, data: { type: 'candidate', candidate: e.candidate } });
        }
      };

      pc.ontrack = (e) => {
        if (remoteVideoRef.current) remoteVideoRef.current.srcObject = e.streams[0];
        setStatus('connected');
      };

      pc.onconnectionstatechange = () => {
        if (pc.connectionState === 'failed' || pc.connectionState === 'disconnected') {
          setStatus((s) => (s === 'ended' ? s : 'waiting'));
        }
      };

      localStreamRef.current.getTracks().forEach((track) => pc.addTrack(track, localStreamRef.current));
      pcRef.current = pc;
      return pc;
    };

    const handleJoined = ({ peers }) => {
      if (cancelled) return;
      setStatus('waiting');
      if (peers.length > 0) createPeerConnection();
    };

    const handlePeerJoined = async () => {
      if (cancelled) return;
      const pc = pcRef.current || createPeerConnection();
      try {
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        socket.emit('signal', { appointmentId, data: { type: 'offer', sdp: offer } });
      } catch {
        setStatus('error');
        setErrorMsg('Could not start the call.');
      }
    };

    const handleSignal = async ({ data }) => {
      if (cancelled) return;
      const pc = pcRef.current || createPeerConnection();
      try {
        if (data.type === 'offer') {
          await pc.setRemoteDescription(new RTCSessionDescription(data.sdp));
          const answer = await pc.createAnswer();
          await pc.setLocalDescription(answer);
          socket.emit('signal', { appointmentId, data: { type: 'answer', sdp: answer } });
        } else if (data.type === 'answer') {
          await pc.setRemoteDescription(new RTCSessionDescription(data.sdp));
        } else if (data.type === 'candidate') {
          await pc.addIceCandidate(new RTCIceCandidate(data.candidate));
        }
      } catch (err) {
        console.error('Signal handling error:', err);
      }
    };

    const handlePeerLeft = () => {
      if (cancelled) return;
      if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;
      if (pcRef.current) {
        pcRef.current.close();
        pcRef.current = null;
      }
      setStatus('waiting');
    };

    const handleMeetingError = ({ msg }) => {
      if (cancelled) return;
      setStatus('error');
      setErrorMsg(msg);
    };

    socket.on('joined-meeting', handleJoined);
    socket.on('peer-joined', handlePeerJoined);
    socket.on('signal', handleSignal);
    socket.on('peer-left', handlePeerLeft);
    socket.on('meetingError', handleMeetingError);

    (async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        localStreamRef.current = stream;
        if (localVideoRef.current) localVideoRef.current.srcObject = stream;
        socket.emit('join-meeting', { appointmentId });
      } catch {
        if (!cancelled) {
          setStatus('error');
          setErrorMsg('Camera/microphone access is required to join the call.');
        }
      }
    })();

    return () => {
      cancelled = true;
      socket.emit('leave-meeting');
      socket.off('joined-meeting', handleJoined);
      socket.off('peer-joined', handlePeerJoined);
      socket.off('signal', handleSignal);
      socket.off('peer-left', handlePeerLeft);
      socket.off('meetingError', handleMeetingError);
      cleanup();
    };
  }, [appointmentId, cleanup]);

  const toggleMic = () => {
    const track = localStreamRef.current?.getAudioTracks()[0];
    if (!track) return;
    track.enabled = !track.enabled;
    setMicOn(track.enabled);
  };

  const toggleCam = () => {
    const track = localStreamRef.current?.getVideoTracks()[0];
    if (!track) return;
    track.enabled = !track.enabled;
    setCamOn(track.enabled);
  };

  const handleLeave = () => {
    setStatus('ended');
    navigate(-1);
  };

  return (
    <div className="h-full flex flex-col bg-slate-950 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-6 py-4 bg-gradient-to-b from-black/60 to-transparent">
        <div className="flex items-center gap-2 text-white">
          <span className={`w-2 h-2 rounded-full ${status === 'connected' ? 'bg-emerald-400' : 'bg-amber-400'} animate-pulse`} />
          <span className="text-sm font-bold tracking-tight">
            {status === 'connected' && 'Live'}
            {status === 'waiting' && 'Waiting for the other participant…'}
            {status === 'connecting' && 'Connecting…'}
          </span>
        </div>
      </div>

      <div className="flex-1 relative flex items-center justify-center">
        {status === 'error' ? (
          <div className="text-center px-6">
            <p className="text-white font-bold text-lg mb-2">Couldn't join the meeting</p>
            <p className="text-slate-400 text-sm">{errorMsg}</p>
            <button
              onClick={() => navigate(-1)}
              className="mt-6 px-6 py-3 bg-white text-slate-900 font-bold rounded-2xl hover:opacity-90 transition-opacity"
            >
              Go back
            </button>
          </div>
        ) : (
          <>
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className={`w-full h-full object-cover ${status === 'connected' ? 'block' : 'hidden'}`}
            />
            {status !== 'connected' && (
              <div className="flex flex-col items-center gap-3 text-slate-400">
                {status === 'connecting' ? (
                  <Loader2 size={32} className="animate-spin" />
                ) : (
                  <User size={48} className="opacity-30" />
                )}
                <p className="text-sm font-medium">
                  {status === 'connecting' ? 'Setting up your camera…' : 'Waiting for the other participant to join…'}
                </p>
              </div>
            )}
          </>
        )}

        {status !== 'error' && (
          <div className="absolute bottom-24 right-6 w-40 sm:w-56 aspect-video rounded-2xl overflow-hidden border-2 border-white/20 shadow-2xl bg-slate-900">
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              className={`w-full h-full object-cover ${camOn ? 'block' : 'hidden'}`}
            />
            {!camOn && (
              <div className="w-full h-full flex items-center justify-center">
                <VideoOff size={20} className="text-slate-500" />
              </div>
            )}
          </div>
        )}
      </div>

      {status !== 'error' && (
        <div className="relative z-20 flex items-center justify-center gap-4 pb-8 pt-4">
          <button
            onClick={toggleMic}
            className={`w-14 h-14 rounded-full flex items-center justify-center transition-all active:scale-95 ${
              micOn ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-white text-slate-900'
            }`}
          >
            {micOn ? <Mic size={20} /> : <MicOff size={20} />}
          </button>
          <button
            onClick={handleLeave}
            className="w-16 h-16 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center shadow-lg shadow-red-500/30 active:scale-95 transition-all"
          >
            <PhoneOff size={24} />
          </button>
          <button
            onClick={toggleCam}
            className={`w-14 h-14 rounded-full flex items-center justify-center transition-all active:scale-95 ${
              camOn ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-white text-slate-900'
            }`}
          >
            {camOn ? <Video size={20} /> : <VideoOff size={20} />}
          </button>
        </div>
      )}
    </div>
  );
};

export default Meeting;
