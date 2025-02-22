// import { NextResponse } from "next/server";

// export function middleware(req) {
//     const token = req.cookies.get("authToken");
//     let user = null;

//     // Attempt to decode the token
//     try {
//         if (token) {
//             // Safely parse the payload from the token
//             const payload = JSON.parse(atob(token.split(".")[1]));
//             user = payload || null;
//         }
//     } catch (error) {
//         console.error("Failed to parse token:", error);
//     }

//     const pathname = req.nextUrl.pathname;

//     // Define role-based route access
//     const roleRoutes = {
//         admin: ["/admin-dashboard", "/leaderboard", "/settings"],
//         user: ["/user-dashboard", "/report", "/rewards", "/leaderboard"],
//         collector: ["/collector-dashboard", "/collect", "/rewards", "/leaderboard"],
//     };

//     // Check if route is protected
//     const protectedRoutes = Object.values(roleRoutes).flat();
//     const isProtectedRoute = protectedRoutes.includes(pathname);

//     if (!user) {
//         // Redirect to sign-in if the user is not authenticated and accessing a protected route
//         if (isProtectedRoute) {
//             return NextResponse.redirect(new URL("/sign-in", req.url));
//         }
//         return NextResponse.next(); // Allow access to public routes
//     }

//     // Check if the user has the appropriate role for the route
//     const allowedRoutes = roleRoutes[user.role] || [];
//     if (!allowedRoutes.includes(pathname)) {
//         return NextResponse.redirect(new URL("/unauthorized", req.url)); // Redirect on unauthorized access
//     }

//     // Allow access to authorized routes
//     return NextResponse.next();
// }

// // Apply middleware to protect specific routes
// export const config = {
//     matcher: [
//         "/admin-dashboard",
//         "/user-dashboard",
//         "/report",
//         "/collector-dashboard",
//         "/collect",
//         "/leaderboard",
//         "/settings",
//         "/rewards",
//     ],
// };
