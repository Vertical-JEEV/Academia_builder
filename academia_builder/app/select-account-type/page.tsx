// "use client";

// import { useRouter, useSearchParams } from "next/navigation";
// import { useState } from "react";
// import { toast } from "react-toastify";

// export default function SelectAccountTypePage() {
//   const router = useRouter();
//   const searchParams = useSearchParams();

//   // Retrieve state and code from the URL
//   const state = searchParams.get("state");
//   const code = searchParams.get("code");

//   const [accountType, setAccountType] = useState<string>("");

//   const handleAccountTypeSelection = () => {
//     if (!accountType) {
//       toast.error("Please select an account type.");
//       return;
//     }

//     // Redirect back to /auth/google with the selected account_type
//     router.push(
//       `/auth/google?state=${encodeURIComponent(
//         state!
//       )}&code=${encodeURIComponent(code!)}&account_type=${accountType}`
//     );
//   };

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
//       <h1 className="text-3xl font-bold mb-6">Select Your Account Type</h1>

//       <div className="flex flex-col gap-4 w-full max-w-sm">
//         <button
//           onClick={() => setAccountType("student")}
//           className={`p-4 border rounded-md text-center cursor-pointer ${
//             accountType === "student"
//               ? "bg-blue-500 text-white"
//               : "bg-white text-black"
//           }`}
//         >
//           Student
//         </button>

//         <button
//           onClick={() => setAccountType("teacher")}
//           className={`p-4 border rounded-md text-center cursor-pointer ${
//             accountType === "teacher"
//               ? "bg-green-500 text-white"
//               : "bg-white text-black"
//           }`}
//         >
//           Teacher
//         </button>
//       </div>

//       <button
//         onClick={handleAccountTypeSelection}
//         className="mt-6 px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
//       >
//         Continue
//       </button>
//     </div>
//   );
// }
