import '../sass/style.scss';

const visorCurrentNumber = document.querySelector('[data-visor=current-number]') as HTMLDivElement;
const visorAccumulator = document.querySelector('[data-visor=accumulator]') as HTMLDivElement;
const buttons = document.querySelectorAll('button') as NodeListOf<HTMLButtonElement>;

visorCurrentNumber.innerHTML = '';
visorAccumulator.innerHTML = '';
const maximumDisplayNumber: number = 8;

const elementsCalculateArray: Array<number| string> = [];

const handleKeyButton = (event: Event) => {
  const keyButton = event.target as HTMLButtonElement;

  const keyNumber = keyButton.dataset.number as string;
  const keyOperator = keyButton.dataset.operator as string;
  const keyFunctionality = keyButton.dataset.functionality as string;

  const addDisplayNumber = (number:string) => {
    const displaySize = visorCurrentNumber.innerHTML.length < maximumDisplayNumber;

    if (displaySize) {
      visorCurrentNumber.innerHTML += number;
    }
  };
  if (keyNumber) addDisplayNumber(keyNumber);

  const addComma = () => {
    if (!visorCurrentNumber.innerHTML.includes('.')) {
      visorCurrentNumber.innerHTML += '.';
    }
  };
  if (keyFunctionality === 'comma') addComma();

  const cleanCurrentEntry = () => {
    visorCurrentNumber.innerHTML = '';
  };
  if (keyFunctionality === 'clear-element') cleanCurrentEntry();

  const clearAll = () => {
    visorAccumulator.innerHTML = '';
    visorCurrentNumber.innerHTML = '';
  };
  if (keyFunctionality === 'clear') clearAll();

  const handleOperation = () => {
    const operator = keyButton.value;
    const previousNumber = visorCurrentNumber.innerHTML;

    if (previousNumber === '') return;

    visorAccumulator.innerHTML = previousNumber + operator;
    visorCurrentNumber.innerHTML = '';

    elementsCalculateArray.push(parseFloat(previousNumber), operator);

    const calculate = (arrayCalculate: Array<string | number>) => {
      const number1 = arrayCalculate[0];
      const number2 = arrayCalculate[2];
      const signalOperator = arrayCalculate[1];

      const verificaNumero = typeof number1 === 'number' && typeof number2 === 'number';

      console.log(verificaNumero);

      if (signalOperator === '+' && verificaNumero) console.log(number1 + number2);

      console.log(arrayCalculate);
      console.log(number1, number2, signalOperator);
    };
    calculate(elementsCalculateArray);
  };
  if (keyOperator) handleOperation();
};

buttons.forEach((KeyButton) => KeyButton.addEventListener('click', handleKeyButton));
