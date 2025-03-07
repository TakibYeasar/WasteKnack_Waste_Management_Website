import Link from "next/link";

const Unauthorized = () => {
    return (
        <div className="h-screen flex flex-col items-center justify-center">
            <h1 className="text-3xl font-bold text-red-600">403 - Unauthorized</h1>
            <p className="mt-2">You do not have permission to view this page.</p>
            <Link href="/" className="mt-4 text-blue-500 underline">Go to Home</Link>
        </div>
    );
};

export default Unauthorized;
