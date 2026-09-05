export default function Loader({ label = "Loading..." }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-24">
      <div className="spinner" />
      <p className="text-sm text-gray-400 dark:text-gray-500">{label}</p>
    </div>
  );
}
