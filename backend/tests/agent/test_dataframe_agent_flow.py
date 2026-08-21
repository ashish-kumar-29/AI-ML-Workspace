import pandas as pd

from services.router.query_router import (
    QueryRouter,
    QuerySource,
)
from services.tools.tool_planner import ToolPlanner
from services.tools.dataframe_tool import DataFrameTool


def test_dataframe_agent_flow():

    dataframe = pd.DataFrame({
        "PassengerId": [1, 2, 3, 4, 5],
        "Age": [20, 30, 60, 70, None],
        "Survived": [1, 0, 1, 0, 1],
        "Fare": [10.0, 20.0, 30.0, 40.0, 50.0],
    })

    query = "How many passengers are older than 50?"

    # -----------------------------------------------
    # 1. Query Router
    # -----------------------------------------------

    router = QueryRouter()

    decision = router.route(query)

    assert (
        QuerySource.DATAFRAME
        in decision.sources
    )

    # -----------------------------------------------
    # 2. Tool Planner
    # -----------------------------------------------

    planner = ToolPlanner()

    plan = planner.plan(
        query=query,
        columns=list(dataframe.columns),
    )

    assert plan.operation == "count_condition"
    assert plan.column == "Age"
    assert plan.value == 50.0

    # -----------------------------------------------
    # 3. DataFrame Tool
    # -----------------------------------------------

    tool = DataFrameTool(dataframe)

    result = tool.execute(
        operation=plan.operation,
        column=plan.column,
        value=plan.value,
        second_column=plan.second_column,
    )

    # -----------------------------------------------
    # 4. Verify exact result
    # -----------------------------------------------

    assert result["result"] == 2