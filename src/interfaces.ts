export interface WorkspaceProject {
  projectType?: string;
  architect?: Record<
    string,
    { builder: string; options?: Record<string, any> }
  >;
}

export interface Workspace {
  projects: Record<string, WorkspaceProject>;
}

export interface BuildTarget {
  name: string;
  options?: { [name: string]: any };
}
