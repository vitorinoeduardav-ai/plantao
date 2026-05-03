export function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="panel flex min-h-40 flex-col items-center justify-center text-center">
      <p className="text-lg font-bold text-slate-800 dark:text-slate-100">{title}</p>
      <p className="mt-1 max-w-md text-sm text-slate-500 dark:text-slate-400">{description}</p>
    </div>
  );
}
