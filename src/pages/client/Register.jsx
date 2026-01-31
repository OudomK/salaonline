import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, ChevronLeft } from "lucide-react";
import logo from "../../assets/logo.jpg";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

// 🟢 Import Data
import { provinces, districts, schools, grades } from "../../data/location";

// 🟢 Import Shadcn
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// 🟢 Zod Validation Schema
const registerSchema = z.object({
    firstName: z.string().min(1, "ត្រកូលត្រូវតែមាន"),
    lastName: z.string().min(1, "ឈ្មោះត្រូវតែមាន"),
    phone: z.string()
        .min(8, "លេខទូរស័ព្ទត្រូវតែមាន 8-9 ខ្ទង់")
        .max(9, "លេខទូរស័ព្ទត្រូវតែមាន 8-9 ខ្ទង់")
        .regex(/^[0-9]+$/, "លេខទូរស័ព្ទត្រូវតែជាលេខ"),
    gender: z.string().min(1, "សូមជ្រើសរើសភេទ"),
    grade: z.string().min(1, "សូមជ្រើសរើសថ្នាក់"),
    province: z.string().min(1, "សូមជ្រើសរើសខេត្ត"),
    district: z.string().min(1, "សូមជ្រើសរើសស្រុក"),
    school: z.string().min(1, "សូមជ្រើសរើសសាលារៀន"),
    customSchool: z.string().optional(),
    password: z.string().min(6, "ពាក្យសម្ងាត់ត្រូវតែមានយ៉ាងតិច 6 តួអក្សរ"),
}).refine((data) => {
    // If school is "other", customSchool must be provided
    if (data.school === "other") {
        return data.customSchool && data.customSchool.length > 0;
    }
    return true;
}, {
    message: "សូមបញ្ចូលឈ្មោះសាលារៀន",
    path: ["customSchool"],
});

export default function Register() {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [districtList, setDistrictList] = useState(districts.p1 || []);

    const form = useForm({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            phone: "",
            gender: "",
            grade: "",
            province: "p1",
            district: "",
            school: "",
            customSchool: "",
            password: "",
        },
    });

    const handleProvinceChange = (provinceId) => {
        form.setValue("province", provinceId);
        form.setValue("district", ""); // Reset district when province changes
        setDistrictList(districts[provinceId] || []);
    };

    const onSubmit = (data) => {
        console.log("Form Data:", data);
        // Navigate to OTP verification
        navigate("/otp-verification");
    };

    const selectedSchool = form.watch("school");

    return (
        <div className="min-h-screen w-full bg-white md:bg-[#f8f9fa] flex items-center justify-center font-khmer-os-battambang">

            {/* 🟢 Main Card Container */}
            <div className="w-full h-full md:h-auto md:max-w-lg md:bg-white md:rounded-[32px] md:p-10 md:shadow-xl md:border md:border-gray-100 flex flex-col">

                {/* 🟢 1. Header (Back Button) - ចេញតែនៅលើ Mobile (md:hidden) */}
                <div className="sticky top-0 z-20 bg-white/90 backdrop-blur-md px-4 py-3 flex items-center md:hidden">
                    <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="rounded-full -ml-2 text-gray-600 hover:bg-gray-100">
                        <ChevronLeft size={28} />
                    </Button>
                    <span className="font-bold text-lg ml-2 text-gray-800">ត្រឡប់ក្រោយ</span>
                </div>

                {/* Scrollable Content */}
                <div className="px-6 pb-10 pt-4 md:px-0 md:pt-0">

                    {/* Logo & Title */}
                    <div className="text-center mb-8">
                        <img src={logo} alt="Logo" className="w-24 h-24 mb-4 mx-auto object-contain" />
                        <h1 className="text-2xl font-extrabold text-[#1E3A8A]">ចុះឈ្មោះសិស្សថ្មី</h1>
                        <p className="text-gray-500 text-sm mt-2">បំពេញព័ត៌មានដើម្បីបង្កើតគណនីសិក្សា</p>
                    </div>

                    {/* Form */}
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">

                        {/* Names (2 Columns) */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-[12px] font-bold text-gray-500">ត្រកូល (First Name)</label>
                                <Input
                                    className="rounded-xl bg-gray-50 border-gray-200 h-12 font-bold focus-visible:ring-[#00B4F6]"
                                    {...form.register("firstName")}
                                />
                                {form.formState.errors.firstName && (
                                    <p className="text-[10px] text-red-500">{form.formState.errors.firstName.message}</p>
                                )}
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[12px] font-bold text-gray-500">ឈ្មោះ (Last Name)</label>
                                <Input
                                    className="rounded-xl bg-gray-50 border-gray-200 h-12 font-bold focus-visible:ring-[#00B4F6]"
                                    {...form.register("lastName")}
                                />
                                {form.formState.errors.lastName && (
                                    <p className="text-[10px] text-red-500">{form.formState.errors.lastName.message}</p>
                                )}
                            </div>
                        </div>

                        {/* Phone */}
                        <div className="space-y-1.5">
                            <label className="text-[12px] font-bold text-[#00B4F6]">លេខទូរស័ព្ទ (Phone)</label>
                            <div className="flex items-center rounded-xl bg-white border border-[#00B4F6] h-12 px-3 focus-within:ring-2 focus-within:ring-[#00B4F6] focus-within:ring-offset-0 shadow-sm">
                                <span className="mr-3 font-bold text-gray-500 text-sm border-r pr-3 py-1">🇰🇭 +855</span>
                                <input
                                    type="tel"
                                    className="flex-1 outline-none font-bold text-gray-900 bg-transparent h-full text-lg tracking-wide placeholder:text-gray-300"
                                    placeholder="12 345 678"
                                    {...form.register("phone")}
                                />
                            </div>
                            {form.formState.errors.phone && (
                                <p className="text-[10px] text-red-500">{form.formState.errors.phone.message}</p>
                            )}
                        </div>

                        {/* Gender & Grade (2 Columns) */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-[12px] font-bold text-gray-500">ភេទ (Gender)</label>
                                <Select
                                    value={form.watch("gender")}
                                    onValueChange={(val) => form.setValue("gender", val)}
                                >
                                    <SelectTrigger className="w-full rounded-xl h-12 bg-gray-50 border-gray-200 font-bold text-gray-600 focus:ring-[#00B4F6]">
                                        <SelectValue placeholder="ភេទ" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="M">ប្រុស (Male)</SelectItem>
                                        <SelectItem value="F">ស្រី (Female)</SelectItem>
                                    </SelectContent>
                                </Select>
                                {form.formState.errors.gender && (
                                    <p className="text-[10px] text-red-500">{form.formState.errors.gender.message}</p>
                                )}
                            </div>


                            <div className="space-y-1.5">
                                <label className="text-[12px] font-bold text-gray-500">ថ្នាក់ទី (Grade)</label>
                                <Select
                                    value={form.watch("grade")}
                                    onValueChange={(val) => form.setValue("grade", val)}
                                >
                                    <SelectTrigger className="w-full rounded-xl h-12 bg-gray-50 border-gray-200 font-bold text-gray-600 focus:ring-[#00B4F6]">
                                        <SelectValue placeholder="ថ្នាក់" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {grades && grades.map((g) => (
                                            <SelectItem key={g.id} value={g.id}>{g.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {form.formState.errors.grade && (
                                    <p className="text-[10px] text-red-500">{form.formState.errors.grade.message}</p>
                                )}
                            </div>
                        </div>

                        {/* Location Section */}
                        <div className="space-y-4 pt-1">
                            <div className="space-y-1.5">
                                <label className="text-[12px] font-bold text-gray-500">ខេត្ត (Province)</label>
                                <Select
                                    value={form.watch("province")}
                                    onValueChange={handleProvinceChange}
                                >
                                    <SelectTrigger className="w-full rounded-xl h-12 bg-gray-50 border-gray-200 font-bold text-gray-600 focus:ring-[#00B4F6]">
                                        <SelectValue placeholder="ជ្រើសរើសខេត្ត" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {provinces.map(p => (
                                            <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {form.formState.errors.province && (
                                    <p className="text-[10px] text-red-500">{form.formState.errors.province.message}</p>
                                )}
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[12px] font-bold text-[#00B4F6]">ស្រុក (District)</label>
                                <Select
                                    value={form.watch("district")}
                                    onValueChange={(val) => form.setValue("district", val)}
                                >
                                    <SelectTrigger className="w-full rounded-xl h-12 bg-white border-[#00B4F6] font-bold text-gray-800 ring-1 ring-[#00B4F6] focus:ring-2">
                                        <SelectValue placeholder="ជ្រើសរើសស្រុក" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {districtList.map((d) => (
                                            <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {form.formState.errors.district && (
                                    <p className="text-[10px] text-red-500">{form.formState.errors.district.message}</p>
                                )}
                            </div>
                        </div>

                        {/* School */}
                        <div className="space-y-1.5">
                            <label className="text-[12px] font-bold text-gray-500">សាលារៀន (School)</label>
                            <Select
                                value={form.watch("school")}
                                onValueChange={(val) => form.setValue("school", val)}
                            >
                                <SelectTrigger className="w-full rounded-xl h-12 bg-gray-50 border-gray-200 font-bold text-gray-600 focus:ring-[#00B4F6]">
                                    <SelectValue placeholder="ជ្រើសរើសសាលារៀន" />
                                </SelectTrigger>
                                <SelectContent>
                                    {schools && schools.map(s => (
                                        <SelectItem key={s.id} value={s.id.toString()}>{s.name}</SelectItem>
                                    ))}
                                    <SelectItem value="other">ផ្សេងៗ (Other)</SelectItem>
                                </SelectContent>
                            </Select>
                            {form.formState.errors.school && (
                                <p className="text-[10px] text-red-500">{form.formState.errors.school.message}</p>
                            )}
                        </div>

                        {/* Custom School Input - Show when "other" is selected */}
                        {selectedSchool === "other" && (
                            <div className="space-y-1.5">
                                <Input
                                    className="rounded-xl bg-gray-50 border-gray-200 h-12 font-bold focus-visible:ring-[#00B4F6]"
                                    placeholder="បញ្ចូលឈ្មោះសាលារៀន"
                                    {...form.register("customSchool")}
                                />
                                {form.formState.errors.customSchool && (
                                    <p className="text-[10px] text-red-500">{form.formState.errors.customSchool.message}</p>
                                )}
                            </div>
                        )}

                        {/* Password */}
                        <div className="space-y-1.5">
                            <label className="text-[12px] font-bold text-[#00B4F6]">ពាក្យសម្ងាត់ (Password)</label>
                            <div className="relative">
                                <Input
                                    type={showPassword ? "text" : "password"}
                                    className="rounded-xl bg-white border-[#00B4F6] h-12 font-bold pr-10 text-lg tracking-widest focus-visible:ring-[#00B4F6]"
                                    placeholder="••••••••"
                                    {...form.register("password")}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 p-1"
                                >
                                    {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                                </button>
                            </div>
                            {form.formState.errors.password && (
                                <p className="text-[10px] text-red-500">{form.formState.errors.password.message}</p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            className="w-full h-14 text-lg rounded-xl bg-[#00B4F6] hover:bg-[#009bd1] text-white font-bold shadow-lg shadow-blue-200 mt-6 active:scale-95 transition-all"
                        >
                            ចុះឈ្មោះ (Sign Up)
                        </Button>

                        <p className="text-center text-sm text-gray-500 pt-2 font-medium">
                            មានគណនីរួចហើយ? <Link to="/login" className="text-[#00B4F6] font-bold hover:underline ml-1">ចូលប្រើ (Sign In)</Link>
                        </p>

                    </form>
                </div>
            </div>
        </div>
    );
}