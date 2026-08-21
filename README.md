# 🤖 DataMind AI

> **An intelligent and interactive workspace for automated Exploratory Data Analysis, AI-powered data-quality recommendations, interactive data cleaning, and cleaned dataset generation.**

![DataMind AI](https://github.com/ashish-kumar-29/DataMind-AI/blob/feature/frontend/docs/Screenshot/landing%20page%201.png)
![DataMind_AI](https://github.com/ashish-kumar-29/DataMind-AI/blob/feature/frontend/docs/Screenshot/landing%20page%202.png)


---

## 📌 Overview

**DataMind AI** is an intelligent data-analysis and data-cleaning platform designed to simplify the process of understanding, diagnosing, and improving datasets.

Instead of manually performing every stage of the data-analysis workflow, users can upload a CSV dataset and let the platform automatically perform **Exploratory Data Analysis (EDA)**, identify potential data-quality issues, generate AI-powered recommendations, and provide interactive cleaning options.

The platform combines:

* 📊 Automated Exploratory Data Analysis
* 🔍 Data-quality detection
* 🤖 AI-powered recommendations
* 💬 RAG-based AI Chatbot for dataset-related questions
* 🧠 Decision Graph for tracking cleaning decisions
* 🧹 Interactive data cleaning
* 📈 Statistical analysis
* 📉 Correlation and distribution analysis
* 📥 Cleaned dataset export

The user remains in control throughout the cleaning process. AI recommendations are presented as suggestions rather than forced transformations.

---

# ✨ Key Features

## 📂 1. Dataset Upload

Users can upload a CSV dataset directly through the web interface.

The platform provides an initial overview containing:

* Number of rows
* Number of columns
* Column names
* Dataset preview
* Basic structural information

---

## 📊 2. Automated Exploratory Data Analysis

After uploading a dataset, DataMind AI automatically analyzes its structure and characteristics.

### Dataset Information

The system identifies:

* Dataset dimensions
* Number of records
* Number of features
* Data types
* Numerical columns
* Categorical columns
* Unique values

---

## 📋 3. Dataset Preview

Users can inspect the uploaded dataset through an interactive preview.

The preview allows users to quickly understand:

* Column names
* Data values
* Dataset structure
* Sample records

This gives users an immediate understanding of the uploaded data before performing further analysis.

---

## 🔍 4. Column Summary

The platform analyzes individual columns and provides information such as:

* Column name
* Data type
* Unique values
* Missing values
* Column characteristics

This helps users understand the role and quality of each feature.

---

## ⚠️ 5. Missing Value Analysis

DataMind AI automatically detects missing values.

For each affected column, the system provides:

* Missing-value count
* Missing-value percentage
* Severity level
* Visual representation

Example:

```text
Age
177 missing values
19.87%

Cabin
687 missing values
77.10%
```

This allows users to quickly identify columns that require attention.

---

## 📌 6. Duplicate Analysis

The system detects duplicate records within the dataset.

The analysis provides information about:

* Number of duplicate rows
* Duplicate percentage

Users can later decide whether duplicate records should be removed during the cleaning process.

---

## ⚠️ 7. Invalid Value Analysis

The platform attempts to identify invalid or problematic values.

This provides an additional data-quality check beyond missing-value detection.

---

## 📈 8. Outlier Analysis

Numerical columns are analyzed for potential outliers.

The system identifies columns containing unusual observations and provides cleaning options such as:

* Remove outliers
* Cap outliers

This helps reduce the effect of extreme observations on later analysis or machine-learning models.

---

## 📊 9. Numerical Statistics

DataMind AI provides statistical information for numerical columns, including:

* Mean
* Median
* Standard deviation
* Minimum
* Maximum
* Variance

Example:

```text
Column       Mean    Median    Std Dev    Min    Max
Age          29.7    28        14.53      0.42   80
Fare         32.2    14.45     49.69      0      512.33
```

---

## 📉 10. Correlation Analysis

The platform calculates correlations between numerical variables.

The correlation matrix helps users understand relationships between different features.

It can be used to identify:

* Positive relationships
* Negative relationships
* Weak relationships
* Strong relationships

---

## 📊 11. Distribution Analysis

DataMind AI analyzes the distribution of numerical variables.

Distribution analysis can help users identify:

* Skewed variables
* Unusual distributions
* Potentially problematic values
* Patterns that may require preprocessing

---

## 📐 12. Kurtosis Analysis

The platform also performs kurtosis analysis on numerical variables.

Kurtosis provides additional information about the shape and tail behavior of distributions and complements the outlier and distribution analysis.

---

# 🤖 AI-Powered Data Quality Recommendations

One of the core features of DataMind AI is its AI-powered recommendation system.

After EDA identifies data-quality issues, the system sends relevant analysis information to the AI service.

The AI then generates recommendations for appropriate cleaning strategies.

Possible recommendations include:

* Mean imputation
* Median imputation
* Mode imputation
* Dropping rows
* Dropping columns
* Removing outliers
* Capping outliers
* Replacing invalid values
* Removing duplicate records

Each recommendation can contain:

* **Problem**
* **Recommended solution**
* **Reason**
* **Alternative approach**
* **Recommended cleaning method**

---

# 💬 RAG-Based AI Chatbot

DataMind AI includes a **Retrieval-Augmented Generation (RAG)** based chatbot that allows users to ask questions about their dataset and analysis results in natural language.

Instead of answering only from the general knowledge of an LLM, the chatbot retrieves relevant information from the available dataset analysis and project context before generating an answer.

### The chatbot can answer questions about:

* Dataset structure
* Column information
* Missing values
* Duplicate records
* Outliers
* Numerical statistics
* Categorical statistics
* Correlations
* Distribution analysis
* Data-quality issues
* AI cleaning recommendations
* Cleaning decisions

### RAG Workflow

```text
User Question
      ↓
Retrieve Relevant Context
      ↓
Dataset / EDA / Cleaning Information
      ↓
Relevant Context + User Question
      ↓
LLM
      ↓
Context-Aware Answer
```

---
### Decision Graph tracks:

* Dataset upload
* EDA completion
* AI recommendations
* User-selected cleaning methods
* Cleaning operations
* Current cleaning state
* Decision source
* Cleaning method
* Reasons and alternatives
* Parent-child relationships between decisions

### Example

```text
Dataset Uploaded
       ↓
EDA Completed
       ↓
AI Recommendation
       ↓
User Decision
       ↓
Cleaning Operation
       ↓
Current Dataset State
```
---

# 🧠 AI Recommendation + Human Decision

DataMind AI follows a **human-in-the-loop** approach.

The AI does not automatically modify the dataset.

Instead:

```text
EDA Analysis
      ↓
Detected Issue
      ↓
AI Recommendation
      ↓
User Reviews Recommendation
      ↓
User Selects Cleaning Method
      ↓
Cleaning Applied
```

This gives users control over how their dataset is transformed.

---

# 🧹 Interactive Data Cleaning

Users can select cleaning operations for detected issues.

Supported operations include:

### Missing Values

* Fill with mean
* Fill with median
* Fill with mode
* Drop rows
* Drop columns

### Outliers

* Remove outliers
* Cap outliers

### Invalid Values

* Replace invalid values with mode
* Replace invalid values with missing values

### Duplicate Records

* Remove duplicate rows

Multiple operations can be selected before applying the cleaning process.

---

# 📊 Cleaning Results

After cleaning is applied, the platform compares the dataset before and after transformation.

The result includes:

| Metric           | Description                       |
| ---------------- | --------------------------------- |
| Original Rows    | Number of rows before cleaning    |
| Cleaned Rows     | Number of rows after cleaning     |
| Original Columns | Number of columns before cleaning |
| Cleaned Columns  | Number of columns after cleaning  |

Example:

```text
Original Rows       : 891
Cleaned Rows        : 889

Original Columns    : 12
Cleaned Columns     : 12
```

This makes the effect of the selected cleaning operations easy to understand.

---

# 📥 Download Cleaned Dataset

After cleaning is completed, users can download the resulting dataset as a CSV file.

The workflow is:

```text
Original Dataset
       ↓
EDA
       ↓
Data Quality Analysis
       ↓
AI Recommendations
       ↓
User Selected Operations
       ↓
Cleaning
       ↓
Cleaned Dataset
       ↓
Download CSV
```

The original uploaded dataset remains unchanged.

---

# 🖥️ Application Screenshots

## 🏠 Dataset Preview

The home page provides an introduction to DataMind AI and allows users to upload their datasets.

![Home](https://github.com/ashish-kumar-29/DataMind-AI/blob/feature/frontend/docs/Screenshot/dataset-preview.png)

---

## 🧹 Data Cleaning

Users can review detected issues and choose appropriate cleaning methods.

![Data Cleaning](https://github.com/ashish-kumar-29/DataMind-AI/blob/feature/frontend/docs/Screenshot/data-cleaning2.png)
![Data Cleaning](https://github.com/ashish-kumar-29/DataMind-AI/blob/feature/frontend/docs/Screenshot/data-cleaning.png)

---

## 🤖 AI Recommendations

The AI analyzes detected data-quality problems and provides recommendations with explanations and alternatives.

![AI Recommendations](https://github.com/ashish-kumar-29/DataMind-AI/blob/feature/frontend/docs/Screenshot/ai-insight2.png)

---

## 💡 Dataset Health & AI Insights

The AI Insights section provides an overall view of dataset quality, detected issues, severity levels, and recommendations.

![Dataset Health](https://github.com/ashish-kumar-29/DataMind-AI/blob/feature/frontend/docs/Screenshot/ai-insights.png)

---

## 🔥 Correlation Analysis

The correlation analysis section provides a correlation matrix and interpretation guide.

![Correlation Analysis](https://github.com/ashish-kumar-29/DataMind-AI/blob/feature/frontend/docs/Screenshot/correlation-analysis.png)

---

## 📊 Numerical Statistics

Users can inspect statistical properties of numerical columns.

![Numerical Statistics](https://github.com/ashish-kumar-29/DataMind-AI/blob/feature/frontend/docs/Screenshot/numerical-statistic.png)

---

## ⚠️ Missing Value Analysis

Missing values are displayed visually with counts and percentages for each column.

![Missing Values](https://github.com/ashish-kumar-29/DataMind-AI/blob/feature/frontend/docs/Screenshot/missing-value.png)

---

## 📑 Dataset Preview

Users can inspect sample records from the uploaded dataset.

![Dataset Preview](https://github.com/ashish-kumar-29/DataMind-AI/blob/feature/frontend/docs/Screenshot/dataset-preview.png)

---

# 🏗️ System Architecture

DataMind AI follows a frontend-backend architecture.

```text
                         ┌─────────────────┐
                         │      User       │
                         └────────┬────────┘
                                  │
                                  ▼
                     ┌────────────────────────┐
                     │     Next.js Frontend   │
                     │                        │
                     │ • Dataset Upload       │
                     │ • Dataset Preview      │
                     │ • EDA Dashboard        │
                     │ • Charts & Statistics  |
                     │ • Decision Graph       |
                     │ • AI Insights          │
                     │ • Data Cleaning        │
                     │ • Download             │
                     └───────────┬────────────┘
                                 │
                           REST API / HTTP
                                 │
                                 ▼
                     ┌────────────────────────┐
                     │     FastAPI Backend    │
                     │                        │
                     │ • Upload Processing    │
                     │ • EDA                  │
                     │ • Data Quality         │
                     │ • AI Recommendations   |
                     │ • RAG Chatbot          |
                     │ • Data Cleaning        │
                     │ • CSV Generation       │
                     └───────────┬────────────┘
                                 │
                 ┌───────────────┴────────────────┐
                 │                                │
                 ▼                                ▼
       ┌───────────────────┐            ┌──────────────────┐
       │ Data Processing   │            │   AI Service     │
       │                   │            │                  │
       │ Pandas            │            │ LLM Provider     │
       │ Statistics        │            │ AI Analysis      │
       │ EDA               │            │ Recommendations  |
       │ Correlation       |            | Context Retrieval|
       | Outliers          |            | RAG              |
       │                   │            └──────────────────┘
       │                   │
       └─────────┬─────────┘
                 │
                 ▼
      ┌────────────────────┐
      │ Decision Intelligence│
      │                     │
      │ • Decision Graph    │
      │ • Decision Tracking │
      │ • Experiments       │
      │ • Branch Comparison │
      └──────────┬──────────┘
                 |
                 ▼
       ┌───────────────────┐
       │ Cleaning Service  │
       │                   │
       │ Transformations   │
       │ Validation        │
       │ CSV Generation    │
       └─────────┬─────────┘
                 │
                 ▼
       ┌───────────────────┐
       │ Cleaned CSV File  │
       └───────────────────┘
```

---

# 📁 Project Structure

```text
AI-ML-Workspace/
│
├── backend/
│   ├── main.py
│   ├── modules.py
│   │
│   ├── services/
│   │   ├── ai_service.py
│   │   ├── grok_service.py
│   │   └── cleaning_service.py
│   │
│   ├── tests/
│   │   └── ...
│   │
│   └── requirements.txt
│
├── frontend/
│   ├── app/
│   ├── components/
│   ├── context/
│   ├── lib/
│   ├── package.json
│   └── ...
│
├── docs/
│   └── screenshots/
│       ├── home.png
│       ├── data-cleaning.png
│       ├── ai-insights.png
│       ├── dataset-health.png
│       ├── correlation.png
│       ├── numerical-statistics.png
│       ├── missing-values.png
│       └── dataset-preview.png
│
├── .gitignore
├── README.md
└── ...
```

---

# 🔧 Technology Stack

## Frontend

* **Next.js**
* **React**
* **Tailwind CSS**
* **Framer Motion**
* **Recharts**
* **Axios**

## Backend

* **Python**
* **FastAPI**
* **Pandas**
* **NumPy**
* Statistical/data-analysis libraries

## AI / RAG

* **LLM-based AI recommendation service**
* **Retrieval-Augmented Generation (RAG)**
* **Context retrieval**
* **RAG-based AI chatbot**
* **Natural-language question answering**
* AI service abstraction for provider flexibility

## Decision Intelligence

* **Decision Graph**
* **Decision tracking**
* **Parent-child decision relationships**
* **Experiment branching**
* **Experiment comparison**
* **Human-in-the-loop decision workflow**

## Development

* Git
* GitHub
* REST API
* Environment variables

---

# 🔌 API Endpoints

The backend exposes REST endpoints for the main application workflow.

| Endpoint          | Method | Purpose                                   |
| --------------    | ------ | ----------------------------------------- |
| `/`               | GET    | Backend health/status                     |
| `/upload`         | POST   | Upload and process CSV dataset            |
| `/eda`            | POST   | Generate EDA report                       |
| `/ai-insights`    | POST   | Generate AI-powered recommendations       |
| `/clean`          | POST   | Apply selected cleaning operations        |
| `/decision-graph` | GET    | Retrieve the current decision graph       |
| `/chat`           | POST   | Ask questions using the RAG-based chatbot |

> The exact endpoint implementation may evolve as the project develops.

---

# ⚙️ Installation

## Prerequisites

Make sure the following are installed:

* Python 3.x
* Node.js
* npm
* Git

---

## 🐍 Backend Setup

Navigate to the backend directory:

```bash
cd backend
```

Create a virtual environment:

```bash
python -m venv venv
```

Activate it on Windows:

```bash
venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Create a `.env` file inside the backend directory.

Example:

```env
GROQ_API_KEY=your_groq_api_key
```

> Never commit your `.env` file or API keys to GitHub.

---

## ▶️ Run Backend

From the backend directory:

```bash
python -m uvicorn main:app --reload
```

The backend will normally run at:

```text
http://127.0.0.1:8000
```

---

# 🌐 Frontend Setup

Navigate to the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The frontend will normally be available at:

```text
http://localhost:3000
```

---

# 🔐 Environment Variables

AI services require API credentials.

Example:

```env
GROQ_API_KEY=your_api_key_here
```

Never commit:

```text
.env
```

or API keys directly into the source code.

Add environment files to `.gitignore`.

---

# 🧪 Testing

The project contains a dedicated testing area under the backend.

Potential test categories include:

```text
tests/
│
├── EDA Tests
├── Cleaning Tests
├── AI Service Tests
├── API Tests
└── Data Validation Tests
```

Important areas to test include:

* CSV upload
* Dataset validation
* Missing-value detection
* Duplicate detection
* Outlier detection
* Statistical analysis
* Correlation analysis
* Cleaning operations
* AI recommendation generation
* Invalid operation handling
* Cleaned CSV generation

---

# 🔄 Complete User Workflow

```text
1. Upload Dataset
        ↓
2. Preview Dataset
        ↓
3. Run EDA
        ↓
4. Analyze Dataset Quality
        ↓
5. Detect Data Issues
        ↓
6. Generate AI Insights
        ↓
7. Ask Questions Using RAG Chatbot
        ↓
8. Review AI Recommendations
        ↓
9. Review Decision Graph
        ↓
10. Experiment With Alternative Cleaning Methods
        ↓
11. Review Alternative Cleaning Methods
        ↓
12. Select Cleaning Operations
        ↓
13. Apply Cleaning
        ↓
14. Review Cleaning Statistics
        ↓
15. Download Cleaned Dataset
```

---

# 🎯 Project Goals

DataMind AI aims to make data preprocessing more accessible by combining automated analysis with intelligent recommendations.

The main goals are:

* Reduce repetitive data-analysis work
* Help users understand dataset quality
* Detect common data-quality problems
* Provide explainable AI recommendations
* Keep the user involved in cleaning decisions
* Simplify dataset preprocessing
* Produce a ready-to-use cleaned dataset

---

# 🚀 Future Scope

Potential future improvements include:

* 🔮 Automatic machine-learning model selection
* 🤖 Natural-language data querying
* 📊 More advanced visualizations
* 🧠 More intelligent preprocessing recommendations
* 📈 Automated feature engineering
* 🏆 Model performance comparison
* 💾 Dataset history and versioning
* 👥 User authentication
* ☁️ Cloud deployment
* 📦 Support for additional file formats
* 🔄 Automated ML pipelines

---

# 🔒 Security Considerations

The project should follow secure development practices.

Important considerations include:

* Keep API keys in environment variables.
* Never commit `.env` files.
* Validate uploaded files.
* Restrict accepted file types.
* Validate dataset size.
* Sanitize user-provided inputs.
* Validate cleaning operations on the backend.
* Avoid exposing API credentials to the frontend.

---

# 👨‍💻 Development Workflow

The project is developed using Git and GitHub.

Recommended workflow:

```text
main
 │
 ├── feature/frontend
 │
 ├── feature/backend
 │
 └── feature/ai
```

Each feature can be developed independently and merged after testing.

---

# 📜 License

This project is developed as an academic/project initiative.

If you plan to distribute the project publicly, add an appropriate open-source license such as MIT License.

---

# ⭐ Project Summary

**DataMind AI** brings together automated EDA, data-quality analysis, AI-powered recommendations, and interactive data cleaning into a single workspace.

Instead of simply cleaning data automatically, the platform explains detected problems, recommends possible solutions, and allows the user to decide which transformations should be applied.

```text
Understand Data
      +
Detect Problems
      +
AI Recommendations
      +
User Decisions
      +
Interactive Cleaning
      =
DataMind AI
```

> **Analyze • Understand • Clean • Improve**
