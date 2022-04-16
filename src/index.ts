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

const updateArrayCalc = (arrayCalc:Array<string | number>, indexOperator:number, result:number) => {
  arrayCalc.splice(indexOperator + 1, 1);
  arrayCalc.splice(indexOperator - 1, 1);
  arrayCalc.splice(indexOperator - 1, 1, result);
};
const numberBeforeOperator = (arrayCalculate:Array<string| number>, operator: number):number => +arrayCalculate[operator - 1];
const numberAfterOperator = (arrayCalculate:Array<string| number>, operator: number): number => +arrayCalculate[operator + 1];

const calculate = (arrayCalculate:Array<string| number>, indexOperator: number, operator:string) => {
  const multiplication = operator === '*' ? numberBeforeOperator(arrayCalculate, indexOperator) * numberAfterOperator(arrayCalculate, indexOperator) : false;
  const division = operator === '/' ? numberBeforeOperator(arrayCalculate, indexOperator) / numberAfterOperator(arrayCalculate, indexOperator) : false;
  const addition = operator === '+' ? numberBeforeOperator(arrayCalculate, indexOperator) + numberAfterOperator(arrayCalculate, indexOperator) : false;
  const subtraction = operator === '-' ? numberBeforeOperator(arrayCalculate, indexOperator) - numberAfterOperator(arrayCalculate, indexOperator) : false;
  const percentage = operator === '%' ? (numberBeforeOperator(arrayCalculate, indexOperator) / 100) * numberAfterOperator(arrayCalculate, indexOperator) : false;

  // const result = [
  //   { '^': (a: number, b: number) => a ** b },
  //   { '*': (a:number, b:number) => a * b, '/': (a:number, b:number) => a / b },
  //   { '+': (a:number, b:number) => a + b, '-': (a:number, b:number) => a - b }];

  const result = multiplication || division || addition || subtraction || percentage;

  console.log(`calculo função = ${result}`);
  console.log(arrayCalculate);

  updateArrayCalc(arrayCalculate, indexOperator, +result);
  showCalculation(arrayCalculate);
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

const showCalculation = (arrayCalculate: Array<string | number>) => {
  const indexMultiplication = arrayCalculate.indexOf('*');
  const indexDivision = arrayCalculate.indexOf('/');
  const indexAddition = arrayCalculate.indexOf('+');
  const indexSubtraction = arrayCalculate.indexOf('-');
  const indexPercentage = arrayCalculate.indexOf('%');

  if (arrayCalculate.includes('*') || arrayCalculate.includes('/')) {
    arrayCalculate.includes('*') ? calculate(arrayCalculate, indexMultiplication, '*') : calculate(arrayCalculate, indexDivision, '/');
  }

  if (arrayCalculate.includes('+') || arrayCalculate.includes('-')) {
    arrayCalculate.includes('+') ? calculate(arrayCalculate, indexAddition, '+') : calculate(arrayCalculate, indexSubtraction, '-');
  }

  if (arrayCalculate.includes('%')) {
    calculate(arrayCalculate, indexPercentage, '%');
  }
};

const lorem2 = [3, '+', 3, '-', 6, '+', 4, '*', 3, '-', 7, '+', 89, '/', 5, '+', 4, '*', 5];

console.log(lorem2);
console.log(`correto = ${3 + 3 - 6 + 4 * 3 - 7 + 89 / 5 + 4 * 5}`); // 22,8
showCalculation(lorem2);
console.log(`resultado função = ${lorem2}`);

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

  showCalculation(elementsCalculateArray);

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
