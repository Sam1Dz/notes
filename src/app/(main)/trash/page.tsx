export default function Trash() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Trash</h1>
        <p className="text-muted-foreground">
          Deleted notes are moved here. You can restore or permanently delete
          them.
        </p>
      </div>

      <div className="rounded-lg border p-6">
        <p className="text-muted-foreground">
          No notes in trash. Deleted notes will appear here.
        </p>
      </div>
    </div>
  );
}
