import React, { useState } from "react";
import { Card } from "./ui/card";


import {
  ChevronDown,
  ChevronUp,
  Globe,
  Target,
  BookOpen,
  Trophy,
} from "lucide-react";

interface LearningGoalProps {
  onNavigate: (page) => void;
  isDarkMode?: boolean;
}

export default function LearningGoal({
  onNavigate,
  isDarkMode = false,
}: LearningGoalProps) {
  const [openCard, setOpenCard] = useState<string | null>(null);

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
  };

  const goals = [
    {
      id: "fluency",
      label: "Language Fluency",
      description: "Master pronunciation skills",
      icon: Trophy,
      option: { label: "Practice Pronunciation", page: "pronunciation" },
    },
    {
      id: "travel",
      label: "Travel & Culture",
      description: "Explore the world confidently",
      icon: Globe,
      option: { label: "Learn with AI Tutor"},
    },
    {
      id: "career",
      label: "Career Growth",
      description: "Professional communication",
      icon: Target,
      option: { label: "Professional Accent"},
    },
    {
      id: "hobby",
      label: "Hobby",
      description: "Learn for fun",
      icon: BookOpen,
      option: { label: "Fun Exercises"},
    },
  ];

  return (
    <div
      className={`min-h-screen ${colors.bgPrimary} flex items-center justify-center p-4 transition-colors duration-300`}
    >
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className={`text-3xl mb-2 ${colors.textPrimary}`}>
            Choose Your Goal 🎯
          </h2>
          <p className={`text-sm ${colors.textSecondary}`}>
            Select your learning path to begin
          </p>
        </div>

        {/* Main Card Container */}
        <Card
          className={`${colors.bgSecondary} border-0 shadow-2xl rounded-3xl p-6 space-y-4`}
        >
          {goals.map((goal) => {
            const Icon = goal.icon;
            const isOpen = openCard === goal.id;

            return (
              <div key={goal.id} className="transition-all duration-300">
                {/* Main Goal Card */}
                <button
                  onClick={() =>
                    setOpenCard(isOpen ? null : goal.id)
                  }
                  className={`w-full p-5 rounded-2xl border-2 ${colors.border} ${colors.bgTertiary} text-left transition-all duration-300 hover:shadow-lg`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center ${colors.bgSecondary}`}
                      >
                        <Icon
                          className={`w-6 h-6 ${colors.textSecondary}`}
                        />
                      </div>

                      <div>
                        <h3 className={`${colors.textPrimary}`}>
                          {goal.label}
                        </h3>
                        <p
                          className={`text-sm ${colors.textTertiary}`}
                        >
                          {goal.description}
                        </p>
                      </div>
                    </div>

                    {isOpen ? (
                      <ChevronUp
                        className={`w-5 h-5 ${colors.textSecondary}`}
                      />
                    ) : (
                      <ChevronDown
                        className={`w-5 h-5 ${colors.textSecondary}`}
                      />
                    )}
                  </div>
                </button>

                {/* Dropdown Option */}
                {isOpen && (
                  <div className="mt-3 pl-4">
                    <button
                      onClick={() => onNavigate(goal.option.page)}
                      className={`w-full h-12 rounded-2xl ${colors.accentBlue} ${colors.accentBlueHover} text-white transition-all duration-300 hover:shadow-lg active:scale-[0.98]`}
                    >
                      {goal.option.label}
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </Card>
      </div>
    </div>
  );
}