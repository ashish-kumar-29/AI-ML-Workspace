import io
import json
import pandas as pd

from fastapi import (
    FastAPI,
    UploadFile,
    File,
    HTTPException,
    Form
)

from fastapi.responses import StreamingResponse

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
from services.grok_service import get_ai_recommendations
from services.cleaning_service import apply_cleaning


# ============================================================
# FASTAPI APP
# ============================================================

app = FastAPI(
    title="DataMind AI API",
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

    expose_headers=[
        "Content-Disposition",
        "X-Original-Rows",
        "X-Cleaned-Rows",
        "X-Original-Columns",
        "X-Cleaned-Columns"
    ]
)


# ============================================================
# ROOT
# ============================================================

@app.get("/")
def root():

    return {
        "status": "success",
        "message": "DataMind AI Backend Running 🚀"
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
        # Return information
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
                detail="Only CSV files are supported."
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
                detail="Invalid cleaning operations JSON."
            )


        # ====================================================
        # VALIDATE OPERATIONS
        # ====================================================

        if not isinstance(
            parsed_operations,
            list
        ):

            raise HTTPException(
                status_code=400,
                detail="Cleaning operations must be a list."
            )


        if len(parsed_operations) == 0:

            raise HTTPException(
                status_code=400,
                detail="No cleaning operations were provided."
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
            parsed_operations
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
        # CONVERT CLEANED DATAFRAME TO CSV
        # ====================================================

        csv_buffer = io.StringIO()


        cleaned_df.to_csv(
            csv_buffer,
            index=False
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
                    str(cleaned_columns)

            }

        )


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