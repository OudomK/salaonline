import { useMutation, useQuery } from "@tanstack/react-query";
import { courseService } from "@/lib/api/services";

/**
 * Course Hooks - React Query hooks for course management
 */

export const useCourses = (params = {}) => {
  return useQuery({
    queryKey: ["courses", params],
    queryFn: () => courseService.getAllCourses(params).then((res) => res.data),
  });
};

export const useCourseHome = () => {
  return useQuery({
    queryKey: ["courses", "home"],
    queryFn: () => courseService.getCourseHome().then((res) => res.data),
  });
};

export const useAdminCourses = (params = {}) => {
  return useQuery({
    queryKey: ["courses", "admin", params],
    queryFn: () =>
      courseService.getAdminCourses(params).then((res) => res.data),
  });
};

export const useCourse = (id) => {
  return useQuery({
    queryKey: ["courses", id],
    queryFn: () => courseService.getCourseById(id).then((res) => res.data),
    enabled: !!id,
  });
};

export const useMyCourses = () => {
  return useQuery({
    queryKey: ["courses", "my"],
    queryFn: () => courseService.getMyCourses().then((res) => res.data),
  });
};

export const useCreateCourse = () => {
  return useMutation({
    mutationFn: (courseData) => courseService.createCourse(courseData),
  });
};

export const useUpdateCourse = () => {
  return useMutation({
    mutationFn: ({ id, courseData }) =>
      courseService.updateCourse(id, courseData),
  });
};

export const useDeleteCourse = () => {
  return useMutation({
    mutationFn: (id) => courseService.deleteCourse(id),
  });
};

export const useEnrollCourse = () => {
  return useMutation({
    mutationFn: (courseId) => courseService.enrollCourse(courseId),
  });
};

export const useCourseLessons = (courseId) => {
  return useQuery({
    queryKey: ["courses", courseId, "lessons"],
    queryFn: () =>
      courseService.getCourseLessons(courseId).then((res) => res.data),
    enabled: !!courseId,
  });
};

export const usePublishCourse = () => {
  return useMutation({
    mutationFn: (id) => courseService.publishCourse(id),
  });
};

export const useHideCourse = () => {
  return useMutation({
    mutationFn: (id) => courseService.hideCourse(id),
  });
};
