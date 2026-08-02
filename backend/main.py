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
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd

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
async def analyze_dataset(file: UploadFile = File(...)):
    df = pd.read_csv(file.file)

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

    # report = {}

    # report["basic_info"] = basic_info(df)
    # print("basic_info OK")

    # report["column_summary"] = col_summary(df)
    # print("column_summary OK")

    # report["missing_analysis"] = missing_values(df)
    # print("missing_analysis OK")

    # report["duplicate_analysis"] = duplicate_values(df)
    # print("duplicate_analysis OK")

    # report["invalid_value_analysis"] = invalid_values(df)
    # print("invalid_value_analysis OK")

    # report["numerical_statistics"] = numerical_statistics(df)
    # print("numerical_statistics OK")

    # report["categorical_statistics"] = categorical_statistics(df)
    # print("categorical_statistics OK")

    # report["datetime_statistics"] = datetime_statistics(df)
    # print("datetime_statistics OK")

    # report["outlier_analysis"] = check_outliers(df)
    # print("outlier_analysis OK")

    # report["correlation_analysis"] = check_correlation(df)
    # print("correlation_analysis OK")

    # report["distribution_analysis"] = distribution_analysis(df)
    # print("distribution_analysis OK")

    # report["kurtosis_analysis"] = kurtosis(df)
    # print("kurtosis_analysis OK")

    # return report
    # return clean_nan(report)

    # import json

    # cleaned_report = clean_nan(report)

    # print("Cleaning completed")

    import json

    for name, value in report.items():
        print(f"Testing {name}...")

        json.dumps(value, allow_nan=False)

        print(f"✅ {name} OK")

    return {"status": "success"}