import React, { useState } from 'react';
import { Save, User, Lock, Camera, Bell, Shield, Key, Mail, Phone, Moon } from "lucide-react";
import { Link } from 'react-router-dom';

// 🟢 IMPORT SHADCN COMPONENTS
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch"; // បើមិនទាន់មាន អាចប្រើ Checkbox ធម្មតាក៏បាន

// --- MOCK DATA ---
const initialProfile = {
  name: "SALA Admin",
  role: "Super Admin",
  email: "admin@school.com",
  phone: "012 999 888",
  avatar: null
};

export default function AdminSettings() {
  const [profile, setProfile] = useState(initialProfile);
  const [passwords, setPasswords] = useState({ current: "", new: "", confirm: "" });

  // --- HANDLERS ---
  const handleSaveProfile = (e) => {
    e.preventDefault();
    alert("រក្សាទុកព័ត៌មានជោគជ័យ! (Profile Updated)");
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      alert("ពាក្យសម្ងាត់ថ្មីមិនដូចគ្នាទេ!");
      return;
    }
    alert("ប្តូរពាក្យសម្ងាត់ជោគជ័យ! (Password Changed)");
  };

  const handleForgotPassword = () => {
    alert(`តំណភ្ជាប់សម្រាប់កំណត់ពាក្យសម្ងាត់ថ្មី ត្រូវបានផ្ញើទៅកាន់ ${profile.email}`);
  };

  return (
    <div className="space-y-6 animate-fade-in-up pb-20">
      
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-gray-900 font-khmer-os-battambang">ការកំណត់ (Settings)</h1>
        <p className="text-sm text-gray-500 font-khmer-os-battambang">កែប្រែព័ត៌មានផ្ទាល់ខ្លួន និងសុវត្ថិភាពគណនី។</p>
      </div>

      <Tabs defaultValue="general" className="flex flex-col lg:flex-row gap-8">
        
        {/* 1. SIDEBAR TABS (VERTICAL ON DESKTOP) */}
        <TabsList className="flex flex-col h-auto w-full lg:w-64 bg-transparent space-y-1 p-0 justify-start">
          <TabsTrigger 
            value="general" 
            className="w-full justify-start gap-3 px-4 py-3 font-bold text-gray-600 data-[state=active]:bg-white data-[state=active]:text-[#00B4F6] data-[state=active]:shadow-sm rounded-xl border border-transparent data-[state=active]:border-gray-100"
          >
             <User size={18} /> ទូទៅ (General)
          </TabsTrigger>
          <TabsTrigger 
            value="security" 
            className="w-full justify-start gap-3 px-4 py-3 font-bold text-gray-600 data-[state=active]:bg-white data-[state=active]:text-[#00B4F6] data-[state=active]:shadow-sm rounded-xl border border-transparent data-[state=active]:border-gray-100"
          >
             <Shield size={18} /> សុវត្ថិភាព (Security)
          </TabsTrigger>
          <TabsTrigger 
            value="notifications" 
            className="w-full justify-start gap-3 px-4 py-3 font-bold text-gray-600 data-[state=active]:bg-white data-[state=active]:text-[#00B4F6] data-[state=active]:shadow-sm rounded-xl border border-transparent data-[state=active]:border-gray-100"
          >
             <Bell size={18} /> ការជូនដំណឹង
          </TabsTrigger>
        </TabsList>

        {/* 2. CONTENT AREA */}
        <div className="flex-1">
           
           {/* === TAB: GENERAL PROFILE === */}
           <TabsContent value="general" className="mt-0 space-y-6">
             <Card className="rounded-2xl border-gray-100 shadow-sm">
                <CardHeader className="border-b border-gray-50 pb-4">
                  <CardTitle className="font-bold text-lg font-khmer-os-battambang">ព័ត៌មានគណនី (Profile)</CardTitle>
                  <CardDescription className="font-khmer-os-battambang">កែប្រែឈ្មោះ និងព័ត៌មានទំនាក់ទំនងរបស់អ្នក។</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <form onSubmit={handleSaveProfile} className="space-y-6">
                     {/* Avatar */}
                     <div className="flex items-center gap-6">
                        <div className="relative group cursor-pointer">
                           <Avatar className="w-24 h-24 border-4 border-white shadow-md">
                              <AvatarImage src={profile.avatar} className="object-cover" />
                              <AvatarFallback className="text-2xl font-bold bg-gray-100 text-gray-400">SA</AvatarFallback>
                           </Avatar>
                           <div className="absolute bottom-0 right-0 bg-[#00B4F6] text-white p-2 rounded-full shadow-sm hover:scale-110 transition-transform">
                              <Camera size={16} />
                           </div>
                        </div>
                        <div>
                           <h4 className="font-bold text-lg text-gray-900">{profile.name}</h4>
                           <p className="text-sm text-gray-500">{profile.role}</p>
                        </div>
                     </div>

                     {/* Inputs */}
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                           <label className="text-xs font-bold text-gray-500 flex items-center gap-1 font-khmer-os-battambang">
                              <User size={14}/> ឈ្មោះពេញ (Name)
                           </label>
                           <Input 
                             value={profile.name} 
                             onChange={(e) => setProfile({...profile, name: e.target.value})}
                             className="bg-gray-50 border-gray-200 focus-visible:ring-[#00B4F6] font-bold rounded-xl h-11"
                           />
                        </div>
                        <div className="space-y-2">
                           <label className="text-xs font-bold text-gray-500 flex items-center gap-1 font-khmer-os-battambang">
                              <Phone size={14}/> លេខទូរស័ព្ទ (Phone)
                           </label>
                           <Input 
                             value={profile.phone} 
                             onChange={(e) => setProfile({...profile, phone: e.target.value})}
                             className="bg-gray-50 border-gray-200 focus-visible:ring-[#00B4F6] font-bold rounded-xl h-11"
                           />
                        </div>
                        <div className="md:col-span-2 space-y-2">
                           <label className="text-xs font-bold text-gray-500 flex items-center gap-1 font-khmer-os-battambang">
                              <Mail size={14}/> អ៊ីមែល (Email)
                           </label>
                           <Input 
                             value={profile.email} 
                             disabled
                             className="bg-gray-100 border-gray-200 text-gray-500 cursor-not-allowed font-medium rounded-xl h-11"
                           />
                           <p className="text-[10px] text-gray-400 ml-1 font-khmer-os-battambang">*អ៊ីមែលមិនអាចកែប្រែបានទេ សូមទាក់ទង Super Admin។</p>
                        </div>
                     </div>

                     <div className="flex justify-end pt-2">
                        <Button type="submit" className="bg-[#00B4F6] hover:bg-[#009bd1] text-white font-bold shadow-md shadow-blue-200 rounded-xl gap-2 font-khmer-os-battambang h-11 px-8">
                           <Save size={18} /> រក្សាទុក (Save)
                        </Button>
                     </div>
                  </form>
                </CardContent>
             </Card>
           </TabsContent>

           {/* === TAB: SECURITY === */}
           <TabsContent value="security" className="mt-0 space-y-6">
             <Card className="rounded-2xl border-gray-100 shadow-sm max-w-2xl">
                <CardHeader className="border-b border-gray-50 pb-4">
                  <CardTitle className="font-bold text-lg font-khmer-os-battambang text-orange-600 flex items-center gap-2">
                    <Shield size={20}/> សុវត្ថិភាព (Security)
                  </CardTitle>
                  <CardDescription className="font-khmer-os-battambang">ផ្លាស់ប្តូរពាក្យសម្ងាត់ដើម្បីការពារគណនី។</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <form onSubmit={handleChangePassword} className="space-y-6">
                     
                     <div className="space-y-2">
                        <div className="flex justify-between items-center">
                           <label className="text-xs font-bold text-gray-500 flex items-center gap-1 font-khmer-os-battambang">
                              <Key size={14}/> ពាក្យសម្ងាត់បច្ចុប្បន្ន
                           </label>
                           <span onClick={handleForgotPassword} className="text-xs font-bold text-[#00B4F6] hover:underline cursor-pointer font-khmer-os-battambang">
                              ភ្លេចពាក្យសម្ងាត់?
                           </span>
                        </div>
                        <Input 
                          type="password" 
                          required
                          placeholder="••••••••"
                          className="bg-white border-gray-200 focus-visible:ring-[#00B4F6] rounded-xl h-11"
                          onChange={(e) => setPasswords({...passwords, current: e.target.value})}
                        />
                     </div>

                     <div className="h-px bg-gray-50"></div>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                           <label className="text-xs font-bold text-gray-500 block font-khmer-os-battambang">ពាក្យសម្ងាត់ថ្មី (New)</label>
                           <Input 
                             type="password" required placeholder="New password"
                             className="bg-white border-gray-200 focus-visible:ring-[#00B4F6] rounded-xl h-11"
                             onChange={(e) => setPasswords({...passwords, new: e.target.value})}
                           />
                        </div>
                        <div className="space-y-2">
                           <label className="text-xs font-bold text-gray-500 block font-khmer-os-battambang">បញ្ជាក់ពាក្យសម្ងាត់ (Confirm)</label>
                           <Input 
                             type="password" required placeholder="Confirm password"
                             className="bg-white border-gray-200 focus-visible:ring-[#00B4F6] rounded-xl h-11"
                             onChange={(e) => setPasswords({...passwords, confirm: e.target.value})}
                           />
                        </div>
                     </div>

                     <div className="pt-2">
                        <Button type="submit" className="w-full bg-gray-900 hover:bg-gray-800 text-white font-bold shadow-md rounded-xl gap-2 font-khmer-os-battambang h-11">
                           <Shield size={18} /> ប្តូរពាក្យសម្ងាត់ (Update Password)
                        </Button>
                     </div>
                  </form>
                </CardContent>
             </Card>
           </TabsContent>

           {/* === TAB: NOTIFICATIONS === */}
           <TabsContent value="notifications" className="mt-0 space-y-6">
             <Card className="rounded-2xl border-gray-100 shadow-sm">
                <CardHeader className="border-b border-gray-50 pb-4">
                  <CardTitle className="font-bold text-lg font-khmer-os-battambang">ការជូនដំណឹង (Preferences)</CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                   
                   <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                      <div className="flex items-center gap-3">
                         <div className="p-2 bg-white rounded-lg text-gray-500 shadow-sm border border-gray-100"><Bell size={20}/></div>
                         <div>
                            <p className="font-bold text-gray-800 text-sm">Email Notifications</p>
                            <p className="text-xs text-gray-500 font-khmer-os-battambang">ទទួលអ៊ីមែលនៅពេលមានសិស្សចុះឈ្មោះថ្មី។</p>
                         </div>
                      </div>
                      <Switch defaultChecked />
                   </div>

                   <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100 opacity-60">
                      <div className="flex items-center gap-3">
                         <div className="p-2 bg-white rounded-lg text-gray-500 shadow-sm border border-gray-100"><Moon size={20}/></div>
                         <div>
                            <p className="font-bold text-gray-800 text-sm">Dark Mode</p>
                            <p className="text-xs text-gray-500 font-khmer-os-battambang">មុខងារនេះនឹងមកដល់ឆាប់ៗ។</p>
                         </div>
                      </div>
                      <Switch disabled />
                   </div>

                </CardContent>
             </Card>
           </TabsContent>

        </div>
      </Tabs>
    </div>
  );
}