import { useQuery } from "@tanstack/react-query";
import { quizService } from "@/lib/api/services/quiz.service";

export const useQuiz = (id) => {
    return useQuery({
        queryKey: ["quiz", id],
        queryFn: () => quizService.getQuizById(id),
        enabled: !!id,
    });
};

export const useFirstTest = (categoryId) => {
    return useQuery({
        queryKey: ["quiz", "first-test", categoryId],
        queryFn: () => quizService.getFirstTest(categoryId),
        enabled: !!categoryId,
    });
};

export const useMyQuizHistory = () => {
    return useQuery({
        queryKey: ["quiz", "my-history"],
        queryFn: () => quizService.getMyQuizHistory(),
    });
};
