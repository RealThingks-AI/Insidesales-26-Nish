import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type Operator = "+" | "-" | "×" | "÷" | null;

export const Calculator = () => {
  const [display, setDisplay] = useState("0");
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operator, setOperator] = useState<Operator>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);

  const inputNumber = (num: string) => {
    if (waitingForOperand) {
      setDisplay(num);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === "0" ? num : display + num);
    }
  };

  const inputDecimal = () => {
    if (waitingForOperand) {
      setDisplay("0.");
      setWaitingForOperand(false);
    } else if (display.indexOf(".") === -1) {
      setDisplay(display + ".");
    }
  };

  const clear = () => {
    setDisplay("0");
    setPreviousValue(null);
    setOperator(null);
    setWaitingForOperand(false);
  };

  const performOperation = (nextOperator: Operator) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (operator) {
      const currentValue = previousValue || 0;
      let newValue = currentValue;

      switch (operator) {
        case "+":
          newValue = currentValue + inputValue;
          break;
        case "-":
          newValue = currentValue - inputValue;
          break;
        case "×":
          newValue = currentValue * inputValue;
          break;
        case "÷":
          newValue = currentValue / inputValue;
          break;
      }

      setDisplay(String(newValue));
      setPreviousValue(newValue);
    }

    setWaitingForOperand(true);
    setOperator(nextOperator);
  };

  const handleEquals = () => {
    const inputValue = parseFloat(display);

    if (previousValue !== null && operator) {
      let result = previousValue;

      switch (operator) {
        case "+":
          result = previousValue + inputValue;
          break;
        case "-":
          result = previousValue - inputValue;
          break;
        case "×":
          result = previousValue * inputValue;
          break;
        case "÷":
          result = previousValue / inputValue;
          break;
      }

      setDisplay(String(result));
      setPreviousValue(null);
      setOperator(null);
      setWaitingForOperand(true);
    }
  };

  return (
    <Card className="w-full max-w-sm p-6 bg-card border-border shadow-2xl">
      <div className="space-y-4">
        {/* Display */}
        <div className="bg-calc-display rounded-lg p-6 min-h-[80px] flex items-center justify-end">
          <div className="text-calc-display-text text-4xl font-light tracking-wider break-all text-right">
            {display}
          </div>
        </div>

        {/* Buttons Grid */}
        <div className="grid grid-cols-4 gap-3">
          {/* Row 1 */}
          <Button
            variant="special"
            size="lg"
            onClick={clear}
            className="col-span-3"
          >
            AC
          </Button>
          <Button
            variant="operator"
            size="lg"
            onClick={() => performOperation("÷")}
          >
            ÷
          </Button>

          {/* Row 2 */}
          <Button variant="number" size="lg" onClick={() => inputNumber("7")}>
            7
          </Button>
          <Button variant="number" size="lg" onClick={() => inputNumber("8")}>
            8
          </Button>
          <Button variant="number" size="lg" onClick={() => inputNumber("9")}>
            9
          </Button>
          <Button
            variant="operator"
            size="lg"
            onClick={() => performOperation("×")}
          >
            ×
          </Button>

          {/* Row 3 */}
          <Button variant="number" size="lg" onClick={() => inputNumber("4")}>
            4
          </Button>
          <Button variant="number" size="lg" onClick={() => inputNumber("5")}>
            5
          </Button>
          <Button variant="number" size="lg" onClick={() => inputNumber("6")}>
            6
          </Button>
          <Button
            variant="operator"
            size="lg"
            onClick={() => performOperation("-")}
          >
            −
          </Button>

          {/* Row 4 */}
          <Button variant="number" size="lg" onClick={() => inputNumber("1")}>
            1
          </Button>
          <Button variant="number" size="lg" onClick={() => inputNumber("2")}>
            2
          </Button>
          <Button variant="number" size="lg" onClick={() => inputNumber("3")}>
            3
          </Button>
          <Button
            variant="operator"
            size="lg"
            onClick={() => performOperation("+")}
          >
            +
          </Button>

          {/* Row 5 */}
          <Button
            variant="number"
            size="lg"
            onClick={() => inputNumber("0")}
            className="col-span-2"
          >
            0
          </Button>
          <Button variant="number" size="lg" onClick={inputDecimal}>
            .
          </Button>
          <Button variant="equals" size="lg" onClick={handleEquals}>
            =
          </Button>
        </div>
      </div>
    </Card>
  );
};
