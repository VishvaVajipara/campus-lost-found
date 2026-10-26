// Shown when a list has no items. "action" is an optional button or link.
function EmptyState({ icon: Icon, title, message, action }) {
  return (
    <div className="card flex flex-col items-center px-6 py-14 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
        <Icon size={24} />
      </div>
      <h3 className="mt-4 text-base font-semibold text-slate-900">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-slate-500">{message}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export default EmptyState;
