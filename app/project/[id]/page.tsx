import { getProjectById } from "@/lib/mockData";

export default async function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = getProjectById(id);
  if (!project) {
    return (
      <div className="max-w-page mx-auto px-7 lg:px-9 py-11">
        <h1 className="font-display text-h1">Project not found</h1>
      </div>
    );
  }
  return (
    <div className="max-w-page mx-auto px-7 lg:px-9 py-11">
      <h1 className="font-display text-h1 mb-2">{project.title}</h1>
      <p className="text-body text-text-muted mb-8">{project.description}</p>
      <p className="text-body-sm text-text-subtle">Tabs (Play / Code / Learn) coming next.</p>
    </div>
  );
}
