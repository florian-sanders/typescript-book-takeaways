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

let myObj: object = {
  a: "toto",
};

myObj.a = "toto";

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

type Toto = "toto" | "tata" | "tutu";

const obj: { [key: string]: any } = {};
