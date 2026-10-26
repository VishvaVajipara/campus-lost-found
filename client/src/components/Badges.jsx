import { CheckCircle2 } from 'lucide-react';

// "Lost" (red) or "Found" (green) label
export function TypeBadge({ type }) {
  const style =
    type === 'lost'
      ? 'bg-rose-50 text-rose-700 ring-rose-200'
      : 'bg-emerald-50 text-emerald-700 ring-emerald-200';
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${style}`}>
      {type === 'lost' ? 'Lost' : 'Found'}
    </span>
  );
}

// "Active" or "Resolved" label
export function StatusBadge({ status }) {
  if (status === 'resolved') {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-semibold text-indigo-700 ring-1 ring-inset ring-indigo-200">
        <CheckCircle2 size={12} /> Resolved
      </span>
    );
  }
  return (
    <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600 ring-1 ring-inset ring-slate-200">
      Active
    </span>
  );
}
