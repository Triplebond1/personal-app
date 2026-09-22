import Link from "next/link";
import { IProject } from "../types/project";


export const ProjectCard = ({ project }: { project: IProject  }) => {
  return (
    <Link
      href="/projects"
      className="group bg-zinc-950 p-8 transition hover:bg-zinc-900"
    >
      <div className="flex items-start justify-between">
        <h3 className="text-2xl font-medium tracking-tight">{project.title}</h3>

        <span className="text-xl text-zinc-500 transition group-hover:text-white">
          ↗
        </span>
      </div>

      <p className="mt-5 leading-7 text-zinc-400">{project.description}</p>

      <div className="mt-8 flex flex-wrap gap-2">
        {project.tags?.map((tag: string) => (
          <span
            key={tag}
            className="rounded-full border border-zinc-700 px-3 py-1 text-xs text-zinc-400"
          >
            {tag}
          </span>
        ))}
      </div>
    </Link>
  );
};