import { useMutation, useQuery } from '@tanstack/react-query'
import { homeworkService } from '@/lib/api/services'

/**
 * Homework Hooks - React Query hooks for homework management
 */

export const useHomeworkList = (params = {}) => {
  return useQuery({
    queryKey: ['homework', params],
    queryFn: () => homeworkService.getAllHomework(params).then((res) => res.data),
  })
}

export const useHomework = (id) => {
  return useQuery({
    queryKey: ['homework', id],
    queryFn: () => homeworkService.getHomeworkById(id).then((res) => res.data),
    enabled: !!id,
  })
}

export const useMyHomework = () => {
  return useQuery({
    queryKey: ['homework', 'my'],
    queryFn: () => homeworkService.getMyHomework().then((res) => res.data),
  })
}

export const useCreateHomework = () => {
  return useMutation({
    mutationFn: (homeworkData) => homeworkService.createHomework(homeworkData),
  })
}

export const useUpdateHomework = () => {
  return useMutation({
    mutationFn: ({ id, homeworkData }) =>
      homeworkService.updateHomework(id, homeworkData),
  })
}

export const useDeleteHomework = () => {
  return useMutation({
    mutationFn: (id) => homeworkService.deleteHomework(id),
  })
}

export const useSubmitHomework = () => {
  return useMutation({
    mutationFn: ({ id, submissionData }) =>
      homeworkService.submitHomework(id, submissionData),
  })
}

export const useGradeHomework = () => {
  return useMutation({
    mutationFn: ({ id, submissionId, gradeData }) =>
      homeworkService.gradeHomework(id, submissionId, gradeData),
  })
}
