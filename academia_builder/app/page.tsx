import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold text-blue-600 mb-6">Welcome to Academia Builder</h1>
      <div className="space-x-4">
        <Link href="/login">
          <span className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Login</span>
        </Link>
        <Link href="/signup">
          <span className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">Sign Up</span>
        </Link>
      </div>
    </div>
  );
}