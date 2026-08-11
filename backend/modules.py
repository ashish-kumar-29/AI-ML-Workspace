
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from pandas.api.types import (
    is_numeric_dtype,
    is_datetime64_any_dtype,
    is_bool_dtype,
    is_string_dtype,
)


def safe_number(value):
    if value is None:
        return None

    if pd.isna(value):
        return None

    if np.isinf(value):
        return None

    return round(float(value), 2)


#importing dataset

def load_dataset(filename :str)-> pd.DataFrame:
    if(filename.endswith(".csv")):
        df = pd.read_csv(filename)
    else:
        raise ValueError("Unsupported file type")

    return df




#column infos

def col_summary(df):
    result = {}
    for col in df.columns:
        dtype = str(df[col].dtype)
        memory = int(df[col].memory_usage(deep =True))
        unique = int(df[col].nunique())
        missing = int(df[col].isnull().sum())
        missing_p = round((missing/len(df) *100),2) if len(df) > 0 else 0
        not_null = len(df) - missing
        if(unique ==1):
            is_constant =True
        else:
            is_constant = False

        result[col] = {
            "dtype" : dtype,
            "memory_usage":memory,
            "unique_values": unique,
            "missing_count" :missing,
            "missing_percent":missing_p,
            "non_null_count":not_null,
            "is_constant":is_constant,
        }
        
    return result
        




#missing values

def missing_values(df):
    result = {}

    for col in df.columns:
        count = int(df[col].isnull().sum())
        percent = round((count / len(df))*100, 2) if len(df) > 0 else 0

        result[col] = {
            "missing_count": count,
            "missing_percent": percent
        }

    return result




#duplicate values

def duplicate_values(df):
    count = int(df.duplicated().sum())
    percent = round(count/len(df)*100 ,2) if len(df) > 0 else 0
    return {
        "duplicate_count":count, 
        "duplicate_percent":percent}




#outliers

def check_outliers(df):
    result={}
    num_col = df.select_dtypes(include='number').columns
    for col in num_col:
        q1 = df[col].quantile(0.25)
        q2 = df[col].quantile(0.50)
        q3 = df[col].quantile(0.75)

        iqr = q3-q1

        l_bound = q1 - 1.5*iqr
        u_bound = q3 + 1.5*iqr
        count = 0

        for value in df[col]:
            if(value<l_bound or value>u_bound):
                count+=1

        result[col] = {
            "outliers_count" : int(count),
            "lower_bound": safe_number(l_bound),
            "upper_bound": safe_number(u_bound)
        }
    return result





# def check_correlation(df):
#     num_df = df.select_dtypes(include ='number')
#     return num_df.corr().to_dict()

def check_correlation(df):
    num_df = df.select_dtypes(include="number")

    corr = num_df.corr()

    corr = corr.replace([np.inf, -np.inf], np.nan)

    # Convert dataframe to object type first
    corr = corr.astype(object)

    # Replace NaN with None
    corr = corr.where(pd.notna(corr), None)

    return corr.to_dict()





# def basic_info(df):
#     return{
#         "rows": len(df),
#         "columns" : len(df.columns),
#         "memory_usage":df.memory_usage(deep=True)
#     }

def basic_info(df):
    info = {}

    info["rows"] = len(df)
    info["columns"] = len(df.columns)

    info["memory_usage_bytes"] = int(df.memory_usage(deep=True).sum())
    info["memory_usage_mb"] = round(info["memory_usage_bytes"] / (1024 * 1024), 2)

    info["numeric_columns"] = len(df.select_dtypes(include="number").columns)
    info["categorical_columns"] = len(df.select_dtypes(include=["object", "category"]).columns)
    info["datetime_columns"] = len(df.select_dtypes(include="datetime").columns)
    info["boolean_columns"] = len(df.select_dtypes(include="bool").columns)

    return info





def describe(df):
    return df.describe().to_dict()





def invalid_values(df):
    result = {}
    invalid_str = [""," ", "NA","N/A", "NULL", "null", "Null", "None", "none", "?","NA", "N/A", "n/a", "na","NaN", "nan", "NAN", "Nil", "nil","Undefined"]

    for col in df.columns:
        count = 0

        if(df[col].dtype == "object"):

            for v in df[col]:

                if not pd.isna(v):

                    if isinstance(v, str):

                        if(v.strip() in invalid_str):
                            count+=1

        if is_numeric_dtype(df[col]):
            count += int(np.isinf(df[col]).sum())

        result[col] = {"invalid_count":int(count)}

    return result






def numerical_statistics(df):
    result = {}
    num_col = df.select_dtypes(include ="number").columns
    for col in num_col:
        cnt = df[col].count()
        mean = df[col].mean()
        median = df[col].median()
        mode = df[col].mode()

        if len(mode) == df[col].nunique():
            mode = "No mode"
        else:
            mode = mode.tolist()

        sumv = df[col].sum()
        minv = df[col].min()
        maxv = df[col].max()
        rangec = maxv-minv
        var = df[col].var()
        sd = df[col].std()
        q1 = df[col].quantile(0.25)
        q2 = df[col].quantile(0.50)
        q3 = df[col].quantile(0.75)

        # Correct IQR = Q3 - Q1
        iqr = q3 - q1

        # result[col] = {
        #     "count":int(cnt),
        #     "mean":round(float(mean),2),
        #     "median":round(float(median),2),
        #     "mode":mode,
        #     "sum":round(float(sumv),2),
        #     "minimum":round(float(minv),2),
        #     "maximum":round(float(maxv),2),
        #     "range":round(float(rangec),2),
        #     "variance":round(float(var),2),
        #     "standard_deviation":round(float(sd),2),
        #     "q1":round(float(q1),2),
        #     "q2":round(float(q2),2),
        #     "q3":round(float(q3),2),
        #     "iqr":round(float(iqr),2),
        #     "unique_values":int(df[col].nunique())
        # }

        result[col] = {
            "count": int(cnt),
            "mean": safe_number(mean),
            "median": safe_number(median),
            "mode": mode,
            "sum": safe_number(sumv),
            "minimum": safe_number(minv),
            "maximum": safe_number(maxv),
            "range": safe_number(rangec),
            "variance": safe_number(var),
            "standard_deviation": safe_number(sd),
            "q1": safe_number(q1),
            "q2": safe_number(q2),
            "q3": safe_number(q3),
            "iqr": safe_number(iqr),
            "unique_values": int(df[col].nunique())
        }

    return result




def categorical_statistics(df):
    result={}
    cat_col= df.select_dtypes(include = ["object","category"]).columns
    
    for col in cat_col:
        mode = df[col].mode()

        if len(mode) > 0:
            top_category = mode[0]
        else:
            top_category = None

        value_counts = df[col].value_counts()

        if len(value_counts) > 0:
            top_freq= int(value_counts.iloc[0])
        else:
            top_freq=  0

        lengths = df[col].dropna().astype(str).str.len()

        if len(lengths) > 0:
            average_length = round(float(lengths.mean()),2)
            minimum_length = int(lengths.min())
            maximum_length = int(lengths.max())
        else:
            average_length = 0
            minimum_length = 0
            maximum_length = 0

        
        result[col] = {
            "count": int(df[col].count()),
            "unique_values":int(df[col].nunique()),
            "top_category":top_category,
            "top_frequency":top_freq,
            "average_length":average_length,
            "minimum_length":minimum_length,
            "maximum_length":maximum_length
                
        }

    return result




def datetime_statistics(df):
    result={}
    date_col = df.select_dtypes(include = "datetime").columns

    for col in date_col:
        result[col]={
            "first_date":str(df[col].min()),
            "last_date":str(df[col].max()),
            "unique_date":int(df[col].nunique()),
            "missing_value":int(df[col].isnull().sum()),
        }

    return result




def distribution_analysis(df):
    result = {}
    num_col = df.select_dtypes(include = "number").columns

    for col in num_col:
        skew = df[col].skew()
        count = (df[col]==0).sum()
        neg_count = (df[col]<0).sum()

        if(pd.isna(skew)):
            distribution = "Undefined"

        elif(skew>0.5):
            distribution = 'Right Skewed'

        elif (skew<-0.5):
            distribution = 'Left Skewed'

        else:
            distribution = "Symmetric"

        result[col] = {
            "distribution":distribution,
            # "skewness":round(float(skew),2),
            "skewness": safe_number(skew),
            "zero_count":int(count),
            "negative_count":int(neg_count)
        }

    return result





def kurtosis(df):
    result ={}
    num_col=df.select_dtypes(include = "number").columns

    for col in num_col:
    
        kurt = df[col].kurt()

        if(pd.isna(kurt)):
            ans = "Undefined"

        elif(kurt>0):
            ans= "Leptokurtic"

        elif(kurt<0):
            ans ="Platykurtic"

        else:
            ans = "Mesokurtic"

        result[col] = {
            # "kurtosis": round(float(kurt), 2),
            "kurtosis": safe_number(kurt),
            "type": ans
        }

    return result
