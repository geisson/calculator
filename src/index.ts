import '../sass/style.scss';

const visorCurrentNumber = document.querySelector('[data-visor=current-number]') as HTMLDivElement;
const visorAccumulator = document.querySelector('[data-visor=accumulator]') as HTMLDivElement;
// eslint-disable-next-line no-undef
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
    };
    calculation(elementsCalculateArray);
  };
  if (keyOperator) handleOperation();

  if (visorAccumulator.innerHTML.includes('=')) {
    console.log('resultado final');
    console.log(keyNumber);
    console.log(keyButton);
    const clickedNumber = document.querySelectorAll('[data-number]') as NodeListOf<HTMLButtonElement>;
    clickedNumber.forEach((item) => item.addEventListener('click', () => {
      visorCurrentNumber.innerHTML = '';
      visorCurrentNumber.innerHTML = item.value;
    }));
  }
};

buttons.forEach((KeyButton) => KeyButton.addEventListener('click', handleKeyButton));
