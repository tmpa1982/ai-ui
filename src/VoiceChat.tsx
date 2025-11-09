/**
 * VoiceChat Component
 * 
 * Handles real-time voice conversation with AI:
 * 1. Records audio from microphone using MediaRecorder API
 * 2. Sends audio chunks to backend via WebSocket (Blob → ArrayBuffer → Base64)
 * 3. Receives base64 audio from backend
 * 4. Plays AI-generated audio responses (Base64 → Blob → Object URL → Audio element)
 */

import { useState, useRef, useEffect } from 'react';
import { useMsal, useAccount } from "@azure/msal-react";
import { LogOut, MessageSquare } from "lucide-react";
import apiUrl from './apiUrl';

// Message types from backend
interface WebSocketMessage {
  type: 'audio_response' | 'error';
  data?: string;
  message?: string;
}

interface VoiceChatProps {
  onNavigateToInterview?: () => void;
}

export default function VoiceChat({ onNavigateToInterview }: VoiceChatProps) {
  const { instance, accounts } = useMsal();
  const account = useAccount(accounts[0] || {});
  
  // WebSocket connection
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  // Recording state
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const cleanupPromiseRef = useRef<Promise<void> | null>(null);
  
  // Audio playback
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [status, setStatus] = useState('');

  /**
   * Get WebSocket URL from API URL
   * Converts HTTP/HTTPS to WS/WSS
   */
  const getWebSocketUrl = (): string => {
    let url = apiUrl;
    if (url.startsWith('https://')) {
      url = url.replace('https://', 'wss://');
    } else if (url.startsWith('http://')) {
      url = url.replace('http://', 'ws://');
    }
    return `${url}/ws`;
  };

  /**
   * Clean up MediaRecorder and MediaStream
   * This ensures proper reset between recordings
   * Returns a Promise that resolves when cleanup is complete
   */
  const cleanupRecording = (): Promise<void> => {
    // If there's already a cleanup in progress, wait for it
    if (cleanupPromiseRef.current) {
      return cleanupPromiseRef.current;
    }

    // Create the cleanup promise
    const cleanupPromise = new Promise<void>((resolve) => {
      // Capture current references to avoid race conditions
      const recorder = mediaRecorderRef.current;
      const stream = mediaStreamRef.current;

      const finishCleanup = () => {
        // Clear MediaRecorder reference and handlers
        if (recorder) {
          recorder.ondataavailable = null;
          recorder.onstop = null;
          recorder.onerror = null;
        }
        mediaRecorderRef.current = null;

        // Stop and clean up MediaStream
        if (stream) {
          stream.getTracks().forEach((track) => {
            track.stop();
            track.enabled = false;
          });
        }
        mediaStreamRef.current = null;

        cleanupPromiseRef.current = null;
        // Small delay to ensure all resources are fully released
        setTimeout(resolve, 100);
      };

      // If no recorder exists, finish immediately
      if (!recorder) {
        finishCleanup();
        return;
      }

      // Remove event handlers to prevent new data chunks
      recorder.ondataavailable = null;
      recorder.onerror = null;

      if (recorder.state === 'recording' || recorder.state === 'paused') {
        // Set up a one-time onstop handler to know when it's fully stopped
        const onStopHandler = () => {
          recorder.onstop = null;
          finishCleanup();
        };
        recorder.onstop = onStopHandler;
        
        try {
          recorder.stop();
        } catch (e) {
          console.warn('Error stopping MediaRecorder:', e);
          finishCleanup();
        }
      } else {
        // Already inactive, finish immediately
        finishCleanup();
      }
    });

    // Store the promise
    cleanupPromiseRef.current = cleanupPromise;
    return cleanupPromise;
  };

  /**
   * Initialize WebSocket connection
   */
  useEffect(() => {
    const wsUrl = getWebSocketUrl();
    const websocket = new WebSocket(wsUrl);

    websocket.onopen = () => {
      console.log('WebSocket connected');
      setIsConnected(true);
      setWs(websocket);
      setStatus('Connected');
    };

    websocket.onclose = () => {
      console.log('WebSocket disconnected');
      setIsConnected(false);
      setStatus('Disconnected');
    };

    websocket.onerror = (error) => {
      console.error('WebSocket error:', error);
      setStatus('Connection error');
    };

    websocket.onmessage = (event) => {
      const message: WebSocketMessage = JSON.parse(event.data);
      handleWebSocketMessage(message);
    };

    return () => {
      websocket.close();
      // Clean up any active recording when component unmounts
      cleanupRecording().catch(console.error);
    };
  }, []);

  /**
   * Handle messages received from backend
   */
  const handleWebSocketMessage = (message: WebSocketMessage) => {
    switch (message.type) {
      case 'audio_response':
        // AI's audio response - play it!
        if (message.data) {
          playAudioResponse(message.data);
        }
        setStatus('');
        break;

      case 'error':
        // Error occurred
        setStatus(`Error: ${message.message || 'Unknown error'}`);
        break;
    }
  };

  /**
   * Start recording audio from microphone
   * 
   * MediaRecorder captures audio chunks every ~1 second
   * IMPORTANT: Always creates a fresh MediaRecorder instance for each recording
   */
  const startRecording = async () => {
    try {
      // Wait for any existing recording to be fully cleaned up
      await cleanupRecording();

      // Small delay to ensure all resources are released
      await new Promise(resolve => setTimeout(resolve, 50));

      // Request microphone permission
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 16000,
        },
      });

      // Store stream reference for cleanup
      mediaStreamRef.current = stream;

      // Create a NEW MediaRecorder instance (never reuse old ones)
      const recorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm',
      });

      // Store recorder reference
      mediaRecorderRef.current = recorder;

      /**
       * ondataavailable fires every 1 second (timeslice=1000)
       * Each chunk is converted to Base64 and sent via WebSocket
       */
      recorder.ondataavailable = async (event) => {
        if (event.data.size > 0) {
          console.log('Audio chunk captured:', event.data.size, 'bytes');
          // Convert Blob → ArrayBuffer → Base64 and send
          await sendAudioChunk(event.data);
        }
      };

      /**
       * onstop fires when recording stops
       */
      recorder.onstop = async () => {
        console.log('Recording stopped');
        
        // Clean up stream
        if (mediaStreamRef.current) {
          mediaStreamRef.current.getTracks().forEach((track) => {
            track.stop();
            track.enabled = false;
          });
          mediaStreamRef.current = null;
        }

        // Clear recorder reference
        mediaRecorderRef.current = null;

        // Notify backend that audio is complete
        if (ws && ws.readyState === WebSocket.OPEN) {
          ws.send(
            JSON.stringify({
              type: 'audio_end',
            })
          );
        }
        setStatus('Processing...');
      };

      // Start recording with 1 second timeslice
      // This means ondataavailable fires every 1 second
      recorder.start(1000);

      setIsRecording(true);
      setStatus('Recording...');
    } catch (error) {
      console.error('Error starting recording:', error);
      // Clean up on error (don't wait, just clean up)
      cleanupRecording().catch(console.error);
      setStatus(
        `Could not access microphone: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  };

  /**
   * Stop recording
   * Properly stops the MediaRecorder and triggers cleanup
   */
  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    } else {
      // If recorder is already stopped or doesn't exist, just clean up
      cleanupRecording();
      setIsRecording(false);
    }
  };

  /**
   * Convert Blob to Base64 and send via WebSocket
   * 
   * Process:
   * 1. Blob → ArrayBuffer
   * 2. ArrayBuffer → Uint8Array → Base64 string
   * 3. Send via WebSocket
   */
  const sendAudioChunk = async (blob: Blob) => {
    try {
      // Convert Blob to ArrayBuffer
      const arrayBuffer = await blob.arrayBuffer();
      
      // Convert ArrayBuffer to Base64
      const base64 = arrayBufferToBase64(arrayBuffer);

      // Send via WebSocket
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(
          JSON.stringify({
            type: 'audio_chunk',
            data: base64,
          })
        );
      }
    } catch (error) {
      console.error('Error sending audio chunk:', error);
    }
  };

  /**
   * Convert ArrayBuffer to Base64 string
   */
  const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  };

  /**
   * Play audio response from backend
   * 
   * Process:
   * 1. Decode base64 to binary string
   * 2. Convert to Uint8Array
   * 3. Create Blob
   * 4. Create Object URL
   * 5. Play via Audio element
   */
  const playAudioResponse = (base64Audio: string) => {
    try {
      // Decode base64 to binary string
      const binaryString = atob(base64Audio);
      
      // Convert to Uint8Array
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      // Create Blob from bytes
      const blob = new Blob([bytes], { type: 'audio/mp3' });

      // Create temporary URL for blob
      const url = URL.createObjectURL(blob);

      // Play audio
      if (audioRef.current) {
        audioRef.current.src = url;
        audioRef.current.play();
        setIsPlaying(true);
        setStatus('Playing response...');

        // Clean up URL when audio finishes
        audioRef.current.onended = () => {
          URL.revokeObjectURL(url);
          setIsPlaying(false);
          setStatus('');
        };
      }
    } catch (error) {
      console.error('Error playing audio:', error);
      setStatus('Error playing audio response');
    }
  };

  const handleLogout = () => {
    instance.logoutRedirect();
  };

  return (
    <div className="h-screen flex flex-col bg-gray-900 text-gray-50">
      {/* Header */}
      <div className="flex justify-between items-center px-6 py-4 bg-gray-800 border-b border-gray-700">
        <div className="text-gray-200 font-medium">
          {account?.name || account?.username || 'User'}
        </div>
        <div className="flex items-center gap-3">
          {onNavigateToInterview && (
            <button
              onClick={onNavigateToInterview}
              className="px-4 py-2 flex items-center gap-2 hover:bg-gray-700 rounded transition-colors text-gray-200"
              title="Back to Interview"
            >
              <MessageSquare size={16} />
              Interview
            </button>
          )}
          <button
            onClick={handleLogout}
            className="px-4 py-2 flex items-center gap-2 hover:bg-gray-700 rounded transition-colors text-gray-200"
          >
            <LogOut size={16} />
            Log Out
          </button>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-2xl w-full space-y-6">
          <h1 className="text-3xl font-bold text-center">🎙️ Voice Assistant</h1>

          {/* Connection Status */}
          <div className={`p-4 rounded-lg text-center ${
            isConnected ? 'bg-green-900/30 text-green-200' : 'bg-red-900/30 text-red-200'
          }`}>
            {isConnected ? '✅ Connected' : '❌ Disconnected'}
          </div>

          {/* Recording Controls */}
          <div className="flex justify-center gap-4">
            {!isRecording ? (
              <button
                onClick={startRecording}
                disabled={!isConnected || isPlaying}
                className={`px-8 py-4 text-lg rounded-lg font-medium transition-colors ${
                  isConnected && !isPlaying
                    ? 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer'
                    : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                }`}
              >
                🎤 Start Recording
              </button>
            ) : (
              <button
                onClick={stopRecording}
                className="px-8 py-4 text-lg rounded-lg font-medium bg-red-600 hover:bg-red-700 text-white cursor-pointer animate-pulse"
              >
                ⏹️ Stop Recording
              </button>
            )}
          </div>

          {/* Status Indicator */}
          {status && (
            <div className={`p-4 rounded-lg text-center ${
              isRecording 
                ? 'bg-red-900/30 text-red-200'
                : isPlaying
                ? 'bg-blue-900/30 text-blue-200'
                : 'bg-yellow-900/30 text-yellow-200'
            }`}>
              {status}
            </div>
          )}

          {/* Instructions */}
          <div className="text-center text-gray-400 space-y-2">
            <p>Click "Start Recording" to begin a voice conversation.</p>
            <p className="text-sm">Audio chunks are sent every second while recording.</p>
          </div>
        </div>
      </div>

      {/* Hidden audio element for playback */}
      <audio ref={audioRef} className="hidden" />
    </div>
  );
}
