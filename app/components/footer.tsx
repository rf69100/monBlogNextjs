export default function Footer() {
  return (
    <footer className="mt-20 border-t border-violet-100 bg-white">
      <div className="mx-auto max-w-5xl px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-500">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-md bg-violet-600 text-white text-[10px] font-bold">B2</span>
          <span className="font-medium text-slate-700">MonBLog</span>
        </div>
        <p>
          Développé avec ❤️ par moi même <span className="font-medium text-violet-600"></span> — © {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  );
}
