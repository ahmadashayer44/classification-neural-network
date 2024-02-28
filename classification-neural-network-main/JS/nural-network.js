let hiddenNeurons;
let activationFunctionForHidden;
let activationFunctionForOutput;
let learningRate;
let epochsCount;
let dataRows;
let table;
let weightsArray;
let thresholdsArray;
let arrayOfBigX;
let outputArray;
let outputArrayForFinalPart;
let resultContainer;
let counterForAccuracy;
let allValues;
const desiredOutputs = [
  [1, 0, 0],
  [0, 1, 0],
  [0, 0, 1],
];

function getPageValues() {
  resultContainer = document.getElementById("finalResults");
  document.getElementById("container").style.opacity = "0";
  document.getElementById("container").style.display = "none";

  hiddenNeurons = document.getElementById("hidden-neurons").value;
  activationFunctionForHidden = document.getElementById(
    "activation-function-hidden"
  ).value;
  activationFunctionForOutput = document.getElementById(
    "activation-function-output"
  ).value;
  learningRate = document.getElementById("learning-rate").value;
  epochsCount = document.getElementById("max-epochs").value;
  dataRows = document.getElementById("data-rows").value;
  table = document.getElementById("table");
  let tableContainer = document.getElementById("tableContainer");
  tableContainer.style.opacity = "1";
  tableContainer.style.display = "flex";

  let header = table.createTHead();
  let headerRow = header.insertRow(0);
  headerRow.insertCell(0).innerHTML = "<b>Color</b>";
  headerRow.insertCell(1).innerHTML = "<b>Sweetness</b>";
  headerRow.insertCell(2).innerHTML = "<b>Orange</b>";
  headerRow.insertCell(3).innerHTML = "<b>Apple</b>";
  headerRow.insertCell(4).innerHTML = "<b>Banana</b>";
  let body = table.createTBody();

  for (let i = 0; i < dataRows; i++) {
    let row = body.insertRow(i);
    let colorCell = row.insertCell(0);
    let colorSelect = document.createElement("select");
    colorSelect.innerHTML =
      "<option value='red'>Red</option><option value='orange'>Orange</option><option value='yellow'>Yellow</option>";
    colorCell.appendChild(colorSelect);

    row.insertCell(1).innerHTML =
      "<input type='number' min='1' max='10' value='1'>";
    row.insertCell(2).innerHTML =
      "<input type='radio' name='fruit" + i + "' value='orange'>";
    row.insertCell(3).innerHTML =
      "<input type='radio' name='fruit" + i + "' value='apple'>";
    row.insertCell(4).innerHTML =
      "<input type='radio' name='fruit" + i + "' value='banana'>";
  }
}

function getTableValues(dataRows, table) {
  let colors = [];
  let sweetnessValues = [];
  let fruitSelections = [];

  for (let i = 0; i < dataRows; i++) {
    let row = table.rows[i + 1];
    let color = row.cells[0].querySelector("select").value;
    let sweetness = parseInt(row.cells[1].querySelector("input").value);
    let fruit = row.querySelector("input[name='fruit" + i + "']:checked").value;

    colors.push(color);
    sweetnessValues.push(sweetness);
    fruitSelections.push(fruit);
  }

  let allRows = [colors, sweetnessValues, fruitSelections];
  return allRows;
}

function initialization() {
  document.getElementById("tableContainer").style.opacity = "0";

  setTimeout(() => {
    document.body.style.backgroundColor = "rgb(34, 31, 56)";
    document.getElementById("tableContainer").style.display = "none";
  }, 300);
  document.getElementById("resultContainer").style.display = "flex";
  document.getElementById("resultContainer").style.opacity = "1";

  weightsArray = new Array(hiddenNeurons * 5);
  thresholdsArray = new Array(hiddenNeurons + 3);

  for (i = 0; i < 2 * hiddenNeurons; i++)
    weightsArray[i] = Math.random() * (2.4 / 2) * 2 - 2.4 / 2;

  for (i = 2 * hiddenNeurons; i < hiddenNeurons * 5; i++)
    weightsArray[i] =
      Math.random() * ((2.4 / hiddenNeurons) * 2) - 2.4 / hiddenNeurons;

  for (i = 0; i < hiddenNeurons; i++)
    thresholdsArray[i] = Math.random() * (2.4 / 2) * 2 - 2.4 / 2;

  thresholdsArray[Number(hiddenNeurons)] =
    Math.random() * ((2.4 / hiddenNeurons) * 2) - 2.4 / hiddenNeurons;

  thresholdsArray[Number(hiddenNeurons) + Number(1)] =
    Math.random() * ((2.4 / hiddenNeurons) * 2) - 2.4 / hiddenNeurons;

  thresholdsArray[Number(hiddenNeurons) + Number(2)] =
    Math.random() * ((2.4 / hiddenNeurons) * 2) - 2.4 / hiddenNeurons;
  allValues = getTableValues(dataRows, table);
  console.log("llllllllllllllll");
  console.log(allValues);
  arrayOfBigX = new Array(hiddenNeurons);
  let indexOfWeights = 0;
  let red = 1;
  let orange = 2;
  let yellow = 3;
  outputArrayForFinalPart = new Array(dataRows);
  for (let i = 0; i < epochsCount; i++) {
    for (j = 0; j < dataRows; j++) {
      let fruitValues = allValues[2];
      let currentFruit = fruitValues[j];
      let colorValues = allValues[0];
      let currentColor = colorValues[j];
      let sweetnessValues = allValues[1];
      let currentSweetness = sweetnessValues[j];

      for (k = 0; k < hiddenNeurons; k++) {
        if (dataRows >= 2) {
          arrayOfBigX[k] =
            weightsArray[indexOfWeights] * allValues[1][j] +
            weightsArray[indexOfWeights + 1] *
              (allValues[0][j] == "red"
                ? red
                : allValues[0][j] == "orange"
                ? orange
                : yellow) +
            thresholdsArray[k];
        } else {
          arrayOfBigX[k] =
            weightsArray[indexOfWeights] * allValues[1] +
            weightsArray[indexOfWeights + 1] *
              (allValues[0] == "red"
                ? red
                : allValues[0] == "orange"
                ? orange
                : yellow) +
            thresholdsArray[k];
        }

        indexOfWeights += 2;
      }

      for (k = 0; k < hiddenNeurons; k++) {
        arrayOfBigX[k] =
          activationFunctionForHidden == "relu"
            ? relu(arrayOfBigX[k])
            : activationFunctionForHidden == "tanh"
            ? tanh(arrayOfBigX[k])
            : sigmoid(arrayOfBigX[k]);
      }

      outputArray = new Array(3);
      let bigX1 = 0;
      let bigX2 = 0;
      let bigX3 = 0;

      let indexForOutput = hiddenNeurons * 2;
      let indexOfHiddenValues = 0;
      let y = 0;

      for (
        x = indexForOutput;
        x < indexForOutput + (weightsArray.length - hiddenNeurons * 2) / 3;
        x++
      ) {
        bigX1 += weightsArray[x] * arrayOfBigX[indexOfHiddenValues];
        indexOfHiddenValues++;
        y = x;
      }
      indexForOutput = y;
      bigX1 += thresholdsArray[Number(hiddenNeurons)];

      indexOfHiddenValues = 0;
      for (
        x = indexForOutput;
        x < indexForOutput + (weightsArray.length - hiddenNeurons * 2) / 3;
        x++
      ) {
        bigX2 += weightsArray[x] * arrayOfBigX[indexOfHiddenValues];
        indexOfHiddenValues++;
        y = x;
      }
      indexForOutput = y;
      bigX2 += thresholdsArray[Number(hiddenNeurons) + Number(1)];

      indexOfHiddenValues = 0;
      for (
        x = indexForOutput;
        x < indexForOutput + (weightsArray.length - hiddenNeurons * 2) / 3;
        x++
      ) {
        bigX3 += weightsArray[x] * arrayOfBigX[indexOfHiddenValues];
        y = x;
      }
      indexForOutput = y;
      bigX3 += thresholdsArray[Number(hiddenNeurons) + Number(2)];
      indexOfHiddenValues = 0;

      let finalOutputArray;
      if (activationFunctionForOutput == "sigmoid")
        finalOutputArray = [sigmoid(bigX1), sigmoid(bigX2), sigmoid(bigX3)];
      else if (activationFunctionForOutput == "softmax")
        finalOutputArray = softmax([bigX1, bigX2, bigX3]);
      else
        console.log("\nSomthing wrong recognize output activation function\n");
      indexOfWeights = 0;

      let newWeightsNewThresholds = backpropagation(
        weightsArray,
        thresholdsArray,
        arrayOfBigX,
        finalOutputArray,
        currentFruit,
        currentColor,
        currentSweetness
      );
      let newWightsToUpdate = newWeightsNewThresholds[0];
      let newThreasholdsToUpdate = newWeightsNewThresholds[1];
      console.log("weights before");
      console.log(weightsArray);
      console.log("Thresholds before");
      console.log(thresholdsArray);
      console.log("hidden output  ");
      console.log(arrayOfBigX);
      console.log("output output  ");
      console.log(finalOutputArray);

      console.log("new weights from Data Row ", j, "and epoch ", i, "= ");
      for (let d = 0; d < newWightsToUpdate.length; d++)
        console.log(d, " ", newWightsToUpdate[d]);

      console.log("new thresholds from Data Row ", j, "and epoch ", i, "= ");
      for (let d = 0; d < newThreasholdsToUpdate.length; d++)
        console.log(d, " ", newThreasholdsToUpdate[d]);

      weightsArray = newWightsToUpdate;
      thresholdsArray = newThreasholdsToUpdate;

      outputArrayForFinalPart[j] = finalOutputArray;
      console.log("outputArrayForFinalPart");
      console.log(outputArrayForFinalPart);
    }
    console.log("\n");
  }
  let finalWeightsThresholdsArray = [weightsArray, thresholdsArray];
  showResults();
  return finalWeightsThresholdsArray;
}

function relu(x) {
  if (x >= 0) return x;
  return 0;
}
function tanh(x) {
  return 2 / (1 + Math.exp(-2 * x)) - 1;
}
function sigmoid(x) {
  return 1 / (1 + Math.exp(-x));
}

function backpropagation(
  weightsArray,
  thresholdsArray,
  hiddenOutputArray,
  outputOutputArray,
  currentFruit,
  currentColor,
  currentSweetness
) {
  let red = 1;
  let orange = 2;
  let yellow = 3;
  let inputHiddenWeights = weightsArray.slice(0, 2 * hiddenNeurons);
  let hiddenOutputWeights = weightsArray.slice(
    2 * hiddenNeurons,
    5 * hiddenNeurons
  );
  console.log("output values before derivative is =======");
  console.log(outputOutputArray);
  let outputDerivativesForOutput = [];
  if (activationFunctionForOutput == "sigmoid") {
    for (let o = 0; o < 3; o++)
      outputDerivativesForOutput.push(sigmoidDerivative(outputOutputArray[o]));
  } else if (activationFunctionForOutput == "softmax")
    outputDerivativesForOutput = softmaxDerivatives(outputOutputArray);
  console.log("output values after derivative is =======");
  console.log(outputDerivativesForOutput);
  let newInputHiddenWeights = [],
    newHiddenOutputWeights = [];
  let deltaWVar, newWeightVar, gradientErrorVar, outputDerivativeVar;
  let normalErrorForOutVar, inputVar;
  let noramlErrorForHiddenVar;
  let actualOutputsVar = outputOutputArray;
  let gradientErrorsForOutputNeuronsArray = [];
  let gradientErrorsForHiddenNeuronsArray = [];

  let currentColorVar =
    currentColor == "red" ? red : currentColor == "orange" ? orange : yellow;

  let desiredOutputsVar =
    currentFruit == "orange"
      ? desiredOutputs[1]
      : currentFruit == "apple"
      ? desiredOutputs[0]
      : desiredOutputs[2];

  /*********************** FOR OUTPUT-HIDDEN ************************** */
  let normalErrorForOutFunction = new Array(3);
  let x = 0;
  for (let i = 0; i < 3; i++) {
    normalErrorForOutFunction[i] = normalErrorForOut(
      desiredOutputsVar[i],
      actualOutputsVar[i]
    );

    outputDerivativeVar = outputDerivativesForOutput[i];
    normalErrorForOutVar = normalErrorForOutFunction[i];
    console.log("output derivative  var is ");
    console.log(outputDerivativeVar);
    console.log("normalErrorForOutVar var is ");
    console.log(normalErrorForOutVar);
    gradientErrorVar = gradientError(outputDerivativeVar, normalErrorForOutVar);
    gradientErrorsForOutputNeuronsArray.push(gradientErrorVar);

    for (let j = 0; j < hiddenNeurons; x++, j++) {
      inputVar = hiddenOutputArray[j];
      console.log("learning rate is ");
      console.log(learningRate);
      deltaWVar = deltaW(learningRate, inputVar, gradientErrorVar);
      console.log("delta var is=====");
      console.log(deltaWVar);
      console.log("hiddenOutputweights");
      console.log(hiddenOutputWeights);
      newWeightVar = hiddenOutputWeights[x] + deltaWVar;
      console.log("new weight var is ");
      console.log(newWeightVar);
      newHiddenOutputWeights.push(newWeightVar);
    }
  }

  let gradientErrorsForOutputs = [...gradientErrorsForOutputNeuronsArray];
  /*********************** FOR HIDDEN-INPUT ************************** */

  let weightsToFunction = [];
  let gradientErrorsToFunction = [...gradientErrorsForOutputNeuronsArray];
  let z = 0;

  for (let i = 0; i < hiddenNeurons; i++) {
    let hiddenNueronsCountForLooop = i;
    for (let k = 0; k < 3; k++) {
      weightsToFunction[k] = hiddenOutputWeights[hiddenNueronsCountForLooop];
      hiddenNueronsCountForLooop += Number(hiddenNeurons);
      console.log("hiddenNueronsCountForLooop");
      console.log(hiddenNueronsCountForLooop);
    }

    noramlErrorForHiddenVar = normalErrorForHidden(
      weightsToFunction,
      gradientErrorsToFunction
    );
    outputDerivativeVar = hiddenOutputArray[i];
    gradientErrorVar = gradientError(
      outputDerivativeVar,
      noramlErrorForHiddenVar
    );
    gradientErrorsForHiddenNeuronsArray.push(gradientErrorVar);

    for (let j = 0; j < 2; z++, j++) {
      if (j % 2 == 0) inputVar = currentSweetness;
      else inputVar = currentColorVar;

      deltaWVar = deltaW(learningRate, inputVar, gradientErrorVar);
      newWeightVar = inputHiddenWeights[z] + deltaWVar;

      newInputHiddenWeights.push(newWeightVar);
    }
  }
  let gradientErrorsForHiddens = [...gradientErrorsForHiddenNeuronsArray];

  let weightResult = newInputHiddenWeights.concat(newHiddenOutputWeights);

  let newThreashould;
  let indexTemp = 0;
  let deltaThreshold;
  let newHiddenThreashoulds = [];
  let newOutputThreashoulds = [];

  for (let i = 0; i < gradientErrorsForHiddens.length; i++, indexTemp++) {
    deltaThreshold =
      learningRate * thresholdsArray[i] * gradientErrorsForHiddens[i];
    newThreashould = thresholdsArray[i] + deltaThreshold;
    newHiddenThreashoulds.push(newThreashould);
  }

  for (let i = 0; i < gradientErrorsForOutputs.length; i++, indexTemp++) {
    deltaThreshold =
      learningRate * thresholdsArray[indexTemp] * gradientErrorsForOutputs[i];

    newThreashould = thresholdsArray[indexTemp] + deltaThreshold;
    newOutputThreashoulds.push(newThreashould);
  }

  let threashouldsResult = newHiddenThreashoulds.concat(newOutputThreashoulds);

  return [weightResult, threashouldsResult];
}

function reluDerivative(x) {
  return x >= 0 ? 1 : 0;
}
function tanhDerivative(x) {
  return 1 - tanh(x) * tanh(x);
}
function sigmoidDerivative(x) {
  const sig = sigmoid(x);
  return sig * (1 - sig);
}

function softmax(input) {
  const expInput = input.map(Math.exp);
  const sumExpInput = expInput.reduce((acc, val) => acc + val, 0);
  const softmaxOutput = expInput.map((value) => value / sumExpInput);

  return softmaxOutput;
}
function softmaxDerivatives(softmaxValues) {
  const derivatives = [];

  for (let i = 0; i < softmaxValues.length; i++) {
    let derivative = 0;

    for (let j = 0; j < softmaxValues.length; j++) {
      if (i === j) {
        derivative = softmaxValues[i] * (1 - softmaxValues[i]);
      } else {
        derivative += -softmaxValues[i] * softmaxValues[j];
      }
    }

    derivatives.push(derivative);
  }

  return derivatives;
}

function getOutputDerivativeForHidden(x) {
  Document.getElementById("activation-function-hidden").value == "sigmoid"
    ? sigmoidDerivative(x)
    : Document.getElementById("activation-function-hidden").value == "relue"
    ? reluDerivative(x)
    : tanhDerivative(x);
}

function deltaW(learningRate, inputNeuron, gradientError) {
  return learningRate * inputNeuron * gradientError;
}
function gradientError(activationFunctionDerivative, error) {
  return activationFunctionDerivative * error;
}
function normalErrorForOut(desiredOutputs, actualOutputs) {
  return desiredOutputs - actualOutputs;
}
function normalErrorForHidden(weights, gradientErrors) {
  let error = 0;
  for (let i = 0; i < 3; i++) error += weights[i] * gradientErrors[i];

  return error;
}
function showResults() {
  counterForAccuracy = 0;
  for (let i = 0; i < outputArrayForFinalPart.length; i++) {
    let max = 0;
    let array = outputArrayForFinalPart[i];
    let maximumValue = array[0];

    for (let j = 1; j < array.length; j++) {
      if (array[j] > maximumValue) {
        maximumValue = array[j];
        max = j;
      }
    }

    let div1 = document.createElement("div");
    div1.style.display = "flex";
    div1.style.flexDirection = "row";

    let h1 = document.createElement("h1");
    h1.innerHTML = `Result ${i + 1}:-`;
    h1.style.marginRight = "260px";
    h1.style.marginLeft = "30px";

    h1.style.fontFamily = "cursive";

    div1.append(h1);

    let img = document.createElement("img");
    console.log(table);
    if (max === 0) {
      img.src = "../Images/apple-img.png";
      h1.style.color = "red";
      if (allValues[2][i] == "apple") counterForAccuracy++;
    } else if (max === 1) {
      img.src = "../Images/orange-img.png";
      h1.style.color = "orange";
      if (allValues[2][i] == "orange") counterForAccuracy++;
    } else {
      img.src = "../Images/banana-img.png";
      h1.style.color = "yellow";
      if (allValues[2][i] == "banana") counterForAccuracy++;
    }

    img.style.width = "100px";
    img.style.height = "100px";
    div1.append(img);

    div1.style.transition = "all 0.3s";
    div1.style.opacity = "0";

    document.getElementById("finalResults").append(div1);

    setTimeout(() => {
      div1.style.opacity = "1";
    });
  }
  document.getElementById("resultForAccuracy").innerHTML =
    `${((counterForAccuracy / dataRows) * 100).toFixed(2)}` + "%";
  document.getElementById("Tn").style.color = "green";
  document.getElementById("Fp").style.color = "red";

  document.getElementById("Tn").innerHTML = `${counterForAccuracy}`;
  document.getElementById("Fp").innerHTML = `${dataRows - counterForAccuracy}`;
  document.getElementById("datarows").innerHTML = `${dataRows}`;
}

function finalStep() {
  document.body.style.backgroundColor = "rgba(0, 231, 231, 0.9)";
  document.getElementById("resultContainer").style.opacity = "0";
  setTimeout(() => {
    document.getElementById("resultContainer").style.display = "none";
  }, 1000);
  document.getElementById("testDiv").style.opacity = "1";
  document.getElementById("testDiv").style.display = "flex";
}

function showTestedResult() {
  document.body.style.backgroundColor = "#00203fff";
  document.getElementById("testDiv").style.opacity = "0";
  setTimeout(() => {
    document.getElementById("testDiv").style.display = "none";
  }, 1000);
  let colorValue = document.getElementById("colorSelect").value;
  let sweetnessValue = document.getElementById("sweetnessInput").value;

  document.getElementById("lastResultContainer").style.display = "flex";
  document.getElementById("lastResultContainer").style.opacity = "1";
  let divSample = document.getElementById("finalResultOfSample");
  let img;
  let indexOfWeights = 0;

  for (k = 0; k < hiddenNeurons; k++) {
    arrayOfBigX[k] =
      weightsArray[indexOfWeights] * sweetnessValue +
      weightsArray[indexOfWeights + 1] *
        (colorValue == "red" ? 1 : colorValue == "orange" ? 2 : 3) +
      thresholdsArray[k];

    indexOfWeights += 2;
  }

  for (k = 0; k < hiddenNeurons; k++) {
    arrayOfBigX[k] =
      activationFunctionForHidden == "relu"
        ? relu(arrayOfBigX[k])
        : activationFunctionForHidden == "tanh"
        ? tanh(arrayOfBigX[k])
        : sigmoid(arrayOfBigX[k]);
  }

  outputArray = new Array(3);
  let bigX1 = 0;
  let bigX2 = 0;
  let bigX3 = 0;

  let indexForOutput = hiddenNeurons * 2;
  let indexOfHiddenValues = 0;
  let y = 0;

  for (
    x = indexForOutput;
    x < indexForOutput + (weightsArray.length - hiddenNeurons * 2) / 3;
    x++
  ) {
    bigX1 += weightsArray[x] * arrayOfBigX[indexOfHiddenValues];
    indexOfHiddenValues++;
    y = x;
  }
  indexForOutput = y;
  bigX1 += thresholdsArray[hiddenNeurons];

  indexOfHiddenValues = 0;
  for (
    x = indexForOutput;
    x < indexForOutput + (weightsArray.length - hiddenNeurons * 2) / 3;
    x++
  ) {
    bigX2 += weightsArray[x] * arrayOfBigX[indexOfHiddenValues];
    indexOfHiddenValues++;
    y = x;
  }
  indexForOutput = y;
  bigX2 += thresholdsArray[Number(hiddenNeurons) + Number(1)];

  indexOfHiddenValues = 0;
  for (
    x = indexForOutput;
    x < indexForOutput + (weightsArray.length - hiddenNeurons * 2) / 3;
    x++
  ) {
    bigX3 += weightsArray[x] * arrayOfBigX[indexOfHiddenValues];
    y = x;
  }
  indexForOutput = y;
  bigX3 += thresholdsArray[Number(hiddenNeurons) + Number(2)];
  indexOfHiddenValues = 0;

  let finalOutputArray;
  if (activationFunctionForOutput == "sigmoid")
    finalOutputArray = [sigmoid(bigX1), sigmoid(bigX2), sigmoid(bigX3)];
  else if (activationFunctionForOutput == "softmax")
    finalOutputArray = softmax([bigX1, bigX2, bigX3]);
  else console.log("\nSomthing wrong recognize output activation function\n");
  indexOfWeights = 0;
  let max = 0;
  let array = finalOutputArray;
  let maximumValue = array[0];

  for (let j = 1; j < array.length; j++) {
    if (array[j] > maximumValue) {
      maximumValue = array[j];
      max = j;
    }
  }
  img = document.createElement("img");

  if (max === 0) {
    img.src = "../Images/apple-img.png";
  } else if (max === 1) {
    img.src = "../Images/orange-img.png";
  } else {
    img.src = "../Images/banana-img.png";
  }

  img.style.width = "100px";
  img.style.height = "100px";
  divSample.append(img);

  divSample.style.transition = "all 0.7s";
}
