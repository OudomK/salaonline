import React, { useState } from 'react';
import { User, MapPin, ChevronLeft, School, Building2, GraduationCap, LockKeyhole } from "lucide-react"; 
import { useNavigate } from 'react-router-dom';

// 🟢 Shadcn Components
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// 🟢 Import Data
import { provinces, districts, schools, grades } from "../../data/location";

export default function UserAccount() {
  const navigate = useNavigate();
  
  // State Profile Mockup
  const [profile, setProfile] = useState({
    firstName: "Sun",
    lastName: "Vatanak",
    phone: "012 999 888",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
    province: "p1",
    district: "d1_1",
    school: "2",
    grade: "12"
  });

  const [passwordData, setPasswordData] = useState({
    newPassword: "",
    confirmPassword: ""
  });

  const currentDistricts = districts[profile.province] || [];

  const handleSave = () => {
    alert("ព័ត៌មានត្រូវបានរក្សាទុក! (Saved Successfully)");
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20 font-khmer-os-battambang">
      
      {/* Header */}
      <div className="bg-white sticky top-0 z-40 border-b border-gray-100 px-4 h-16 flex items-center gap-3 shadow-sm">
         <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-gray-100 text-gray-600">
            <ChevronLeft size={24} />
         </button>
         <h1 className="text-lg font-bold text-gray-800">គណនីរបស់ខ្ញុំ (My Account)</h1>
      </div>

      <div className="max-w-2xl mx-auto p-4 space-y-6">
        
        {/* Profile Avatar */}
        <div className="flex flex-col items-center py-6">
            <div className="relative group">
                <Avatar className="w-24 h-24 border-4 border-white shadow-lg">
                    <AvatarImage src={profile.avatar} />
                    <AvatarFallback>SV</AvatarFallback>
                </Avatar>
            </div>
            <h2 className="mt-3 text-xl font-bold text-gray-900">{profile.firstName} {profile.lastName}</h2>
            <p className="text-gray-500 text-sm">Student ID: STU001</p>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-2 h-12 bg-white p-1 rounded-2xl shadow-sm border border-gray-100 mb-6">
                <TabsTrigger value="profile" className="rounded-xl font-bold data-[state=active]:bg-[#00B4F6] data-[state=active]:text-white">ព័ត៌មានទូទៅ</TabsTrigger>
                <TabsTrigger value="location" className="rounded-xl font-bold data-[state=active]:bg-[#00B4F6] data-[state=active]:text-white">ទីតាំង & សាលា</TabsTrigger>
            </TabsList>

            {/* --- Tab 1: General (Added Forgot Password Button) --- */}
            <TabsContent value="profile">
                <Card className="border-0 shadow-sm rounded-2xl">
                    <CardContent className="space-y-5 pt-6">
                        
                        {/* Name Fields */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-gray-500">ត្រកូល</label>
                                <Input value={profile.firstName} onChange={(e) => setProfile({...profile, firstName: e.target.value})} className="font-bold rounded-xl" />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-gray-500">ឈ្មោះ</label>
                                <Input value={profile.lastName} onChange={(e) => setProfile({...profile, lastName: e.target.value})} className="font-bold rounded-xl" />
                            </div>
                        </div>

                        {/* Phone Field */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-500">លេខទូរស័ព្ទ</label>
                            <Input value={profile.phone} onChange={(e) => setProfile({...profile, phone: e.target.value})} className="font-bold rounded-xl" />
                        </div>

                        {/* Change Password Section */}
                        <div className="pt-4 mt-2 border-t border-gray-100">
                            <label className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                                <LockKeyhole size={16} className="text-orange-500"/> ប្តូរពាក្យសម្ងាត់ (Change Password)
                            </label>
                            
                            <div className="space-y-3">
                                <Input 
                                    type="password" 
                                    placeholder="ពាក្យសម្ងាត់ថ្មី (New Password)" 
                                    className="font-bold rounded-xl h-12"
                                    value={passwordData.newPassword}
                                    onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                                />
                                <Input 
                                    type="password" 
                                    placeholder="បញ្ជាក់ពាក្យសម្ងាត់ (Confirm Password)" 
                                    className="font-bold rounded-xl h-12"
                                    value={passwordData.confirmPassword}
                                    onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                                />
                            </div>

                            {/* 🟢 ប៊ូតុង Forgot Password */}
                            <div className="flex justify-end mt-2">
                                <Button 
                                    variant="link" 
                                    className="text-xs font-bold text-[#00B4F6] p-0 h-auto"
                                    onClick={() => navigate('/forgot-password')}
                                >
                                    ភ្លេចពាក្យសម្ងាត់? (Forgot Password?)
                                </Button>
                            </div>
                        </div>

                        <Button onClick={handleSave} className="w-full bg-[#00B4F6] hover:bg-[#009bd1] text-white font-bold rounded-xl mt-2 h-12 shadow-md">
                            រក្សាទុកការកែប្រែ
                        </Button>

                    </CardContent>
                </Card>
            </TabsContent>

            {/* --- Tab 2: Location --- */}
            <TabsContent value="location">
                <Card className="border-0 shadow-sm rounded-2xl">
                    <CardHeader>
                        <CardTitle className="text-base font-bold flex items-center gap-2"><MapPin size={18} className="text-orange-500"/> ទីតាំង & ការសិក្សា</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-5">
                        
                        {/* Province */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500">ខេត្ត (Province)</label>
                            <Select value={profile.province} onValueChange={(val) => setProfile({...profile, province: val})}>
                                <SelectTrigger className="w-full rounded-xl font-bold h-12"><SelectValue /></SelectTrigger>
                                <SelectContent>{provinces.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}</SelectContent>
                            </Select>
                        </div>

                        {/* District */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500">ស្រុក (District)</label>
                            <Select value={profile.district} onValueChange={(val) => setProfile({...profile, district: val})}>
                                <SelectTrigger className="w-full rounded-xl font-bold h-12"><SelectValue /></SelectTrigger>
                                <SelectContent>{currentDistricts.map(d => <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>)}</SelectContent>
                            </Select>
                        </div>

                        {/* School */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500">សាលារៀន (School)</label>
                            <Select value={profile.school} onValueChange={(val) => setProfile({...profile, school: val})}>
                                <SelectTrigger className="w-full rounded-xl font-bold h-12"><SelectValue /></SelectTrigger>
                                <SelectContent>{schools.map(s => <SelectItem key={s.id} value={s.id.toString()}>{s.name}</SelectItem>)}</SelectContent>
                            </Select>
                        </div>

                        {/* Grade */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 flex items-center gap-1"><GraduationCap size={14}/> ថ្នាក់ទី (Grade)</label>
                            <Select value={profile.grade} onValueChange={(val) => setProfile({...profile, grade: val})}>
                                <SelectTrigger className="w-full rounded-xl font-bold h-12"><SelectValue /></SelectTrigger>
                                <SelectContent>{grades.map(g => <SelectItem key={g.id} value={g.id}>{g.name}</SelectItem>)}</SelectContent>
                            </Select>
                        </div>

                        <Button onClick={handleSave} className="w-full bg-[#00B4F6] hover:bg-[#009bd1] text-white font-bold rounded-xl mt-4 h-12 shadow-md">
                            ធ្វើបច្ចុប្បន្នភាព
                        </Button>

                    </CardContent>
                </Card>
            </TabsContent>

        </Tabs>
      </div>
    </div>
  );
}