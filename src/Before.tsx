import React from 'react';

// no-redundant-parentheses
const RedundantParentheses = () => {
  let a, b;
  a = b = 2;
  return <p>{((a + b))}</p>;
};

// cyclomatic-complexity
const CyclomaticComplexity = () => {
  const random = Math.floor(Math.random() * 100);
  const cyclomatic = (random === 1) || (random === 2) || (random === 3) || (random === 4) || (random === 5) || (random === 6) || (random === 7) || (random === 8) || (random === 9) || (random === 10);
  return <p>{cyclomatic}</p>;
};

// function-inside-loop
const FunctionInsideLoop = () => {
  const funs = [];
  for (var i = 0; i < 13; i++) {
    funs[i] = () => i;
  }
  return <p>{funs.map(f => f().toString()).join(',')}</p>;
};

// no-array-delete
const NoArrayDelete = () => {
  const myArray = [1, 2, 3];
  delete myArray[1];
  const undef = myArray[1];
  const myArrayLen = myArray.length;
  const noArrayDel = undef / myArrayLen;
  return <p>{noArrayDel}</p>;
};

// prefer-type-guard
const PreferTypeGuard = () => {
  interface Animal {
    name: string
  }
  interface Fish extends Animal {
    swim: () => any
  }
  function isFish(animal: Animal): boolean {
    return (animal as Fish).swim !== undefined;
  }
  return <p>{isFish({ name: 'Shergar' })}</p>;
};
// elseif-without-else
const ElseIfWithoutElse = () => {
  const random = Math.floor(Math.random() * 100);
  if (random > 75) {
    return <p>75</p>;
  } else if (random > 50) {
    return <p>50</p>;
  };
};

// no-identical-conditions
const NoIdentitcalConditions = () => {
  const random = Math.floor(Math.random() * 100);
  if (random === 50) {
    return <p>50</p>;
  } else if (random > 49 && random < 51) {
    return <p>50</p>;
  } else {
    return <p>50</p>;
  }
};

// cognitive-complexity
const CognitiveComplexity = () => {
  const random = Math.floor(Math.random() * 100);
  const getText = () => {
    if (random === 1) {
      return 'I am 1';
    } else if (random === 2) {
      return 'I am 2';
    } else if (random === 3) {
      return 'I am 3';
    } else if (random === 4) {
      return 'I am 4';
    } else if (random === 5) {
      return 'I am 5';
    } else if (random === 6) {
      return 'I am 6';
    } else if (random === 7) {
      return 'I am 7';
    } else if (random === 8) {
      return 'I am 8';
    } else if (random === 9) {
      return 'I am 9';
    } else if (random === 10) {
      return 'I am 10';
    } else {
      return 'I am greater than 10';
    }
  };
  return <p>{getText()}</p>;
};

const CognitiveComplexityTwo = () => {
  const randomThing1 = Math.floor(Math.random() * 100) > 50;
  const randomThing2 = Math.floor(Math.random() * 100) > 50;
  const randomThing3 = Math.floor(Math.random() * 100) > 50;
  if (randomThing1) {
    return (
      <div>

      </div>
    );
  } else if (randomThing2 && randomThing3) {
    return (
      <div>
        <p></p>
      </div>
    );
  } else if (!randomThing2 && randomThing3) {
    return (
      <div>
        <p></p>
      </div>
    );
  }  else if (randomThing2 && !randomThing3) {
    return (
      <div>
        <p></p>
      </div>
    );
  } else {
    const now = Date.now().toString();
    if (Number.parseInt(now.split('')[now.length - 1], 10) % 2 === 0) {
      return <p>{}</p>
    } else {
      return <p></p>
    }
  }
};

// no-duplicate-string
const NoDuplicateString = (): JSX.Element => {
  const june = 'the month of' + 'june';
  const july = 'the month of' + 'july';
  return (
    <>
      In {'the month of'} {'may'} we like gardening.
      In {june} we like swimming.
      In {july} we like hiking.
      In {'the month of'} august we like reading.
    </>
  );
};

// prefer-immediate-return
const PreferImmediateReturn = ({ hours, minutes, seconds }: { hours: number, minutes: number, seconds: number }) => {
  const duration = <p>{((hours * 60 + minutes) * 60 + seconds) * 1000} milliseconds</p>;
  return duration;
};

// render
const Before = () => (
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

export default Before;
