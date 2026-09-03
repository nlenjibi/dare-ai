import { Badge } from "@/frontend/component/badge";

interface Component {
  _id: { toString(): string };
  parentId?: { toString(): string } | null;
  name: string;
  description: string;
  dimension?: string;
  relationships?: string[];
  sortOrder?: number;
}

interface ComponentListProps {
  components: Component[];
}

interface TreeNode extends Component {
  children: TreeNode[];
}

function buildTree(components: Component[]): TreeNode[] {
  const map = new Map<string, TreeNode>();
  components.forEach((c) => map.set(c._id.toString(), { ...c, children: [] }));

  const roots: TreeNode[] = [];
  map.forEach((node) => {
    const parentId = node.parentId?.toString();
    if (parentId && map.has(parentId)) {
      map.get(parentId)!.children.push(node);
    } else {
      roots.push(node);
    }
  });

  // Stable sort by sortOrder at each level
  function sort(nodes: TreeNode[]) {
    nodes.sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
    nodes.forEach((n) => sort(n.children));
  }
  sort(roots);
  return roots;
}

function ComponentNode({ node, depth }: { node: TreeNode; depth: number }) {
  return (
    <li>
      <div
        className="flex items-start gap-2 py-2"
        style={{ paddingLeft: `${depth * 20}px` }}
      >
        {depth > 0 && (
          <span className="mt-1.5 text-border shrink-0 select-none">└</span>
        )}
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-medium text-sm">{node.name}</span>
            {node.dimension && <Badge variant="mono">{node.dimension}</Badge>}
          </div>
          <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{node.description}</p>
          {node.relationships && node.relationships.length > 0 && (
            <p className="text-xs text-muted-foreground/70 mt-0.5 italic">
              {node.relationships.join(" · ")}
            </p>
          )}
        </div>
      </div>
      {node.children.length > 0 && (
        <ul className="border-l border-border/40 ml-[8px]">
          {node.children.map((child) => (
            <ComponentNode key={child._id.toString()} node={child} depth={depth + 1} />
          ))}
        </ul>
      )}
    </li>
  );
}

export function ComponentList({ components }: ComponentListProps) {
  const tree = buildTree(components);

  return (
    <section className="rounded-lg border border-border p-5 space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold">Components</h2>
        <span className="text-xs text-muted-foreground">{components.length} total</span>
      </div>
      <ul className="space-y-0 divide-y divide-border/30">
        {tree.map((node) => (
          <ComponentNode key={node._id.toString()} node={node} depth={0} />
        ))}
      </ul>
    </section>
  );
}
