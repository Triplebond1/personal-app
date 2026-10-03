import Link from "next/link";


export const Footer = () => {   
    
  return (    
      <footer className="border-t border-zinc-200">
        <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-12 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="font-semibold">Olayinka.</p>
            <p className="mt-2 text-sm text-zinc-500">
              Building, researching and writing about technology, security and
              trust.
            </p>
          </div>

          <div className="flex flex-wrap gap-6 text-sm text-zinc-500">
            <Link href="/writings" className="hover:text-zinc-950">
              Writing
            </Link>
            <Link href="/projects" className="hover:text-zinc-950">
              Projects
            </Link>
            <Link href="/research" className="hover:text-zinc-950">
              Research
            </Link>
            <Link href="/about" className="hover:text-zinc-950">
              About
            </Link>
            <Link href="/contact" className="hover:text-zinc-950">
              Contact
            </Link>
          </div>
        </div>

        <div className="border-t border-zinc-200">
          <div className="mx-auto max-w-6xl px-6 py-6 text-xs text-zinc-400">
            © {new Date().getFullYear()} Olayinka Adebisi. All rights reserved.
          </div>
        </div>
      </footer> ) }