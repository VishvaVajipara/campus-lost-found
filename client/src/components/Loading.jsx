import { Loader2 } from 'lucide-react';

function Loading({ text = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-20 text-slate-500">
      <Loader2 className="animate-spin text-indigo-600" size={28} />
      <p className="text-sm">{text}</p>
    </div>
  );
}

export default Loading;
