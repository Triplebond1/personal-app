import remarkGfm from "remark-gfm";
import ReactMarkdown from "react-markdown";
import { Post } from "@/src/types/post";


export const ArticleBody = ({ post }: {post:Post}) => { 
    
   return (  <div className="border-t border-zinc-200">
          <div className="mx-auto max-w-3xl px-6 py-5 md:py-5">

      
      {/* Article */}
      <article
        className="
          prose prose-zinc mt-16 max-w-none

          prose-headings:font-semibold
          prose-headings:tracking-tight

          prose-h2:mt-14
          prose-h2:text-3xl

          prose-h3:mt-10
          prose-h3:text-2xl

          prose-p:text-lg
          prose-p:leading-8
          prose-p:text-zinc-700

          prose-a:text-zinc-950
          prose-a:underline
          prose-a:underline-offset-4

          prose-strong:text-zinc-950

          prose-blockquote:border-zinc-300
          prose-blockquote:text-zinc-600

          prose-code:text-zinc-950

          prose-pre:rounded-xl
          prose-pre:bg-zinc-950
          prose-pre:text-zinc-200
        "
      >
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {post.content}
        </ReactMarkdown>
      </article>
        </div>
      </div>)
}