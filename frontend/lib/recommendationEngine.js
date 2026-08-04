export default function generateRecommendations(dataset, eda) {

  if (!dataset || !eda) return [];


  const recommendations = [];



  // Dataset Status

  recommendations.push({

    type: "success",

    text:
      "Dataset loaded successfully. AI analysis is ready."

  });




  // Missing Values Analysis

  if (eda.missing_values) {


    const missingColumns = Object.entries(
      eda.missing_values
    )
    .filter(([column, value]) => value > 0);



    if (missingColumns.length > 0) {


      let message =
        "Missing values detected in: ";



      missingColumns.forEach(([column, value]) => {

        message += `${column} (${value}), `;

      });



      message +=
        " Apply imputation techniques before model training.";



      recommendations.push({

        type: "warning",

        text: message

      });



    } else {


      recommendations.push({

        type: "success",

        text:
          "No missing values detected. Dataset cleaning is good."

      });


    }

  }




  // Categorical Columns


  if (
    eda.basic_info &&
    eda.basic_info.categorical_columns > 0
  ) {


    recommendations.push({

      type: "info",

      text:
        `${eda.basic_info.categorical_columns} categorical features found. Apply One-Hot Encoding before ML training.`

    });


  }





  // Numerical Columns


  if (
    eda.basic_info &&
    eda.basic_info.numeric_columns > 0
  ) {


    recommendations.push({

      type: "success",

      text:
        `${eda.basic_info.numeric_columns} numerical features detected. Scaling or normalization can improve model performance.`

    });


  }





  // Dataset Size Based Recommendation


  if (dataset.rows > 10000) {


    recommendations.push({

      type: "success",

      text:
        "Large dataset detected. Random Forest, XGBoost, or Neural Networks are suitable choices."

    });


  }

  else if (dataset.rows > 5000) {


    recommendations.push({

      type: "info",

      text:
        "Medium-sized dataset detected. Random Forest and Gradient Boosting models are recommended."

    });


  }

  else {


    recommendations.push({

      type: "info",

      text:
        "Small dataset detected. Start with Linear Regression, Logistic Regression, or Decision Trees."

    });


  }





  // ML Readiness


  let readiness = 100;



  if (eda.missing_values) {

    const totalMissing =
      Object.values(eda.missing_values)
      .reduce(
        (sum,value)=>sum+value,
        0
      );


    if(totalMissing > 0){

      readiness -= 20;

    }

  }




  if(readiness >= 90){


    recommendations.push({

      type:"success",

      text:
        `ML Readiness Score: ${readiness}%. Dataset is ready for model development.`

    });


  }

  else{


    recommendations.push({

      type:"warning",

      text:
        `ML Readiness Score: ${readiness}%. Some preprocessing is required before training.`

    });


  }



  return recommendations;

}