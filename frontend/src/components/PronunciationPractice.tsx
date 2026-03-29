import React, { useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { ArrowLeft, Volume2, Mic, ChevronRight, Sun, Moon, Brain, Sparkles } from "lucide-react";

const API_BASE = "http://localhost:5000";

interface PronunciationPracticeProps {
  onBack?: () => void;
  language?: string;
}

interface AnalyzeResponse {
  score: number;
  feedback: string;
}

export const PronunciationPractice: React.FC<PronunciationPracticeProps> = ({
  onBack,
  language = "French",
}) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const [word, setWord] = useState<string | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [wordIndex, setWordIndex] = useState(1);

  const [isLoadingWord, setIsLoadingWord] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const [score, setScore] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [hasRecording, setHasRecording] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const playAudioFromUrl = async (url: string) => {
    if (!url) return;
    try {
      setIsPlaying(true);
      const audio = new Audio(url);
      audio.onended = () => setIsPlaying(false);
      audio.onerror = () => {
        setIsPlaying(false);
        setErrorMessage("Unable to play audio. Please try again.");
      };
      await audio.play().catch(() => {
        setIsPlaying(false);
      });
    } catch {
      setIsPlaying(false);
      setErrorMessage("Unable to play audio. Please try again.");
    }
  };

  const fetchWord = async (autoPlay: boolean) => {
    try {
      setIsLoadingWord(true);
      setErrorMessage(null);
      setScore(null);
      setFeedback(null);
      setHasRecording(false);

      const res = await fetch(`${API_BASE}/get-word`, { method: "GET" });

      if (!res.ok) {
        throw new Error(`Failed to load word (status ${res.status})`);
      }

      const data = await res.json();

      if (!data || typeof data.word !== "string" || typeof data.audio_url !== "string") {
        throw new Error("Invalid response from server.");
      }

      setWord(data.word);
      setAudioUrl(data.audio_url);

      if (autoPlay) {
        await playAudioFromUrl(data.audio_url);
      }
    } catch (err) {
      console.error(err);
      setErrorMessage("Could not load a word. Please try again.");
    } finally {
      setIsLoadingWord(false);
    }
  };

  useEffect(() => {
    void fetchWord(true);

    return () => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
        mediaRecorderRef.current.stop();
      }
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePlayAudio = async () => {
    if (!audioUrl) {
      await fetchWord(true);
      return;
    }
    await playAudioFromUrl(audioUrl);
  };

  const analyzeAudio = async (blob: Blob) => {
    try {
      setIsAnalyzing(true);
      setErrorMessage(null);
      setScore(null);
      setFeedback(null);
  
      const formData = new FormData();
      formData.append("audio_file", blob, "recording.webm");
      formData.append("text", word || "");
      formData.append("user_uuid", "test-user");
      formData.append("word_id", "1");
      formData.append("level_id", "1");
      formData.append("language", language);
  
      const res = await fetch(`${API_BASE}/analyze`, {
        method: "POST",
        body: formData,
      });
  
      if (!res.ok) {
        throw new Error(`Analysis failed (status ${res.status})`);
      }
  
      const data: AnalyzeResponse = await res.json();
  
      console.log("AI RESULT:", data);
  
      if (typeof data.score !== "number" || typeof data.feedback !== "string") {
        throw new Error("Invalid analysis response from server.");
      }
  
      setScore(data.score);
      setFeedback(data.feedback);
  
    } catch (err) {
      console.error(err);
      setErrorMessage("Could not analyze your recording. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const stopMedia = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((t) => t.stop());
      mediaStreamRef.current = null;
    }
  };

  const handleRecordClick = async () => {
    if (isRecording) {
      stopMedia();
      return;
    }

    if (isAnalyzing || isLoadingWord) {
      return;
    }

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setErrorMessage("Recording is not supported in this browser.");
      return;
    }

    try {
      setErrorMessage(null);
      setScore(null);
      setFeedback(null);
      setIsRecording(true);
      setHasRecording(false);

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      audioChunksRef.current = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = async () => {
        setIsRecording(false);
        const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        stopMedia();
        setHasRecording(true);
        await analyzeAudio(blob);
      };

      recorder.onerror = () => {
        setIsRecording(false);
        stopMedia();
        setErrorMessage("Recording failed. Please try again.");
      };

      recorder.start();
    } catch (err) {
      console.error(err);
      setIsRecording(false);
      stopMedia();
      setErrorMessage("Could not access your microphone. Please check permissions.");
    }
  };

  const handleNextWord = async () => {
    stopMedia();
    setScore(null);
    setFeedback(null);
    setHasRecording(false);
    setErrorMessage(null);
    setWordIndex((prev) => prev + 1);
    await fetchWord(true);
  };

  const handleTryAgain = () => {
    stopMedia();
    setScore(null);
    setFeedback(null);
    setHasRecording(false);
    setErrorMessage(null);
  };

  const colors = {
    bgPrimary: isDarkMode ? "bg-[#1C1C1E]" : "bg-[#F2F2F7]",
    bgSecondary: isDarkMode ? "bg-[#2C2C2E]" : "bg-white",
    bgTertiary: isDarkMode ? "bg-[#3A3A3C]" : "bg-gray-50",

    textPrimary: isDarkMode ? "text-white" : "text-gray-900",
    textSecondary: isDarkMode ? "text-gray-300" : "text-gray-600",
    textTertiary: isDarkMode ? "text-gray-400" : "text-gray-500",

    border: isDarkMode ? "border-gray-700" : "border-gray-200",

    accentBlue: isDarkMode ? "bg-[#0A84FF]" : "bg-[#007AFF]",
    accentBlueHover: isDarkMode ? "hover:bg-[#409CFF]" : "hover:bg-[#0051D5]",
    accentPink: isDarkMode ? "bg-[#FF375F]" : "bg-[#FF2D55]",
    accentPinkHover: isDarkMode ? "hover:bg-[#FF6482]" : "hover:bg-[#D70015]",
  };

  const showAnalyzing = hasRecording && (isAnalyzing || (!score && !errorMessage));
  const hasResult = hasRecording && score !== null && !isAnalyzing;

  return (
    <div className={`min-h-screen ${colors.bgPrimary} transition-colors duration-300`}>
      <div className="max-w-md mx-auto min-h-screen flex flex-col">
        <header
          className={`${colors.bgSecondary} ${colors.border} border-b px-4 py-4 flex items-center justify-between`}
        >
          <button
            onClick={onBack}
            className={`p-2 rounded-full ${colors.bgTertiary} ${colors.textPrimary} hover:scale-110 transition-transform`}
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="flex items-center space-x-2">
            <div
              className={`w-8 h-8 rounded-xl ${
                isDarkMode
                  ? "bg-gradient-to-br from-blue-500 to-purple-600"
                  : "bg-gradient-to-br from-blue-400 to-purple-500"
              } flex items-center justify-center`}
            >
              <Brain className="w-4 h-4 text-white" />
            </div>
            <h1 className={`${colors.textPrimary}`}>Pronunciation Practice</h1>
          </div>

          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`p-2 rounded-full ${colors.bgTertiary} ${colors.textPrimary} hover:scale-110 transition-transform`}
          >
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </header>

        <main className="flex-1 px-5 py-6 space-y-6">
          {errorMessage && (
            <div
              className={`text-sm px-4 py-2 rounded-xl ${
                isDarkMode ? "bg-red-500/10 text-red-300" : "bg-red-50 text-red-600"
              }`}
            >
              {errorMessage}
            </div>
          )}

          <div className="text-center">
            <Badge
              className={`${colors.bgTertiary} ${colors.textSecondary} border-0 px-4 py-1.5 rounded-full`}
            >
              Word {wordIndex}
            </Badge>
          </div>

          <Card className={`${colors.bgSecondary} border-0 shadow-2xl rounded-3xl overflow-hidden`}>
            <div className="p-8 text-center space-y-4">
              <Badge
                className={`${
                  isDarkMode
                    ? "bg-blue-500/20 text-blue-400"
                    : "bg-blue-50 text-blue-700"
                } border-0 px-4 py-1.5 rounded-full`}
              >
                {language}
              </Badge>

              <h2 className={`text-5xl ${colors.textPrimary}`}>
                {isLoadingWord ? "..." : word || "—"}
              </h2>

              <p className={`text-base ${colors.textTertiary}`}>
                Listen carefully, then record your pronunciation.
              </p>
            </div>
          </Card>

          <Button
            onClick={handlePlayAudio}
            disabled={isPlaying || isRecording || isLoadingWord}
            className={`w-full h-14 ${colors.accentBlue} ${colors.accentBlueHover} text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50`}
          >
            <Volume2 className={`w-5 h-5 mr-2 ${isPlaying ? "animate-pulse" : ""}`} />
            {isLoadingWord
              ? "Loading word..."
              : isPlaying
              ? "Playing..."
              : "Play Word Audio"}
          </Button>

          <Button
            onClick={handleRecordClick}
            disabled={isPlaying || isLoadingWord || isAnalyzing}
            className={`w-full h-14 ${colors.accentPink} ${colors.accentPinkHover} text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 ${
              isRecording ? "animate-pulse" : ""
            }`}
          >
            <Mic className="w-5 h-5 mr-2" />
            {isRecording ? "Stop Recording" : "Record Your Audio"}
          </Button>

          {isRecording && (
            <div
              className={`${colors.bgSecondary} rounded-2xl p-4 flex items-center justify-center gap-1 h-20`}
            >
              {Array.from({ length: 20 }).map((_, i) => (
                <div
                  key={i}
                  className={`w-1 ${isDarkMode ? "bg-pink-500" : "bg-pink-600"} rounded-full`}
                  style={{
                    height: `${Math.random() * 40 + 10}px`,
                    animation: "pulse 0.5s ease-in-out infinite",
                    animationDelay: `${i * 0.05}s`,
                  }}
                />
              ))}
            </div>
          )}

          {hasRecording && (
            <div className="space-y-6">
              {showAnalyzing ? (
                <div className="flex flex-col items-center justify-center py-8">
                  <div
                    className={`w-24 h-24 rounded-full ${
                      isDarkMode ? "bg-blue-500/20" : "bg-blue-100"
                    } flex items-center justify-center mb-4 animate-pulse`}
                  >
                    <Sparkles
                      className={`w-10 h-10 ${
                        isDarkMode ? "text-blue-400" : "text-blue-600"
                      }`}
                    />
                  </div>
                  <p className={colors.textSecondary}>Analyzing your pronunciation...</p>
                </div>
              ) : (
                hasResult && (
                  <div className="flex flex-col items-center justify-center space-y-4">
                    <div className="relative w-36 h-36 mb-2">
                      <svg className="w-36 h-36 transform -rotate-90">
                        <circle
                          cx="72"
                          cy="72"
                          r="60"
                          stroke={isDarkMode ? "#3A3A3C" : "#E5E7EB"}
                          strokeWidth="10"
                          fill="none"
                        />
                        <circle
                          cx="72"
                          cy="72"
                          r="60"
                          stroke="url(#scoreGradient)"
                          strokeWidth="10"
                          fill="none"
                          strokeLinecap="round"
                          strokeDasharray={`${2 * Math.PI * 60}`}
                          strokeDashoffset={`${2 * Math.PI * 60 * (1 - (score || 0) / 100)}`}
                          className="transition-all duration-1000 ease-out"
                        />
                        <defs>
                          <linearGradient
                            id="scoreGradient"
                            x1="0%"
                            y1="0%"
                            x2="100%"
                            y2="100%"
                          >
                            <stop offset="0%" stopColor={isDarkMode ? "#0A84FF" : "#007AFF"} />
                            <stop offset="50%" stopColor={isDarkMode ? "#5E5CE6" : "#5856D6"} />
                            <stop offset="100%" stopColor={isDarkMode ? "#BF5AF2" : "#AF52DE"} />
                          </linearGradient>
                        </defs>
                      </svg>

                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className={`text-4xl ${colors.textPrimary}`}>
                          {score}%
                        </span>
                        <span className={`text-sm ${colors.textTertiary}`}>Score</span>
                      </div>
                    </div>

                    {feedback && (
                      <Card
                        className={`${colors.bgSecondary} border-0 shadow-lg w-full rounded-2xl`}
                      >
                        <div className="p-5 text-center space-y-2">
                          <h3 className={`text-xl ${colors.textPrimary}`}>Feedback</h3>
                          <p className={colors.textSecondary}>{feedback}</p>
                        </div>
                      </Card>
                    )}
                  </div>
                )
              )}
            </div>
          )}

          <div className="space-y-3 pt-4">
            {score !== null && (
              <Button
                onClick={handleTryAgain}
                className={`w-full h-12 ${
                  isDarkMode
                    ? "bg-orange-500/20 text-orange-400 hover:bg-orange-500/30"
                    : "bg-orange-50 text-orange-600 hover:bg-orange-100"
                } rounded-2xl transition-all hover:scale-[1.02] active:scale-[0.98]`}
              >
                Try Again
              </Button>
            )}

            <Button
              onClick={handleNextWord}
              disabled={isLoadingWord || isRecording || isAnalyzing}
              className={`w-full h-12 ${colors.accentBlue} ${colors.accentBlueHover} text-white rounded-2xl shadow-md hover:shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50`}
            >
              Next Word
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </main>
      </div>
    </div>
  );
};
