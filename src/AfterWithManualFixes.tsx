import React from 'react'

const getRandomNumber = (): number => Math.floor(Math.random() * 100);

// no-redundant-parentheses
const RedundantParentheses = (): JSX.Element => {
  let b;
  const a = b = 2;
  return <p>{a + b}</p>;
};

// cyclomatic-complexity
const CyclomaticComplexity = (): JSX.Element => <p>{String(getRandomNumber() <= 10)}</p>;

// function-inside-loop
const FunctionInsideLoop = (): JSX.Element => {
  const funs = [];
  for (let i = 0; i < 13; i++) {
    const scoped = +i;
    funs[i] = () => scoped;
  }
  return <p>{funs.map(f => f().toString()).join(',')}</p>;
};

// no-array-delete
const NoArrayDelete = (): JSX.Element => {
  const myArray = [1, 2, 3];
  myArray.splice(1, 1);
  return <p>{myArray[1] / myArray.length}</p>;
};

// prefer-type-guard
const PreferTypeGuard = (): JSX.Element => {
  interface Animal {
    name: string
  }
  interface Fish extends Animal {
    swim: () => any
  }
  function isFish(pet: Fish): pet is Fish {
    return (pet).swim !== undefined
  }
  const fish = { name: 'Shergar', swim: () => 'ok' };
  // isFish({ name: 'Shergar' }) fails to compile
  return <p>{String(isFish(fish))}</p>;
};

// elseif-without-else
const ElseIfWithoutElse = (): JSX.Element => {
  const random = getRandomNumber();
  if (random > 75) {
    return <p>75</p>;
  } else if (random > 50) {
    return <p>50</p>;
  } else {
    return <p>Other Number</p>;
  }
};

// no-identical-conditions
const NoIdentitcalConditions = (): JSX.Element => getRandomNumber() === 50 ? (<p>50</p>) : (<p>Not 50</p>);

// cognitive-complexity
const CognitiveComplexity = (): JSX.Element => {
  const random = getRandomNumber();
  return <p>{random <= 10 ? `I am ${random}` : 'I am greater than 10'}</p>;
};

// no-duplicate-string
const NoDuplicateString = (): JSX.Element => {
  const prefix = 'the month of';
  const [may, june, july] = ['may', 'june', 'july'].map((month) => `${prefix} ${month}`);
  return (
    <>
      In {may} we like gardening.
      In {june} we like swimming.
      In {july} we like hiking.
      In {prefix} august we like reading.
    </>
  );
};

// prefer-immediate-return
interface Time { hours: number, minutes: number, seconds: number }
const PreferImmediateReturn = ({ hours, minutes, seconds }: Time): JSX.Element => (
  <p>
    {((hours * 60 + minutes) * 60 + seconds) * 1000} milliseconds
  </p>
);

// render
const After = (): JSX.Element => (
  <div>
    <h1>no-redundant-parentheses</h1>
    <RedundantParentheses />
    <h1>cyclomatic-complexity</h1>
    <CyclomaticComplexity />
    <h1>function-inside-loop</h1>
    <FunctionInsideLoop />
    <h1>no-array-delete</h1>
    <NoArrayDelete />
    <h1>prefer-type-guard</h1>
    <PreferTypeGuard />
    <h1>elseif-without-else</h1>
    <ElseIfWithoutElse />
    <h1>no-identical-conditions</h1>
    <NoIdentitcalConditions />
    <h1>cognitive-complexity</h1>
    <CognitiveComplexity />
    <h1>no-duplicate-string</h1>
    <NoDuplicateString />
    <h1>prefer-immediate-return</h1>
    <PreferImmediateReturn hours={1} minutes={30} seconds={45} />
  </div>
);

export default After;
