import sqlite3
from pathlib import Path
from typing import Any


class MemoryStore:
    """
    Persistent conversational memory for DataMind AI.

    Stores messages associated with a conversation and dataset.
    """

    def __init__(
        self,
        database_path: str = "data/memory.db",
    ):
        self.database_path = Path(database_path)

        self.database_path.parent.mkdir(
            parents=True,
            exist_ok=True,
        )

        self._initialize_database()

    def _get_connection(self) -> sqlite3.Connection:
        connection = sqlite3.connect(
            self.database_path
        )

        connection.row_factory = sqlite3.Row

        return connection

    def _initialize_database(self) -> None:
        with self._get_connection() as connection:

            connection.execute(
                """
                CREATE TABLE IF NOT EXISTS conversations (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    conversation_id TEXT NOT NULL,
                    dataset_id TEXT,
                    role TEXT NOT NULL,
                    content TEXT NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
                """
            )

            connection.execute(
                """
                CREATE INDEX IF NOT EXISTS
                idx_conversation
                ON conversations(conversation_id)
                """
            )

            connection.execute(
                """
                CREATE INDEX IF NOT EXISTS
                idx_dataset
                ON conversations(dataset_id)
                """
            )

            connection.commit()

    def add_message(
        self,
        conversation_id: str,
        role: str,
        content: str,
        dataset_id: str | None = None,
    ) -> None:
        """
        Store one conversation message.
        """

        if not conversation_id:
            raise ValueError(
                "conversation_id is required"
            )

        if role not in {
            "user",
            "assistant",
            "system",
        }:
            raise ValueError(
                "Invalid message role"
            )

        if not content or not content.strip():
            raise ValueError(
                "content cannot be empty"
            )

        with self._get_connection() as connection:

            connection.execute(
                """
                INSERT INTO conversations
                (
                    conversation_id,
                    dataset_id,
                    role,
                    content
                )
                VALUES (?, ?, ?, ?)
                """,
                (
                    conversation_id,
                    dataset_id,
                    role,
                    content.strip(),
                ),
            )

            connection.commit()

    def get_messages(
        self,
        conversation_id: str,
        dataset_id: str | None = None,
        limit: int = 10,
    ) -> list[dict[str, Any]]:
        """
        Retrieve recent conversation messages.
        """

        if not conversation_id:
            raise ValueError(
                "conversation_id is required"
            )

        if limit <= 0:
            raise ValueError(
                "limit must be greater than zero"
            )

        query = """
            SELECT
                conversation_id,
                dataset_id,
                role,
                content,
                created_at
            FROM conversations
            WHERE conversation_id = ?
        """

        parameters: list[Any] = [
            conversation_id
        ]

        if dataset_id is not None:
            query += """
                AND dataset_id = ?
            """

            parameters.append(dataset_id)

        query += """
            ORDER BY id DESC
            LIMIT ?
        """

        parameters.append(limit)

        with self._get_connection() as connection:

            rows = connection.execute(
                query,
                parameters,
            ).fetchall()

        # Reverse so the oldest retrieved message
        # appears first.
        rows.reverse()

        return [
            dict(row)
            for row in rows
        ]

    def clear_conversation(
        self,
        conversation_id: str,
    ) -> None:
        """
        Delete all messages for a conversation.
        """

        with self._get_connection() as connection:

            connection.execute(
                """
                DELETE FROM conversations
                WHERE conversation_id = ?
                """,
                (conversation_id,),
            )

            connection.commit()