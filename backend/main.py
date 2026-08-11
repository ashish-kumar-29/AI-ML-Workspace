
import json
import pandas as pd


from fastapi import FastAPI, UploadFile, File, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware


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
    kurtosis
)


from services.ai_service import analyze_dataset
from services.gemini_service import get_ai_recommendations
from services.cleaning_service import apply_cleaning


# ============================================================
# FASTAPI APP
# ============================================================

app = FastAPI(
    title="AI ML Workspace API",
    description="Dataset EDA and AI-powered data quality analysis",
    version="1.0.0"
)


# ============================================================
# CORS
# ============================================================

app.add_middleware(
    CORSMiddleware,

    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000"
    ],

    allow_credentials=True,

    allow_methods=["*"],

    allow_headers=["*"],
)


# ============================================================
# ROOT
# ============================================================

@app.get("/")
def root():

    return {
        "status": "success",
        "message": "AI ML Workspace Backend Running 🚀"
    }


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
    file: UploadFile = File(...)
):

    try:

        # ----------------------------------------------------
        # Validate file
        # ----------------------------------------------------

        if not file.filename.lower().endswith(".csv"):

            raise HTTPException(
                status_code=400,
                detail="Only CSV files are supported."
            )


        # ----------------------------------------------------
        # Read CSV
        # ----------------------------------------------------

        df = pd.read_csv(
            file.file
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
            None
        )

        preview = preview_df.to_dict(
            orient="records"
        )


        # ----------------------------------------------------
        # Return basic information
        # ----------------------------------------------------

        return {

            "filename":
                file.filename,

            "rows":
                len(df),

            "columns":
                len(df.columns),

            "column_names":
                df.columns.tolist(),

            "preview":
                preview

        }


    except HTTPException:

        raise


    except Exception as e:

        print(
            f"[Upload] Error: {e}"
        )

        raise HTTPException(
            status_code=500,
            detail=f"Failed to read CSV: {str(e)}"
        )


# ============================================================
# EDA
# ============================================================

@app.post("/eda")
async def eda(
    file: UploadFile = File(...)
):

    try:

        # ----------------------------------------------------
        # Validate
        # ----------------------------------------------------

        if not file.filename.lower().endswith(".csv"):

            raise HTTPException(
                status_code=400,
                detail="Only CSV files are supported."
            )


        # ----------------------------------------------------
        # Read CSV
        # ----------------------------------------------------

        df = pd.read_csv(
            file.file
        )


        # ----------------------------------------------------
        # Generate report
        # ----------------------------------------------------

        report = generate_report(
            df
        )


        return report


    except HTTPException:

        raise


    except Exception as e:

        print(
            f"[EDA] Error: {e}"
        )

        raise HTTPException(
            status_code=500,
            detail=f"EDA failed: {str(e)}"
        )


# ============================================================
# AI INSIGHTS
# ============================================================

@app.post("/ai-insights")
async def ai_insights(
    file: UploadFile = File(...)
):

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
                detail="Only CSV files are supported."
            )


        # ----------------------------------------------------
        # Read CSV
        # ----------------------------------------------------

        df = pd.read_csv(
            file.file
        )


        print(
            f"Dataset loaded: {file.filename}"
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
        # STEP 3 — CALL GEMINI
        # ====================================================

        print(
            "Sending prompt to Gemini..."
        )


        recommendations = get_ai_recommendations(
            result["prompt"]
        )


        print(
            "Gemini request completed."
        )


        # ====================================================
        # STEP 4 — Add recommendations
        # ====================================================

        result["recommendations"] = recommendations


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
            detail=str(e)
        )


# ============================================================
# DATA CLEANING
# ============================================================

@app.post("/clean")
async def clean_dataset(
    file: UploadFile = File(...),
    operations: str = Form("")
):

    try:

        # ----------------------------------------------------
        # Validate file
        # ----------------------------------------------------

        if not file.filename.lower().endswith(".csv"):

            raise HTTPException(
                status_code=400,
                detail="Only CSV files are supported."
            )


        # ----------------------------------------------------
        # Read CSV
        # ----------------------------------------------------

        df = pd.read_csv(
            file.file
        )


        # ----------------------------------------------------
        # Parse operations
        # ----------------------------------------------------

        try:

            parsed_operations = json.loads(
                operations
            )

        except json.JSONDecodeError:

            raise HTTPException(
                status_code=400,
                detail="Invalid cleaning operations JSON."
            )


        # ----------------------------------------------------
        # Apply cleaning
        # ----------------------------------------------------

        cleaned_df = apply_cleaning(
            df,
            parsed_operations
        )


        # ----------------------------------------------------
        # Return information
        # ----------------------------------------------------

        return {

            "message":
                "Dataset cleaned successfully.",

            "original_rows":
                len(df),

            "cleaned_rows":
                len(cleaned_df),

            "original_columns":
                len(df.columns),

            "cleaned_columns":
                len(cleaned_df.columns),

            "columns":
                cleaned_df.columns.tolist()

        }


    except HTTPException:

        raise


    except Exception as e:

        print(
            f"[Cleaning] Error: {e}"
        )

        raise HTTPException(
            status_code=500,
            detail=f"Cleaning failed: {str(e)}"
        )

