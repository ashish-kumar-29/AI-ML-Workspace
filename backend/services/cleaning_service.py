import pandas as pd


def apply_cleaning(df, operations):

    df = df.copy()


    for operation in operations:

        column = operation.get(
            "column"
        )

        problem = operation.get(
            "problem"
        )

        method = operation.get(
            "method"
        )


        # ====================================================
        # DUPLICATE ROWS
        # ====================================================

        if problem == "Duplicate Rows":

            if method == "drop_duplicates":

                df = df.drop_duplicates()

            continue


        # ====================================================
        # COLUMN VALIDATION
        # ====================================================

        if column not in df.columns:
            continue


        # ====================================================
        # MISSING VALUES
        # ====================================================

        if problem == "Missing Values":

            # ------------------------------------------------
            # MEAN
            # ------------------------------------------------

            if method == "mean":

                if pd.api.types.is_numeric_dtype(
                    df[column]
                ):

                    mean_value = (
                        df[column].mean()
                    )

                    df[column] = (
                        df[column].fillna(
                            mean_value
                        )
                    )


            # ------------------------------------------------
            # MEDIAN
            # ------------------------------------------------

            elif method == "median":

                if pd.api.types.is_numeric_dtype(
                    df[column]
                ):

                    median_value = (
                        df[column].median()
                    )

                    df[column] = (
                        df[column].fillna(
                            median_value
                        )
                    )


            # ------------------------------------------------
            # MODE
            # ------------------------------------------------

            elif method == "mode":

                mode = (
                    df[column].mode()
                )

                if not mode.empty:

                    df[column] = (
                        df[column].fillna(
                            mode.iloc[0]
                        )
                    )


            # ------------------------------------------------
            # DROP COLUMN
            # ------------------------------------------------

            elif method == "drop_column":

                df = df.drop(
                    columns=[column]
                )


            # ------------------------------------------------
            # DROP ROWS
            # ------------------------------------------------

            elif method == "drop_rows":

                df = df.dropna(
                    subset=[column]
                )


        # ====================================================
        # OUTLIERS
        # ====================================================

        elif problem == "Outliers":

            if not pd.api.types.is_numeric_dtype(
                df[column]
            ):

                continue


            q1 = df[column].quantile(
                0.25
            )

            q3 = df[column].quantile(
                0.75
            )

            iqr = q3 - q1


            lower_bound = (
                q1 - (1.5 * iqr)
            )

            upper_bound = (
                q3 + (1.5 * iqr)
            )


            # ------------------------------------------------
            # REMOVE OUTLIERS
            # ------------------------------------------------

            if method == "remove_outliers":

                df = df[
                    (
                        df[column] >=
                        lower_bound
                    )
                    &
                    (
                        df[column] <=
                        upper_bound
                    )
                ]


            # ------------------------------------------------
            # CAP OUTLIERS
            # ------------------------------------------------

            elif method == "cap_outliers":

                df[column] = (
                    df[column].clip(
                        lower_bound,
                        upper_bound
                    )
                )


        # ====================================================
        # INVALID VALUES
        # ====================================================

        elif problem == "Invalid Values":

            if method == "drop_rows":

                invalid_mask = (
                    df[column]
                    .astype(str)
                    .str.strip()
                    .isin([
                        "",
                        " ",
                        "NA",
                        "N/A",
                        "NULL",
                        "null",
                        "None",
                        "none",
                        "?",
                        "n/a",
                        "na",
                        "NaN",
                        "nan",
                        "NAN"
                    ])
                )


                df = df[
                    ~invalid_mask
                ]


            # ------------------------------------------------
            # REPLACE INVALID VALUES WITH MODE
            # ------------------------------------------------

            elif method == "replace_with_mode":

                invalid_mask = (
                    df[column]
                    .astype(str)
                    .str.strip()
                    .isin([
                        "",
                        " ",
                        "NA",
                        "N/A",
                        "NULL",
                        "null",
                        "None",
                        "none",
                        "?",
                        "n/a",
                        "na",
                        "NaN",
                        "nan",
                        "NAN"
                    ])
                )


                valid_values = (
                    df.loc[
                        ~invalid_mask,
                        column
                    ]
                )


                mode = (
                    valid_values.mode()
                )


                if not mode.empty:

                    df.loc[
                        invalid_mask,
                        column
                    ] = mode.iloc[0]


            # ------------------------------------------------
            # REPLACE INVALID VALUES WITH NAN
            # ------------------------------------------------

            elif method == "replace_with_nan":

                invalid_values = [
                    "",
                    " ",
                    "NA",
                    "N/A",
                    "NULL",
                    "null",
                    "None",
                    "none",
                    "?",
                    "n/a",
                    "na",
                    "NaN",
                    "nan",
                    "NAN"
                ]


                df[column] = (
                    df[column].replace(
                        invalid_values,
                        pd.NA
                    )
                )


        # ====================================================
        # BACKWARD COMPATIBILITY
        # ====================================================
        #
        # This allows the old frontend request:
        #
        # {"column": "Age", "method": "median"}
        #
        # to continue working.
        # ====================================================

        elif problem is None:

            # ------------------------------------------------
            # MEAN
            # ------------------------------------------------

            if method == "mean":

                if pd.api.types.is_numeric_dtype(
                    df[column]
                ):

                    mean_value = (
                        df[column].mean()
                    )

                    df[column] = (
                        df[column].fillna(
                            mean_value
                        )
                    )


            # ------------------------------------------------
            # MEDIAN
            # ------------------------------------------------

            elif method == "median":

                if pd.api.types.is_numeric_dtype(
                    df[column]
                ):

                    median_value = (
                        df[column].median()
                    )

                    df[column] = (
                        df[column].fillna(
                            median_value
                        )
                    )


            # ------------------------------------------------
            # MODE
            # ------------------------------------------------

            elif method == "mode":

                mode = (
                    df[column].mode()
                )

                if not mode.empty:

                    df[column] = (
                        df[column].fillna(
                            mode.iloc[0]
                        )
                    )


            # ------------------------------------------------
            # DROP COLUMN
            # ------------------------------------------------

            elif method == "drop_column":

                df = df.drop(
                    columns=[column]
                )


            # ------------------------------------------------
            # DROP ROWS
            # ------------------------------------------------

            elif method == "drop_rows":

                df = df.dropna(
                    subset=[column]
                )


    return df