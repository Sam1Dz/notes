export default function Home() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Welcome to Notes</h1>
        <p className="text-muted-foreground">
          Your personal note-taking application. Create, organize, and manage
          your notes efficiently.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border p-6">
          <h3 className="text-lg font-semibold">Quick Start</h3>
          <p className="text-muted-foreground mt-2 text-sm">
            Get started by creating your first note or exploring the sidebar
            navigation.
          </p>
        </div>

        <div className="rounded-lg border p-6">
          <h3 className="text-lg font-semibold">Organize</h3>
          <p className="text-muted-foreground mt-2 text-sm">
            Keep your notes organized with categories and tags.
          </p>
        </div>

        <div className="rounded-lg border p-6">
          <h3 className="text-lg font-semibold">Archive</h3>
          <p className="text-muted-foreground mt-2 text-sm">
            Archive old notes to keep your workspace clean.
          </p>
        </div>
      </div>
    </div>
  );
}
