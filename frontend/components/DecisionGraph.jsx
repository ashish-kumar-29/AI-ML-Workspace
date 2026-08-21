"use client";

import { useEffect, useMemo, useState } from "react";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export default function DecisionGraph() {
  const [graph, setGraph] = useState({
    nodes: [],
    edges: [],
    current_node: null,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedNode, setSelectedNode] = useState(null);

  async function loadGraph() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_BASE}/decision-graph`, {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error(`Failed to load decision graph (${response.status})`);
      }

      const data = await response.json();

      setGraph({
        nodes: Array.isArray(data.nodes) ? data.nodes : [],
        edges: Array.isArray(data.edges) ? data.edges : [],
        current_node: data.current_node ?? null,
      });
    } catch (err) {
      console.error("[DecisionGraph]", err);
      setError(err.message || "Unable to load decision graph.");
    } finally {
      setLoading(false);
    }
  }

  async function rollback(nodeId) {
    try {
      const response = await fetch(
        `${API_BASE}/decision-graph/rollback/${nodeId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!response.ok) {
        throw new Error("Rollback failed.");
      }

      await loadGraph();

      // Keep the UI consistent after rollback.
      setSelectedNode(null);
    } catch (err) {
      console.error("[DecisionGraph rollback]", err);
      setError(err.message || "Rollback failed.");
    }
  }

  useEffect(() => {
    loadGraph();
  }, []);

  /*
   * Build a tree-like presentation from the existing graph data.
   *
   * IMPORTANT:
   * This only changes how nodes are displayed.
   * It does not modify nodes, edges, API responses, rollback logic,
   * dataset state, cleaning logic, EDA, AI recommendations, or
   * any existing backend functionality.
   */
  const workflowLevels = useMemo(() => {
    const nodes = graph.nodes || [];
    const edges = graph.edges || [];

    if (!nodes.length) return [];

    const nodeIds = new Set(nodes.map((node) => node.id));

    const incoming = new Map();
    const outgoing = new Map();

    nodes.forEach((node) => {
      incoming.set(node.id, []);
      outgoing.set(node.id, []);
    });

    edges.forEach((edge) => {
      const source = edge.source || edge.from;
      const target = edge.target || edge.to;

      if (!nodeIds.has(source) || !nodeIds.has(target)) return;

      incoming.get(target).push(source);
      outgoing.get(source).push(target);
    });

    // Roots are nodes with no incoming edge.
    // If malformed/legacy graph data has no root, fall back to the
    // first node rather than hiding anything.
    let roots = nodes
      .filter((node) => incoming.get(node.id).length === 0)
      .map((node) => node.id);

    if (!roots.length) {
      roots = [nodes[0].id];
    }

    const depth = new Map();
    const queue = roots.map((id) => ({ id, level: 0 }));

    roots.forEach((id) => depth.set(id, 0));

    while (queue.length) {
      const { id, level } = queue.shift();

      const children = outgoing.get(id) || [];

      children.forEach((childId) => {
        const nextLevel = level + 1;
        const previousLevel = depth.get(childId);

        if (previousLevel === undefined || nextLevel > previousLevel) {
          depth.set(childId, nextLevel);
          queue.push({ id: childId, level: nextLevel });
        }
      });
    }

    // Any disconnected/legacy nodes are still displayed.
    nodes.forEach((node, index) => {
      if (!depth.has(node.id)) {
        depth.set(node.id, Math.max(0, index));
      }
    });

    const maxDepth = Math.max(...Array.from(depth.values()));

    return Array.from({ length: maxDepth + 1 }, (_, level) =>
      nodes.filter((node) => depth.get(node.id) === level)
    );
  }, [graph.nodes, graph.edges]);

  const nodeById = Object.fromEntries(
    graph.nodes.map((node) => [node.id, node])
  );

  function getNodeStyle(node) {
    const type = String(
      node.type || node.node_type || "decision"
    ).toLowerCase();

    if (type.includes("analysis") || type.includes("eda")) {
      return {
        card: "border-purple-400 bg-purple-50 text-purple-950",
        label: "ANALYSIS",
        labelColor: "text-purple-700",
      };
    }

    if (type.includes("recommend")) {
      return {
        card: "border-amber-400 bg-amber-50 text-amber-950",
        label: "AI RECOMMENDATION",
        labelColor: "text-amber-700",
      };
    }

    if (type.includes("experiment")) {
      return {
        card: "border-orange-400 bg-orange-50 text-orange-950",
        label: "EXPERIMENT",
        labelColor: "text-orange-700",
      };
    }

    if (type.includes("clean")) {
      return {
        card: "border-emerald-400 bg-emerald-50 text-emerald-950",
        label: "CLEANING DECISION",
        labelColor: "text-emerald-700",
      };
    }

    return {
      card: "border-blue-400 bg-blue-50 text-blue-950",
      label: "DATASET",
      labelColor: "text-blue-700",
    };
  }

  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-slate-600">Loading Decision Graph...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-8">
        <h2 className="text-xl font-bold text-red-700">
          Decision Graph Error
        </h2>

        <p className="mt-2 text-red-600">{error}</p>

        <button
          onClick={loadGraph}
          className="mt-4 rounded-lg bg-red-600 px-4 py-2 font-semibold text-white hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  if (graph.nodes.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <h2 className="text-2xl font-bold text-slate-800">
          Decision Graph
        </h2>

        <p className="mt-3 text-slate-500">
          No decision history is available yet.
        </p>

        <p className="mt-2 text-sm text-slate-400">
          Upload a dataset and run EDA or AI analysis to create decision
          graph nodes.
        </p>

        <button
          onClick={loadGraph}
          className="mt-6 rounded-lg bg-blue-600 px-5 py-2 font-semibold text-white hover:bg-blue-700"
        >
          Refresh
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">
              Decision Graph
            </h2>

            <p className="mt-1 text-slate-500">
              Track dataset analysis, AI recommendations, experiments,
              and cleaning decisions.
            </p>
          </div>

          <button
            onClick={loadGraph}
            className="rounded-lg bg-blue-600 px-5 py-2 font-semibold text-white shadow-sm hover:bg-blue-700"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* MAIN GRAPH + DETAILS */}
      <div className="grid min-w-0 grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
        {/* WORKFLOW */}
        <section className="min-w-0 rounded-2xl border border-slate-700 bg-slate-950 p-4 shadow-xl sm:p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h3 className="text-xl font-bold text-white">
                Workflow
              </h3>

              <p className="mt-1 text-sm text-slate-400">
                {graph.nodes.length} decisions/nodes ·{" "}
                {graph.edges.length} connections
              </p>
            </div>

            <span className="hidden rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-xs text-slate-400 md:block">
              Click a node to inspect
            </span>
          </div>

          {/*
            NO horizontal scrolling here.

            The graph uses responsive rows and wrapping. Therefore:
            - cards never disappear behind the details panel
            - branches wrap to the next line when required
            - the graph remains fully accessible
            - only vertical scrolling is used for a long graph
          */}
          <div
            className="
              max-h-[calc(100vh-250px)]
              min-h-[500px]
              overflow-y-auto
              overflow-x-hidden
              rounded-xl
              border border-slate-800
              bg-[#0b1324]
              p-3
              sm:p-5
            "
          >
            <div className="w-full">
              {workflowLevels.map((levelNodes, levelIndex) => (
                <div key={`level-${levelIndex}`}>
                  {/* LEVEL */}
                  <div
                    className="
                      flex
                      w-full
                      flex-wrap
                      items-stretch
                      justify-center
                      gap-4
                      py-2
                    "
                  >
                    {levelNodes.map((node) => {
                      const style = getNodeStyle(node);
                      const isCurrent =
                        node.id === graph.current_node;
                      const isSelected =
                        selectedNode?.id === node.id;

                      return (
                        <button
                          key={node.id}
                          type="button"
                          onClick={() =>
                            setSelectedNode(
                              selectedNode?.id === node.id
                                ? null
                                : node
                            )
                          }
                          className={`
                            min-w-0
                            w-full
                            max-w-[360px]
                            flex-1
                            rounded-2xl
                            border-2
                            p-4
                            text-left
                            shadow-lg
                            transition
                            duration-200
                            ${style.card}
                            ${
                              isSelected
                                ? "ring-4 ring-blue-400/50"
                                : "hover:-translate-y-0.5 hover:shadow-xl"
                            }
                            ${
                              isCurrent
                                ? "ring-4 ring-emerald-400/80"
                                : ""
                            }
                          `}
                        >
                          <div className="flex min-w-0 items-start gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/70 text-lg shadow-sm">
                              {style.label === "DATASET"
                                ? "📊"
                                : style.label === "ANALYSIS"
                                ? "🔍"
                                : style.label ===
                                  "AI RECOMMENDATION"
                                ? "🤖"
                                : style.label === "EXPERIMENT"
                                ? "🧪"
                                : "🧹"}
                            </div>

                            <div className="min-w-0 flex-1">
                              <div className="mb-1 flex flex-wrap items-center gap-2">
                                <span
                                  className={`text-[10px] font-extrabold tracking-wider ${style.labelColor}`}
                                >
                                  {style.label}
                                </span>

                                {isCurrent && (
                                  <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[9px] font-extrabold text-emerald-700">
                                    CURRENT
                                  </span>
                                )}

                                {style.label === "EXPERIMENT" && (
                                  <span className="rounded-full bg-orange-100 px-2 py-0.5 text-[9px] font-extrabold text-orange-700">
                                    EXPERIMENT
                                  </span>
                                )}
                              </div>

                              <h4 className="break-words text-base font-bold leading-6 sm:text-lg">
                                {node.label ||
                                  node.title ||
                                  "Decision"}
                              </h4>

                              <p className="mt-1 text-[11px] opacity-60">
                                {node.timestamp
                                  ? new Date(
                                      node.timestamp
                                    ).toLocaleString()
                                  : "Time unavailable"}
                              </p>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* LEVEL CONNECTOR */}
                  {levelIndex < workflowLevels.length - 1 && (
                    <div className="relative my-1 flex min-h-[64px] w-full items-center justify-center">
                      <div className="absolute left-1/2 top-0 h-5 w-px -translate-x-1/2 bg-slate-600" />

                      <div className="relative z-10 rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-[10px] font-semibold text-slate-400">
                        {graph.nodes.length > 1
                          ? "next decision"
                          : "workflow"}
                      </div>

                      <div className="absolute bottom-0 left-1/2 h-5 w-px -translate-x-1/2 bg-slate-600" />

                      <span className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1 text-xs text-slate-500">
                        ↓
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <p className="mt-3 text-center text-xs text-slate-500">
            The workflow expands vertically as decisions are added.
            Branches automatically wrap instead of being clipped.
          </p>
        </section>

        {/* DECISION DETAILS */}
        <aside
          className="
            min-w-0
            h-fit
            overflow-hidden
            rounded-2xl
            border
            border-slate-700
            bg-slate-900
            text-white
            shadow-xl
            xl:sticky
            xl:top-6
          "
        >
          <div className="border-b border-slate-700 bg-slate-950 px-5 py-4">
            <h3 className="text-lg font-bold text-white">
              Decision Details
            </h3>

            <p className="mt-1 text-xs text-slate-400">
              Why this decision was made
            </p>
          </div>

          {!selectedNode ? (
            <div className="flex min-h-[360px] items-center justify-center p-7 text-center">
              <div>
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-slate-800">
                  🔍
                </div>

                <h4 className="font-semibold text-slate-200">
                  Select a node
                </h4>

                <p className="mt-2 text-sm leading-6 text-slate-400">
                  Click a workflow node to inspect its details.
                </p>
              </div>
            </div>
          ) : (
            <div className="max-h-[calc(100vh-150px)] overflow-y-auto p-5">
              <div className="space-y-5">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                    Node
                  </p>

                  <h4 className="mt-2 break-words text-xl font-bold text-white">
                    {selectedNode.label ||
                      selectedNode.title ||
                      "Decision"}
                  </h4>
                </div>

                {selectedNode.id === graph.current_node && (
                  <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-xs font-semibold text-emerald-300">
                    ✓ Current Decision
                  </div>
                )}

                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                    Type
                  </p>

                  <p className="mt-1 text-xs font-semibold uppercase text-slate-200">
                    {selectedNode.type ||
                      selectedNode.node_type ||
                      "DECISION"}
                  </p>
                </div>

                {selectedNode.details?.column && (
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                      Column
                    </p>

                    <p className="mt-2 break-words rounded-lg bg-slate-800 px-3 py-2 text-sm font-semibold text-slate-200">
                      {selectedNode.details.column}
                    </p>
                  </div>
                )}

                {selectedNode.details?.decision_source && (
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                      Decision Source
                    </p>

                    <span className="mt-2 inline-flex max-w-full break-all rounded-full bg-purple-500/20 px-3 py-1.5 text-xs font-bold text-purple-300">
                      {String(
                        selectedNode.details.decision_source
                      )}
                    </span>
                  </div>
                )}

                {selectedNode.details?.method && (
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                      Selected Method
                    </p>

                    <p className="mt-2 break-all rounded-lg bg-slate-800 px-3 py-2 font-mono text-xs text-slate-200">
                      {selectedNode.details.method}
                    </p>
                  </div>
                )}

                {selectedNode.details?.ai_recommendation && (
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                      AI Recommendation
                    </p>

                    <p className="mt-2 break-words text-sm font-semibold text-fuchsia-300">
                      {selectedNode.details.ai_recommendation}
                    </p>
                  </div>
                )}

                {selectedNode.details?.reason && (
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                      Why?
                    </p>

                    <div className="mt-2 break-words rounded-lg border border-slate-700 bg-slate-800 p-3 text-xs leading-5 text-slate-300">
                      {selectedNode.details.reason}
                    </div>
                  </div>
                )}

                {selectedNode.details?.alternative && (
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                      Alternative
                    </p>

                    <p className="mt-2 break-words text-sm font-semibold text-amber-300">
                      {selectedNode.details.alternative}
                    </p>
                  </div>
                )}

                <div>
                  <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                    Technical Details
                  </p>

                  <pre className="max-h-64 overflow-auto rounded-xl border border-slate-700 bg-slate-950 p-3 text-[11px] leading-5 text-slate-300">
                    {JSON.stringify(selectedNode, null, 2)}
                  </pre>
                </div>

                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                    Timestamp
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    {selectedNode.timestamp
                      ? new Date(
                          selectedNode.timestamp
                        ).toLocaleString()
                      : "Not available"}
                  </p>
                </div>

                <button
                  onClick={() => rollback(selectedNode.id)}
                  disabled={
                    selectedNode.id === graph.current_node
                  }
                  className="
                    w-full
                    rounded-xl
                    bg-red-600
                    px-4
                    py-3
                    text-sm
                    font-bold
                    text-white
                    shadow-lg
                    hover:bg-red-700
                    disabled:cursor-not-allowed
                    disabled:bg-slate-700
                    disabled:text-slate-400
                  "
                >
                  ↩ Rollback to This Decision
                </button>
              </div>
            </div>
          )}
        </aside>
      </div>

      {/* CONNECTIONS */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <h3 className="text-xl font-bold text-slate-900">
              Connections
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Relationships between decisions in the workflow.
            </p>
          </div>

          <span className="w-fit rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
            {graph.edges.length} connections
          </span>
        </div>

        {graph.edges.length === 0 ? (
          <p className="rounded-xl bg-slate-50 p-4 text-slate-500">
            No graph connections are available.
          </p>
        ) : (
          <div className="max-h-72 space-y-3 overflow-y-auto pr-1">
            {graph.edges.map((edge, index) => {
              const source =
                nodeById[edge.source] || nodeById[edge.from];

              const target =
                nodeById[edge.target] || nodeById[edge.to];

              return (
                <div
                  key={edge.id || index}
                  className="flex min-w-0 flex-wrap items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm"
                >
                  <span className="max-w-full break-words font-semibold text-slate-800">
                    {source?.label ||
                      source?.title ||
                      edge.source ||
                      edge.from}
                  </span>

                  <span className="font-bold text-blue-600">
                    →
                  </span>

                  <span className="max-w-full break-words font-semibold text-slate-800">
                    {target?.label ||
                      target?.title ||
                      edge.target ||
                      edge.to}
                  </span>

                  {edge.type && (
                    <span className="rounded-full bg-slate-200 px-2 py-1 text-xs text-slate-600">
                      {edge.type}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}