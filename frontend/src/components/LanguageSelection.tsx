import { useState } from "react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { 
  ArrowLeft,
  Brain,
  ChevronRight,
  Globe,
  Star,
  TrendingUp,
  Users,
  Sparkles
} from "lucide-react";
import React from "react";

interface LanguageSelectionProps {
  onBack?: () => void;
  onLanguageSelect?: (language: string) => void;
  isDarkMode?: boolean;
}

const languages = [
  {
    id: 1,
    name: "English",
    flag: "🇬🇧",
    gradient: "from-blue-400 to-blue-600",
    bgGradient: "from-blue-50 via-blue-100 to-indigo-100",
    darkBgGradient: "from-blue-500/20 to-indigo-500/20"
  },
  {
    id: 2,
    name: "Hindi",
    flag: "🇮🇳",
    gradient: "from-orange-400 to-amber-600",
    bgGradient: "from-orange-50 via-amber-100 to-yellow-100",
    darkBgGradient: "from-orange-500/20 to-amber-500/20"
  },
  {
    id: 3,
    name: "French",
    flag: "🇫🇷",
    gradient: "from-purple-400 to-violet-600",
    bgGradient: "from-purple-50 via-violet-100 to-purple-100",
    darkBgGradient: "from-purple-500/20 to-violet-500/20"
  },
  {
    id: 4,
    name: "Spanish",
    flag: "🇪🇸",
    gradient: "from-red-400 to-rose-600",
    bgGradient: "from-red-50 via-pink-100 to-rose-100",
    darkBgGradient: "from-red-500/20 to-rose-500/20"
  },
  {
    id: 5,
    name: "German",
    flag: "🇩🇪",
    gradient: "from-gray-400 to-slate-600",
    bgGradient: "from-gray-50 via-slate-100 to-gray-100",
    darkBgGradient: "from-gray-500/20 to-slate-500/20"
  },
  {
    id: 6,
    name: "Japanese",
    flag: "🇯🇵",
    gradient: "from-pink-400 to-red-600",
    bgGradient: "from-pink-50 via-rose-100 to-red-100",
    darkBgGradient: "from-pink-500/20 to-red-500/20"
  }
];

export function LanguageSelection({ onBack, onLanguageSelect, isDarkMode = false }: LanguageSelectionProps) {
  const [selectedLanguageId, setSelectedLanguageId] = useState<number | null>(null);

  // Color tokens based on theme
  const colors = {
    bgPrimary: isDarkMode ? "bg-[#1C1C1E]" : "bg-[#F2F2F7]",
    bgSecondary: isDarkMode ? "bg-[#2C2C2E]" : "bg-white",
    bgTertiary: isDarkMode ? "bg-[#3A3A3C]" : "bg-gray-50",
    textPrimary: isDarkMode ? "text-white" : "text-gray-900",
    textSecondary: isDarkMode ? "text-gray-300" : "text-gray-600",
    textTertiary: isDarkMode ? "text-gray-400" : "text-gray-500",
    border: isDarkMode ? "border-gray-700" : "border-gray-200",
  };

  const handleLanguageClick = (language: typeof languages[0]) => {
    setSelectedLanguageId(language.id);
    // Add slight delay for visual feedback
    setTimeout(() => {
      onLanguageSelect?.(language.name);
    }, 200);
  };

  return (
    <div className={`min-h-screen ${colors.bgPrimary} transition-colors duration-300`}>
      {/* iPhone-sized container */}
      <div className="max-w-md mx-auto min-h-screen flex flex-col">
        
        {/* Header */}
        <header className={`${colors.bgSecondary} ${colors.border} border-b px-5 py-4 flex items-center justify-between`}>
          <button 
            onClick={onBack}
            className={`p-2 rounded-full ${colors.bgTertiary} ${colors.textPrimary} hover:scale-110 transition-transform`}
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          
          <div className="flex items-center space-x-2">
            <Globe className={`w-5 h-5 ${colors.textSecondary}`} />
            <h1 className={`text-lg ${colors.textPrimary}`}>
              Choose Language
            </h1>
          </div>
          
          <div className="w-9 h-9" /> {/* Spacer for centering */}
        </header>

        {/* Main Content */}
        <main className="flex-1 px-5 py-6 space-y-6 overflow-auto">
          
          {/* Hero Section */}
          <div className="text-center space-y-2">
            <div className={`inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br ${isDarkMode ? 'from-blue-500 to-purple-600' : 'from-blue-400 to-purple-500'} mb-2`}>
              <Brain className="w-10 h-10 text-white" />
            </div>
            <h2 className={`text-3xl ${colors.textPrimary}`}>
              Start Your Journey
            </h2>
            <p className={`${colors.textSecondary}`}>
              Select a language to begin learning with AI
            </p>
          </div>

          {/* Popular Badge */}
          <div className="flex items-center justify-center">
            <Badge className={`${isDarkMode ? 'bg-yellow-500/20 text-yellow-400' : 'bg-yellow-50 text-yellow-700'} border-0 px-4 py-1.5 rounded-full`}>
              <Star className="w-3 h-3 mr-1 fill-current" />
              Most Popular Languages
            </Badge>
          </div>

          {/* Language Grid */}
          <div className="grid grid-cols-2 gap-4">
            {languages.map((language) => (
              <Card 
                key={language.id}
                onClick={() => handleLanguageClick(language)}
                className={`bg-gradient-to-br ${isDarkMode ? language.darkBgGradient : language.bgGradient} border-0 shadow-lg hover:shadow-xl rounded-3xl overflow-hidden transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer group relative ${
                  selectedLanguageId === language.id ? 'ring-4 ring-blue-500' : ''
                }`}
              >
                <div className="p-5 flex flex-col items-center justify-center space-y-3 h-44">
                  {/* Flag Icon */}
                  <div className="text-6xl transform group-hover:scale-110 transition-transform duration-300">
                    {language.flag}
                  </div>
                  
                  {/* Language Name */}
                  <h4 className={`text-lg ${colors.textPrimary}`}>
                    {language.name}
                  </h4>
                  
                  {/* Stats */}
                  <div className="flex flex-col items-center space-y-1">
                    <div className="flex items-center space-x-1">
                      <Users className={`w-3 h-3 ${colors.textTertiary}`} />
                      <span className={`text-xs ${colors.textTertiary}`}>
                      </span>
                    </div>
                    <Badge className={`${colors.bgSecondary} ${colors.textSecondary} border-0 px-2 py-0.5 text-xs rounded-md`}>
                    </Badge>
                  </div>
                  
                  {/* Arrow indicator */}
                  <div className={`absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${colors.textTertiary}`}>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Info Card */}
          <Card className={`${colors.bgSecondary} border-0 shadow-md rounded-2xl`}>
            <div className="p-5">
              <div className="flex items-start space-x-3">
                <div className={`w-10 h-10 rounded-xl ${isDarkMode ? 'bg-blue-500/20' : 'bg-blue-100'} flex items-center justify-center flex-shrink-0`}>
                  <Sparkles className={`w-5 h-5 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                </div>
                <div>
                  <h4 className={`${colors.textPrimary} mb-1`}>
                    AI-Powered Learning
                  </h4>
                  <p className={`text-sm ${colors.textSecondary} leading-relaxed`}>
                    Each language comes with personalized AI tutoring, pronunciation coaching, and interactive games designed just for you.
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Progress Info */}
          <Card className={`${isDarkMode ? 'bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-green-500/30' : 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200'} border rounded-2xl`}>
            <div className="p-5 flex items-center space-x-3">
              <div className={`w-12 h-12 rounded-2xl ${isDarkMode ? 'bg-green-500/30' : 'bg-green-100'} flex items-center justify-center flex-shrink-0`}>
                <TrendingUp className={`w-6 h-6 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`} />
              </div>
              <div>
                <p className={`${colors.textPrimary} mb-0.5`}>
                  Track Your Progress
                </p>
                <p className={`text-sm ${colors.textSecondary}`}>
                  See your improvement with detailed analytics
                </p>
              </div>
            </div>
          </Card>

        </main>
      </div>
    </div>
  );
}
