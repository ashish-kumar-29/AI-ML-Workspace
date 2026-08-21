"use client";

import { useEffect, useState } from "react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export default function DecisionGraphPage() {
  const [graph, setGraph] = useState({
    nodes: [],
    edges: [],
    current_node: null,
  });

  const [selectedNode, setSelectedNode] = useState(null);
  const [loading, setLoading] = useState(true);

  // Experiment comparison
  const [branchComparison, setBranchComparison] = useState(null);
  const [compareLoading, setCompareLoading] = useState(false);

  // ============================================================
  // FETCH DECISION GRAPH
  // ============================================================

  const loadGraph = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}/decision-graph`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch decision graph");
      }

      const data = await response.json();

      setGraph(data);

      // Select latest node by default
      if (data.nodes && data.nodes.length > 0) {
        setSelectedNode(
          data.nodes[data.nodes.length - 1]
        );
      }
    } catch (error) {
      console.error(
        "Decision graph error:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
// ROLLBACK TO SELECTED NODE
// ============================================================

const rollbackToNode = async () => {
  if (!selectedNode) return;

  const confirmed = window.confirm(
    `Rollback to "${selectedNode.title}"?\n\n` +
    `This will make this node the current decision.`
  );

  if (!confirmed) return;

  try {
    setLoading(true);

    // const response = await fetch(
    //   `${API_URL}/decision-graph/rollback`,
    //   {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify({
    //       node_id: selectedNode.id,
    //     }),
    //   }
    // );

    const response = await fetch(
      `${API_URL}/decision-graph/rollback/${selectedNode.id}`,
      {
        method: "POST",
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.detail || "Rollback failed"
      );
    }

    alert("Rollback successful.");

    // Reload graph so CURRENT node updates
    await loadGraph();

  } catch (error) {
    console.error(
      "Rollback error:",
      error
    );

    alert(
      `Rollback failed: ${error.message}`
    );

  } finally {
    setLoading(false);
  }
};

// ================================================

  useEffect(() => {
    loadGraph();
  }, []);

  // ============================================================
  // NODE TYPE INFORMATION
  // ============================================================

  const getNodeIcon = (type) => {
    switch (type) {
      case "dataset":
        return "📊";

      case "analysis":
        return "🔍";

      case "recommendation":
        return "🤖";

      case "cleaning":
        return "🧹";

      case "feature_engineering":
        return "⚙️";

      case "model":
        return "🧠";

      case "evaluation":
        return "📈";

      case "experiment":
        return "🧪";

      default:
        return "🔹";
    }
  };

  const getNodeLabel = (type) => {
    switch (type) {
      case "dataset":
        return "DATASET";

      case "analysis":
        return "ANALYSIS";

      case "recommendation":
        return "AI RECOMMENDATION";

      case "cleaning":
        return "CLEANING DECISION";

      case "feature_engineering":
        return "FEATURE ENGINEERING";

      case "model":
        return "MODEL";

      case "evaluation":
        return "EVALUATION";

      case "experiment":
        return "EXPERIMENT";

      default:
        return type?.toUpperCase();
    }
  };

  // ============================================================
  // FORMAT DATE
  // ============================================================

  const formatDate = (timestamp) => {
    if (!timestamp) return "";

    try {
      return new Date(timestamp).toLocaleString();
    } catch {
      return timestamp;
    }
  };

  // ============================================================
  // NODE COLOR
  // ============================================================

  const getNodeStyle = (type) => {
    switch (type) {
      case "dataset":
        return {
          border: "border-blue-500",
          bg: "bg-blue-50",
          iconBg: "bg-blue-100",
          text: "text-blue-700",
        };

      case "analysis":
        return {
          border: "border-purple-500",
          bg: "bg-purple-50",
          iconBg: "bg-purple-100",
          text: "text-purple-700",
        };

      case "recommendation":
        return {
          border: "border-yellow-500",
          bg: "bg-yellow-50",
          iconBg: "bg-yellow-100",
          text: "text-yellow-700",
        };

      case "cleaning":
        return {
          border: "border-green-500",
          bg: "bg-green-50",
          iconBg: "bg-green-100",
          text: "text-green-700",
        };

      case "experiment":
        return {
          border: "border-orange-400",
          bg: "bg-orange-50",
          iconBg: "bg-orange-100",
          text: "text-orange-700",
        };

      case "feature_engineering":
        return {
          border: "border-orange-500",
          bg: "bg-orange-50",
          iconBg: "bg-orange-100",
          text: "text-orange-700",
        };

      case "model":
        return {
          border: "border-pink-500",
          bg: "bg-pink-50",
          iconBg: "bg-pink-100",
          text: "text-pink-700",
        };

      case "evaluation":
        return {
          border: "border-indigo-500",
          bg: "bg-indigo-50",
          iconBg: "bg-indigo-100",
          text: "text-indigo-700",
        };

      default:
        return {
          border: "border-gray-400",
          bg: "bg-gray-50",
          iconBg: "bg-gray-100",
          text: "text-gray-700",
        };
    }
  };

  // ============================================================
  // GET PREVIOUS NODE
  // ============================================================

  const getPreviousNode = (nodeId) => {
    const edge = graph.edges?.find(
      (edge) => edge.target === nodeId
    );

    if (!edge) return null;

    return graph.nodes?.find(
      (node) => node.id === edge.source
    );
  };

  // ============================================================
// GET CHILD NODES
// ============================================================

const getChildNodes = (nodeId) => {
  const childIds = (graph.edges || [])
    .filter((edge) => edge.source === nodeId)
    .map((edge) => edge.target);

  return (graph.nodes || []).filter((node) =>
    childIds.includes(node.id)
  );
};

// ============================================================
// COMPARE EXPERIMENT BRANCHES
// ============================================================

const compareBranches = async () => {
  if (!selectedNode) return;

  const parentNodeId =
    selectedNode.details?.parent_node ||
    selectedNode.details?.parent_node_id;

  if (!parentNodeId) {
    alert("Parent node not found for this experiment.");
    return;
  }

  try {
    setCompareLoading(true);

    const response = await fetch(
      `${API_URL}/decision-graph/compare/${parentNodeId}`
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.detail || "Failed to compare branches"
      );
    }

    setBranchComparison(data);

  } catch (error) {
    console.error("Branch comparison error:", error);

    alert(
      `Comparison failed: ${error.message}`
    );

  } finally {
    setCompareLoading(false);
  }
};

// ============================================================
// FIND ROOT NODES
// ============================================================

const getRootNodes = () => {
  const targetIds = new Set(
    (graph.edges || []).map((edge) => edge.target)
  );

  return (graph.nodes || []).filter(
    (node) => !targetIds.has(node.id)
  );
};

  // ============================================================
  // LOADING
  // ============================================================

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
        <div className="text-center">
          <div className="text-4xl mb-4 animate-pulse">
            🧠
          </div>

          <p className="text-lg">
            Loading Decision Graph...
          </p>
        </div>
      </main>
    );
  }

  // ============================================================
  // EMPTY GRAPH
  // ============================================================

  if (!graph.nodes || graph.nodes.length === 0) {
    return (
      <main className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
        <div className="text-center">
          <div className="text-5xl mb-4">
            🌐
          </div>

          <h1 className="text-2xl font-bold mb-2">
            No Decision Graph Yet
          </h1>

          <p className="text-slate-400">
            Upload and analyze a dataset to create
            your ML decision history.
          </p>

          <button
            onClick={loadGraph}
            className="mt-6 px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 transition"
          >
            Refresh Graph
          </button>
        </div>
      </main>
    );
  }

  // ============================================================
  // MAIN UI
  // ============================================================

  return (
    <main className="min-h-screen bg-slate-950 text-white">

      {/* ======================================================
          HEADER
      ====================================================== */}

      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">

          <div>
            <h1 className="text-2xl font-bold">
              ML Decision Graph
            </h1>

            <p className="text-sm text-slate-400 mt-1">
              Trace every decision made during your
              machine learning workflow.
            </p>
          </div>

          <button
            onClick={loadGraph}
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 transition text-sm font-medium"
          >
            ↻ Refresh
          </button>

        </div>
      </header>

      {/* ======================================================
          CONTENT
      ====================================================== */}

      <div className="max-w-7xl mx-auto px-6 py-8">

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ==================================================
              GRAPH
          ================================================== */}

          <section className="lg:col-span-2">

            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

              <div className="flex items-center justify-between mb-8">

                <div>
                  <h2 className="text-lg font-semibold">
                    Workflow
                  </h2>

                  <p className="text-sm text-slate-400">
                    {graph.nodes.length} decisions/nodes
                    {" · "}
                    {graph.edges.length} connections
                  </p>
                </div>

                <div className="text-xs text-slate-400">
                  Click a node to inspect
                </div>

              </div>

              {/* =================================================
    ML DECISION GRAPH
================================================= */}

<div className="overflow-x-auto pb-8">

  <div className="min-w-[750px] flex flex-col items-center">

    {getRootNodes().map((rootNode) => {

      const renderNode = (node) => {

        const style = getNodeStyle(node.type);

        const isSelected =
          selectedNode?.id === node.id;

        const isCurrent =
          graph.current_node === node.id;

        const children =
          getChildNodes(node.id);

        return (
          <div
            key={node.id}
            className="flex flex-col items-center"
          >

            {/* ================================
                NODE
            ================================= */}

            <button
              onClick={() =>
                setSelectedNode(node)
              }
              className={`
                w-full max-w-xl
                text-left
                rounded-2xl
                border-2
                ${style.border}
                ${style.bg}
                text-slate-900
                p-5
                transition-all
                duration-200
                hover:scale-[1.01]
                shadow-lg

                ${
                  isSelected
                    ? "ring-4 ring-blue-500/30 scale-[1.01]"
                    : ""
                }

                ${
                  isCurrent
                    ? "ring-2 ring-green-400/50"
                    : ""
                }
              `}
            >

              <div className="flex items-start gap-4">

                {/* ICON */}

                <div
                  className={`
                    w-12 h-12
                    rounded-xl
                    ${style.iconBg}
                    flex
                    items-center
                    justify-center
                    text-2xl
                    shrink-0
                  `}
                >
                  {getNodeIcon(node.type)}
                </div>


                {/* CONTENT */}

                <div className="flex-1">

                  <div className="flex items-center gap-2 mb-1">

                    <span
                      className={`
                        text-xs
                        font-bold
                        ${style.text}
                      `}
                    >
                      {getNodeLabel(node.type)}
                    </span>

                    {isCurrent && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-100 text-green-700 font-semibold">
                        CURRENT
                      </span>
                    )}

                    {node.details?.branch && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 font-semibold">
                        EXPERIMENT
                      </span>
                    )}

                  </div>


                  <h3 className="font-bold text-lg">
                    {node.title}
                  </h3>


                  <p className="text-xs text-slate-500 mt-2">
                    {formatDate(node.timestamp)}
                  </p>

                </div>

              </div>

            </button>


            {/* =================================
                CHILDREN
            ================================= */}

            {children.length > 0 && (

              <div className="flex flex-col items-center">

                {/* Vertical connector */}

                <div className="w-0.5 h-8 bg-slate-600" />

                {/* Branch label */}

                {children.length > 1 && (
                  <div className="mb-3 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-xs text-slate-400">
                    {children.length} experiments / decisions
                  </div>
                )}


                {/* ============================
                    SINGLE CHILD
                ============================= */}

                {children.length === 1 && (

                  <div className="flex flex-col items-center">

                    <div className="text-slate-500 text-xl leading-none mb-2">
                      ↓
                    </div>

                    {renderNode(children[0])}

                  </div>

                )}


                {/* ============================
                    MULTIPLE CHILDREN / BRANCH
                ============================= */}

                {children.length > 1 && (

                  <div className="flex flex-col items-center">

                    {/* Horizontal branch line */}

                    <div className="relative flex justify-center w-full">

                      <div
                        className="absolute top-0 h-0.5 bg-slate-600"
                        style={{
                          width: `${Math.min(
                            children.length * 280,
                            900
                          )}px`
                        }}
                      />

                    </div>


                    {/* Branches */}

                    <div className="flex justify-center gap-6 mt-0">

                      {children.map((child) => (

                        <div
                          key={child.id}
                          className="flex flex-col items-center min-w-[260px]"
                        >

                          {/* Branch connector */}

                          <div className="w-0.5 h-6 bg-slate-600" />

                          <div className="text-slate-500 text-xl leading-none mb-2">
                            ↓
                          </div>

                          {/* Child node */}

                          {renderNode(child)}

                        </div>

                      ))}

                    </div>

                  </div>

                )}

              </div>

            )}

          </div>
        );
      };


      return (
        <div
          key={rootNode.id}
          className="flex flex-col items-center w-full"
        >
          {renderNode(rootNode)}
        </div>
      );

    })}

  </div>

</div>

            </div>

          </section>

          {/* ==================================================
              DETAILS PANEL
          ================================================== */}

          <aside>

            <div className="sticky top-6 rounded-2xl border border-slate-800 bg-slate-900 overflow-hidden">

              <div className="px-5 py-4 border-b border-slate-800">

                <h2 className="font-semibold">
                  Decision Details
                </h2>

                <p className="text-xs text-slate-400 mt-1">
                  Why this decision was made
                </p>

              </div>

              {selectedNode && (
                <div className="p-5 space-y-5">

                  {/* TITLE */}

                  <div>

                    <p className="text-xs text-slate-500 uppercase tracking-wider">
                      Node
                    </p>

                    <h3 className="text-xl font-bold mt-1">
                      {selectedNode.title}
                    </h3>

                  </div>

                  {/* ROLLBACK BUTTON */}

                  <div>
      <button
        onClick={rollbackToNode}
        disabled={
          !selectedNode ||
          graph.current_node === selectedNode.id
        }
        className={`
          w-full px-4 py-3 rounded-lg
          font-semibold text-sm transition
          ${
            graph.current_node === selectedNode.id
              ? "bg-slate-700 text-slate-500 cursor-not-allowed"
              : "bg-red-600 hover:bg-red-700 text-white"
          }
        `}
      >
        {graph.current_node === selectedNode.id
          ? "✓ Current Decision"
          : "↩ Rollback to This Decision"}
      </button>
    </div>

                  {/* TYPE */}

                  <div>

                    <p className="text-xs text-slate-500 uppercase tracking-wider">
                      Type
                    </p>

                    <p className="mt-1 text-sm">
                      {getNodeLabel(
                        selectedNode.type
                      )}
                    </p>

                  </div>

                  {/* CLEANING DECISION */}

                  {selectedNode.type ===
                    "cleaning" && (
                    <>

                      {/* SOURCE */}

                      <div>

                        <p className="text-xs text-slate-500 uppercase tracking-wider">
                          Decision Source
                        </p>

                        <div className="mt-2">

                          {selectedNode.details
                            ?.decision_source ===
                          "AI" ? (
                            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/20 text-purple-300 text-sm font-medium">
                              🤖 AI Recommended
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/20 text-blue-300 text-sm font-medium">
                              👤 User Selected
                            </span>
                          )}

                        </div>

                      </div>

                      {/* METHOD */}

                      <div>

                        <p className="text-xs text-slate-500 uppercase tracking-wider">
                          Selected Method
                        </p>

                        <div className="mt-2 px-3 py-2 rounded-lg bg-slate-800 font-mono text-sm">
                          {
                            selectedNode
                              .details
                              ?.method
                          }
                        </div>

                      </div>

                      {/* AI RECOMMENDATION */}

                      {selectedNode.details
                        ?.ai_recommendation && (
                        <div>

                          <p className="text-xs text-slate-500 uppercase tracking-wider">
                            AI Recommendation
                          </p>

                          <p className="mt-1 text-sm text-purple-300">
                            {
                              selectedNode
                                .details
                                .ai_recommendation
                            }
                          </p>

                        </div>
                      )}

                      {/* REASON */}

                      {selectedNode.details
                        ?.reason && (
                        <div>

                          <p className="text-xs text-slate-500 uppercase tracking-wider">
                            Why?
                          </p>

                          <div className="mt-2 p-3 rounded-lg bg-slate-800 text-sm text-slate-300 leading-relaxed">
                            {
                              selectedNode
                                .details
                                .reason
                            }
                          </div>

                        </div>
                      )}

                      {/* ALTERNATIVE */}

                      {selectedNode.details
                        ?.alternative && (
                        <div>

                          <p className="text-xs text-slate-500 uppercase tracking-wider">
                            Alternative
                          </p>

                          <p className="mt-1 text-sm text-yellow-300">
                            {
                              selectedNode
                                .details
                                .alternative
                            }
                          </p>

                        </div>
                      )}

                    </>
                  )}

                  {/* ============================================================
    EXPERIMENT DETAILS
============================================================ */}

{selectedNode.type === "experiment" && (
  <>
    {/* STATUS */}

    <div>
      <p className="text-xs text-slate-500 uppercase tracking-wider">
        Status
      </p>

      <div className="mt-2">
        <span
          className={`
            inline-flex items-center gap-2
            px-3 py-1.5
            rounded-full
            text-sm
            font-medium
            ${
              selectedNode.details?.status === "completed"
                ? "bg-green-500/20 text-green-300"
                : "bg-orange-500/20 text-orange-300"
            }
          `}
        >
          {selectedNode.details?.status === "completed"
            ? "✓ Completed"
            : "🧪 Experiment"}
        </span>
      </div>
    </div>

    {/* COLUMN */}

    <div>
      <p className="text-xs text-slate-500 uppercase tracking-wider">
        Column
      </p>

      <p className="mt-1 text-sm font-semibold">
        {selectedNode.details?.column}
      </p>
    </div>

    {/* METHOD */}

    <div>
      <p className="text-xs text-slate-500 uppercase tracking-wider">
        Method Tested
      </p>

      <div className="mt-2 px-3 py-2 rounded-lg bg-slate-800 font-mono text-sm">
        {selectedNode.details?.method}
      </div>
    </div>

    {/* RESULTS */}

    <div>
      <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">
        Experiment Results
      </p>

      <div className="grid grid-cols-2 gap-3">

        <div className="p-3 rounded-lg bg-slate-800">
          <p className="text-xs text-slate-500">
            Rows Before
          </p>

          <p className="font-bold mt-1">
            {selectedNode.details?.rows_before}
          </p>
        </div>

        <div className="p-3 rounded-lg bg-slate-800">
          <p className="text-xs text-slate-500">
            Rows After
          </p>

          <p className="font-bold mt-1">
            {selectedNode.details?.rows_after}
          </p>
        </div>

        <div className="p-3 rounded-lg bg-slate-800">
          <p className="text-xs text-slate-500">
            Rows Removed
          </p>

          <p className="font-bold mt-1">
            {selectedNode.details?.rows_removed}
          </p>
        </div>

        <div className="p-3 rounded-lg bg-slate-800">
          <p className="text-xs text-slate-500">
            Columns
          </p>

          <p className="font-bold mt-1">
            {selectedNode.details?.columns_before}
            {" → "}
            {selectedNode.details?.columns_after}
          </p>
        </div>

      </div>
    </div>

    {/* COMPARE BUTTON */}

    <div>
      <button
        onClick={compareBranches}
        disabled={compareLoading}
        className="
          w-full
          px-4
          py-3
          rounded-lg
          bg-orange-600
          hover:bg-orange-700
          disabled:bg-slate-700
          disabled:text-slate-500
          text-white
          font-semibold
          text-sm
          transition
        "
      >
        {compareLoading
          ? "Comparing..."
          : "🧪 Compare Experiments"}
      </button>
    </div>

    {/* COMPARISON RESULT */}

    {branchComparison && (
      <div className="space-y-3">

        <p className="text-xs text-slate-500 uppercase tracking-wider">
          Experiment Comparison
        </p>

        <div className="p-3 rounded-lg bg-slate-800">

          <p className="text-sm text-slate-400 mb-3">
            {branchComparison.count} experiment
            {branchComparison.count !== 1 ? "s" : ""} found
          </p>

          {branchComparison.branches?.length > 0 ? (
            <div className="space-y-2">

              {branchComparison.branches.map(
                (branch) => (
                  <div
                    key={branch.id}
                    className="
                      p-3
                      rounded-lg
                      bg-slate-700/50
                      border
                      border-slate-700
                    "
                  >

                    <p className="font-semibold text-sm">
                      {branch.title}
                    </p>

                    <div className="text-xs text-slate-400 mt-2 space-y-1">

                      <p>
                        Method:{" "}
                        <span className="text-slate-200">
                          {branch.details?.method}
                        </span>
                      </p>

                      <p>
                        Status:{" "}
                        <span className="text-green-300">
                          {branch.details?.status}
                        </span>
                      </p>

                      {branch.details?.rows_before !==
                        undefined && (
                        <p>
                          Rows:{" "}
                          {branch.details.rows_before}
                          {" → "}
                          {branch.details.rows_after}
                        </p>
                      )}

                    </div>

                  </div>
                )
              )}

            </div>
          ) : (
            <p className="text-sm text-slate-500">
              No experiment branches found.
            </p>
          )}

        </div>
      </div>
    )}
  </>
)}

                  {/* DATASET DETAILS */}

                  {selectedNode.type ===
                    "dataset" && (
                    <>

                      <div className="grid grid-cols-2 gap-3">

                        <div className="p-3 rounded-lg bg-slate-800">
                          <p className="text-xs text-slate-500">
                            Rows
                          </p>

                          <p className="font-bold mt-1">
                            {
                              selectedNode
                                .details
                                ?.rows
                            }
                          </p>
                        </div>

                        <div className="p-3 rounded-lg bg-slate-800">
                          <p className="text-xs text-slate-500">
                            Columns
                          </p>

                          <p className="font-bold mt-1">
                            {
                              selectedNode
                                .details
                                ?.columns
                            }
                          </p>
                        </div>

                      </div>

                      <div>

                        <p className="text-xs text-slate-500 uppercase tracking-wider">
                          File
                        </p>

                        <p className="mt-1 text-sm">
                          {
                            selectedNode
                              .details
                              ?.filename
                          }
                        </p>

                      </div>

                    </>
                  )}

                  {/* GENERAL DETAILS */}

                  <div>

                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">
                      Technical Details
                    </p>

                    <pre className="max-h-64 overflow-auto rounded-lg bg-black/40 border border-slate-800 p-3 text-xs text-slate-400">
                      {JSON.stringify(
                        selectedNode.details,
                        null,
                        2
                      )}
                    </pre>

                  </div>

                  {/* TIMESTAMP */}

                  <div>

                    <p className="text-xs text-slate-500 uppercase tracking-wider">
                      Timestamp
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      {formatDate(
                        selectedNode.timestamp
                      )}
                    </p>

                  </div>

                </div>
              )}

            </div>

          </aside>

        </div>

      </div>

    </main>
  );
}