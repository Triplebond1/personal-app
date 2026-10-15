import { PostType } from "@/src/types/post";
import Link from "next/link";
type ArticleFooterProps = {
    Url: string,
    type: PostType
}

export const ArticleFooter = ({ Url, type}: ArticleFooterProps) => { 
    const lowerCaseType = type.toLowerCase()
    return (
        <section className="mt-20 border-t border-zinc-200 pt-10">
        <p className="text-base leading-7 text-zinc-600">
                This {lowerCaseType} is ongoing. I&apos;ll continue publishing experiments,
          technical notes, findings, and related writing as I learn more.
        </p>

        <Link
          href={Url}
          className="mt-6 inline-block text-sm font-medium text-zinc-950 underline underline-offset-4"
        >
                Explore more {lowerCaseType} →
        </Link>
      </section>
    )
}