import '../sass/style.scss';
import '../index.html';

const currentNumberDisplay = document.querySelector('[data-visor=current-number]') as HTMLDivElement;
const arithmeticExpressionDisplay = document.querySelector('[data-visor=accumulator]') as HTMLDivElement;
const keyNumbers = document.querySelectorAll('[data-number]');
const keyOperators = document.querySelectorAll('[data-operator]');
const keyComma = document.querySelector('[data-functionality=comma]') as HTMLButtonElement;
const keyClearAll = document.querySelector('[data-functionality=clear-all]') as HTMLButtonElement;
const keyClearElement = document.querySelector('[data-functionality=clear-element]') as HTMLButtonElement;
const keyPlusMinus = document.querySelector('[data-functionality=plus-minus]') as HTMLButtonElement;
const keyEqual = document.querySelector('[data-result=equal]') as HTMLButtonElement;

const maximumDisplaySize = 8;
const arrayWithMathExpression: Array<number | string> = [];

currentNumberDisplay.innerHTML = '0';
arithmeticExpressionDisplay.innerHTML = '';

const roundNumber = (_value:number, _decimalAmount:number):number => {
  const multiplier = 10 ** (_decimalAmount || 0);
  return Math.round(_value * multiplier) / multiplier;
};

const limitDecimalPlaces = (_currentNumberDisplay: HTMLDivElement, _decimalAmount: number) => {
  const elCurrentNumberDisplay = _currentNumberDisplay;
  const containsDecimalPoint = elCurrentNumberDisplay.innerHTML.indexOf('.');

  if (containsDecimalPoint) {
    const currentNumber = +elCurrentNumberDisplay.innerHTML;
    const roundedDecimalNumber = roundNumber(currentNumber, _decimalAmount);
    elCurrentNumberDisplay.innerHTML = `${roundedDecimalNumber}`;
  }
};

const addDisplayNumber = (
  _number: string,
  _currentNumberDisplay: HTMLDivElement,
  _displaySize: number,
): void => {
  const elNumberDisplay = _currentNumberDisplay;
  const displayIsCorrectSize = elNumberDisplay.innerHTML.length < _displaySize;

  if (displayIsCorrectSize) { elNumberDisplay.innerHTML += _number; }

  limitDecimalPlaces(elNumberDisplay, 3);
};

const updateCalculusArray = (
  _arrayWithMathExpression: Array<string | number>,
  _indexArithmeticOperator: number,
  _result: number,
) => {
  _arrayWithMathExpression.splice(_indexArithmeticOperator + 1, 1);
  _arrayWithMathExpression.splice(_indexArithmeticOperator - 1, 1);
  _arrayWithMathExpression.splice(_indexArithmeticOperator - 1, 1, _result);
};

const calculate = (
  _arithmeticOperator: string,
  _previousNumber: number,
  _nextNumber: number,
): number => {
  const calculateMultiplication = +_previousNumber * +_nextNumber;
  const calculateDivision = +_previousNumber / +_nextNumber;
  const calculateAddition = +_previousNumber + +_nextNumber;
  const calculateSubtraction = +_previousNumber - +_nextNumber;
  const calculatePercentage = (_previousNumber / 100) * _nextNumber;

  if (_arithmeticOperator === '*') return calculateMultiplication;
  if (_arithmeticOperator === '/') return calculateDivision;
  if (_arithmeticOperator === '+') return calculateAddition;
  if (_arithmeticOperator === '-') return calculateSubtraction;
  if (_arithmeticOperator === '%') return calculatePercentage;

  throw new Error("Shouldn't be reachable");
};

const calculateOrder = (
  _arithmeticOperator: (string | number),
  _indexArithmeticOperator: number,
  _arrayWithMathExpression: Array<string | number>,
) => {
  const previousNumber = +_arrayWithMathExpression[_indexArithmeticOperator - 1];
  const nextNumber = +_arrayWithMathExpression[_indexArithmeticOperator + 1];

  const firstOrder = _arithmeticOperator === '*' || _arithmeticOperator === '/';
  const secondOrder = _arithmeticOperator === '+' || _arithmeticOperator === '-';
  const percentage = _arithmeticOperator === '%';

  if (firstOrder || secondOrder || percentage) {
    const result = calculate(_arithmeticOperator, previousNumber, nextNumber);
    updateCalculusArray(_arrayWithMathExpression, _indexArithmeticOperator, result);
  }
};

const orderArithmeticOperators = (_arrayWithMathExpression: Array<string | number>) => {
  const firstOrderArithmeticOperators = _arrayWithMathExpression.find((arithmeticOperator) => arithmeticOperator === '*' || arithmeticOperator === '/');

  const secondOrderArithmeticOperators = _arrayWithMathExpression.find((arithmeticOperator) => arithmeticOperator === '+' || arithmeticOperator === '-');

  const percentageArithmeticOperator = _arrayWithMathExpression.find(((arithmeticOperator) => arithmeticOperator === '%'));

  return firstOrderArithmeticOperators
    || secondOrderArithmeticOperators || percentageArithmeticOperator;
};

const calculateExpressionArray = (_arrayWithMathExpression: Array<string | number>) => {
  const arithmeticOperatorCurrent = orderArithmeticOperators(_arrayWithMathExpression);
  const indexArithmeticOperatorCurrent = (arithmeticOperatorCurrent)
    ? _arrayWithMathExpression.indexOf(arithmeticOperatorCurrent)
    : '';

  if (arithmeticOperatorCurrent && indexArithmeticOperatorCurrent) {
    calculateOrder(
      arithmeticOperatorCurrent,
      indexArithmeticOperatorCurrent,
      _arrayWithMathExpression,
    );

    calculateExpressionArray(_arrayWithMathExpression);
  }

  return _arrayWithMathExpression;
};

const cleanAll = (
  _currentNumberDisplay: HTMLDivElement,
  _currentArithmeticDisplay: HTMLDivElement,
  _arrayWithMathExpression: Array<string | number>,
) => {
  const elCurrentDisplay = _currentNumberDisplay;
  const elArithmeticDisplay = _currentArithmeticDisplay;
  const elArrayArithmeticExpression = _arrayWithMathExpression;

  elCurrentDisplay.innerHTML = '0';
  elArithmeticDisplay.innerHTML = '';
  elArrayArithmeticExpression.length = 0;
};

const clearElement = (
  _arithmeticExpressionDisplay: HTMLDivElement,
  _currentNumberDisplay: HTMLDivElement,
  _arrayWithMathExpression: Array<string | number>,
) => {
  const elArithmeticExpressionDisplay = _arithmeticExpressionDisplay;
  const elCurrentNumberDisplay = _currentNumberDisplay;
  const lastElementArray = _arrayWithMathExpression[_arrayWithMathExpression.length - 1];
  const lastArrayNumber = _arrayWithMathExpression[_arrayWithMathExpression.length - 2];

  const lastElementOfArrayIsAOperator = typeof lastElementArray === 'string';
  const EmptyCurrentNumberDisplay = elCurrentNumberDisplay.innerHTML === '';

  if (elArithmeticExpressionDisplay.innerHTML.includes('=')) {
    cleanAll(elCurrentNumberDisplay, elArithmeticExpressionDisplay, _arrayWithMathExpression);
    return;
  }

  if (lastElementOfArrayIsAOperator && !EmptyCurrentNumberDisplay) {
    elCurrentNumberDisplay.innerHTML = '';
    return;
  }

  if (_arrayWithMathExpression.length === 0) {
    elCurrentNumberDisplay.innerHTML = '0';
    return;
  }

  _arrayWithMathExpression.splice(-2, 2);

  elArithmeticExpressionDisplay.innerHTML = `${_arrayWithMathExpression.join('')}`;
  elCurrentNumberDisplay.innerHTML = `${lastArrayNumber}`;
};

const addArithmeticOperator = (
  _arithmeticOperator: string,
  _currentNumberDisplay: HTMLDivElement,
  _arithmeticExpressionDisplay:HTMLDivElement,
  _arrayArithmeticExpression:Array<string | number>,
) => {
  const previousNumber = _currentNumberDisplay.innerHTML;
  const elArrayArithmeticExpression = _arrayArithmeticExpression;
  const elCurrentNumberDisplay = _currentNumberDisplay;
  const elArithmeticExpressionDisplay = _arithmeticExpressionDisplay;

  if (previousNumber === '') return;

  const arithmeticExpressionContainsEqualSign = elArrayArithmeticExpression.includes('=');

  if (arithmeticExpressionContainsEqualSign) elArrayArithmeticExpression.length = 0;

  elArrayArithmeticExpression.push(parseFloat(previousNumber), _arithmeticOperator);

  const showArithmeticOperationOnDisplay = elArrayArithmeticExpression.join('');

  elArithmeticExpressionDisplay.innerHTML = showArithmeticOperationOnDisplay;
  elCurrentNumberDisplay.innerHTML = '';
};

const addDecimalPoint = (_currentNumberDisplay: HTMLDivElement) => {
  const elCurrentNumberDisplay = _currentNumberDisplay;
  const currentNumberContainsDecimalPoint = elCurrentNumberDisplay.innerHTML.includes('.');

  if (!currentNumberContainsDecimalPoint) elCurrentNumberDisplay.innerHTML += '.';
};

const changeNumberSign = (_currentNumberDisplay: HTMLDivElement) => {
  const elCurrentNumberDisplay = _currentNumberDisplay;
  const isMinus = _currentNumberDisplay.innerHTML.includes('-');

  const addMinus = () => { elCurrentNumberDisplay.innerHTML = `-${elCurrentNumberDisplay.innerHTML}`; };
  const removeMinus = () => { elCurrentNumberDisplay.innerHTML = `${elCurrentNumberDisplay.innerHTML.replace('-', '')}`; };

  return isMinus ? removeMinus() : addMinus();
};

const showResultOnDisplay = (
  _result: number,
  _resultDisplay: HTMLDivElement,
  _displaySize: number,
) => {
  const elResultDisplay = _resultDisplay;
  const resultLargerThanDisplaySize = _result.toString().length > _displaySize;

  if (resultLargerThanDisplaySize) elResultDisplay.innerHTML = 'ERROR';
  else (elResultDisplay.innerHTML = `${_result}`);
};

const doCalculation = (
  _previousNumber: string,
  _arithmeticExpressionDisplay:HTMLDivElement,
  _arrayArithmeticExpression: Array<string | number>,
) => {
  const elArithmeticExpressionDisplay = _arithmeticExpressionDisplay;

  if (_previousNumber !== '') {
    _arrayArithmeticExpression.push(parseFloat(_previousNumber));
  }

  const lastItem = _arrayArithmeticExpression[_arrayArithmeticExpression.length - 1];
  const isNumber = typeof lastItem === 'number';

  if (!isNumber) {
    _arrayArithmeticExpression.pop();
  }

  const showArithmeticOperation = `${_arrayArithmeticExpression.join('')}=`;
  elArithmeticExpressionDisplay.innerHTML = showArithmeticOperation;

  const result = roundNumber(+calculateExpressionArray(_arrayArithmeticExpression).join(), 2);

  showResultOnDisplay(result, currentNumberDisplay, maximumDisplaySize);
};

const handleKeyNumber = (event: Event) => {
  const keyNumber = event.target as HTMLButtonElement;
  const keyNumberValue:string = keyNumber.value;

  const arithmeticExpressionContainsEqualSign = arithmeticExpressionDisplay.innerHTML.includes('=');

  if (arithmeticExpressionContainsEqualSign) {
    cleanAll(currentNumberDisplay, arithmeticExpressionDisplay, arrayWithMathExpression);
  }

  addDisplayNumber(keyNumberValue, currentNumberDisplay, maximumDisplaySize);
};

const handleKeyOperator = (event: Event) => {
  const arithmeticOperatorKey = event.target as HTMLButtonElement;
  const arithmeticOperatorValue = arithmeticOperatorKey.value;

  addArithmeticOperator(
    arithmeticOperatorValue,
    currentNumberDisplay,
    arithmeticExpressionDisplay,
    arrayWithMathExpression,
  );
};

const handleKeyComma = () => {
  addDecimalPoint(currentNumberDisplay);
};

const handleKeyClearAll = () => {
  cleanAll(currentNumberDisplay, arithmeticExpressionDisplay, arrayWithMathExpression);
};

const handleKeyClearElement = () => {
  clearElement(arithmeticExpressionDisplay, currentNumberDisplay, arrayWithMathExpression);
};

const handleKeyPlusMinus = ():void => {
  changeNumberSign(currentNumberDisplay);
};

const handleKeyEqual = () => {
  const previousNumber = currentNumberDisplay.innerHTML;

  if (arrayWithMathExpression.length > 1) {
    doCalculation(
      previousNumber,
      arithmeticExpressionDisplay,
      arrayWithMathExpression,
    );
    arrayWithMathExpression.length = 0;
  }
};

keyNumbers.forEach((numberButton) => numberButton.addEventListener('click', handleKeyNumber));
keyOperators.forEach((keyOperator) => keyOperator.addEventListener('click', handleKeyOperator));
keyComma.addEventListener('click', handleKeyComma);
keyClearAll.addEventListener('click', handleKeyClearAll);
keyClearElement.addEventListener('click', handleKeyClearElement);
keyPlusMinus.addEventListener('click', handleKeyPlusMinus);
keyEqual.addEventListener('click', handleKeyEqual);
