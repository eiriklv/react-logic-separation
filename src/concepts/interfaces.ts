/**
 * Define a generic interface
 * for number operations with
 * a max of two operands
 */
interface NumberOperationWithTwoOperands {
  (a: number, b: number): number;
}

/**
 * Declare some specific implementations
 * using the full interface
 */
const sum: NumberOperationWithTwoOperands = (a, b) => a + b;
const multiply: NumberOperationWithTwoOperands = (a, b) => a * b;
const divide: NumberOperationWithTwoOperands = (a, b) => a / b;

/**
 * Using the implementations
 */
sum(2, 3); // 5
multiply(2, 3); // 6
divide(2, 3); // 0.667

/**
 * Declare some specific implementations
 * using a partial of the input arguments
 */
const add10: NumberOperationWithTwoOperands = (a) => a + 10;
const multiplyByTen: NumberOperationWithTwoOperands = (a) => a * 10;
const divideByTen: NumberOperationWithTwoOperands = (a) => a / 10;

/**
 * While the second argument is still required
 * by the interface, it is ignored by the implementation
 */
add10(2); // fails type check
add10(2, 3); // 12
multiplyByTen(2); // fails type check
multiplyByTen(2, 3); // 20
divideByTen(2); // fails type check
divideByTen(2, 3); // 0.2

/**
 * Declare some specific implementations
 * using none of the input arguments
 */
const zero: NumberOperationWithTwoOperands = () => 0;
const one: NumberOperationWithTwoOperands = () => 1;
const ten: NumberOperationWithTwoOperands = () => 10;

/**
 * While both arguments are still required
 * by the interface, both are ignored by the implementation
 */
zero(); // fails type check
zero(2, 3); // 0
one(); // fails type check
one(2, 3); // 1
ten(); // fails type check
ten(2, 3); // 10

/**
 * Let's declare a compound interface
 */
interface MathOperations {
  add: NumberOperationWithTwoOperands;
  double: NumberOperationWithTwoOperands;
  zero: NumberOperationWithTwoOperands;
}

/**
 * Creating an implementation using the compound type
 * where we deliberately have zero input arguments
 * for the implementations. This is completely valid.
 *
 * NOTE: This is usually how we implement mocks;
 * ignoring the input arguments and providing
 * a static return value matching the interface
 */
const math: MathOperations = {
  add: () => 5,
  double: () => 5,
  zero: () => 0,
};

/**
 * But it still requires two operands from the interface!
 */
math.add(); // fails type check
math.add(2, 3); // 5
math.double(); // fails type check
math.double(2, 3); // 4
math.zero(); // fails type check
math.zero(2, 3); // 0

/**
 * Let's declare some more interface,
 * which are subsets of the original interface
 */
interface NumberOperationWithOneOperand {
  (a: number): number;
}

interface NumberOperationNoOperands {
  (): number;
}

/**
 * Then let's declare some implementations
 * where we use one of each of the interfaces
 * - the original with two operands
 * - the new one with a single operand
 * - the new one with no operands
 */
const myAdd: NumberOperationWithTwoOperands = (a, b) => a + b;
const myDouble: NumberOperationWithOneOperand = (a) => a * 2;
const myZero: NumberOperationNoOperands = () => 0;

/**
 * Using the implementations, notice that because we're using
 * the appropriate subset for each implementation we no longer
 * have to provide extra operands that will just be discarded anyway
 */
myAdd(2, 3); // 5
myDouble(2); // 4
myZero(); // 0

/**
 * Let's declare an object containing this collection
 * but without tying it to a compound interface
 */
const myMathStuff = {
  add: myAdd,
  double: myDouble,
  zero: myZero,
};

/**
 * Using them through the object works just the same
 * as using the individually
 */
myMathStuff.add(2, 3);
myMathStuff.double(2);
myMathStuff.zero();

/**
 * Now let's declare another implementation
 * of the compound interface, where
 * we use the above implementation
 *
 * This is completely fine, because the
 * subset interfaces completely overlaps
 * with the original one with two operands
 *
 * You might look at it as our
 * object being cast into the compound type
 */
const otherMath: MathOperations = myMathStuff;

/**
 * But now it requires two operands to be passed for all of them
 * because through the compound interface they are all seen as
 * the original interface that requires two operands
 */
otherMath.add(2, 3); // 5
otherMath.double(2); // fails type check
otherMath.double(2, 3); // 4
otherMath.zero(); // fails type check
otherMath.zero(2, 3); // 0

/**
 * Now let's declare another compound interface,
 * which is narrower than the original one
 */
interface MyMathDependencies {
  add: (a: number, b: number) => number;
  double: (a: number) => number;
  zero: () => number;
}

/**
 * If we try to map the 'otherMath' object into this
 * new compound interface we won't be allowed to,
 * as that is a stricter interface than the one
 * declared above (not fully overlapping)
 */
const mathDependencies: MyMathDependencies = otherMath;

/**
 * But if we try to map the 'myMathStuff' object
 * into the same interface that's completely fine,
 * as it fully overlaps
 */
const otherMathDependencies: MyMathDependencies = myMathStuff;

/**
 * Use the methods through the compound interface
 */
otherMathDependencies.add(2, 3); // 5
otherMathDependencies.double(2); // 4
otherMathDependencies.zero(); // 0
