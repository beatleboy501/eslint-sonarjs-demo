# ESLint + SonarJS Plugin: Name a more iconic duo, I'll wait

## Automated training wheels for writing the best code of your life in JavaScript or Typescript

As software engineers we always insist on the highest standards which is why we are constantly on the lookout for guardrails that keep our code running smoothly.  Having used ESLint with the SonarJS plugin successfully on consulting engagements in the past, I strongly feel it can improve the quality of any JS/TS code. The tangible results one could expect to see are reduced code review times, fewer bug tickets, less time spent on tech debt, and more time spent working on new features. If you are not familiar with these two entities I will provide a quick rundown.

ESLint is a popular linting tool that can be used to identify and fix potential issues in your code, such as syntax errors, style inconsistencies, and logical bugs. By integrating ESLint into your Typescript app, you can ensure that your code adheres to a consistent style and follows best practices, which can make it easier to maintain and debug. Additionally, using ESLint can help catch errors early on in the development process, which can save time and effort in the long run. See this post on adding ESLint to your project.

The eslint-plugin-sonarjs package is open-source with a LGPL-3.0 license, actively maintained by 29 contributors, and has 868 stars on GitHub as of February 2023. It provides additional rules for detecting and preventing common coding issues. These rules are based on the SonarQube static code analysis platform and can help identify potential security vulnerabilities, performance bottlenecks, and logical bugs in your code. By using eslint-plugin-sonarjs in conjunction with ESLint, you can gain an even deeper understanding of your code's quality and potential issues, which can help you create more robust and maintainable applications. So with that in mind let's run through how to configure these the ESLint tool with the SonarJS plugin for a demo React application.

### Configuration

Install using this command `npm i -D eslint-plugin-sonarjs`. Some additional rule definitions you may want to include can be imported using: npm i -D @typescript-eslint/parser eslint-config-airbnb eslint-config-airbnb-typescript eslint-plugin-jsx-a11y eslint-plugin-react-hooks. Let's say you have an existing .eslintrc.js file where you can add the following:
Change your "extends" array to `['plugin:react/recommended', 'standard-with-typescript', 'airbnb-typescript', 'plugin:sonarjs/recommended', 'react-app']`
For parser put `'@typescript-eslint/parser'`
Add `'react', '@typescript-eslint', 'sonarjs'` to the `"plugins"` array
Add `'tsconfig.json'` as `parserOptions.project`
In the `"rules"` object incrementally add the rules we want to include in our scans. The syntax is the same as any existing ESLint rules, ex. "<rule name>": "[<off | warn | error>, <...options>] OR [<0 | 1 | 2>, <...options>]" .
Run npm run lint (or whatever your lint command is) from the command line to see the output of the scan
(Optionally) Run the scan as a pre-commit check automatically (i.e. through a git hook) or on-demand

### Usage

For an existing code base, it wouldn't be practical to add the error severity for new rules all at once. Instead you should either temporarily ignore or add the warn severity for these new rules introduced by SonarJS. I've split the  rules up into three categories: Recommended, Bug Detection, and Code Smell Detection.
Recommended Rules
The plugin exposes to ESLint users a subset of JS/TS rules from SonarJS. SonarJS has around 280 JavaScript and TypeScript rules based on pattern matching and control flow analysis. It includes support for mainstream JS/TS frameworks (React and Vue) and styling frameworks (CSS, SCSS, Less, and CSS-in-JS). It would be crazy to give an overview of all the rules, so I'll just give a quick explanation of some of my favorites.
cyclomatic-complexity
Cyclomatic complexity is the measure of how hard to your code is to test. Take the following for example:

~~~ts
function getMonth(x: number): string {
    if (a === 1) {
        return 'January';
    } else if (a === 2) {
        return 'February';
    } else if (a === 3) {
        return 'March';
    }

    ...

    else {
        return 'Error'; // 13th Path
    }
}
~~~

If you set the max property to 10 for complexity in your .eslintrc config, this would fail the check. If you are trying to unit test this you would have cover 13 different branching statements to achieve full coverage. If you try replacing it with something like the following.

~~~ts
function getMonth(x: number): string {
  const numbersToNames = { 1: 'January', 2: 'February', 3: 'March', ... };
  return numbersToNames[x] ?? 'Error';
}
~~~

or similarly with an array. You save yourself a lot of headache because the code no longer relies on if-else statements. Bugs that could appear as a  result of extra code within the if-else block or a missed return statement are mitigated because with a hash map or an array, either it has the entry or it doesn't.
no-loop-func
This is a basic JS closure trick that comes up often in interviews. Take the following code for example:

~~~ts
var funs = [];
for (var i = 0; i < 13; i++) {
  funs[i] = function() {
    return i;
  };
}
console.log(funs[0]());
console.log(funs[1]());
console.log(funs[2]());
console.log(funs[3]());
~~~

What do you think the output will be? If you answered 0, 1, 2, 3… then you might want to think again. To be fair using let  or const would mitigate the issue with this code. It's still best practice to not declare functions inside a loop because it gets even trickier once you add async behavior into the mix. Now, see if you can figure out the following code:

~~~ts
let foo = 0;
for (let i = 0; i < 10; ++i) {
    setTimeout(() => console.log(foo), 1000);
    foo += 1;
}
foo = 100;
~~~

Congratulations, you have a very useful utility function that can print the number 100 ten times in a row. The no-loop-func rule can also detect dangerous references inside a loop in addition to function declarations inside a loop.
no-array-delete
This one doesn't need a whole lot of explanation, just prohibits you from using the delete keyword in JS. Simply put, if you are going to remove an item from an array, it's best not to leave an undefined in its place afterwards. This is what a non-compliant block looks like:

~~~ts
const myArray = ['a', 'b', 'c', 'd'];
delete myArray[2];  // Noncompliant. myArray => ['a', 'b', undefined, 'd']
console.log(myArray[2]); // expected value was 'd' but output is undefined
~~~

And this is what a compliant block looks like:

~~~ts
const myArray = ['a', 'b', 'c', 'd'];
// removes 1 element from index 2
removed = myArray.splice(2, 1);  // myArray => ['a', 'b', 'd']
console.log(myArray[2]); // outputs 'd'
~~~

elseif-without-else
elseif-without-else
if() {} elseIf() {} -> if() {} elseIf() {} else {}
Bug Detection Rules
There are ten bug detection rules available. I won't list all of them here but you can head over to the repo README to see the full list. However, here is a brief explanation of my top three rules.
no-identical-conditions
Related "if/else if" statements should not have the same condition. At best, it's simply dead code and at worst, it's a bug that is likely to introduce bugs as the code is extended, and obviously could lead to unintended behavior. Sometimes they are easy to spot such as in this code:

~~~ts
  const random = Math.floor(Math.random() * 100);
  if (random === 50) {
    return <p>50</p>;
  } else if (random > 49 && random < 51) {
    return <p>50</p>;
  } else {
    return <p>50</p>;
  }
~~~

However if we were to continue building on this and introduce more variables it gets harder to track. By checking for repeated conditions we keep the code trim and easier to read:

~~~ts
return Math.floor(Math.random() * 100) === 50 ? (<p>50</p>) : (<p>Not 50</p>);
~~~

no-all-duplicated-branches
This rule is similar to no-identical-conditions except it prevents the logic gated by the condition from being duplicated. Sometimes duplicated branches are easy to miss, especially when you are refactoring existing code:

~~~ts
if (variable === true) {
  getValue();
} else { 
  getValue(); // Noncompliant
}
~~~

Obviously you don't want the same thing to happen in both cases so this rule helps you out by catching instances of
Code Smell Rules
no-identical-functions
I've seen this happen often with custom React hooks in a repo. Having a check for functions with  identical logic ensures you reuse existing code like you're supposed to.
cognitive-complexity
Unlike cyclomatic complexity which we discussed earlier, cognitive complexity refers to how easy or difficult it is for a person to understand and reason about your code. Code with a high cognitive complexity is often harder to understand and maintain, while code with a lower cognitive complexity is easier to understand and work with. Factors that can contribute to cognitive complexity include:

- nested loops
- nested conditionals
- number of variables
- number of functions
- the overall structure of the code

It can also be affected by the readability of the code and the use of meaningful variable and function names. Take the following code for example:

~~~ts
const CognitiveComplexity = (): JSX.Element => {
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
~~~

Of course this kind of code is an exaggeration but there are plenty of instances in legacy code where the if-else statement is a mile long. It can easily be simplified to read like the following:

~~~ts
const CognitiveComplexity = (): JSX.Element => {
  const random = getRandomNumber();
  return <p>{random <= 10 ? `I am ${random}` : 'I am greater than 10'}</p>;
};
~~~

As you start to break up monolithic components and functions you begin to realize that the code naturally becomes more extensible and less repetitive. You can easily reuse the smaller components and functions because they focus on executing an atomic task.

no-duplicate-string
On the surface, cleaning up repetitive string literals by declaring and reusing a constant may seem like a nit picky comment to leave on someone's pull request. You must consider that maybe that string literal will need to be updated one day and it would be much easier to update one constant rather than multiple occurrences, possibly across multiple files.
prefer-immediate-return
Much like this article you're reading now, no one likes to read more than they have to. So remember, code like this:

~~~ts
const longWindedFunction = () => {
  const resultString = 'result';
  return resultString;
};
const unnecessaryUseOfCharacters = () => {
  return {
    foo: 'bar',
  };
};
~~~

Can always be reduced down to this:

~~~ts
const longWindedFunction = () => 'result';
const unnecessaryUseOfCharacters = () => ({ foo: 'bar' });
~~~

### Demo Time

If you want to follow along you can start by cloning this repo. It already has eslint and the SonarJS plugin configured. Start by opening src/Before.tsx in your IDE. There are a number of issues in these components which we will fix using the linter. From your CLI in the root directory run npm run lint you should see some output like the following.
OutputOpen your src/AfterWithAutomatedFixes.tsx file to see how different the code looks now. A lot of improvements, but as you saw in the console, there is still some work to be done.
Once you get a hang of it you can keep reducing functions and components to their lowest common denominator. Before long you are achieving the same functionality with fewer lines of code. In this case we eliminate 70 lines of code after applying the automated and manual fixes from ESLint and SonarJS.
