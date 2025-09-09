import React, { useState } from 'react';
import { Delete, Calculator as CalcIcon } from 'lucide-react';

const Calculator: React.FC = () => {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForNewValue, setWaitingForNewValue] = useState(false);

  const inputNumber = (num: string) => {
    if (waitingForNewValue) {
      setDisplay(num);
      setWaitingForNewValue(false);
    } else {
      setDisplay(display === '0' ? num : display + num);
    }
  };

  const inputDecimal = () => {
    if (waitingForNewValue) {
      setDisplay('0.');
      setWaitingForNewValue(false);
    } else if (display.indexOf('.') === -1) {
      setDisplay(display + '.');
    }
  };

  const clear = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setWaitingForNewValue(false);
  };

  const performOperation = (nextOperation: string) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (operation) {
      const currentValue = previousValue || 0;
      const newValue = calculate(currentValue, inputValue, operation);

      setDisplay(String(newValue));
      setPreviousValue(newValue);
    }

    setWaitingForNewValue(true);
    setOperation(nextOperation);
  };

  const calculate = (firstValue: number, secondValue: number, operation: string): number => {
    switch (operation) {
      case '+':
        return firstValue + secondValue;
      case '-':
        return firstValue - secondValue;
      case '×':
        return firstValue * secondValue;
      case '÷':
        return firstValue / secondValue;
      case '=':
        return secondValue;
      default:
        return secondValue;
    }
  };

  const handlePercentage = () => {
    const value = parseFloat(display) / 100;
    setDisplay(String(value));
  };

  const handleSquareRoot = () => {
    const value = Math.sqrt(parseFloat(display));
    setDisplay(String(value));
  };

  const buttons = [
    ['C', '√', '%', '÷'],
    ['7', '8', '9', '×'],
    ['4', '5', '6', '-'],
    ['1', '2', '3', '+'],
    ['0', '.', '='],
  ];

  const handleButtonClick = (button: string) => {
    if (button >= '0' && button <= '9') {
      inputNumber(button);
    } else if (button === '.') {
      inputDecimal();
    } else if (button === 'C') {
      clear();
    } else if (button === '=') {
      performOperation('=');
    } else if (button === '%') {
      handlePercentage();
    } else if (button === '√') {
      handleSquareRoot();
    } else {
      performOperation(button);
    }
  };

  return (
    <div className="p-4 sm:p-6">
      <div className="max-w-md mx-auto w-full">
        <div className="flex items-center justify-center mb-6">
          <CalcIcon className="text-blue-600 mr-2" size={24} />
          <h2 className="text-2xl font-bold text-gray-900">Financial Calculator</h2>
        </div>

        <div className="bg-white rounded-xl shadow-lg border">
          {/* Display */}
          <div className="p-6 border-b border-gray-200">
            <div className="bg-gray-900 text-white p-4 rounded-lg text-right">
              <div className="text-2xl sm:text-3xl font-mono min-h-[1.5em] break-all">
                {display}
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="p-4">
            <div className="grid gap-2">
              {buttons.map((row, rowIndex) => (
                <div key={rowIndex} className="grid grid-cols-4 gap-2">
                  {row.map((button) => (
                    <button
                      key={button}
                      onClick={() => handleButtonClick(button)}
                      className={`h-14 text-xl font-semibold rounded-lg transition-colors ${
                        button === '=' 
                          ? 'col-span-2 bg-blue-600 text-white hover:bg-blue-700'
                          : button === '0'
                          ? 'col-span-2 bg-gray-100 text-gray-900 hover:bg-gray-200'
                          : ['C', '√', '%', '÷', '×', '-', '+'].includes(button)
                          ? 'bg-orange-500 text-white hover:bg-orange-600'
                          : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                      }`}
                    >
                      {button}
                    </button>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Additional Functions */}
          <div className="p-4 border-t border-gray-200">
            <p className="text-sm text-gray-600 text-center mb-2">Quick Financial Calculations</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                onClick={() => {
                  const principal = parseFloat(prompt('Enter principal amount:') || '0');
                  const rate = parseFloat(prompt('Enter interest rate (%):') || '0') / 100;
                  const time = parseFloat(prompt('Enter time period (years):') || '0');
                  const interest = principal * rate * time;
                  setDisplay(String(interest));
                }}
                className="px-3 py-2 bg-green-100 text-green-800 text-sm rounded hover:bg-green-200"
              >
                Simple Interest
              </button>
              <button
                onClick={() => {
                  const monthly = parseFloat(prompt('Enter monthly amount:') || '0');
                  const annual = monthly * 12;
                  setDisplay(String(annual));
                }}
                className="px-3 py-2 bg-blue-100 text-blue-800 text-sm rounded hover:bg-blue-200"
              >
                Annual Total
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold text-blue-900 mb-2">Calculator Features:</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Basic arithmetic operations (+, -, ×, ÷)</li>
            <li>• Percentage calculations</li>
            <li>• Square root function</li>
            <li>• Simple interest calculator</li>
            <li>• Annual total calculator</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Calculator;