import { useMutation, useQuery } from '@tanstack/react-query'
import { placementService } from '@/lib/api/services'

/**
 * Placement Test Hooks - React Query hooks for placement tests
 */

export const usePlacementTests = (params = {}) => {
  return useQuery({
    queryKey: ['placement-tests', params],
    queryFn: () => placementService.getAllTests(params).then((res) => res.data),
  })
}

export const usePlacementTest = (id) => {
  return useQuery({
    queryKey: ['placement-tests', id],
    queryFn: () => placementService.getTestById(id).then((res) => res.data),
    enabled: !!id,
  })
}

export const useCreatePlacementTest = () => {
  return useMutation({
    mutationFn: (testData) => placementService.createTest(testData),
  })
}

export const useUpdatePlacementTest = () => {
  return useMutation({
    mutationFn: ({ id, testData }) => placementService.updateTest(id, testData),
  })
}

export const useDeletePlacementTest = () => {
  return useMutation({
    mutationFn: (id) => placementService.deleteTest(id),
  })
}

export const useSubmitTest = () => {
  return useMutation({
    mutationFn: ({ id, answers }) => placementService.submitTest(id, answers),
  })
}

export const useTestResult = (id) => {
  return useQuery({
    queryKey: ['placement-tests', id, 'result'],
    queryFn: () => placementService.getTestResult(id).then((res) => res.data),
    enabled: !!id,
  })
}
