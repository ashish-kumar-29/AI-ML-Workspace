from services.report_service import compare_reports

before = {

    "score": 59,

    "summary": {

        "issues": [1, 2, 3, 4, 5]

    }

}

after = {

    "score": 88,

    "summary": {

        "issues": [1]

    }

}

print(compare_reports(before, after))