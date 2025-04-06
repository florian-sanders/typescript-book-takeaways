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
###
