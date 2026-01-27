export const getPhoneStyle = (phone) => {
    if (!phone) return { bg: "bg-gray-500", icon: "unknown" };
    const p = phone.replace(/\s/g, "");
    if (/^(010|015|016|069|070|081|086|087|093|096|098)/.test(p))
        return { bg: "bg-[#00C853]", icon: "S" };
    if (/^(011|012|014|017|061|076|077|078|085|089|092|095|099)/.test(p))
        return { bg: "bg-[#FF9800]", icon: "C" };
    return { bg: "bg-blue-500", icon: "M" };
};

export const getCourseColor = (course) => {
    if (!course) return "bg-gray-50 text-gray-600 border-gray-100";
    if (course.includes("English"))
        return "bg-pink-50 text-pink-600 border-pink-100";
    if (course.includes("Korean"))
        return "bg-indigo-50 text-indigo-600 border-indigo-100";
    if (course.includes("Chinese"))
        return "bg-orange-50 text-orange-600 border-orange-100";
    return "bg-gray-50 text-gray-600";
};