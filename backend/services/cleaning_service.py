import pandas as pd


def apply_cleaning(df, operations):
    """
    operations example:

    [
        {
            "column": "Age",
            "method": "median"
        },
        {
            "column": "Cabin",
            "method": "drop_column"
        }
    ]
    """

    cleaned_df = df.copy()

    for op in operations:

        column = op.get("column")
        method = op.get("method")

        if column not in cleaned_df.columns:
            continue

        # Missing Value Handling

        if method == "mean":

            cleaned_df[column] = cleaned_df[column].fillna(
                cleaned_df[column].mean()
            )

        elif method == "median":

            cleaned_df[column] = cleaned_df[column].fillna(
                cleaned_df[column].median()
            )

        elif method == "mode":

            cleaned_df[column] = cleaned_df[column].fillna(
                cleaned_df[column].mode()[0]
            )

        # Drop Entire Column

        elif method == "drop_column":

            cleaned_df.drop(columns=[column], inplace=True)

        # Drop Rows

        elif method == "drop_rows":

            cleaned_df = cleaned_df.dropna(subset=[column])

    return cleaned_df