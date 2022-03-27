import '../sass/style.scss';

const visorCurrentNumber = document.querySelector('[data-visor=current-number]') as HTMLDivElement;
const visorAccumulator = document.querySelector('[data-visor=accumulator]') as HTMLDivElement;
const keyNumbers = document.querySelectorAll('[data-number]') as NodeListOf<HTMLButtonElement>;
const keyOperators = document.querySelectorAll('[data-operator]') as NodeListOf<HTMLButtonElement>;
const keyComma = document.querySelector('[data-functionality=comma]') as HTMLButtonElement;
const keyClearAll = document.querySelector('[data-functionality=clear-all]') as HTMLButtonElement;
const keyClearElement = document.querySelector('[data-functionality=clear-element]') as HTMLButtonElement;
const keyPlusMinus = document.querySelector('[data-functionality=plus-minus]') as HTMLButtonElement;

visorCurrentNumber.innerHTML = '0';
visorAccumulator.innerHTML = '';
const maximumDisplayNumber: number = 8;

const elementsCalculateArray: Array<number | string> = [];

const roundNumber = (value:number, precision:number) => {
  const multiplier = 10 ** (precision || 0);
  return Math.round(value * multiplier) / multiplier;
};

const handleKeyNumber = (event: Event) => {
  const keyNumber = event.target as HTMLButtonElement;
  const keyNumberValue = keyNumber.value;

  if (visorCurrentNumber.innerHTML === '0') {
    visorCurrentNumber.innerHTML = '';
  }

  if (visorAccumulator.innerHTML.includes('=')) {
    visorCurrentNumber.innerHTML = '';
    visorAccumulator.innerHTML = '';
  }

  const addDisplayNumber = (number: string) => {
    const displaySize = visorCurrentNumber.innerHTML.length < maximumDisplayNumber;

    if (displaySize) {
      visorCurrentNumber.innerHTML += number;
    }

    if (visorCurrentNumber.innerHTML.indexOf('.')) {
      const currentNumber = +visorCurrentNumber.innerHTML;
      const floatNumber = roundNumber(currentNumber, 3);
      visorCurrentNumber.innerHTML = `${floatNumber}`;
    }
  };
  addDisplayNumber(keyNumberValue);
};

const handleKeyOperator = (event:Event) => {
  const keyOperator = event.target as HTMLButtonElement;
  const operator = keyOperator.value;
  const previousNumber = visorCurrentNumber.innerHTML;

  if (previousNumber === '') return;

  visorAccumulator.innerHTML = previousNumber + operator;
  visorCurrentNumber.innerHTML = '';

  elementsCalculateArray.push(parseFloat(previousNumber), operator);

  const calculation = (arrayCalculate: Array<string | number>) => {
    const number1 = +arrayCalculate[arrayCalculate.length - 4];
    const number2 = +arrayCalculate[arrayCalculate.length - 2];
    const calcOperator: string = (arrayCalculate[arrayCalculate.length - 3]).toString();

    const resultOperation = (operation:string, number01: number, number02: number):number => {
      const addition = operation === '+';
      const subtraction = operation === '-';
      const multiplication = operation === '*';
      const division = operation === '/';
      const percentage = operation === '%';
      let resultCalc:number = 0;

      if (addition) { resultCalc = number01 + number02; }
      if (subtraction) { resultCalc = number01 - number02; }
      if (multiplication) { resultCalc = number01 * number02; }
      if (division) { resultCalc = number01 / number02; }
      if (percentage) { resultCalc = (number1 / 100) * number2; }

      return resultCalc;
    };

    const result = resultOperation(calcOperator, number1, number2);

    visorCurrentNumber.innerHTML = `${result}`;
    elementsCalculateArray.push(result, operator);
    visorAccumulator.innerHTML = result + operator;
    visorCurrentNumber.innerHTML = '';
  };
  calculation(elementsCalculateArray);
};

const handleKeyComma = () => {
  if (!visorCurrentNumber.innerHTML.includes('.')) {
    visorCurrentNumber.innerHTML += '.';
  }
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

const handleKeyPlusMinus = () => {
  const isMinus = visorCurrentNumber.innerHTML.includes('-');
  const addMinus = () => visorCurrentNumber.innerHTML = `-${visorCurrentNumber.innerHTML}`;
  const removeMinus = () => visorCurrentNumber.innerHTML = `${visorCurrentNumber.innerHTML.replace('-', '')}`;

  return isMinus ? removeMinus() : addMinus();
};

keyNumbers.forEach((numberButton) => numberButton.addEventListener('click', handleKeyNumber));
keyOperators.forEach((keyOperator) => keyOperator.addEventListener('click', handleKeyOperator));
keyComma.addEventListener('click', handleKeyComma);
keyClearAll.addEventListener('click', handleKeyClearAll);
keyClearElement.addEventListener('click', handleKeyClearElement);
keyPlusMinus.addEventListener('click', handleKeyPlusMinus);
// buttons.forEach((KeyButton) => KeyButton.addEventListener('click', handleKeyButton));
