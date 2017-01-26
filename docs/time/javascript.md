# Javascript

miTime scripts are written using JavaScript; [JavaScript](http://en.wikipedia.org/wiki/JavaScript) is a programming language used by browsers (like Internet Explorer, Chrome or Safari). miTime's scripts do not require you to program any JavaScript but you should have a basic grasp of the basic syntax before we go on. If you know some basic JavaScript you can skip this section and go directly to the Hello world tutorial.

The fundamental building blocks of javascript expressions are variables and literals (more details [here](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Values,_variables,_and_literals)).

Variables store information. Each variable stores one or a few different values.

### Value types
There are several types of values recognized by JavaScript.

Type				| Examples
------------------- | --------
Numbers				| 42, 3.13
String				| "Howdy", '' // a string is always wrapped in single or double parenthesis
Logical (Boolean)	| true, false
Array				| `[]`, `[1,3,5]`
Object				| `{}`, `{a:12, b:"twelve"}` // An object has named properties, the second instance here has two properties: `a` and `b`.
Function			| `function(){console.log('Howdy')}`

### Variables
Variables are symbolic names for values in your script. You can define variables using the keyword `var`; for example `var x=42` sets the value 42 into the variable `x`. Any time you want to refer to the value stored in a variable you can refer to the variable name instead. This is useful if you want to define a value at one point in your script and reuse it again and again.

```javascript
// Define variable
var x = 17
console.log(x)		// prints 17 into the browser's console.

// change variable value
x = 343
console.log(x)		// prints 343
```

Notice that the first time we created the variable `x`, we had to use the word `var`. Then, when we referred to that variable again, we did not use `var` anymore. You can create each variable only once in your code. You can create the variable at any point in your file. However, you can't use the variable until you created it. So, setting 343 into x before you created it won't work. 

### Comments
Comments are a way to keep your code documented. You will probably not remember what you were trying to do a week after you wrote a piece of code. So make sure to document everything. Further, if you document your code, others can use it, or help you find errors.

JavaScript has two types of comments; block comments and single line comments:

```javascript
// a short, single-line comment
console.log(123) // one line comments can come at the end of a line of script too

/* this is a long, multi-line comment
	 about my script. So I am using 
	 the syntax for a block comment. */
```

### Array literals
Arrays are ordered lists of values, their elements may be any value types (including other arrays). When you create the array, you can assign the elements within the array with commas (learn [more](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)).

```javascript
// Define arr
var arr = [1,3,5,7,11]

// Access arr elements
console.log(arr[0])			// prints 1
console.log(arr[3])			// prints 7
```

Arrays have cells. To refer to one value in the array, we use the value's cell index inside []. 

### Object literals
Object literals are a structure of variables. The structure is a list of property names and associated values. Like arrays, objects group of few variables together. However, in objects, each value has a name (rather than a cell number). For instance, you can think of a person as an object with many different properties. The person has a name, a family name, age, weight, and more. 

```javascript
// Define an object named person.
var person = {name: 'John Ridley', family:'Stroop', age:33, weight:{lbs:150, kg:68}} 
//This object has four variables in it. The weight variable is an object inside an object.

// Here are the two main methods to refer to the object's properties
console.log(person.name)		// prints 'John Ridley'
console.log(person['family'])		// prints 'Stroop'
console.log(person.weight.kg)		// prints '68'
```

The property name and values are separated using a colon `:`, pairs are separated using a semicolon `;`. Object property names can be any string (=text), number, array, or object. The properties are accessed either using brackets `obj['propertyName']` or using dot(.) notation `obj.propertyName`.

### Functions
Functions are one of the fundamental building blocks in JavaScript. A function is a JavaScript procedure—a set of statements that perform a task or calculate a value.

For example, the following code defines a simple function named square:

```javascript
function square(number) {
	return number * number;
}
```
This function accepts a number as an argument and then returns its square.

A function definition consists of the `function` keyword followed by:

* The name of the function (optional).
* A list of arguments to the function, enclosed in parentheses and separated by commas.
* The JavaScript statements that define the function, enclosed in curly braces, `{}`.

Functions in JavaScript are a special type of object. This means that they can be stored as variables and passed as arguments. In order to activate the procedure stored within a function you use parenthesis notation `functionName(arguments)`, using the function previously defined:

```javascript
console.log(square)				// prints the square function
console.log(square(9))			// prints 81
```

(learn more [here](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Functions)).

### Errors and debugging
When developing miTime scripts things don't always go as expected. Sometimes you might make a syntactical error, sometime you might misspell a miTime keyword. The browser always logs these errors and it is useful to see them. All modern browsers have a console that allows you to see the errors (if you are using firefox you should check out [firebug](https://getfirebug.com/)). Most browsers use `F12` as a shortcut for displaying the console. If that doesn't work for you search your browsers menus: look for a **Web Developer** or **Developer Tools** menu under tools or options.

In case your script does not load, or freezes at a certain point, open your console and see if you have any errors.

The [local server](install.html) gives you an additional, extremely powerful, tool. It uses [jshint](http://jshint.com/) to evaluate your code and can often point out syntax errors that are difficult to recognize.
