from services.summary_service import create_summary
from services.quality_service import calculate_score

report = {

    "basic_info": {

        "rows":100,

        "columns":5,

        "memory_usage_mb":0.5,

        "numeric_columns":3,

        "categorical_columns":2

    },

    "missing_analysis":{

        "Age":{

            "missing_count":20,

            "missing_percent":20

        },

        "Cabin":{

            "missing_count":80,

            "missing_percent":80

        }

    },

    "duplicate_analysis":{

        "duplicate_count":5,

        "duplicate_percent":5

    },

    "invalid_value_analysis":{

        "Age":{
            "invalid_count":0
        },

        "Gender":{
            "invalid_count":3
        },

        "Name":{
            "invalid_count":2
        }

    },

    "outlier_analysis":{

        "Age":{
            "outliers_count":15
        },

        "Fare":{
            "outliers_count":30
        },

        "Pclass":{
            "outliers_count":0
        }

    }

}

summary = create_summary(report)

score = calculate_score(summary)

print(summary)
print()
print("Dataset Score =", score)