// Example 1: Basic JavaScript Syntax
function greet(name) {
    return "Hello, " + name + "!";
}
console.log(greet("World"));

// Example 2: Working with Arrays
let fruits = ["Apple", "Banana", "Cherry"];
fruits.push("Date");
console.log(fruits);

// Example 3: Using Objects
let person = {
    firstName: "John",
    lastName: "Doe",
    age: 30,
    fullName: function() {
        return this.firstName + " " + this.lastName;
    }
};
console.log(person.fullName());

// Example 4: Looping through an Array
for (let i = 0; i < fruits.length; i++) {
    console.log(fruits[i]);
}

// Example 5: Conditional Statements
let number = 10;
if (number > 5) {
    console.log("Number is greater than 5");
} else {
    console.log("Number is 5 or less");
}

// Example 6: Event Handling in the Browser
document.addEventListener('DOMContentLoaded', (event) => {
    document.getElementById('myButton').addEventListener('click', function() {
        alert('Button was clicked!');
    });
});

// Example 7: Working with Promises
let promise = new Promise((resolve, reject) => {
    let success = true;
    if (success) {
        resolve("Promise resolved successfully!");
    } else {
        reject("Promise rejected.");
    }
});

promise.then((message) => {
    console.log(message);
}).catch((message) => {
    console.log(message);
});

// Example 8: Using Async/Await
async function fetchData() {
    try {
        let response = await fetch('https://jsonplaceholder.typicode.com/posts/1');
        let data = await response.json();
        console.log(data);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}
fetchData();

// Example 9: Arrow Functions
let add = (a, b) => a + b;
console.log(add(5, 3));

// Example 10: Destructuring Assignment
let [firstFruit, secondFruit, ...restFruits] = fruits;
console.log(firstFruit); // Apple
console.log(secondFruit); // Banana
console.log(restFruits); // ["Cherry", "Date"]

// Example 11: Template Literals
let greeting = `Hello, ${person.firstName} ${person.lastName}! You are ${person.age} years old.`;
console.log(greeting);

// Example 12: Default Parameters
function multiply(a, b = 2) {
    return a * b;
}
console.log(multiply(5)); // 10
console.log(multiply(5, 3)); // 15