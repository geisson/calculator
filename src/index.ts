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
const elementsCalculateArray:Array<number | string> = [];

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

  // if (visorCurrentNumber.innerHTML === '0') { visorCurrentNumber.innerHTML = ''; }

  console.log('tem sinal de = ?', visorAccumulator.innerHTML.includes('='));

  if (visorAccumulator.innerHTML.includes('=')) {
    visorCurrentNumber.innerHTML = '';
    visorAccumulator.innerHTML = '';
  }

  addDisplayNumber(keyNumberValue);
};

const calculate = (operation:string, number1: number, number2: number):number => {
  const addition:boolean = operation === '+';
  const subtraction:boolean = operation === '-';
  const multiplication:boolean = operation === '*';
  const division:boolean = operation === '/';
  const percentage: boolean = operation === '%';
  let resultCalc:number = 0;

  if (addition) { resultCalc = number1 + number2; }
  if (subtraction) { resultCalc = number1 - number2; }
  if (multiplication) { resultCalc = number1 * number2; }
  if (division) { resultCalc = number1 / number2; }
  if (percentage) { resultCalc = (number1 / 100) * number2; }

  return resultCalc;
};

const showCalculation = (arrayCalculate: Array<string | number>, operator: string) => {
  const number1 = +arrayCalculate[0];
  const number2 = +arrayCalculate[2];
  const calcOperator = arrayCalculate[1].toString();

  const isNumber = (!Number.isNaN(number1) && !Number.isNaN(number2));

  console.log(isNumber);

  if (isNumber) {
    const result = calculate(calcOperator, number1, number2);

    elementsCalculateArray.length = 0;
    elementsCalculateArray.push(result);

    visorCurrentNumber.innerHTML = result.toString();

    console.log(`
    result: ${result}
    number1: ${number1}
    number2: ${number2}
    calcOperator: ${calcOperator}
    `);
  }

  const isSequenceNumbers = (typeof arrayCalculate[0] === 'number' && typeof arrayCalculate[1] === 'number');

  if (isSequenceNumbers) {
    console.log('tem uma sequencia');
    elementsCalculateArray.shift();
  }

  // if (!isNaN(result)) { arrayCalculate.push(result); }

  // elementsCalculateArray.push(result);
  // visorAccumulator.innerHTML = result + calcOperator;
  // visorCurrentNumber.innerHTML = '';

  console.log(arrayCalculate);
};

const handleKeyOperator = (event:Event) => {
  const keyOperator = event.target as HTMLButtonElement;
  const operator = keyOperator.value;
  const previousNumber = visorCurrentNumber.innerHTML;

  if (previousNumber === '') return;

  visorAccumulator.innerHTML = previousNumber + operator;
  visorCurrentNumber.innerHTML = '';

  elementsCalculateArray.push(parseFloat(previousNumber), operator);

  showCalculation(elementsCalculateArray, operator);
};

const handleKeyComma = () => {
  if (!visorCurrentNumber.innerHTML.includes('.')) { visorCurrentNumber.innerHTML += '.'; }
};

const handleKeyClearAll = () => {
  visorAccumulator.innerHTML = '';
  visorCurrentNumber.innerHTML = '0';
};

const handleKeyClearElement = () => {
  const lastElement = elementsCalculateArray[elementsCalculateArray.length - 2];

  if (visorCurrentNumber.innerHTML === '') {
    elementsCalculateArray.pop();
    visorCurrentNumber.innerHTML = `${lastElement}`;
  } else {
    visorCurrentNumber.innerHTML = '';
  }
  console.log('clearElement', elementsCalculateArray);
  console.log(lastElement);
};

const handleKeyPlusMinus = ():void => {
  const isMinus = visorCurrentNumber.innerHTML.includes('-');
  const addMinus = ():void => { visorCurrentNumber.innerHTML = `-${visorCurrentNumber.innerHTML}`; };
  const removeMinus = ():void => { visorCurrentNumber.innerHTML = `${visorCurrentNumber.innerHTML.replace('-', '')}`; };

  return isMinus ? removeMinus() : addMinus();
};

// const handleKeyEqual = () => {
//   console.log('é igual a');
// };

keyNumbers.forEach((numberButton) => numberButton.addEventListener('click', handleKeyNumber));
keyOperators.forEach((keyOperator) => keyOperator.addEventListener('click', handleKeyOperator));
keyComma.addEventListener('click', handleKeyComma);
keyClearAll.addEventListener('click', handleKeyClearAll);
keyClearElement.addEventListener('click', handleKeyClearElement);
keyPlusMinus.addEventListener('click', handleKeyPlusMinus);
// keyEqual.addEventListener('click', handleKeyEqual);
// buttons.forEach((KeyButton) => KeyButton.addEventListener('click', handleKeyButton));
