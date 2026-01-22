import React, { useState } from "react";
import { User, BookOpen, Award, Globe, CreditCard, MapPin, Share2, Edit2, ChevronRight, LogOut, FileText } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

// Shadcn
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

export default function Profile() {
  const navigate = useNavigate();
  const [showLogoutAlert, setShowLogoutAlert] = useState(false);

  // Mock Data
  const user = {
    name: "Sun Vatanak",
    location: "Phnom Penh, Cambodia",
    phone: "012 999 888", // 🟢 ប្រើ Phone ជំនួស Email
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
    role: "Student"
  };

  const handleLogout = () => {
    navigate("/login");
  };

  const menuGroups = [
    {
      id: "general",
      title: "ទូទៅ (General)",
      items: [
        { icon: <User size={18} />, label: "គណនី (Account)", link: "/account", color: "text-blue-500 bg-blue-50" },
        { icon: <FileText size={18} />, label: "ធ្វើតេស្ត (Placement Test)", link: "/placement-test", color: "text-orange-500 bg-orange-50" },
        { icon: <Award size={18} />, label: "វិញ្ញាបនបត្រ (Certificates)", link: "/certificate", color: "text-yellow-500 bg-yellow-50" },
      ]
    },
    {
      id: "learning",
      title: "ការសិក្សា (Learning)",
      items: [
        { icon: <BookOpen size={18} />, label: "ការសិក្សារបស់ខ្ញុំ (My Learning)", link: "/my-learning", color: "text-green-500 bg-green-50" },
        { icon: <Edit2 size={18} />, label: "កិច្ចការផ្ទះ (Homework)", link: "/homework", color: "text-purple-500 bg-purple-50" },
      ]
    },
    // {
    //   id: "billing",
    //   title: "ផ្សេងៗ (Billing & More)",
    //   items: [
    //     { icon: <CreditCard size={18} />, label: "ការទូទាត់ (Payment)", link: "/payment", color: "text-indigo-500 bg-indigo-50" },
    //     { icon: <Share2 size={18} />, label: "ណែនាំមិត្ត (Referral)", link: "/referral", color: "text-teal-500 bg-teal-50" },
    //     { icon: <MapPin size={18} />, label: "ទីតាំង (Location)", link: "/account", color: "text-red-500 bg-red-50" },
    //   ]
    // }
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 pb-24 md:pb-10 font-khmer-os-battambang">
      
      {/* Header */}
      <div className="bg-white pb-8 pt-6 px-4 rounded-b-[40px] shadow-sm mb-6 md:bg-transparent md:shadow-none md:p-0 md:max-w-4xl md:mx-auto md:mt-8">
         <div className="flex flex-col md:flex-row items-center gap-6 md:bg-white md:p-8 md:rounded-[32px] md:shadow-sm md:border md:border-gray-100 transition-all">
            <div className="relative">
                <Avatar className="w-24 h-24 md:w-28 md:h-28 border-4 border-white shadow-lg">
                    <AvatarImage src={user.avatar} className="object-cover" />
                    <AvatarFallback>SV</AvatarFallback>
                </Avatar>
            </div>
            
            <div className="flex-1 text-center md:text-left space-y-1">
                <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
                {/* 🟢 បង្ហាញ Phone */}
                <p className="text-sm text-gray-500 font-bold font-mono tracking-wide text-[#00B4F6]">{user.phone}</p>
                <div className="flex items-center justify-center md:justify-start gap-2 text-gray-400 text-xs mt-2">
                    <MapPin size={14} /> <span>{user.location}</span>
                </div>
            </div>

            <Button asChild className="rounded-full px-6 bg-[#00B4F6] hover:bg-[#009bd1] text-white font-bold shadow-md">
                <Link to="/account"><Edit2 size={16} className="mr-2"/> Edit Profile</Link>
            </Button>
         </div>
      </div>

      {/* Menu */}
      <div className="px-4 max-w-4xl mx-auto space-y-6">
         {menuGroups.map((group) => (
            <Card key={group.id} className="border-0 shadow-sm rounded-[24px] overflow-hidden bg-white">
                <CardHeader className="bg-gray-50/50 border-b border-gray-100 py-3 px-5">
                    <CardTitle className="text-sm font-bold text-gray-500 uppercase tracking-wide">{group.title}</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    {group.items.map((item, index) => (
                        <div key={index}>
                            <Link to={item.link} className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${item.color} shadow-sm`}>{item.icon}</div>
                                    <span className="font-bold text-gray-700 text-sm md:text-base">{item.label}</span>
                                </div>
                                <ChevronRight size={18} className="text-gray-400" />
                            </Link>
                            {index !== group.items.length - 1 && <Separator className="opacity-50" />}
                        </div>
                    ))}
                </CardContent>
            </Card>
         ))}

         {/* 3. LOGOUT BUTTON */}
         <Button variant="outline" onClick={() => setShowLogoutAlert(true)} className="w-full h-14 rounded-[20px] text-red-500 border-red-100 bg-white hover:bg-red-50 font-bold shadow-sm mt-4 mb-8">
            <LogOut size={20} className="mr-2"/> ចាកចេញ (Sign Out)
         </Button>
         <p className="text-center text-xs text-gray-400 pb-8">Version 1.0.0 • Sala Digital App</p>
      </div>

      {/* Logout Alert */}
      <AlertDialog open={showLogoutAlert} onOpenChange={setShowLogoutAlert}>
        <AlertDialogContent className="rounded-[24px]">
            <AlertDialogHeader><AlertDialogTitle>បញ្ជាក់ការចាកចេញ?</AlertDialogTitle></AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel className="rounded-xl border-0 bg-gray-100">បោះបង់</AlertDialogCancel>
                <AlertDialogAction onClick={handleLogout} className="rounded-xl bg-red-500 hover:bg-red-600">ចាកចេញ</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  );
}