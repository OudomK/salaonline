import React from 'react';
import { Link } from 'react-router-dom';

const Contact = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] bg-white px-4">
      {/* Icon Section */}
      <div className="mb-8 animate-bounce">
        <div className="bg-blue-50 p-6 rounded-full shadow-sm">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-16 w-16 text-[#00B4F6]" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
      </div>

      {/* Text Section */}
      <div className="text-center max-w-lg">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          ទាក់ទងមកកាន់ពួកយើង
        </h1>
        <h2 className="text-2xl font-semibold text-[#00B4F6] mb-6 uppercase tracking-wider">
          Coming Soon
        </h2>
        
        <p className="text-gray-500 mb-8 text-lg leading-relaxed">
          សូមអធ្យាស្រ័យ! មុខងារសម្រាប់ទាក់ទងកំពុងស្ថិតក្នុងដំណាក់កាលអភិវឌ្ឍន៍។
          <br />
          ក្រុមការងារយើងនឹងដាក់ឲ្យប្រើប្រាស់ក្នុងពេលឆាប់ៗនេះ។
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            to="/home" 
            className="px-8 py-3 bg-[#00B4F6] text-white rounded-full font-medium hover:bg-blue-500 transition-colors shadow-lg shadow-blue-200"
          >
            ត្រឡប់ទៅទំព័រដើម (Go Home)
          </Link>
          
          <Link 
            to="/courses" 
            className="px-8 py-3 border-2 border-[#00B4F6] text-[#00B4F6] rounded-full font-medium hover:bg-blue-50 transition-colors"
          >
            មើលវគ្គសិក្សា (Courses)
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Contact;