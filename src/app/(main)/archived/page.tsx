export default function Archived() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Archived Notes</h1>
        <p className="text-muted-foreground">
          Your archived notes are stored here for safekeeping.
        </p>
      </div>

      <div className="rounded-lg border p-6">
        <p className="text-muted-foreground">
          No archived notes yet. Notes you archive will appear here.
        </p>
      </div>
    </div>
  );
}
