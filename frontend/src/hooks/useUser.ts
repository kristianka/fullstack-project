import { useQuery } from "@tanstack/react-query";
import { FireBaseUserInterface } from "../types";
import userService from "../services/user";

const useUser = (firebaseAuth: FireBaseUserInterface | null) => {
    return useQuery({
        // firebase auth is dependency for this query,
        // so it will be refetched when firebase auth changes
        queryKey: ["user", firebaseAuth],
        enabled: !!firebaseAuth,
        queryFn: () => {
            const fetchData = async () => {
                if (firebaseAuth) {
                    const user = await userService.getUser(firebaseAuth.uid);
                    return user;
                }
            };
            return fetchData();
        },
        retry: 5,
        retryDelay: 1000
    });
};

export default useUser;
