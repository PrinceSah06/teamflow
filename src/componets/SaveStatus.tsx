type SaveStatusProps = {
  status: "idle" | "editing" | "saving" | "saved" | "error";
  error: string | null;
};

const SaveStatus = ({ status, error }: SaveStatusProps) => {
  return (
    <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
      <div>
        <p className="text-xs font-black uppercase tracking-normal text-slate-500">
          Editor
        </p>
        <p className="mt-1 text-sm font-bold capitalize text-slate-600">{status}</p>
      </div>
      {error && <p className="text-sm font-bold text-red-600">{error}</p>}
    </div>
  );
};

export default SaveStatus;
