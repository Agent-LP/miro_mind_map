import { DSVRowArray } from "d3-dsv";

type GraphNode = {
  nodeView: { content: string };
  children: GraphNode[];
};

/**
 * Create graph from CSV rows
 *
 * @param contents CSV rows
  const visited: Record<string, GraphNode> = {};
 */
const createGraph = (contents: DSVRowArray<string>) => {
  const root: GraphNode = { nodeView: { content: "parent_node" }, children: [] };

  const visited: Record<string, GraphNode> = {};

  for (const row of contents) {
    let parent: GraphNode = root; // Ahora el padre inicial es un nodo raíz fijo

    for (const col of contents.columns) {
      const value = row[col]!;

      const key = `${col}-${value}`;

      if (!visited[key]) {
        const node = { nodeView: { content: value }, children: [] };
        visited[key] = node;

        if (parent) {
          parent.children.push(visited[key]);
        }
      }

      parent = visited[key];
    }
  }

  return root;
}


/**
 * Create mindmap from CSV rows
 *
 * @param contents CSV rows
 */
export const createMindmap = async (contents: DSVRowArray<string>) => {
    const root = createGraph(contents);
    await miro.board.experimental.createMindmapNode(root);
  };