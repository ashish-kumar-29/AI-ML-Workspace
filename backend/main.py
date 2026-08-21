import io
import json
import hashlib

import pandas as pd

from fastapi import (
    FastAPI,
    UploadFile,
    File,
    HTTPException,
    Form,
)

from pydantic import BaseModel

from fastapi.responses import StreamingResponse

from fastapi.middleware.cors import CORSMiddleware


# ============================================================
# AGENTIC RAG
# ============================================================

from services.router.query_router import QueryRouter
from services.agent.agent_orchestrator import AgentOrchestrator
from services.rag.rag_service import RAGService


# ============================================================
# EXISTING SERVICES
# ============================================================

from modules import (
    basic_info,
    col_summary,
    missing_values,
    duplicate_values,
    invalid_values,
    numerical_statistics,
    categorical_statistics,
    datetime_statistics,
    check_outliers,
    check_correlation,
    distribution_analysis,
    kurtosis,
)

from services.ai_service import analyze_dataset

from services.grok_service import (
    get_ai_recommendations,
    get_ai_chat_response,
)

from services.cleaning_service import apply_cleaning


# ============================================================
# DECISION GRAPH
# ============================================================

from services.decision_graph_service import (
    create_node,
    create_edge,
    create_branch,
    get_graph,
    clear_graph,
    rollback_to_node,
    compare_branches,
    create_experiment_branch,
)


# ============================================================
# FASTAPI APP
# ============================================================

app = FastAPI(
    title="DataMind AI API",
    description="Dataset EDA and AI-powered data quality analysis",
    version="1.0.0",
)


# ============================================================
# ACTIVE DATASET STATE
# ============================================================

# The most recently uploaded/processed dataset.
#
# For the hackathon this is intentionally kept in memory.
# A production multi-user version should store this per user/session.

ACTIVE_DATASET_ID: str | None = None

ACTIVE_DATASET_NAME: str | None = None

# In-memory registry of uploaded datasets.
# The hackathon uses the latest uploaded dataset as the active dataset.
DATASET_STORE: dict[str, pd.DataFrame] = {}


# ============================================================
# CORS
# ============================================================

app.add_middleware(
    CORSMiddleware,

    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],

    allow_credentials=True,

    allow_methods=["*"],

    allow_headers=["*"],

    expose_headers=[
        "Content-Disposition",
        "X-Original-Rows",
        "X-Cleaned-Rows",
        "X-Original-Columns",
        "X-Cleaned-Columns",
    ],
)


# ============================================================
# ROOT
# ============================================================

@app.get("/")
def root():

    return {
        "status": "success",
        "message": "DataMind AI Backend Running 🚀",
    }


# ============================================================
# DATASET ID GENERATOR
# ============================================================

def generate_dataset_id(
    file_bytes: bytes,
) -> str:
    """
    Generate a stable ID for an uploaded dataset.

    The same file produces the same dataset ID.
    Different files produce different IDs.
    """

    if not file_bytes:

        raise ValueError(
            "Dataset file is empty."
        )

    return hashlib.sha256(
        file_bytes
    ).hexdigest()[:16]


# ============================================================
# CHAT REQUEST MODEL
# ============================================================

class ChatRequest(BaseModel):
    """
    Request body for the DataMind AI chatbot.
    """

    query: str

    conversation_id: str = "default"


# ============================================================
# CHATBOT — AGENTIC RAG + GROQ
# ============================================================

@app.post("/chat")
async def chat(
    request: ChatRequest,
):
    """
    DataMind AI Agentic Chat endpoint.

    Flow:

        User Query
             ↓
        QueryRouter
             ↓
        AgentOrchestrator
             ├── RAG
             ├── Memory
             └── DataFrame
                    ↓
               ToolPlanner
                    ↓
               DataFrameTool
             ↓
        Groq
             ↓
        Natural Language Answer
    """

    global ACTIVE_DATASET_ID

    try:

        # ----------------------------------------------------
        # Validate query
        # ----------------------------------------------------

        query = request.query.strip()

        if not query:

            raise HTTPException(
                status_code=400,
                detail="Query cannot be empty.",
            )

        # ----------------------------------------------------
        # Validate active dataset
        # ----------------------------------------------------

        if not ACTIVE_DATASET_ID:

            raise HTTPException(
                status_code=400,
                detail=(
                    "No dataset has been uploaded yet. "
                    "Please upload a CSV dataset before "
                    "using the AI chatbot."
                ),
            )

        active_dataframe = DATASET_STORE.get(
            ACTIVE_DATASET_ID
        )

        if active_dataframe is None:

            raise HTTPException(
                status_code=400,
                detail=(
                    "The active dataset is not available "
                    "in memory. Please upload the dataset again."
                ),
            )

        # ----------------------------------------------------
        # Logging
        # ----------------------------------------------------

        print(
            "\n========================================"
        )

        print(
            "CHAT REQUEST RECEIVED"
        )

        print(
            f"Query: {query}"
        )

        print(
            f"Conversation ID: "
            f"{request.conversation_id}"
        )

        print(
            f"Active Dataset ID: "
            f"{ACTIVE_DATASET_ID}"
        )

        print(
            f"Rows: {len(active_dataframe)}"
        )

        print(
            f"Columns: {len(active_dataframe.columns)}"
        )

        print(
            "========================================"
        )

        # ----------------------------------------------------
        # Create RAG service
        # ----------------------------------------------------

        rag_service = RAGService()

        # ----------------------------------------------------
        # Create Agent Orchestrator
        #
        # IMPORTANT:
        # Pass the active DataFrame here. Without this,
        # DATAFRAME routing cannot execute.
        # ----------------------------------------------------

        orchestrator = AgentOrchestrator(
            query_router=QueryRouter(),
            rag_service=rag_service,
            dataframe=active_dataframe,
        )

        # ----------------------------------------------------
        # Execute agent using CURRENT DATASET
        # ----------------------------------------------------

        context = orchestrator.run(
            query=query,
            dataset_id=ACTIVE_DATASET_ID,
            conversation_id=request.conversation_id,
        )

        print(
            f"RAG results retrieved: "
            f"{len(context.rag_results)}"
        )

        # ----------------------------------------------------
        # Prepare context for Groq
        #
        # get_ai_chat_response already accepts RAG-style
        # context. We add the deterministic DataFrame result
        # as a synthetic context item so the existing Groq
        # service can explain the exact calculated result
        # without requiring another file change.
        # ----------------------------------------------------

        ai_context_results = list(
            context.rag_results
        )

        if context.dataframe_result is not None:

            try:

                dataframe_result_text = json.dumps(
                    context.dataframe_result,
                    indent=2,
                    default=str,
                )

            except Exception:

                dataframe_result_text = str(
                    context.dataframe_result
                )

            ai_context_results.insert(
                0,
                {
                    "text": (
                        "DETERMINISTIC DATAFRAME RESULT:\n"
                        f"{dataframe_result_text}"
                    ),
                    "metadata": {
                        "dataset_id":
                            ACTIVE_DATASET_ID,
                        "source":
                            "dataframe",
                        "analysis_type":
                            "deterministic_calculation",
                    },
                    "distance": 0.0,
                },
            )

            print(
                "\n[DataFrame] RESULT:"
            )

            print(
                dataframe_result_text
            )

        # ----------------------------------------------------
        # Generate actual AI answer
        # ----------------------------------------------------

        ai_response = get_ai_chat_response(
            query=query,
            rag_results=ai_context_results,
            memory_context=context.memory_context,
        )

        # ----------------------------------------------------
        # Extract answer
        # ----------------------------------------------------

        answer = ai_response.get(
            "answer",
            "Unable to generate an answer.",
        )

        print(
            "\n[Chat] AI ANSWER:"
        )

        print(
            answer
        )

        print()

        # ----------------------------------------------------
        # Routing information
        # ----------------------------------------------------

        routing = (
            context.routing_decision
        )

        sources = []

        for source in routing.sources:

            if hasattr(
                source,
                "value",
            ):

                sources.append(
                    source.value
                )

            else:

                sources.append(
                    str(source)
                )

        # ----------------------------------------------------
        # Return final chatbot response
        # ----------------------------------------------------

        return {

            "status":
                "success",

            "answer":
                answer,

            "conversation_id":
                request.conversation_id,

            "dataset_id":
                ACTIVE_DATASET_ID,

            "sources":
                sources,

            "confidence":
                routing.confidence,

            "reasoning":
                routing.reasoning,

            "context": {

                "query":
                    context.query,

                "dataset_id":
                    ACTIVE_DATASET_ID,

                "routing": {

                    "sources":
                        sources,

                    "confidence":
                        routing.confidence,

                    "reasoning":
                        routing.reasoning,
                },

                "rag_results":
                    context.rag_results,

                "memory_context":
                    context.memory_context,

                "structured_eda":
                    context.structured_eda,

                "dataframe_result":
                    context.dataframe_result,
            },
        }

    except HTTPException:

        raise

    except Exception as e:

        print(
            f"[Chat] Error: {e}"
        )

        raise HTTPException(
            status_code=500,
            detail=str(e),
        )


# ============================================================
# GENERATE EDA REPORT
# ============================================================

def generate_report(df):

    report = {}

    # --------------------------------------------------------
    # Basic information
    # --------------------------------------------------------

    report["basic_info"] = basic_info(df)

    # --------------------------------------------------------
    # Column summary
    # --------------------------------------------------------

    report["column_summary"] = col_summary(df)

    # --------------------------------------------------------
    # Missing values
    # --------------------------------------------------------

    report["missing_analysis"] = missing_values(df)

    # --------------------------------------------------------
    # Duplicate rows
    # --------------------------------------------------------

    report["duplicate_analysis"] = duplicate_values(df)

    # --------------------------------------------------------
    # Invalid values
    # --------------------------------------------------------

    report["invalid_value_analysis"] = invalid_values(df)

    # --------------------------------------------------------
    # Numerical statistics
    # --------------------------------------------------------

    report["numerical_statistics"] = numerical_statistics(df)

    # --------------------------------------------------------
    # Categorical statistics
    # --------------------------------------------------------

    report["categorical_statistics"] = categorical_statistics(df)

    # --------------------------------------------------------
    # Datetime statistics
    # --------------------------------------------------------

    report["datetime_statistics"] = datetime_statistics(df)

    # --------------------------------------------------------
    # Outliers
    # --------------------------------------------------------

    report["outlier_analysis"] = check_outliers(df)

    # --------------------------------------------------------
    # Correlation
    # --------------------------------------------------------

    report["correlation_analysis"] = check_correlation(df)

    # --------------------------------------------------------
    # Distribution
    # --------------------------------------------------------

    report["distribution_analysis"] = distribution_analysis(df)

    # --------------------------------------------------------
    # Kurtosis
    # --------------------------------------------------------

    report["kurtosis_analysis"] = kurtosis(df)

    return report


# ============================================================
# UPLOAD DATASET
# ============================================================

@app.post("/upload")
async def upload_dataset(
    file: UploadFile = File(...),
):

    global ACTIVE_DATASET_ID
    global ACTIVE_DATASET_NAME

    try:

        # ----------------------------------------------------
        # Validate file
        # ----------------------------------------------------

        if not file.filename.lower().endswith(".csv"):

            raise HTTPException(
                status_code=400,
                detail="Only CSV files are supported.",
            )

        # ----------------------------------------------------
        # Read file bytes
        # ----------------------------------------------------

        file_bytes = await file.read()

        if not file_bytes:

            raise HTTPException(
                status_code=400,
                detail="Uploaded CSV file is empty.",
            )

        # ----------------------------------------------------
        # Generate dataset ID
        # ----------------------------------------------------

        dataset_id = generate_dataset_id(
            file_bytes
        )

        # ----------------------------------------------------
        # Read CSV
        # ----------------------------------------------------

        df = pd.read_csv(
            io.BytesIO(file_bytes)
        )

        # ----------------------------------------------------
        # Store dataset in memory and set active dataset
        # ----------------------------------------------------

        DATASET_STORE[dataset_id] = df

        ACTIVE_DATASET_ID = dataset_id

        # ----------------------------------------------------
        # Decision Graph — new dataset becomes graph root
        # ----------------------------------------------------

        clear_graph()

        dataset_node = create_node(
            "dataset",
            "Dataset Uploaded",
            {
                "dataset_id": dataset_id,
                "filename": file.filename,
                "rows": len(df),
                "columns": len(df.columns),
                "column_names": df.columns.tolist(),
            },
        )

        graph = get_graph()
        graph["current_node"] = dataset_node["id"]

        print(
            "Decision graph: Dataset node created."
        )

        ACTIVE_DATASET_NAME = (
            file.filename
        )

        # ----------------------------------------------------
        # Logging
        # ----------------------------------------------------

        print(
            "\n========================================"
        )

        print(
            "DATASET UPLOADED"
        )

        print(
            f"Filename: {file.filename}"
        )

        print(
            f"Dataset ID: {dataset_id}"
        )

        print(
            f"Rows: {len(df)}"
        )

        print(
            f"Columns: {len(df.columns)}"
        )

        print(
            "========================================"
        )

        # ----------------------------------------------------
        # Create preview
        # ----------------------------------------------------

        preview_df = df.head(10).copy()

        preview_df = preview_df.astype(
            object
        )

        preview_df = preview_df.where(
            pd.notna(preview_df),
            None,
        )

        preview = preview_df.to_dict(
            orient="records"
        )

        # ----------------------------------------------------
        # Return information
        # ----------------------------------------------------

        return {

            "status":
                "success",

            "filename":
                file.filename,

            "dataset_id":
                dataset_id,

            "rows":
                len(df),

            "columns":
                len(df.columns),

            "column_names":
                df.columns.tolist(),

            "preview":
                preview,
        }

    except HTTPException:

        raise

    except Exception as e:

        print(
            f"[Upload] Error: {e}"
        )

        raise HTTPException(
            status_code=500,
            detail=(
                f"Failed to read CSV: {str(e)}"
            ),
        )


# ============================================================
# DECISION GRAPH API
# ============================================================

class BranchRequest(BaseModel):
    parent_node_id: str
    column: str
    method: str


@app.get("/decision-graph")
def get_decision_graph():
    """Return the current in-memory decision graph."""

    return get_graph()


@app.post("/decision-graph/rollback/{node_id}")
def rollback_decision(node_id: str):
    """Move the graph's current workflow position to an existing node."""

    try:
        node = rollback_to_node(node_id)

        if node is None:
            raise HTTPException(
                status_code=404,
                detail="Decision node not found.",
            )

        return {
            "message": "Rollback successful.",
            "node": node,
            "current_node": node_id,
            "graph": get_graph(),
        }

    except HTTPException:
        raise

    except Exception as e:
        print(
            f"[Decision Graph] Rollback error: {e}"
        )
        raise HTTPException(
            status_code=500,
            detail=str(e),
        )


@app.post("/decision-graph/branch")
async def create_decision_branch(
    request: BranchRequest,
):
    """Create an alternative experiment branch from a graph node."""

    try:
        graph = get_graph()

        parent_node = next(
            (
                node
                for node in graph["nodes"]
                if node["id"] == request.parent_node_id
            ),
            None,
        )

        if parent_node is None:
            raise HTTPException(
                status_code=404,
                detail="Parent node not found.",
            )

        original_method = (
            parent_node.get("details", {}).get("method")
        )

        branch_node = create_experiment_branch(
            parent_node_id=request.parent_node_id,
            column=request.column,
            method=request.method,
            original_method=original_method,
            reason=(
                "Alternative method selected for experiment."
            ),
        )

        return {
            "message": "Experiment branch created successfully.",
            "node": branch_node,
            "graph": get_graph(),
        }

    except HTTPException:
        raise

    except Exception as e:
        print(
            f"[Decision Graph] Branch error: {e}"
        )
        raise HTTPException(
            status_code=500,
            detail=str(e),
        )


@app.get("/decision-graph/compare/{parent_node_id}")
def compare_decision_branches(
    parent_node_id: str,
):
    """Return experiment branches directly connected to a parent node."""

    try:
        graph = get_graph()

        parent_exists = any(
            node["id"] == parent_node_id
            for node in graph["nodes"]
        )

        if not parent_exists:
            raise HTTPException(
                status_code=404,
                detail="Parent node not found.",
            )

        branches = compare_branches(
            parent_node_id
        )

        return {
            "parent_node_id": parent_node_id,
            "branches": branches,
            "count": len(branches),
        }

    except HTTPException:
        raise

    except Exception as e:
        print(
            f"[Decision Graph] Compare error: {e}"
        )
        raise HTTPException(
            status_code=500,
            detail=str(e),
        )


@app.post("/decision-graph/experiment")
async def run_decision_experiment(
    file: UploadFile = File(...),
    parent_node_id: str = Form(...),
    column: str = Form(...),
    method: str = Form(...),
):
    """Run a cleaning method experimentally without changing the active dataset."""

    try:
        if not file.filename.lower().endswith(".csv"):
            raise HTTPException(
                status_code=400,
                detail="Only CSV files are supported.",
            )

        graph = get_graph()

        parent_node = next(
            (
                node
                for node in graph["nodes"]
                if node["id"] == parent_node_id
            ),
            None,
        )

        if parent_node is None:
            raise HTTPException(
                status_code=404,
                detail="Parent decision node not found.",
            )

        df = pd.read_csv(file.file)

        rows_before = len(df)
        columns_before = len(df.columns)

        if column not in df.columns:
            raise HTTPException(
                status_code=400,
                detail=f"Column '{column}' not found.",
            )

        operation = {
            "column": column,
            "method": method,
            "decision_source": "EXPERIMENT",
        }

        experiment_df = apply_cleaning(
            df.copy(),
            [operation],
        )

        rows_after = len(experiment_df)
        columns_after = len(experiment_df.columns)

        experiment_node = create_branch(
            parent_node_id,
            "experiment",
            f"{column} → {method}",
            {
                "column": column,
                "method": method,
                "branch": True,
                "status": "completed",
                "parent_node": parent_node_id,
                "rows_before": rows_before,
                "rows_after": rows_after,
                "rows_removed": rows_before - rows_after,
                "columns_before": columns_before,
                "columns_after": columns_after,
            },
        )

        return {
            "message": "Experiment completed successfully.",
            "experiment": experiment_node,
            "results": {
                "rows_before": rows_before,
                "rows_after": rows_after,
                "rows_removed": rows_before - rows_after,
                "columns_before": columns_before,
                "columns_after": columns_after,
            },
            "graph": get_graph(),
        }

    except HTTPException:
        raise

    except Exception as e:
        print(
            f"[Decision Graph] Experiment error: {e}"
        )
        raise HTTPException(
            status_code=500,
            detail=f"Experiment failed: {str(e)}",
        )


# ============================================================
# EDA
# ============================================================

@app.post("/eda")
async def eda(
    file: UploadFile = File(...),
):

    global ACTIVE_DATASET_ID
    global ACTIVE_DATASET_NAME

    try:

        # ----------------------------------------------------
        # Validate file
        # ----------------------------------------------------

        if not file.filename.lower().endswith(".csv"):

            raise HTTPException(
                status_code=400,
                detail="Only CSV files are supported.",
            )

        # ----------------------------------------------------
        # Read file bytes
        # ----------------------------------------------------

        file_bytes = await file.read()

        if not file_bytes:

            raise HTTPException(
                status_code=400,
                detail="Uploaded CSV file is empty.",
            )

        # ----------------------------------------------------
        # Generate dataset ID
        # ----------------------------------------------------

        dataset_id = generate_dataset_id(
            file_bytes
        )

        # ----------------------------------------------------
        # Set active dataset
        # ----------------------------------------------------

        ACTIVE_DATASET_ID = dataset_id

        ACTIVE_DATASET_NAME = (
            file.filename
        )

        # ----------------------------------------------------
        # Read CSV
        # ----------------------------------------------------

        df = pd.read_csv(
            io.BytesIO(file_bytes)
        )

        # Keep the exact DataFrame used for EDA available
        # to the chatbot's DataFrame tools.
        DATASET_STORE[dataset_id] = df

        print(
            "\n========================================"
        )

        print(
            "EDA REQUEST RECEIVED"
        )

        print(
            f"Dataset: {file.filename}"
        )

        print(
            f"Dataset ID: {dataset_id}"
        )

        print(
            f"Rows: {len(df)}"
        )

        print(
            f"Columns: {len(df.columns)}"
        )

        print(
            "========================================"
        )

        # ----------------------------------------------------
        # Generate report
        # ----------------------------------------------------

        report = generate_report(
            df
        )

        print(
            "EDA report generated."
        )

        # ----------------------------------------------------
        # Decision Graph — EDA completed
        # ----------------------------------------------------

        graph = get_graph()
        previous_node_id = graph.get("current_node")

        eda_node = create_node(
            "analysis",
            "EDA Completed",
            {
                "dataset_id": dataset_id,
                "filename": file.filename,
                "rows": len(df),
                "columns": len(df.columns),
            },
        )

        if previous_node_id:
            create_edge(
                previous_node_id,
                eda_node["id"],
            )

        graph["current_node"] = eda_node["id"]

        print(
            "Decision graph: EDA node created."
        )

        # ----------------------------------------------------
        # Index EDA knowledge for CURRENT dataset
        # ----------------------------------------------------

        rag_service = RAGService()

        indexed_documents = (
            rag_service.index_report(
                report=report,
                dataset_id=dataset_id,
            )
        )

        print(
            f"RAG knowledge indexed: "
            f"{indexed_documents} documents"
        )

        # ----------------------------------------------------
        # Return report
        # ----------------------------------------------------

        return {

            "status":
                "success",

            "dataset_id":
                dataset_id,

            "filename":
                file.filename,

            "report":
                report,
        }

    except HTTPException:

        raise

    except Exception as e:

        print(
            f"[EDA] Error: {e}"
        )

        raise HTTPException(
            status_code=500,
            detail=f"EDA failed: {str(e)}",
        )


# ============================================================
# AI INSIGHTS
# ============================================================

@app.post("/ai-insights")
async def ai_insights(
    file: UploadFile = File(...),
):

    global ACTIVE_DATASET_ID
    global ACTIVE_DATASET_NAME

    try:

        print(
            "\n========================================"
        )

        print(
            "AI INSIGHTS REQUEST RECEIVED"
        )

        print(
            "========================================"
        )

        # ----------------------------------------------------
        # Validate file
        # ----------------------------------------------------

        if not file.filename.lower().endswith(".csv"):

            raise HTTPException(
                status_code=400,
                detail="Only CSV files are supported.",
            )

        # ----------------------------------------------------
        # Read file
        # ----------------------------------------------------

        file_bytes = await file.read()

        if not file_bytes:

            raise HTTPException(
                status_code=400,
                detail="Uploaded CSV file is empty.",
            )

        # ----------------------------------------------------
        # Generate dataset ID
        # ----------------------------------------------------

        dataset_id = generate_dataset_id(
            file_bytes
        )

        # ----------------------------------------------------
        # Set active dataset
        # ----------------------------------------------------

        ACTIVE_DATASET_ID = dataset_id

        ACTIVE_DATASET_NAME = (
            file.filename
        )

        # ----------------------------------------------------
        # Read CSV
        # ----------------------------------------------------

        df = pd.read_csv(
            io.BytesIO(file_bytes)
        )

        # Keep the current dataset available for chatbot
        # DataFrame calculations.
        DATASET_STORE[dataset_id] = df

        print(
            f"Dataset loaded: {file.filename}"
        )

        print(
            f"Dataset ID: {dataset_id}"
        )

        print(
            f"Rows: {len(df)}"
        )

        print(
            f"Columns: {len(df.columns)}"
        )

        # ====================================================
        # STEP 1 — Generate EDA report
        # ====================================================

        report = generate_report(
            df
        )

        print(
            "EDA report generated."
        )

        # ====================================================
        # STEP 2 — Analyze dataset
        # ====================================================

        result = analyze_dataset(
            report
        )

        print(
            f"Health score: {result['score']}"
        )

        print(
            f"Issues detected: "
            f"{len(result['summary']['issues'])}"
        )

        # ====================================================
        # STEP 3 — CALL GROQ
        # ====================================================

        print(
            "Sending prompt to Groq..."
        )

        recommendations = get_ai_recommendations(
            result["prompt"]
        )

        print(
            "Groq request completed."
        )

        # ====================================================
        # STEP 4 — ADD RECOMMENDATIONS
        # ====================================================

        result["recommendations"] = (
            recommendations
        )

        # ====================================================
        # Decision Graph — AI recommendations generated
        # ====================================================

        graph = get_graph()
        previous_node_id = graph.get("current_node")

        recommendation_node = create_node(
            "recommendation",
            "AI Recommendations Generated",
            {
                "dataset_id": dataset_id,
                "issues_count": len(
                    result["summary"]["issues"]
                ),
                "recommendations": recommendations,
            },
        )

        if previous_node_id:
            create_edge(
                previous_node_id,
                recommendation_node["id"],
            )

        graph["current_node"] = recommendation_node["id"]

        print(
            "Decision graph: AI recommendation node created."
        )

        # ====================================================
        # RETURN RESULT
        # ====================================================

        return result

    except HTTPException:

        raise

    except Exception as e:

        print(
            f"AI INSIGHTS ERROR: {e}"
        )

        raise HTTPException(
            status_code=500,
            detail=str(e),
        )


# ============================================================
# DATA CLEANING
# ============================================================

@app.post("/clean")
async def clean_dataset(
    file: UploadFile = File(...),
    operations: str = Form(""),
):

    try:

        print(
            "\n========================================"
        )

        print(
            "CLEANING REQUEST RECEIVED"
        )

        print(
            "========================================"
        )

        # ====================================================
        # VALIDATE FILE
        # ====================================================

        if not file.filename.lower().endswith(".csv"):

            raise HTTPException(
                status_code=400,
                detail="Only CSV files are supported.",
            )

        # ====================================================
        # READ ORIGINAL CSV
        # ====================================================

        df = pd.read_csv(
            file.file
        )

        print(
            f"Dataset: {file.filename}"
        )

        print(
            f"Original rows: {len(df)}"
        )

        print(
            f"Original columns: {len(df.columns)}"
        )

        # ====================================================
        # PARSE OPERATIONS
        # ====================================================

        try:

            parsed_operations = json.loads(
                operations
            )

        except json.JSONDecodeError:

            raise HTTPException(
                status_code=400,
                detail="Invalid cleaning operations JSON.",
            )

        # ====================================================
        # VALIDATE OPERATIONS
        # ====================================================

        if not isinstance(
            parsed_operations,
            list,
        ):

            raise HTTPException(
                status_code=400,
                detail="Cleaning operations must be a list.",
            )

        if len(parsed_operations) == 0:

            raise HTTPException(
                status_code=400,
                detail="No cleaning operations were provided.",
            )

        print(
            "Cleaning operations:"
        )

        print(
            parsed_operations
        )

        # ====================================================
        # APPLY CLEANING
        # ====================================================

        cleaned_df = apply_cleaning(
            df,
            parsed_operations,
        )

        # ====================================================
        # CLEANING STATISTICS
        # ====================================================

        original_rows = len(
            df
        )

        cleaned_rows = len(
            cleaned_df
        )

        original_columns = len(
            df.columns
        )

        cleaned_columns = len(
            cleaned_df.columns
        )

        print(
            f"Cleaned rows: {cleaned_rows}"
        )

        print(
            f"Cleaned columns: {cleaned_columns}"
        )

        # ====================================================
        # Decision Graph — cleaning decisions
        # ====================================================

        graph = get_graph()
        previous_node_id = graph.get("current_node")

        for operation in parsed_operations:

            if isinstance(operation, dict):
                column = (
                    operation.get("column")
                    or operation.get("column_name")
                    or "Unknown column"
                )

                method = (
                    operation.get("method")
                    or operation.get("operation")
                    or operation.get("action")
                    or "Unknown method"
                )

                decision_source = operation.get(
                    "decision_source",
                    "USER",
                )

                ai_recommendation = operation.get(
                    "ai_recommendation"
                )

                reason = operation.get(
                    "reason"
                )

                alternative = operation.get(
                    "alternative"
                )

            else:
                column = "Unknown column"
                method = str(operation)
                decision_source = "USER"
                ai_recommendation = None
                reason = None
                alternative = None

            cleaning_node = create_node(
                "cleaning",
                f"{column} → {method}",
                {
                    "dataset_id": ACTIVE_DATASET_ID,
                    "column": column,
                    "method": method,
                    "operation": operation,
                    "decision_source": decision_source,
                    "ai_recommendation": ai_recommendation,
                    "reason": reason,
                    "alternative": alternative,
                    "rows_before": original_rows,
                    "rows_after": cleaned_rows,
                    "columns_before": original_columns,
                    "columns_after": cleaned_columns,
                },
            )

            if previous_node_id:
                create_edge(
                    previous_node_id,
                    cleaning_node["id"],
                )

            previous_node_id = cleaning_node["id"]

        if previous_node_id:
            graph["current_node"] = previous_node_id

        print(
            "Decision graph: Cleaning decision(s) recorded."
        )

        # ====================================================
        # CONVERT CLEANED DATAFRAME TO CSV
        # ====================================================

        csv_buffer = io.StringIO()

        cleaned_df.to_csv(
            csv_buffer,
            index=False,
        )

        csv_buffer.seek(0)

        # ====================================================
        # DOWNLOAD FILENAME
        # ====================================================

        original_name = (
            file.filename
            or "dataset.csv"
        )

        if original_name.lower().endswith(
            ".csv"
        ):

            base_name = original_name[
                :-4
            ]

        else:

            base_name = original_name

        download_filename = (
            f"{base_name}_cleaned.csv"
        )

        # ====================================================
        # RETURN CLEANED CSV
        # ====================================================

        return StreamingResponse(

            iter([
                csv_buffer.getvalue()
            ]),

            media_type="text/csv",

            headers={

                "Content-Disposition":
                    f'attachment; filename="{download_filename}"',

                "X-Original-Rows":
                    str(original_rows),

                "X-Cleaned-Rows":
                    str(cleaned_rows),

                "X-Original-Columns":
                    str(original_columns),

                "X-Cleaned-Columns":
                    str(cleaned_columns),
            },
        )

    except HTTPException:

        raise

    except Exception as e:

        print(
            f"[Cleaning] Error: {e}"
        )

        raise HTTPException(
            status_code=500,
            detail=f"Cleaning failed: {str(e)}",
        )