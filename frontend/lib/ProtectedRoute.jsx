"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useCurrentUserQuery } from "@/store/features/auth/authApi";

const ProtectedRoute = ({ children, allowedRoles }) => {
    const pathname = usePathname();
    const router = useRouter();
    const { data: userInfo, isLoading } = useCurrentUserQuery();

    useEffect(() => {
        if (!isLoading) {
            if (!userInfo) {
                router.push("/sign-in");
            } else if (allowedRoles && !allowedRoles.includes(userInfo.role)) {
                router.push("/sign-in");
            }
        }
    }, [userInfo, isLoading, router, allowedRoles]);

    if (isLoading || !userInfo || (userInfo && allowedRoles && !allowedRoles.includes(userInfo.role))) {
        return null;
    }

    return <>{children}</>;
};

export default ProtectedRoute;
