import '../sass/style.scss';

const visorCurrentNumber = document.querySelector('[data-visor=current-number]') as HTMLDivElement;
const visorAccumulator = document.querySelector('[data-visor=accumulator]') as HTMLDivElement;
const keyNumbers = document.querySelectorAll('[data-number]') as NodeListOf<HTMLButtonElement>;
const keyOperators = document.querySelectorAll('[data-operator]') as NodeListOf<HTMLButtonElement>;
const keyComma = document.querySelector('[data-functionality=comma]') as HTMLButtonElement;
const keyClearAll = document.querySelector('[data-functionality=clear-all]') as HTMLButtonElement;
const keyClearElement = document.querySelector('[data-functionality=clear-element]') as HTMLButtonElement;
const keyPlusMinus = document.querySelector('[data-functionality=plus-minus]') as HTMLButtonElement;
const keyEqual = document.querySelector('[data-result=equal]') as HTMLButtonElement;

const maximumDisplayNumber:number = 8;
const elementsCalculateArray: Array<number | string> = [];

visorCurrentNumber.innerHTML = '0';
visorAccumulator.innerHTML = '';

const roundNumber = (value:number, precision:number):number => {
  const multiplier:number = 10 ** (precision || 0);
  return Math.round(value * multiplier) / multiplier;
};

const addDisplayFloatNumber = ():void => {
  if (visorCurrentNumber.innerHTML.indexOf('.')) {
    const currentNumber:number = +visorCurrentNumber.innerHTML;
    const floatNumber:number = roundNumber(currentNumber, 3);
    visorCurrentNumber.innerHTML = `${floatNumber}`;
  }
};

const addDisplayNumber = (number: string):void => {
  const displaySize:boolean = visorCurrentNumber.innerHTML.length < maximumDisplayNumber;

  if (displaySize) { visorCurrentNumber.innerHTML += number; }

  addDisplayFloatNumber();
};

const handleKeyNumber = (event: Event) => {
  const keyNumber = event.target as HTMLButtonElement;
  const keyNumberValue:string = keyNumber.value;

  if (visorAccumulator.innerHTML.includes('=')) {
    visorCurrentNumber.innerHTML = '';
    visorAccumulator.innerHTML = '';
    elementsCalculateArray.length = 0;
  }

  addDisplayNumber(keyNumberValue);
};

const updateCalculusArray = (array:Array<string | number>, index:number, result:number) => {
  array.splice(index + 1, 1);
  array.splice(index - 1, 1);
  array.splice(index - 1, 1, result);
};

const calculate = (operationSignal:string, previousNumber:number, nextNumber:number):number => {
  const calculateMultiplication = +previousNumber * +nextNumber;
  const calculateDivision = +previousNumber / +nextNumber;
  const calculateAddition = +previousNumber + +nextNumber;
  const calculateSubtraction = +previousNumber - +nextNumber;
  const calculatePercentage = (previousNumber / 100) * nextNumber;

  if (operationSignal === '*') return calculateMultiplication;
  if (operationSignal === '/') return calculateDivision;
  if (operationSignal === '+') return calculateAddition;
  if (operationSignal === '-') return calculateSubtraction;
  if (operationSignal === '%') return calculatePercentage;

  throw new Error("Shouldn't be reachable");
};

const calculateOrder = (element: (string | number), index: number, array: Array<string | number>) => {
  const previousElement = +array[index - 1];
  const nextElement = +array[index + 1];

  const firstOrder = element === '*' || element === '/';
  const secondOrder = element === '+' || element === '-';
  const percentage = element === '%';

  if (firstOrder) {
    console.log('--- INICIO PRIMEIRA ORDEM -------------------------');

    const result = calculate(element, previousElement, nextElement);

    console.log(`operação (${index}): ${previousElement} ${element} ${nextElement} = ${result}`);

    updateCalculusArray(array, index, result);

    console.log(array);
    console.log('--- FIM PRIMEIRA ORDEM -------------------------');
  }

  if (secondOrder) {
    console.log('--- INICIO SEGUNDA ORDEM -------------------------');

    const result = calculate(element, previousElement, nextElement);

    console.log(`operação (${index}): ${previousElement} ${element} ${nextElement} = ${result}`);

    updateCalculusArray(array, index, result);

    console.log(array);

    console.log(`--- FIM SEGUNDA ORDEM -------------------------

    `);
  }

  if (percentage) {
    const result = calculate(element, previousElement, nextElement);
    updateCalculusArray(array, index, result);
  }
};

const calculateExpressionArray = (array: Array<string | number>) => {
  const firstOrderSignal = array.find((element) => element === '*' || element === '/');
  const secondOrderSignal = array.find((element) => element === '+' || element === '-');
  const percentSign = array.find(((element) => element === '%'));

  console.log(`first order = ${firstOrderSignal}`);
  console.log(`second order = ${secondOrderSignal}`);

  const operationSignal = firstOrderSignal || secondOrderSignal || percentSign;
  const indexSign = (operationSignal) ? array.indexOf(operationSignal) : '';

  console.log(array);

  if (operationSignal && indexSign) {
    calculateOrder(operationSignal, indexSign, array);
    calculateExpressionArray(array);
  }
};

const percentagem = [10, '%', 30];
const lore = [1, '+', 2, '-', 3, '*', 4, '+', 5, '/', 6, '-', 7, '*', 8, '+', 9, '/', 10];
console.log(lore);
calculateExpressionArray(lore);
console.log(lore);

const handleKeyOperator = (event:Event) => {
  const keyOperator = event.target as HTMLButtonElement;
  const operator = keyOperator.value;
  const previousNumber = visorCurrentNumber.innerHTML;

  if (previousNumber === '') return;

  if (visorAccumulator.innerHTML.includes('=')) {
    elementsCalculateArray.length = 0;
  }

  elementsCalculateArray.push(parseFloat(previousNumber), operator);

  const showOperation:string = elementsCalculateArray.join('');
  visorAccumulator.innerHTML = showOperation;
  visorCurrentNumber.innerHTML = '';
};

const handleKeyComma = () => {
  if (!visorCurrentNumber.innerHTML.includes('.')) { visorCurrentNumber.innerHTML += '.'; }
};

const handleKeyClearAll = () => {
  visorAccumulator.innerHTML = '';
  visorCurrentNumber.innerHTML = '0';
};

const handleKeyClearElement = () => {
  if (visorCurrentNumber.innerHTML === '') {
    elementsCalculateArray.pop();
    const lastElement = elementsCalculateArray[elementsCalculateArray.length - 1];

    visorCurrentNumber.innerHTML = `${lastElement}`;
    visorAccumulator.innerHTML = '';

    if (elementsCalculateArray.length === 0) {
      visorCurrentNumber.innerHTML = '';
    }
  } else {
    visorCurrentNumber.innerHTML = '';
  }

  if (visorAccumulator.innerHTML.includes('=')) {
    visorCurrentNumber.innerHTML = '';
    visorAccumulator.innerHTML = '';
    elementsCalculateArray.length = 0;
  }
};

const handleKeyPlusMinus = ():void => {
  const isMinus = visorCurrentNumber.innerHTML.includes('-');
  const addMinus = ():void => { visorCurrentNumber.innerHTML = `-${visorCurrentNumber.innerHTML}`; };
  const removeMinus = ():void => { visorCurrentNumber.innerHTML = `${visorCurrentNumber.innerHTML.replace('-', '')}`; };

  return isMinus ? removeMinus() : addMinus();
};

const handleKeyEqual = () => {
  const previousNumber = visorCurrentNumber.innerHTML;

  if (previousNumber !== '') {
    elementsCalculateArray.push(parseFloat(previousNumber));
  }

  const lastItem = elementsCalculateArray[elementsCalculateArray.length - 1];
  const isNumber = typeof lastItem === 'number';

  if (!isNumber) {
    elementsCalculateArray.pop();
  }

  const showArithmeticOperation = `${elementsCalculateArray.join('')}=`;
  visorAccumulator.innerHTML = showArithmeticOperation;

  console.log(lastItem);
  console.log(isNumber);

  console.log('array de key equal= ', elementsCalculateArray);

  // showCalculation(elementsCalculateArray);

  console.log(elementsCalculateArray);

  visorCurrentNumber.innerHTML = `${elementsCalculateArray}`;

  // showCalculation(elementsCalculateArray);
};

keyNumbers.forEach((numberButton) => numberButton.addEventListener('click', handleKeyNumber));
keyOperators.forEach((keyOperator) => keyOperator.addEventListener('click', handleKeyOperator));
keyComma.addEventListener('click', handleKeyComma);
keyClearAll.addEventListener('click', handleKeyClearAll);
keyClearElement.addEventListener('click', handleKeyClearElement);
keyPlusMinus.addEventListener('click', handleKeyPlusMinus);
keyEqual.addEventListener('click', handleKeyEqual);
// buttons.forEach((KeyButton) => KeyButton.addEventListener('click', handleKeyButton));
