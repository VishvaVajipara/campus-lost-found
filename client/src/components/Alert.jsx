import { AlertCircle, CheckCircle2 } from 'lucide-react';

// type is "error" or "success". Renders nothing if there is no message.
function Alert({ type = 'error', message }) {
  if (!message) return null;

  const isError = type === 'error';
  const colors = isError
    ? 'border-red-200 bg-red-50 text-red-700'
    : 'border-emerald-200 bg-emerald-50 text-emerald-700';
  const Icon = isError ? AlertCircle : CheckCircle2;

  return (
    <div role={isError ? 'alert' : 'status'} className={`flex items-start gap-2 rounded-lg border px-4 py-3 text-sm ${colors}`}>
      <Icon size={18} className="mt-0.5 shrink-0" />
      <span>{message}</span>
    </div>
  );
}

export default Alert;
