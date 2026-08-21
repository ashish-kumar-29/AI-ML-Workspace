import pandas as pd
import pytest

from services.tools.dataframe_tool import DataFrameTool


@pytest.fixture
def dataframe():
    return pd.DataFrame({
        "Age": [20, 30, 60, 70, None],
        "Survived": [1, 0, 1, 0, 1],
        "Fare": [10.0, 20.0, 30.0, 40.0, 50.0],
        "Embarked": ["S", "C", "S", "Q", "S"],
    })


@pytest.fixture
def tool(dataframe):
    return DataFrameTool(dataframe)


def test_count_missing(tool):
    result = tool.execute(
        operation="count_missing",
        column="Age",
    )

    assert result["result"] == 1


def test_count_rows(tool):
    result = tool.execute(
        operation="count_rows",
    )

    assert result["result"] == 5


def test_count_condition(tool):
    result = tool.execute(
        operation="count_condition",
        column="Age",
        value=50,
    )

    assert result["result"] == 2


def test_percentage_condition(tool):
    result = tool.execute(
        operation="percentage_condition",
        column="Age",
        value=50,
    )

    assert result["result"] == 40.0


def test_value_counts(tool):
    result = tool.execute(
        operation="value_counts",
        column="Embarked",
    )

    assert result["result"]["S"] == 3


def test_mean(tool):
    result = tool.execute(
        operation="mean",
        column="Fare",
    )

    assert result["result"] == 30.0


def test_sum(tool):
    result = tool.execute(
        operation="sum",
        column="Fare",
    )

    assert result["result"] == 150.0


def test_compare_columns(tool):
    result = tool.execute(
        operation="compare_columns",
        column="Age",
        second_column="Survived",
    )

    assert isinstance(
        result["result"],
        float,
    )


def test_invalid_column(tool):
    with pytest.raises(ValueError):
        tool.execute(
            operation="mean",
            column="InvalidColumn",
        )


def test_unsupported_operation(tool):
    with pytest.raises(ValueError):
        tool.execute(
            operation="unknown_operation",
        )