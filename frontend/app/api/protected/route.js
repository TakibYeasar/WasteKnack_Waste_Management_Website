import { NextResponse } from "next/server";

export async function GET(req) {
    const token = req.cookies.get("authToken");

    // Check if token is missing
    if (!token) {
        return NextResponse.json({ message: "Unauthorized: No token provided" }, { status: 401 });
    }

    let user = null;

    // Safely parse the token
    try {
        const payload = atob(token.split(".")[1]); // Decode the token payload
        user = JSON.parse(payload);
    } catch (error) {
        console.error("Failed to parse token:", error);
        return NextResponse.json({ message: "Invalid token" }, { status: 400 });
    }

    // Check if user role is "admin"
    if (!user || user.role !== "admin") {
        return NextResponse.json({ message: "Forbidden: Insufficient privileges" }, { status: 403 });
    }

    // If everything is valid, return a success response
    return NextResponse.json({ message: "Welcome Admin!" });
}
