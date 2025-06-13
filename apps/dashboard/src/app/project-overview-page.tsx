import {LayoutDashboard} from 'lucide-react';

export function ProjectOverviewPage() {
  return (
    <section className="flex flex-col gap-y-6">
      <h1 className="text-3xl font-black flex items-center gap-x-2 underline">
        <LayoutDashboard className="size-8" />
        Project Overview
      </h1>
    </section>
  );
}
