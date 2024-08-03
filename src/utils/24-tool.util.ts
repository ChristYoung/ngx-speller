type Operator = '+' | '-' | '*' | '/';

export interface ResultOf24 {
  success: boolean;
  expression: string;
}

export function compute(
  a: number,
  b: number,
  operator: Operator
): number | null {
  switch (operator) {
    case '+':
      return a + b;
    case '-':
      return a - b;
    case '*':
      return a * b;
    case '/':
      return b !== 0 ? a / b : null;
    default:
      return null;
  }
}

export function canReach24(numbers: number[]): ResultOf24 {
  if (numbers.length === 1) {
    if (Math.abs(numbers[0] - 24) < 1e-6) {
      return { success: true, expression: numbers[0].toString() };
    }
    return { success: false, expression: '' };
  }

  for (let i = 0; i < numbers.length; i++) {
    for (let j = 0; j < numbers.length; j++) {
      if (i !== j) {
        let remaining = numbers.filter(
          (_, index) => index !== i && index !== j
        );

        for (const operator of ['+', '-', '*', '/'] as Operator[]) {
          const result = compute(numbers[i], numbers[j], operator);
          if (result !== null) {
            const expression = `(${numbers[i]} ${operator} ${numbers[j]})`;
            const nextStep = canReach24([...remaining, result]);
            if (nextStep.success) {
              return {
                success: true,
                expression: `${expression} => ${nextStep.expression}`,
              };
            }
          }
        }
      }
    }
  }

  return { success: false, expression: '' };
}
