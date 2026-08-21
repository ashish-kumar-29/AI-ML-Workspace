import pytest

from services.tools.tool_planner import (
    ToolPlanner,
)


@pytest.fixture
def planner():
    return ToolPlanner()


@pytest.fixture
def columns():
    return [
        "PassengerId",
        "Age",
        "Fare",
        "Survived",
        "Embarked",
    ]


def test_missing_values(planner, columns):
    plan = planner.plan(
        "How many missing Age values are there?",
        columns,
    )

    assert plan.operation == "count_missing"
    assert plan.column == "Age"


def test_count_condition(planner, columns):
    plan = planner.plan(
        "How many passengers are older than 50?",
        columns,
    )

    assert plan.operation == "count_condition"
    assert plan.column == "Age"
    assert plan.value == 50.0


def test_percentage_condition(planner, columns):
    plan = planner.plan(
        "What percentage of passengers are older than 50?",
        columns,
    )

    assert plan.operation == "percentage_condition"
    assert plan.column == "Age"
    assert plan.value == 50.0


def test_mean(planner, columns):
    plan = planner.plan(
        "What is the average Fare?",
        columns,
    )

    assert plan.operation == "mean"
    assert plan.column == "Fare"


def test_sum(planner, columns):
    plan = planner.plan(
        "What is the total Fare?",
        columns,
    )

    assert plan.operation == "sum"
    assert plan.column == "Fare"


def test_value_counts(planner, columns):
    plan = planner.plan(
        "Show the frequency of Embarked values.",
        columns,
    )

    assert plan.operation == "value_counts"
    assert plan.column == "Embarked"


def test_row_count(planner, columns):
    plan = planner.plan(
        "How many rows are there?",
        columns,
    )

    assert plan.operation == "count_rows"
    assert plan.column is None


def test_invalid_query(planner, columns):
    with pytest.raises(ValueError):
        planner.plan(
            "Tell me something unrelated.",
            columns,
        )


def test_empty_query(planner, columns):
    with pytest.raises(ValueError):
        planner.plan(
            "",
            columns,
        )