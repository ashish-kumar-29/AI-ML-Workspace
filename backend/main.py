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

from fastapi.encoders import jsonable_encoder
from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
from fastapi.responses import StreamingResponse
from io import StringIO
import json
from pydantic import BaseModel
from services.ai_service import analyze_dataset
from services.cleaning_service import apply_cleaning
from services.report_service import compare_reports
from services.summary_service import create_summary
from services.quality_service import calculate_score
import math
import numpy as np




def clean_nan(obj, path="root"):
    if isinstance(obj, dict):
        return {k: clean_nan(v, f"{path}.{k}") for k, v in obj.items()}

    elif isinstance(obj, list):
        return [clean_nan(v, f"{path}[{i}]") for i, v in enumerate(obj)]

    elif isinstance(obj, np.integer):
        return int(obj)

    elif isinstance(obj, np.floating):
        value = float(obj)
        if math.isnan(value) or math.isinf(value):
            print(f"NaN found at: {path}")
            return None
        return value

    elif isinstance(obj, float):
        if math.isnan(obj) or math.isinf(obj):
            print(f"NaN found at: {path}")
            return None
        return obj

    elif pd.isna(obj):
        print(f"NaN found at: {path}")
        return None

    return obj

def generate_report(df):

    report = {
        "basic_info": basic_info(df),
        "column_summary": col_summary(df),
        "missing_analysis": missing_values(df),
        "duplicate_analysis": duplicate_values(df),
        "invalid_value_analysis": invalid_values(df),
        "numerical_statistics": numerical_statistics(df),
        "categorical_statistics": categorical_statistics(df),
        "datetime_statistics": datetime_statistics(df),
        "outlier_analysis": check_outliers(df),
        "correlation_analysis": check_correlation(df),
        "distribution_analysis": distribution_analysis(df),
        "kurtosis_analysis": kurtosis(df),
    }

    return clean_nan(report)



app = FastAPI(
    title="AI ML Workspace API",
    description="Backend API for AI-Powered ML Workspace",
    version="1.0.0"
)

# Allow frontend to access backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



@app.get("/")
def root():
    return {
        "status": "success",
        "message": "AI ML Workspace Backend Running 🚀"
    }

# @app.post("/upload")
# async def upload_csv(file: UploadFile = File(...)):
#     # Read CSV
#     df = pd.read_csv(file.file)

#     return {
#         "filename": file.filename,
#         "rows": len(df),
#         "columns": len(df.columns),
#         "column_names": df.columns.tolist(),
#         "preview": df.head().to_dict(orient="records")
#     }

@app.post("/upload")
async def upload_csv(file: UploadFile = File(...)):
    df = pd.read_csv(file.file)
    print(df.dtypes)

    preview = (
        df.head()
        .replace({np.nan: None})
        .to_dict(orient="records")
    )

    print(preview)

    return {
        "filename": file.filename,
        "rows": int(len(df)),
        "columns": int(len(df.columns)),
        "column_names": df.columns.tolist(),
        "preview": preview,
    }


@app.post("/eda")
async def eda_endpoint(file: UploadFile = File(...)):

    df = pd.read_csv(file.file)

    report = generate_report(df)

    return report
    


@app.post("/ai-insights")
async def ai_insights(file: UploadFile = File(...)):

    df = pd.read_csv(file.file)

    report = generate_report(df)

    result = analyze_dataset(report)

    return result

@app.post("/clean")
async def clean_dataset(
    file: UploadFile = File(...),
    operations: str = Form(...)
):
    # Read uploaded CSV
    df = pd.read_csv(file.file)

    # Convert operations JSON string to Python list
    operations = json.loads(operations)

    # -----------------------
    # BEFORE CLEANING
    # -----------------------

    report_before = generate_report(df)

    summary_before = create_summary(report_before)

    score_before = calculate_score(summary_before)

    # -----------------------
    # APPLY CLEANING
    # -----------------------

    cleaned_df = apply_cleaning(df, operations)

    # -----------------------
    # AFTER CLEANING
    # -----------------------

    report_after = generate_report(cleaned_df)

    summary_after = create_summary(report_after)

    score_after = calculate_score(summary_after)

    # -----------------------
    # COMPARE
    # -----------------------

    comparison = compare_reports(

        {
            "score": score_before,
            "summary": summary_before
        },

        {
            "score": score_after,
            "summary": summary_after
        }

    )

    # -----------------------
    # RETURN
    # -----------------------

    return {

        "comparison": comparison,

        "before": {

            "score": score_before,

            "summary": summary_before

        },

        "after": {

            "score": score_after,

            "summary": summary_after

        },

        "preview": (

            cleaned_df
            .head()
            .replace({np.nan: None})
            .to_dict(orient="records")

        )

    }

@app.post("/download")
async def download_cleaned_csv(
    file: UploadFile = File(...),
    operations: str = Form(...)
):

    # Read CSV
    df = pd.read_csv(file.file)

    # Convert operations
    operations = json.loads(operations)

    # Apply cleaning
    cleaned_df = apply_cleaning(df, operations)

    # Convert DataFrame to CSV
    output = StringIO()

    cleaned_df.to_csv(output, index=False)

    output.seek(0)

    return StreamingResponse(
        output,
        media_type="text/csv",
        headers={
            "Content-Disposition": "attachment; filename=cleaned_dataset.csv"
        }
    )


   