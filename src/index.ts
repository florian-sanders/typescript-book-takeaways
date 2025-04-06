console.log("Hello, TypeScript!");

// const a: any = 3;
// const b: any = true;
// const c = a + b; // 4 - inferred as any and no error

const a: unknown = 3;
const b: unknown = true;
if (typeof a === "number" && typeof b === "number") {
  const c = a + b; // no error
}

let myType = "toto"; // inferred as string

myType = 6; // throws an error, supposed to be a string

let myType2; // inferred as string
myType2 = "toto"; // inferred as string

myType2 = 6; // throws an error, supposed to be a string

let myType3: number | string = "toto";
myType3 = 6;

const test = myType3 + 5;

const toto = "toto"; // inferred as 'toto' and not just string
const myNumber = 3; // inferred as 3 and not any number
const myObject = { toto: "toto" }; // !!! inferred as { toto: string } because object properties may be reassigned at any point
const myArray = ["toto"];

myObject.tata = "tata"; // throw an error because `tata` is not part of the initial type
myArray.push("tata"); // no error because it's an array of string, not a tuple (will come back to this later);
