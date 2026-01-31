// src/data/quizData.js

export const quizData = {
  1: [ // English - Category ID 1
    {
      id: 1,
      question: "Which bird is known for its ability to mimic sounds?",
      options: ["A. Parrot", "B. Eagle", "C. Crow", "D. Pigeon"],
      correct: "A. Parrot",
      image: "https://cdn-icons-png.flaticon.com/512/3069/3069172.png"
    },
    {
      id: 2,
      question: "Complete the sentence: She ______ to school every day.",
      options: ["A. go", "B. goes", "C. going", "D. went"],
      correct: "B. goes",
      image: "https://cdn-icons-png.flaticon.com/512/3596/3596147.png"
    },
    {
      id: 3,
      question: "What is the past tense of 'Eat'?",
      options: ["A. Eated", "B. Ate", "C. Eaten", "D. Eating"],
      correct: "B. Ate",
      image: "https://cdn-icons-png.flaticon.com/512/1046/1046857.png"
    }
  ],

  2: [ // Chinese - Category ID 2
    {
      id: 1,
      question: "What does '你好' (Nǐ hǎo) mean?",
      options: ["A. Goodbye", "B. Thank you", "C. Hello", "D. Sorry"],
      correct: "C. Hello",
      image: "https://flagcdn.com/w320/cn.png"
    },
    {
      id: 2,
      question: "How do you say 'Thank you' in Chinese?",
      options: ["A. Xièxiè", "B. Zàijiàn", "C. Duìbùqǐ", "D. Hǎo"],
      correct: "A. Xièxiè",
      image: "https://flagcdn.com/w320/cn.png"
    }
  ]
};

// Categories configuration
export const categories = [
  {
    id: 1,
    name: "English",
    nameKh: "ភាសាអង់គ្លេស",
    flag: "https://flagcdn.com/w160/gb.png",
    color: "border-[#00B4F6] hover:bg-blue-50/50 hover:border-[#00B4F6]",
    textColor: "text-[#00B4F6]"
  },
  {
    id: 2,
    name: "Chinese",
    nameKh: "ភាសាចិន",
    flag: "https://flagcdn.com/w160/cn.png",
    color: "border-red-400 hover:bg-red-50/50 hover:border-red-400",
    textColor: "text-red-500"
  },
  {
    id: 3,
    name: "Thai",
    nameKh: "ភាសាថៃ",
    flag: "https://flagcdn.com/w160/th.png",
    color: "border-blue-500 hover:bg-blue-50/50 hover:border-blue-500",
    textColor: "text-blue-500",
    comingSoon: true
  },
  {
    id: 4,
    name: "Korean",
    nameKh: "ភាសាកូរ៉េ",
    flag: "https://flagcdn.com/w160/kr.png",
    color: "border-purple-500 hover:bg-purple-50/50 hover:border-purple-500",
    textColor: "text-purple-500",
    comingSoon: true
  },
  {
    id: 5,
    name: "Japanese",
    nameKh: "ភាសាជប៉ុន",
    flag: "https://flagcdn.com/w160/jp.png",
    color: "border-pink-500 hover:bg-pink-50/50 hover:border-pink-500",
    textColor: "text-pink-500",
    comingSoon: true
  }
];

// Helper functions for localStorage
export const getCompletedTests = () => {
  try {
    const stored = localStorage.getItem('completedPlacementTests');
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
};

export const saveTestResult = (categoryId, score, totalQuestions, level) => {
  const completed = getCompletedTests();
  completed[categoryId] = {
    score,
    totalQuestions,
    level,
    completedAt: new Date().toISOString()
  };
  localStorage.setItem('completedPlacementTests', JSON.stringify(completed));
};

export const hasCompletedTest = (categoryId) => {
  const completed = getCompletedTests();
  return !!completed[categoryId];
};

export const getTestResult = (categoryId) => {
  const completed = getCompletedTests();
  return completed[categoryId] || null;
};
