import '../sass/style.scss';

const visorCurrentNumber = document.querySelector('[data-visor=current-number]') as HTMLDivElement;
const visorAccumulator = document.querySelector('[data-visor=accumulator]') as HTMLDivElement;
const keyNumbers = document.querySelectorAll('[data-number]') as NodeListOf<HTMLButtonElement>;
const keyOperators = document.querySelectorAll('[data-operator]') as NodeListOf<HTMLButtonElement>;
const keyComma = document.querySelector('[data-functionality=comma]') as HTMLButtonElement;
const keyClearAll = document.querySelector('[data-functionality=clear-all]') as HTMLButtonElement;
const keyClearElement = document.querySelector('[data-functionality=clear-element]') as HTMLButtonElement;
const keyPlusMinus = document.querySelector('[data-functionality=plus-minus]') as HTMLButtonElement;

visorCurrentNumber.innerHTML = '';
visorAccumulator.innerHTML = '';
const maximumDisplayNumber: number = 8;

const elementsCalculateArray: Array<number| string> = [];

const handleKeyNumber = (event: Event) => {
  const keyNumber = event.target as HTMLButtonElement;
  const keyNumberValue = keyNumber.value;

  const addDisplayNumber = (number: string) => {
    const displaySize = visorCurrentNumber.innerHTML.length < maximumDisplayNumber;

    if (displaySize) {
      visorCurrentNumber.innerHTML += number;
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
    const number1 = arrayCalculate[0];
    const number2 = arrayCalculate[2];
    const signalOperator = arrayCalculate[1];

    const verificaNumero = typeof number1 === 'number' && typeof number2 === 'number';
    const addition = signalOperator === '+' && verificaNumero;
    const subtraction = signalOperator === '-' && verificaNumero;
    const multiplication = signalOperator === '*' && verificaNumero;
    const division = signalOperator === '/' && verificaNumero;

    if (addition) {
      const calculateSoma = number1 + number2;
      visorCurrentNumber.innerHTML = `${calculateSoma}`;
    }

    if (subtraction) {
      const calculateSubtraction = number1 - number2;
      visorCurrentNumber.innerHTML = `${calculateSubtraction}`;
    }

    if (multiplication) {
      const calculateMultiplication = number1 * number2;
      visorCurrentNumber.innerHTML = `${calculateMultiplication}`;
    }

    if (division) {
      const calculateDivision = number1 / number2;
      visorCurrentNumber.innerHTML = `${calculateDivision}`;
    }

    if (arrayCalculate.length >= 4) {
      arrayCalculate.splice(0, 4);
    }

    console.log(`
        numero1= ${number1}
        numero2= ${number2},
        operação = ${signalOperator}
        array= ${arrayCalculate}`);
    console.log(arrayCalculate);
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
  visorCurrentNumber.innerHTML = '';
};

const handleKeyClearElement = () => {
  visorCurrentNumber.innerHTML = '';
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
