import React from 'react';
import { Users, UserPlus, Zap, BookOpen, Download, Calendar } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

// 🟢 IMPORT SHADCN COMPONENTS
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// --- MOCK DATA ---
const chartData = [
  { name: 'Mon', students: 12, active: 8 },
  { name: 'Tue', students: 19, active: 15 },
  { name: 'Wed', students: 15, active: 12 },
  { name: 'Thu', students: 25, active: 20 },
  { name: 'Fri', students: 32, active: 28 },
  { name: 'Sat', students: 40, active: 35 },
  { name: 'Sun', students: 45, active: 40 },
];

const recentSales = [
  { name: "Sok Dara", email: "dara@gmail.com", amount: "+$25.00", course: "English L1" },
  { name: "Chan Maly", email: "maly@gmail.com", amount: "+$35.00", course: "Chinese Basic" },
  { name: "Keo Visal", email: "visal@gmail.com", amount: "+$25.00", course: "English L1" },
  { name: "Ly Bopha", email: "bopha@gmail.com", amount: "+$40.00", course: "Korean Topik" },
  { name: "Vann Soth", email: "soth@gmail.com", amount: "+$25.00", course: "English L2" },
];
const handlePrint = () => {
  window.print();
};
export default function Dashboard() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6 animate-fade-in-up pb-20">
      
      {/* 1. HEADER & ACTIONS */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between space-y-2">
        <div>
           <h2 className="text-3xl font-bold tracking-tight text-gray-900 font-khmer-os-battambang">ផ្ទាំងគ្រប់គ្រង</h2>
           <p className="text-gray-500 font-khmer-os-battambang">ទិដ្ឋភាពទូទៅនៃសាលារៀនរបស់អ្នក។</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" className="hidden md:flex gap-2 rounded-xl">
             <Calendar className="mr-2 h-4 w-4" />
             {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </Button>
               <Button 
         onClick={handlePrint} // 🟢 ដាក់ត្រង់នេះ
         className="bg-[#00B4F6] hover:bg-[#009bd1] text-white rounded-xl gap-2 shadow-lg shadow-blue-200"
         >
         <Download className="mr-2 h-4 w-4" /> Download PDF
         </Button>
        </div>
      </div>

      {/* 2. TABS SECTION */}
      <Tabs defaultValue="overview" className="space-y-4">
        
        <TabsList className="bg-white p-1 rounded-xl border border-gray-100 shadow-sm hidden md:inline-flex">
          <TabsTrigger value="overview" className="rounded-lg data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900 font-bold">Overview</TabsTrigger>
          <TabsTrigger value="analytics" className="rounded-lg data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900 font-bold">Analytics</TabsTrigger>
          <TabsTrigger value="students" className="rounded-lg data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900 font-bold">Students</TabsTrigger>
        </TabsList>

        {/* --- OVERVIEW CONTENT --- */}
        <TabsContent value="overview" className="space-y-4">
          
          {/* STATS CARDS */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            
            {/* Total Students */}
            <Card className="rounded-2xl shadow-sm hover:shadow-md transition-all">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-bold text-gray-500 font-khmer-os-battambang">សិស្សសរុប (Total)</CardTitle>
                <Users className="h-4 w-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,250</div>
                <p className="text-xs text-muted-foreground text-green-600 font-medium mt-1">
                  +20.1% from last month
                </p>
              </CardContent>
            </Card>

            {/* Active Students */}
            <Card className="rounded-2xl shadow-sm hover:shadow-md transition-all">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-bold text-gray-500 font-khmer-os-battambang">កំពុងសិក្សា (Active)</CardTitle>
                <Zap className="h-4 w-4 text-[#00B4F6]" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-[#00B4F6]">340</div>
                <p className="text-xs text-muted-foreground mt-1">
                  +180 since last hour
                </p>
              </CardContent>
            </Card>

            {/* New Signups */}
            <Card className="rounded-2xl shadow-sm hover:shadow-md transition-all">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-bold text-gray-500 font-khmer-os-battambang">ចុះឈ្មោះថ្មី (New)</CardTitle>
                <UserPlus className="h-4 w-4 text-orange-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+15</div>
                <p className="text-xs text-muted-foreground mt-1">
                  +19% from yesterday
                </p>
              </CardContent>
            </Card>

            {/* Total Courses */}
            <Card className="rounded-2xl shadow-sm hover:shadow-md transition-all">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-bold text-gray-500 font-khmer-os-battambang">វគ្គសិក្សា (Courses)</CardTitle>
                <BookOpen className="h-4 w-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground mt-1">
                  3 categories active
                </p>
              </CardContent>
            </Card>
          </div>

          {/* CHARTS & LISTS */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            
            {/* LEFT: MAIN CHART (Big) */}
            <Card className="col-span-4 rounded-2xl shadow-sm">
              <CardHeader>
                <CardTitle className="font-khmer-os-battambang">ស្ថិតិសិស្សចូលរៀន (Overview)</CardTitle>
                <CardDescription>
                  សកម្មភាពសិស្សប្រចាំសប្តាហ៍នេះ
                </CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id="colorStudents" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#00B4F6" stopOpacity={0.2}/>
                          <stop offset="95%" stopColor="#00B4F6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                      <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}} />
                      <Area type="monotone" dataKey="students" stroke="#00B4F6" strokeWidth={3} fillOpacity={1} fill="url(#colorStudents)" />
                      <Area type="monotone" dataKey="active" stroke="#82ca9d" strokeWidth={3} fillOpacity={1} fill="url(#colorStudents)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* RIGHT: RECENT SALES / STUDENTS */}
            <Card className="col-span-3 rounded-2xl shadow-sm">
              <CardHeader>
                <CardTitle className="font-khmer-os-battambang">ចុះឈ្មោះថ្មីៗ (Recent)</CardTitle>
                <CardDescription>
                  សិស្សចំនួន 15 នាក់បានចុះឈ្មោះថ្ងៃនេះ
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {recentSales.map((sale, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-9 w-9 bg-blue-50 text-[#00B4F6]">
                          <AvatarFallback className="font-bold">{sale.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="space-y-1">
                          <p className="text-sm font-bold leading-none text-gray-800">{sale.name}</p>
                          <p className="text-xs text-gray-500">{sale.email}</p>
                        </div>
                      </div>
                      <div className="text-right">
                         <div className="font-bold text-sm text-green-600">{sale.amount}</div>
                         <div className="text-[10px] text-gray-400">{sale.course}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

          </div>
        </TabsContent>
        
        <TabsContent value="analytics" className="h-[400px] flex items-center justify-center text-gray-400">
           Analytics Content Coming Soon...
        </TabsContent>

      </Tabs>
    </div>
  );
}