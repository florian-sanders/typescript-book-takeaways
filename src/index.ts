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

type Doggo = "willow" | "sana";

type TestDoggo = "willowsana" extends Doggo ? true : false;

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

const myArrayy = ["red"];
myArrayy.push(true); // error because `myArray` is inferred as string[] (with `const` or `let`)

const myArrayyy: (string | boolean)[] = ["red"];
myArrayyy.push(true); // no error

const myImmutableArray: readonly string[] = ["toto", "tutu"];

myImmutableArray.push("tata"); // error
myImmutableArray[1] = "tata"; // error

const myTest = myArray[1] ? "yeah" : "nope"; // no error, TS knows that myArrayyy[1] is a boolean

let aT: [number] = [1];
let bT: [string, string, number] = ["malcolm", "gladwell", 1963];
bT = ["queen", "elizabeth", 1926]; // no error
bT = ["queen", "elizabeth", 1926, "toto"]; // error
bT = ["queen", "elizabeth", "toto"]; // error

function tooto() {
  let aa = []; // at this point typed as `any`
  aa.push(1); // now typed to number[]
  aa.push("x"); // now typed to (string|number)[]
  return aa; // (string|number)[]
}

class Pizza {
  addVegetable = () => "blabla";
}

addDeliciousVegetable(new Pizza());
addDeliciousVegetable(null); // error with strict null check
addDeliciousVegetable(null); // no error without strict null check

function addDeliciousVegetable(pizza: Pizza): string {
  return pizza.addVegetable();
}

enum Language {
  English, // inferred automatically as English = 0
  Spanish, // inferred automatically as Spanish = 1
}

enum Language {
  Russian = 2,
}

let myFirstLanguage = Language.Russian;

enum Color {
  Red = "#c100000",
  Blue = "#007ac1",
  Pink = 0xc100050, // Hexadecimal literal
  White = 255, // decimal literal
}

const myColor = Color.Green; // error
const myColor2 = Color[10]; // no error

const enum Color2 {
  Red = "#c100000",
  Blue = "#007ac1",
  Pink = 0xc100050, // Hexadecimal literal
  White = 255, // decimal literal
}

console.log(Color2.Red);

const myColor = Color2.Green; // error
const myColor2 = Color2[10]; // error
const myColor3 = Color2[0]; // error too, cannot access through index

function fancyDate(this: Date) {
  return `${this.getDate()}/${this.getMonth()}/${this.getFullYear()}`;
}

fancyDate(); // error at runtime
fancyDate.apply(new Date()); // to bind this and call the function at the same time (same but if we had arguments, we'd provide them as second param in an array)
const boundFancyDate = fancyDate.bind(new Date());
boundFancyDate(); // no error
