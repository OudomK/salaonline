import { PlayCircle, Star } from "lucide-react";
import { Card, CardContent } from "./card";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { Badge } from "./badge";
import { imgUrl } from "@/lib/helper/enviroment";

const CourseCard = ({ course, handleCourseClick }) => {
    return (
        <div>
            <Card
                key={course?.id}
                onClick={handleCourseClick}
                className="group border-0 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 rounded-[24px] overflow-hidden cursor-pointer bg-white"
            >
                {/* Image Section */}
                <div className="relative h-48 w-full overflow-hidden">
                    <img
                        src={imgUrl + course?.thumbnail}
                        alt={course?.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    {/* Overlay Play Icon on Hover */}
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <div className="bg-white/20 backdrop-blur-sm p-3 rounded-full">
                            <PlayCircle className="text-white fill-white/20" size={32} />
                        </div>
                    </div>

                    {/* Price / Category Badge */}
                    <div className="absolute top-3 left-3">
                        <Badge className="bg-white/90 text-gray-800 hover:bg-white backdrop-blur-sm shadow-sm border-0 font-bold uppercase">
                            {course?.category?.name || "General"}
                        </Badge>
                    </div>
                </div>

                {/* Content Section */}
                <CardContent className="p-5">
                    {/* <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-1 text-orange-400 text-xs font-bold bg-orange-50 px-2 py-1 rounded-lg">
                            <Star size={12} fill="currentColor" /> 4.8
                        </div>
                        <span className="text-[#00B4F6] font-extrabold text-lg">$25.00</span>
                    </div> */}

                    <h4 className="font-bold text-gray-800 text-base md:text-lg line-clamp-1 mb-3 group-hover:text-[#00B4F6] transition-colors">
                        {course?.title}
                    </h4>

                    {/* Instructor Info */}
                    <div className="flex items-center gap-3 pt-3 border-t border-gray-50">
                        <Avatar className="h-8 w-8 border border-gray-100">
                            <AvatarImage src={course?.teacher?.avatar ? imgUrl + course.teacher.avatar : `https://api.dicebear.com/7.x/avataaars/svg?seed=${course?.teacher?.first_name}`} />
                            <AvatarFallback>IN</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                            <span className="text-[10px] text-gray-400 font-medium uppercase">បង្រៀនដោយ</span>
                            <span className="text-xs font-bold text-gray-700">{course?.teacher ? `${course.teacher.first_name} ${course.teacher.last_name}` : course?.teacher_name}</span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default CourseCard;
