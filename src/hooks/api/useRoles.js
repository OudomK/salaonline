

export const useRoles = () => {
    return useQuery({
        queryKey: ["roles"],
        queryFn: () => userService.getRoles().then((res) => res.data),
    });
};