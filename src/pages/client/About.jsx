import React from 'react';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] bg-white px-4">
      {/* Icon Section */}
      <div className="mb-8 animate-bounce">
        <div className="bg-blue-50 p-6 rounded-full shadow-sm">
          {/* User/Team Icon for 'About Us' */}
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-16 w-16 text-[#00B4F6]" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        </div>
      </div>

      {/* Text Section */}
      <div className="text-center max-w-lg">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          អំពីពួកយើង (About Us)
        </h1>
        <h2 className="text-2xl font-semibold text-[#00B4F6] mb-6 uppercase tracking-wider">
          Coming Soon
        </h2>
        
        <p className="text-gray-500 mb-8 text-lg leading-relaxed">
          ប្រវត្តិនិងបេសកកម្មរបស់ SALA ONLINE កំពុងត្រូវបានរៀបចំ។
          <br />
          សូមរង់ចាំតាមដានទាំងអស់គ្នា!
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            to="/home" 
            className="px-8 py-3 bg-[#00B4F6] text-white rounded-full font-medium hover:bg-blue-500 transition-colors shadow-lg shadow-blue-200"
          >
            ត្រឡប់ទៅទំព័រដើម
          </Link>
          
          <Link 
            to="/courses" 
            className="px-8 py-3 border-2 border-[#00B4F6] text-[#00B4F6] rounded-full font-medium hover:bg-blue-50 transition-colors"
          >
            ទៅកាន់ថ្នាក់រៀន
          </Link>
        </div>
      </div>
    </div>
  );
};

export default About;