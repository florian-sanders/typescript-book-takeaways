# Notes

## Macro

### Lifecycle

- TypeScript
  1. Source Code (in TS) -> TypeScript AST
  2. AST checked by the typechecker
  3. TypeScript AST -> JavaScript Source (TypeScript Compiler)
- JavaScript
  1. JavaScript Source -> JavaScript AST
  2. JavaScript AST -> bytecode
  3. Bytecode evaluated by runtime

## Types

### Any

- Any = Last resort,
- No help from type checker,
- Means that you can easily make mistakes:

```ts
const a: any = 3;
const b: any = true;
const c = a + b; // 4 - inferred as any and no error
```

### Unknown

- A little bit more type safe than `any`,
- To be used when you cannot anticipate the type of something,
- Prevents you from making mistakes because TypeScript won't let you use the value without narrowing its type:

```ts
const a: unknown = 3;
const b: unknown = true;
const c = a + b; // error when type checking, won't compile - "a is of type 'unknown'" & "b is of type 'unknown'
```

You have to narrow the type:

```ts
const a: unknown = 3;
const b: unknown = true;
if (typeof a === "number" && typeof b === "number") {
  const c = a + b; // no error
}
```

- Contrary to `any`, TypeScript will never infer `unknown`,
- We need to annotate it.

### Objects

- TypeScript does `stuctural / duck typing` (as opposed to `nominal typing`) => we don't care about the name of the type but we care about its shape (its properties).
- There are many ways to type an object:
  - `object` (mind the capitalization): an object, with no specific shape, not `null`. **To be used when we don't really care about the shape** of the object and we don't plan on mutating / accessing its properties.
  - `{ property: type }` (object literal (!== type literal)): an object with this exact shape (can be an object OR a class as long as it matches the shape), **to be used in most cases where we can anticipate the shape**,
    - `{}`: !!! ideally **should never be used** or last resort since it means the shape is empty (better off using `object`),
    - if what we mean is an object with key names that cannot be anticipated: `{ [key: string]: ValueType }`,
  - `Object`: roughly the same as `{}` (subtle different about methods that can be assigned to it or not). !!! **should never be used**.

### Type literals

- Type literal = a type that represents a single **value**,
- Very few programming languages support this,
- Many types have literals,
- For instance:

```ts
// `true` & `false` are boolean literals
let totoTrue: true = true;
let totoFalse: false = false;
let myStringLiteral: 'toto' = 'toto';
let myNumberLiteral: 4 = 4;
let myObjectLiteral: { toto: 'toto' } = { toto: 'toto' };
...
```

### let typing behavior

- when using `let` with **no annotation**:
  - the type of the variable is inferred when the declaration & assignment are done at the same time:
```TS
let myType = 'toto'; // inferred as string
myType = 6; // throws an error, supposed to be a string
```

What if I don't assign the `let` variable directly?
The type is inferred as `any`.

```TS
let myType; // inferred as any
myType = 'toto';
myType = 6; // no error since any - bad for typesafety, prone to mistakes
```

So how do you handle a `let` variable that can be of different types?

You **annotate** it with the possible types:

```ts
let myType: string|number = 'toto';
myType = 6; // no error
myType = true; // error
```

What good does it do?

```ts
let myType: string|number = 'toto';
myType = 6; // no error
const myNumber = myType + 8; // myNumber inferred as number because TS knows that at this point, myType is of type number
```

### const typing behavior

- since `const` cannot be reassigned, the type is narrowed down to the maximum (but watch out, there are some legitimate limits).

```TS
const toto = "toto"; // inferred as 'toto' and not just string
const myNumber = 3; // inferred as 3 and not any number
const myObject = { toto: "toto" }; // !!! inferred as { toto: string } because object properties may be reassigned at any point
const myArray = ["toto"]; // inferred as string[], you could mutate the array in any way you want, as long as it's only made of strings

myObject.tata = "tata"; // throw an error because `tata` is not part of the initial type
myArray.push("tata"); // no error because it's an array of string, not a tuple (will come back to this later);
```

### Array

- Two syntaxes: Array<T> vs T[]
- Same in perf and meaning
- Easier to deal with homogeneous arrays:

```ts
const myArray = ['red'];
myArray.push(true); // error because `myArray` is inferred as string[] (with `const` or `let`)
```

To fix this, you would need to explicitely annotate:

```ts
const myArray: (string|boolean)[] = ['red'];
myArray.push(true); // no error
```

Special case & behavior:

```ts
function myFunction () { // inferred return type = (string|number)[]
  let aa = []; // at this point inferred as `any`
  aa.push(1); // now inferred to number[]
  aa.push("x"); // now inferred to (string|number)[]
  return aa; // (string|number)[]
}
```

#### Tuples

- Tuples = subtype of array
- Fixed length,
- Each array value is explicitely typed / annotated (no inferrence).

```ts
let a: [number] = [1];
let b: [string, string, number] = ['malcolm', 'gladwell', 1963];
b = ['queen', 'elizabeth', 1926] // no error
b = ['queen', 'elizabeth', 1926, 'toto'] // error
b = ['queen', 'elizabeth', 'toto'] // error
```

You can specify optional tuple members with `?` just like in objects:

```ts
let trainFares: Array<[number, number?]> = [
  [3.75],
  [8.25, 7.70],
  [10.50]
];
// alternative syntax
let trainFares: Array<[number]|[number, number]> = [
  [3.75],
  [8.25, 7.70],
  [10.50]
];
```

You can use rest elements (spread). It is convenient to specify a minimum length for the array for instance:

```ts
const friends: [string, ...string[]] = ['Sara', 'Tali', 'Chloe', 'Claire']; // array of at least one string
```

Tuples are useful for heterogenous lists because they capture each type + the minimum (if spreading) or exact length of the array, contrary to plain arrays:

```ts
let list: [number, boolean, ...string[]] = [1, false, 'a', 'b', 'c'];
```

### Immutability

- Use the `readonly` modifier,
- Two syntaxes: `readonly string[]` vs `Readonly<string[]>` (or `Readonly<Array<string>>`),
- Should probably be done for all reactive properties with non primitive values (objects & values).

```ts
const myImmutableArray: readonly string[] = ['toto', 'tutu'];

myImmutableArray.push('tata'); // error "push does not exist on type readonly string[]"
myImmutableArray[1] = 'tata'; // error "Index signature in type 'readonly string[]' only permits reading."
```

Note that this is just a type and it doesn't actually produce frozen objects / arrays when transpiled to JS.

### Union & Intersection

- `|` for union,
- `&` for intersection.

```TS
type Cat = {
  name: string;
  purrs: boolean;
};

type Dog = { name: string; barks: boolean; wags: boolean };

type CatOrDogOrBoth = Cat | Dog | { toto: "toto" }; // note that union doesn't necessarily mean one OR the other, it can be both at the same time

type CatAndDog = Cat & Dog; // common ground between Cat and Dog

let aCatOrDogOrBoth: CatOrDogOrBoth = { name: "bonkers", purrs: true };
aCatOrDogOrBoth = { name: "Domino", barks: true, wags: true }; // no error

aCatOrDogOrBoth = {
  name: "Dokners",
  barks: true,
  wags: true,
  purrs: true,
  toto: "toto",
}; // no error, it matches several shapes from the union (all of them combined actually)

aCatOrDogOrBoth = {
  toto: "toto",
}; // no error, it's one of the shapes provided in the union

let aCatAndDog: CatAndDog = {
  name: "same",
  barks: true,
  wags: true,
  purrs: true, // if you comment out one of these properties, you get an error
}; // what's the difference with the previous example? Here it needs to be both, we need to set properties of both cat and dog
// in the previous example, we only need to set all properties of a cat OR a dog (but we can set properties of both)
```

Why it can be both? Because TS only checks that my object matches at least one of the objects within the union type.

### null, undefined, void, and never

- Though we tend to use `null` and `undefined` interchangeably, there is a subtle difference (by convention mainly):
  - `undefined` = something hasn't been defined yet,
  - `null` = absence of value (you tried to compute a value but failed).
- TypeScript doesn't have an opinion about the differene between `null` & `undefined` but they are two different types,
- `void` = return type of a function that doesn't explicitely return anything,
  - though the book says return type of a function, it can actually be used in other contexts. The book means that this type is inferred in these contexts.
- `never` = return type for a function that never returns anything (either throws or runs forever),
  - though the book says return type of a function, it can actually be used in other contexts. The book means that this type is inferred in these contexts.

#### strictNullChecks

- `strictNullChecks: false` = same as old TypeScript versions,
- when it is set to `false` = `null` is a subtype of all types except `never`,
  - means that every type is nullable,
  - means you should check that value is not `null` yourself, without any help from TypeScript (no static analysis) to avoid runtime errors.
- should only be enabled to transition to a TS codebase but it is an unsafe option in the long run.

```ts
class Pizza {
  addVegetable = () => "blabla";
}

addDeliciousVegetable(new Pizza());
addDeliciousVegetable(null); // error with strict null check
addDeliciousVegetable(null); // no error without strict null check

function addDeliciousVegetable(pizza: Pizza): string {
  return pizza.addVegetable(); // will error at runtime if we pass a `null` pizza
}
```

### Enum

- Enum !== Union
- Unions can be extended while Enum cannot,
- Union is only a type (doesn't exist at runtime),
- Enum is transpiled to a JS value,
- Enum = unordered data structure that maps keys to values,
- You may refer to its keys or values,
- Enum ~= object with keys fixed at compile time,
- Naming convention: Capitalized & singular (keys are also capitalized)

```ts
enum Language {
  English, // inferred automatically as English = 0
  Spanish, // inferred automatically as Spanish = 1
  Russian, // inferred automatically as Russian = 2
}
```

To retrieve a value from an enum:

```ts
let myFirstLanguage = Language.Russian;
```

- Enums like interfaces are merged automatically:

```ts
enum Language {
  English = 0, // = 0 is not mandatory as it's automatically inferred
  Spanish = 1 // = 1 is not mandatory as it's automatically inferred
}

// in another file for instance someone consuming your lib types
enum Language {
  Russian = 2
}
```

TypeScript automatically computed the enum item value if it's not provided:

```ts
enum Language {
  English = 100,
  Spanish = 200 + 300,
  Russian // inferred as 501 (next number after 200+300)
}
```

Values don't have to be numbers:

```ts
enum Color {
  Red = '#c100000',
  Blue = '#007ac1',
  Pink = 0xc100050, // Hexadecimal literal
  White = 255 // decimal literal
}
```

#### typesafety errors related to enums

You may refer to the enum both by key index or the key itself but accessing through the key index can be unsafe in some cases like the previous example:

```ts
enum Color {
  Red = '#c100000',
  Blue = '#007ac1',
  Pink = 0xc100050, // Hexadecimal literal
  White = 255 // decimal literal
}

const myColor = Color.Green; // error
const myColor2 = Color[10]; // no error
```

We can opt for a safer enum by making the enum a `const`:

```ts
const enum Color {
  Red = '#c100000',
  Blue = '#007ac1',
  Pink = 0xc100050, // Hexadecimal literal
  White = 255 // decimal literal
}

const myColor = Color.Green; // error
const myColor2 = Color[10]; // error
const myColor3 = Color[0]; // error too, cannot access through index, can only be accessed through string literal index
```

when using `const` enums, TypeScript automatically inlines the values where the values are used.

For instance (generated through AI cause I didn't understand with the book example so I couldn't rephrase it myself):

```ts
// in ts
const enum Direction {
  Up = "UP",
  Down = "DOWN",
  Left = "LEFT",
  Right = "RIGHT"
}

const move = Direction.Up;

// in transpiled js
const move = "UP"; // The enum value is inlined directly
```

Notice that the `Direction` enum doesn't exist at runtime - it's completely erased from the output, unlike regular enums which generate a JavaScript object.

### The Problem with `const enum` in Distributed Packages (e.g., via npm)

This inlining behavior becomes problematic when you distribute your code as a library:

1.  **Breaking Changes & Stale Values**: If you publish a new version of your library with changed `const enum` values:

    ```typescript
    // my-lib version 1.0.0
    export const enum Status { Active = 1, Inactive = 0 }

    // my-lib version 2.0.0
    export const enum Status { Active = 10, Inactive = 0 } // Value for Active changed!
    ```

    A consumer might have code like this:

    ```typescript
    // consumer code (compiled with my-lib v1.0.0)
    import { Status } from 'my-lib';
    const currentStatus = Status.Active;
    console.log(currentStatus); // Compiles to: console.log(1);
    ```

    If the consumer updates `my-lib` to version 2.0.0 **but doesn't recompile their own code**, their compiled JavaScript still contains `console.log(1);`. However, if functions within `my-lib` v2.0.0 now expect `Status.Active` to be `10`, this mismatch will lead to runtime errors or unexpected behavior that is very hard to debug. The consumer's code has the *old* value hardcoded (inlined).

2.  **No Runtime Existence**: Since the enum is erased, consumers cannot reference the enum object at runtime (e.g., iterate over its keys/values).

3.  **Potential Build Tool Issues**: Different build tools or compiler settings (`--isolatedModules`) might handle `const enum` imports inconsistently.

### Best Practices for Libraries

To avoid these issues when publishing packages:

1.  **Use Regular Enums**: They generate JavaScript objects, ensuring consumers always reference the *current* values from your library at runtime.
    ```typescript
    // Prefer this for libraries
    export enum Status {
      Active = 1,
      Inactive = 0
    }
    ```

2.  **Use `--preserveConstEnums` Compiler Flag**: If you must use `const enum`, this flag tells TypeScript to generate the JavaScript object for the enum, similar to regular enums, preventing inlining. However, this might negate some potential performance benefits of `const enum`.

3.  **Use `as const` Objects**: Often a safer alternative, providing similar benefits without the inlining issues.
    ```typescript
    export const Status = {
      Active: 1,
      Inactive: 0
    } as const;
    export type Status = typeof Status[keyof typeof Status]; // Extract the type
    ```

4.  **Use String Literal Unions**: Simple and effective for predefined sets of string values.
    ```typescript
    export type Status = 'active' | 'inactive';
    ```

In summary, while `const enum` can offer minor bundle size reductions by inlining values, this optimization is generally unsafe for code intended for distribution, as it tightly couples the consumer's build process to the library's implementation details and can easily lead to version mismatches. Regular enums or alternatives like `as const` objects are usually preferred for public APIs.


#### Conclusion about enums

Do not use them unless you really need to but you probably don't need them anyway.

Note: if you use `erasableSyntaxOnly`, enums are disabled because they generate non standard JS code anyway

### Functions

#### Reminders

- Multiple syntaxes (just like in JS):
  - `function greet(name: string): string { ... }` = named function syntax,
  - `let greet = function(name: string): string { ... }` = function expression,
  - `let greet = (name: string) => { ... }` = arrow function expression,
  - `let greet = (name: string) => ...` = shorthand arrow function expression,
  - `let greet = new Function('name', 'return "hello" + name')` = should never be used. It's an object that callable + methods from the `Function` prototype. But it says nothing about the params and return types. This makes it unsafe since params & return type are specifically what we want to type within functions.
- Parameter = piece of data that a function needs to run. Declared as part of the a function declaration = AKA formal parameter,
- Argument = piece of data passed to a function when invoking it = AKA actual parameter.
- Return type is inferred automatically by TypeScript so the annotation is optional.
- When invoking a function, you don't annotate the arguments, TS will check if their type matches the ones required by the function params:

```TS
add(1, 3) // no need to annotate + no error since add declared 2 params with type number
greet('Willow') // no need to annoated + no error since greet declared 1 param with type string
add(1) // error because 1 argument is missing
greet(1, 'a') // error because first param is of type number instead of string
```

#### Optional & default params

- `?` to mark param as optional,
- Required params must come first,
- Providing a default value for a param is essentially the same as making it optional but there's a difference:
  - params with default values may come before required params
- If you provide a default value, you don't have to annotate with `?`, optional is implied by the default value presence.

```TS
// optional with no default value
function log(message: string, userId?: string) {
  ...
}
// cannot come first
function log(userId?: string, message: string) { // !!! error
  ...
}
// with a default value
function log(message: string, userId = 'Not signed in') {
  ...
}
// optional with default value may come first
function log(userId = 'Not signed in', message: string) { // no error
  ...
}
```

#### Rest parameters

- If list of params, then you can type as `array`

```TS
function sum(numbers: number[]): number { ... }
```

- Variadic function API = takes a variable number of arguments

```TS
function sumVariadic(): number {
  return Array.from(arguments).reduce((total, n) => total + n, 0);
}
```

!!! `arguments` is totally unsafe. In the example above, `n` is typed as `any`.

TS will throw an error when calling `sumVariadic`:

```TS
sumVariadic(1, 2, 3); // error: Expected 0 arguments, but got 3
```

Since the function signature lists no arguments, TS expects us to provide no arguments.

How do we type variadic functions then? => Rest parameters

```TS
function sumVariadicSafe(...numbers: number[]): number {
  return numbers.reduce((total, n) => total + n, 0);
}

sumVariadic(1, 2, 3); // no error
```

Rules about Rest params:

- at most 1 rest parameter by function,
- must be the last param.

Example of how `console.log` is typed:

```TS
interface Console {
  log(message?: any, ...optionalParams: any[]): void;
}
```

#### Typing `this` (function context)

- if function uses `this`, declare & annotate it as a param:

```TS
function fancyDate(this: Date) {
  return `${this.getDate()}/${this.getMonth()}/${this.getFullYear()}`;
}

fancyDate() // error at compile time & at runtime because this is not bound
fancyDate.call(new Date); // to bind this and call the function at the same time
fancyDate.apply(new Date); // to bind this and call the function at the same time (same but if we had arguments, we'd provide them as second param in an array)
const boundFancyDate = fancyDate.bind(new Date);
boundFancyDate(); // no error
```

These errors are related to `noImplicitThis` that is set to `true` when using `strict: true` in tsconfig.

#### Generator functions

- generate values,
- Lazy (compute value when a consumer asks for it),
- Specifically useful for infinite lists.

```TS
function* createFibonacciGenerator() {
  let a = 0;
  let b = 1;
  while (true) {
    yield a;
    [a, b] = [b, a + b];
  }
}

let fibonacciGenerator = createFibonacciGenerator(); // IterableIterator<number>
fibonacciGenerator.next(); // { value: 0, done: false }
fibonacciGenerator.next(); // { value: 1, done: false }
fibonacciGenerator.next(); // { value: 1, done: false }
fibonacciGenerator.next(); // { value: 2, done: false }
fibonacciGenerator.next(); // { value: 3, done: false }
fibonacciGenerator.next(); // { value: 5, done: false }
```

- `yield` = the result given to each `next()` call
- TS automatically infers `IterableIterator<number>` for the generator function but you may annotate it yourself

```TS
function* createNumber(): IterableIterator<number> {
  let n = 0;
  while(true) {
    yield n++;
  }
}
```

Terminology:
- `iterable` = any object that contains a property called `Symbol.iterator`, whose value is a function that returns an iterator.
- `iterator` = any object that defined a method called next, which returns an object with the properties `value` and `done`.

When creating a generator (for instance calling `createFibonacciGenerator`):
- get a value that's both `iterable` and `iterator` because it defines a `Symbole.iterator` property & a `next` method.

Manual creation:

```TS
let number = {
  *[Symbol.iterator]() {
    for (let n = 1; n <= 10; n++) {
      yield n;
    }
  }
}
```

Note: Didn't understand iterable vs iterator, will need to go back to this later on but not really a TS subject anyway.
