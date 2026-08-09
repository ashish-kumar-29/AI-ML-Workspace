import pandas as pd

from services.cleaning_service import apply_cleaning

df = pd.DataFrame({

    "Age": [10, None, 25, None],

    "Name": ["A", "B", "C", "D"],

    "Cabin": [None, None, None, None]

})

operations = [

    {
        "column": "Age",
        "method": "median"
    },

    {
        "column": "Cabin",
        "method": "drop_column"
    }

]

cleaned = apply_cleaning(df, operations)

print(cleaned)