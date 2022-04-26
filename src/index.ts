import '../sass/style.scss';

const currentNumberDisplay = document.querySelector('[data-visor=current-number]') as HTMLDivElement;
const arithmeticExpressionDisplay = document.querySelector('[data-visor=accumulator]') as HTMLDivElement;
const keyNumbers = document.querySelectorAll('[data-number]') as NodeListOf<HTMLButtonElement>;
const keyOperators = document.querySelectorAll('[data-operator]') as NodeListOf<HTMLButtonElement>;
const keyComma = document.querySelector('[data-functionality=comma]') as HTMLButtonElement;
const keyClearAll = document.querySelector('[data-functionality=clear-all]') as HTMLButtonElement;
const keyClearElement = document.querySelector('[data-functionality=clear-element]') as HTMLButtonElement;
const keyPlusMinus = document.querySelector('[data-functionality=plus-minus]') as HTMLButtonElement;
const keyEqual = document.querySelector('[data-result=equal]') as HTMLButtonElement;

const maximumDisplaySize = 8;
const arrayWithMathExpression: Array<number | string> = [];

currentNumberDisplay.innerHTML = '0';
arithmeticExpressionDisplay.innerHTML = '';

const roundNumber = (value:number, decimalAmount:number):number => {
  const multiplier = 10 ** (decimalAmount || 0);
  return Math.round(value * multiplier) / multiplier;
};

const addDisplayFloatNumber = (
  _currentNumberDisplay: HTMLDivElement,
  decimalAmount: number,
): void => {
  const containerCurrentNumberDisplay = _currentNumberDisplay;
  const containsDecimalPoint = containerCurrentNumberDisplay.innerHTML.indexOf('.');

  if (containsDecimalPoint) {
    const currentNumber = +containerCurrentNumberDisplay.innerHTML;
    const floatNumber = roundNumber(currentNumber, decimalAmount);
    containerCurrentNumberDisplay.innerHTML = `${floatNumber}`;
  }
};

const addDisplayNumber = (
  number: string,
  _currentNumberDisplay: HTMLDivElement,
  displaySize: number,
): void => {
  const containerNumberDisplay = _currentNumberDisplay;
  const displayIsCorrectSize = containerNumberDisplay.innerHTML.length < displaySize;

  if (displayIsCorrectSize) { containerNumberDisplay.innerHTML += number; }

  addDisplayFloatNumber(containerNumberDisplay, 3);
};

const updateCalculusArray = (
  array: Array<string | number>,
  indexArithmeticOperator: number,
  result: number,
) => {
  array.splice(indexArithmeticOperator + 1, 1);
  array.splice(indexArithmeticOperator - 1, 1);
  array.splice(indexArithmeticOperator - 1, 1, result);
};

const calculate = (arithmeticOperator:string, previousNumber:number, nextNumber:number):number => {
  const calculateMultiplication = +previousNumber * +nextNumber;
  const calculateDivision = +previousNumber / +nextNumber;
  const calculateAddition = +previousNumber + +nextNumber;
  const calculateSubtraction = +previousNumber - +nextNumber;
  const calculatePercentage = (previousNumber / 100) * nextNumber;

  if (arithmeticOperator === '*') return calculateMultiplication;
  if (arithmeticOperator === '/') return calculateDivision;
  if (arithmeticOperator === '+') return calculateAddition;
  if (arithmeticOperator === '-') return calculateSubtraction;
  if (arithmeticOperator === '%') return calculatePercentage;

  throw new Error("Shouldn't be reachable");
};

const calculateOrder = (
  arithmeticOperator: (string | number),
  indexArithmeticOperator: number,
  array: Array<string | number>,
) => {
  const previousNumber = +array[indexArithmeticOperator - 1];
  const nextNumber = +array[indexArithmeticOperator + 1];

  const firstOrder = arithmeticOperator === '*' || arithmeticOperator === '/';
  const secondOrder = arithmeticOperator === '+' || arithmeticOperator === '-';
  const percentage = arithmeticOperator === '%';

  if (firstOrder || secondOrder || percentage) {
    const result = calculate(arithmeticOperator, previousNumber, nextNumber);
    updateCalculusArray(array, indexArithmeticOperator, result);
  }
};

const orderArithmeticOperators = (array: Array<string | number>) => {
  const firstOrderArithmeticOperators = array.find((arithmeticOperator) => arithmeticOperator === '*' || arithmeticOperator === '/');

  const secondOrderArithmeticOperators = array.find((arithmeticOperator) => arithmeticOperator === '+' || arithmeticOperator === '-');

  const percentageArithmeticOperator = array.find(((arithmeticOperator) => arithmeticOperator === '%'));

  return firstOrderArithmeticOperators
    || secondOrderArithmeticOperators || percentageArithmeticOperator;
};

const calculateExpressionArray = (array: Array<string | number>) => {
  const arithmeticOperatorCurrent = orderArithmeticOperators(array);
  const indexArithmeticOperatorCurrent = (arithmeticOperatorCurrent) ? array.indexOf(arithmeticOperatorCurrent) : '';

  if (arithmeticOperatorCurrent && indexArithmeticOperatorCurrent) {
    calculateOrder(arithmeticOperatorCurrent, indexArithmeticOperatorCurrent, array);
    calculateExpressionArray(array);
  }

  return array;
};

const cleanAll = (
  _currentNumberDisplay: HTMLDivElement,
  _currentArithmeticDisplay: HTMLDivElement,
  array: Array<string | number>,
) => {
  const containerCurrentDisplay = _currentNumberDisplay;
  const containerArithmeticDisplay = _currentArithmeticDisplay;
  const arrayArithmetic = array;

  containerCurrentDisplay.innerHTML = '';
  containerArithmeticDisplay.innerHTML = '';
  arrayArithmetic.length = 0;
};

const clearElement = () => {
  arrayWithMathExpression.pop();
  console.log(arrayWithMathExpression);

  // if (currentNumberDisplay.innerHTML === '') {
  //   arrayWithMathExpression.pop();
  //   const lastElement = arrayWithMathExpression[arrayWithMathExpression.length - 1];

  //   currentNumberDisplay.innerHTML = `${lastElement}`;
  //   arithmeticExpressionDisplay.innerHTML = `${arrayWithMathExpression}`;

  //   console.log(arrayWithMathExpression);
  //   console.log(lastElement);

  //   if (arrayWithMathExpression.length === 0) {
  //     currentNumberDisplay.innerHTML = '';
  //   }
  // } else {
  //   currentNumberDisplay.innerHTML = '';
  // }

  if (arithmeticExpressionDisplay.innerHTML.includes('=')) {
    cleanAll(currentNumberDisplay, arithmeticExpressionDisplay, arrayWithMathExpression);
  }
};

const addArithmeticOperator = (_arithmeticOperator:string) => {
  const arithmeticOperator = _arithmeticOperator;
  const previousNumber = currentNumberDisplay.innerHTML;

  if (previousNumber === '') return;

  if (arithmeticExpressionDisplay.innerHTML.includes('=')) {
    arrayWithMathExpression.length = 0;
  }

  arrayWithMathExpression.push(parseFloat(previousNumber), arithmeticOperator);
  const showArithmeticOperationOnDisplay:string = arrayWithMathExpression.join('');
  arithmeticExpressionDisplay.innerHTML = showArithmeticOperationOnDisplay;
  currentNumberDisplay.innerHTML = '';
};

const handleKeyNumber = (event: Event) => {
  const keyNumber = event.target as HTMLButtonElement;
  const keyNumberValue:string = keyNumber.value;

  if (arithmeticExpressionDisplay.innerHTML.includes('=')) {
    cleanAll(currentNumberDisplay, arithmeticExpressionDisplay, arrayWithMathExpression);
  }

  addDisplayNumber(keyNumberValue, currentNumberDisplay, maximumDisplaySize);
};

const handleKeyOperator = (event: Event) => {
  const arithmeticOperatorKey = event.target as HTMLButtonElement;
  const arithmeticOperatorValue = arithmeticOperatorKey.value;
  addArithmeticOperator(arithmeticOperatorValue);
};

const handleKeyComma = () => {
  if (!currentNumberDisplay.innerHTML.includes('.')) { currentNumberDisplay.innerHTML += '.'; }
};

const handleKeyClearAll = () => {
  cleanAll(currentNumberDisplay, arithmeticExpressionDisplay, arrayWithMathExpression);
};

const handleKeyClearElement = () => {
  clearElement();
};

const handleKeyPlusMinus = ():void => {
  const isMinus = currentNumberDisplay.innerHTML.includes('-');
  const addMinus = ():void => { currentNumberDisplay.innerHTML = `-${currentNumberDisplay.innerHTML}`; };
  const removeMinus = ():void => { currentNumberDisplay.innerHTML = `${currentNumberDisplay.innerHTML.replace('-', '')}`; };

  return isMinus ? removeMinus() : addMinus();
};

const handleKeyEqual = () => {
  const previousNumber = currentNumberDisplay.innerHTML;

  if (previousNumber !== '') {
    arrayWithMathExpression.push(parseFloat(previousNumber));
  }

  const lastItem = arrayWithMathExpression[arrayWithMathExpression.length - 1];
  const isNumber = typeof lastItem === 'number';

  if (!isNumber) {
    arrayWithMathExpression.pop();
  }

  const showArithmeticOperation = `${arrayWithMathExpression.join('')}=`;
  arithmeticExpressionDisplay.innerHTML = showArithmeticOperation;

  const result = roundNumber(+calculateExpressionArray(arrayWithMathExpression).join(), 2);

  console.log(result.toString().length);

  if (result.toString().length > maximumDisplaySize) {
    currentNumberDisplay.innerHTML = 'ERROR';
  } else {
    currentNumberDisplay.innerHTML = `${result}`;
  }
};

keyNumbers.forEach((numberButton) => numberButton.addEventListener('click', handleKeyNumber));
keyOperators.forEach((keyOperator) => keyOperator.addEventListener('click', handleKeyOperator));
keyComma.addEventListener('click', handleKeyComma);
keyClearAll.addEventListener('click', handleKeyClearAll);
keyClearElement.addEventListener('click', handleKeyClearElement);
keyPlusMinus.addEventListener('click', handleKeyPlusMinus);
keyEqual.addEventListener('click', handleKeyEqual);
