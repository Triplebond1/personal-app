import Link from "next/link";

const stats = [
  {
    label: "Published Posts",
    value: "4",
  },
  {
    label: "Drafts",
    value: "2",
  },
  {
    label: "Projects",
    value: "0",
  },
  {
    label: "Research",
    value: "0",
  },
];

// export default function DashboardPage() {
//   return (
//     <div>
//       <header className="border-b border-zinc-200 bg-white">
//         <div className="px-6 py-6 md:px-10">
//           <h1 className="text-2xl font-semibold tracking-tight">
//             Dashboard
//           </h1>

//           <p className="mt-1 text-sm text-zinc-500">
//             Manage your writing, research and projects.
//           </p>
//         </div>
//       </header>

//       <div className="p-6 md:p-10">
//         <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
//           {stats.map((stat) => (
//             <div
//               key={stat.label}
//               className="rounded-xl border border-zinc-200 bg-white p-6"
//             >
//               <p className="text-sm text-zinc-500">
//                 {stat.label}
//               </p>

//               <p className="mt-3 text-3xl font-semibold">
//                 {stat.value}
//               </p>
//             </div>
//           ))}
//         </div>

//         <div className="mt-10 flex items-center justify-between">
//           <div>
//             <h2 className="text-lg font-semibold">
//               Recent posts
//             </h2>

//             <p className="mt-1 text-sm text-zinc-500">
//               Your latest writing.
//             </p>
//           </div>

//           <Link
//             href="/dashboard/post/newPost"
//             className="rounded-lg bg-zinc-950 px-4 py-2.5 text-sm font-medium text-white hover:bg-zinc-800"
//           >
//             New post
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// }

export default function DashboardPage() {
  return (
    <div className="min-w-0">
      <div className="border-b border-zinc-200 bg-white">
        <div className="mx-auto max-w-7xl px-5 py-6 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-950 sm:text-3xl">
            Dashboard
          </h1>

          <p className="mt-1 text-sm text-zinc-500">
            Manage your website content and activity.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-5 py-6 sm:px-6 lg:px-8">
        <div className="p-6 md:p-10">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-zinc-200 bg-white p-6"
            >
              <p className="text-sm text-zinc-500">
                {stat.label}
              </p>

              <p className="mt-3 text-3xl font-semibold">
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-10 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">
              Recent posts
            </h2>

            <p className="mt-1 text-sm text-zinc-500">
              Your latest writing.
            </p>
          </div>

          <Link
            href="/dashboard/post/newPost"
            className="rounded-lg bg-zinc-950 px-4 py-2.5 text-sm font-medium text-white hover:bg-zinc-800"
          >
            New post
          </Link>
        </div>
      </div>
      </div>
    </div>
  );
}