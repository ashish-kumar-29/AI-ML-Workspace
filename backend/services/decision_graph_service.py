from datetime import datetime
from uuid import uuid4


# ============================================================
# DECISION GRAPH STATE
# ============================================================

# In-memory graph for the current application session.
#
# The graph is intentionally kept separate from the existing
# dataset store, RAG system, EDA system, and DataFrame agent.
#
# This means adding Decision Graph functionality does not
# modify the existing analysis pipeline.

decision_graph = {
    "nodes": [],
    "edges": [],
    "current_node": None,
}


# ============================================================
# CREATE NODE
# ============================================================

def create_node(
    node_type: str,
    title: str,
    details: dict | None = None,
):
    """
    Create a node in the Decision Graph.

    Parameters
    ----------
    node_type:
        Type of graph node.

    title:
        Human-readable node title.

    details:
        Additional information associated with the node.
    """

    node = {
        "id": str(uuid4()),
        "type": node_type,
        "title": title,
        "details": details or {},
        "timestamp": datetime.now().isoformat(),
    }

    decision_graph["nodes"].append(node)

    return node


# ============================================================
# CREATE EDGE
# ============================================================

def create_edge(
    source_id: str,
    target_id: str,
):
    """
    Connect two nodes in the Decision Graph.
    """

    edge = {
        "id": str(uuid4()),
        "source": source_id,
        "target": target_id,
    }

    decision_graph["edges"].append(edge)

    return edge


# ============================================================
# CREATE BRANCH
# ============================================================

def create_branch(
    parent_node_id: str,
    node_type: str,
    title: str,
    details: dict | None = None,
):
    """
    Create a new branch from an existing graph node.
    """

    branch_node = create_node(
        node_type=node_type,
        title=title,
        details=details,
    )

    create_edge(
        source_id=parent_node_id,
        target_id=branch_node["id"],
    )

    return branch_node


# ============================================================
# CREATE EXPERIMENT BRANCH
# ============================================================

def create_experiment_branch(
    parent_node_id: str,
    column: str,
    method: str,
    original_method: str | None = None,
    reason: str | None = None,
):
    """
    Create an alternative cleaning/analysis experiment branch.

    Example:

        Age → median
              |
              └── Age → mean
                       EXPERIMENT
    """

    experiment_node = create_node(
        node_type="experiment",
        title=f"{column} → {method}",
        details={
            "column": column,
            "method": method,
            "branch": True,
            "status": "experiment",
            "parent_node": parent_node_id,
            "original_method": original_method,
            "reason": reason,
        },
    )

    create_edge(
        source_id=parent_node_id,
        target_id=experiment_node["id"],
    )

    return experiment_node


# ============================================================
# COMPARE BRANCHES
# ============================================================

def compare_branches(
    parent_node_id: str,
):
    """
    Return experiment branches directly connected to a node.
    """

    branches = []

    for edge in decision_graph["edges"]:

        if edge["source"] != parent_node_id:
            continue

        child_node = next(
            (
                node
                for node in decision_graph["nodes"]
                if node["id"] == edge["target"]
            ),
            None,
        )

        if child_node is None:
            continue

        details = child_node.get(
            "details",
            {},
        )

        is_branch = (
            child_node.get("type") == "experiment"
            or details.get("branch") is True
        )

        if is_branch:
            branches.append(child_node)

    return branches


# ============================================================
# ROLLBACK
# ============================================================

def rollback_to_node(
    node_id: str,
):
    """
    Set an existing graph node as the current decision point.

    IMPORTANT:
    This does not delete graph history and does not modify the
    active DataFrame. It only changes the graph's current
    workflow position.
    """

    node = next(
        (
            node
            for node in decision_graph["nodes"]
            if node["id"] == node_id
        ),
        None,
    )

    if node is None:
        return None

    decision_graph["current_node"] = node_id

    return node


# ============================================================
# GET GRAPH
# ============================================================

def get_graph():
    """
    Return the complete Decision Graph.
    """

    return decision_graph


# ============================================================
# CLEAR GRAPH
# ============================================================

def clear_graph():
    """
    Clear the current Decision Graph.

    This is called when a new dataset becomes the active dataset,
    so the graph represents the current dataset rather than
    mixing histories from different datasets.
    """

    decision_graph["nodes"].clear()
    decision_graph["edges"].clear()
    decision_graph["current_node"] = None