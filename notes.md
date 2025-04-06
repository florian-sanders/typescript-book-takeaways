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
