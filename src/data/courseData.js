// src/data/courseData.js

export const courseDetail = {
  id: 1,
  title: "English for Beginners: Level 1",
  coverImage: "https://i.pinimg.com/736x/97/67/12/97671241df8391113cd0d2c985829992.jpg",
  description: "រៀនមូលដ្ឋានគ្រឹះនៃភាសាអង់គ្លេសសម្រាប់អ្នកចាប់ផ្តើមដំបូង។",
  lessons: [
    { id: 1, title: "Introduction to English", duration: "10:00 min", isLocked: false, isCompleted: true },
    { id: 2, title: "Greetings & Introductions", duration: "12:30 min", isLocked: false, isCompleted: false }, // កំពុងរៀន
    { id: 3, title: "Verb to Be (am, is, are)", duration: "15:00 min", isLocked: true, isCompleted: false },  // ជាប់សោ
    { id: 4, title: "Present Simple Tense", duration: "18:00 min", isLocked: true, isCompleted: false },
    { id: 5, title: "Daily Routines", duration: "14:20 min", isLocked: true, isCompleted: false },
    { id: 6, title: "Final Review", duration: "20:00 min", isLocked: true, isCompleted: false },
  ]
};