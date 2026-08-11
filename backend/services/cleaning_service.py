
import pandas as pd


def apply_cleaning(df, operations):

    df = df.copy()

    for operation in operations:

        column = operation.get("column")
        method = operation.get("method")

        if column not in df.columns:
            continue


        # ====================================================
        # MEAN
        # ====================================================

        if method == "mean":

            if pd.api.types.is_numeric_dtype(
                df[column]
            ):

                mean_value = df[column].mean()

                df[column] = df[column].fillna(
                    mean_value
                )


        # ====================================================
        # MEDIAN
        # ====================================================

        elif method == "median":

            if pd.api.types.is_numeric_dtype(
                df[column]
            ):

                median_value = df[column].median()

                df[column] = df[column].fillna(
                    median_value
                )


        # ====================================================
        # MODE
        # ====================================================

        elif method == "mode":

            mode = df[column].mode()

            if not mode.empty:

                df[column] = df[column].fillna(
                    mode.iloc[0]
                )


        # ====================================================
        # DROP COLUMN
        # ====================================================

        elif method == "drop_column":

            df = df.drop(
                columns=[column]
            )


        # ====================================================
        # DROP ROWS
        # ====================================================

        elif method == "drop_rows":

            df = df.dropna(
                subset=[column]
            )


    return df
