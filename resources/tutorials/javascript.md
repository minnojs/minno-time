## JavaScript
PIP scripts are written using JavaScript; [JavaScript](http://en.wikipedia.org/wiki/JavaScript) is a programing language that can be run by browsers (like Internet Explorer, Chrome or Safari). The PIP scripts do not require you to program any JavaScript but you should have a basic grasp of the basic syntax before we go on. If you know some basic JavaScript you can skip this section and go directly to the Hello world tutorial.

The fundumental building blocks of javascript expressions are variables and literals (thirsty for [more](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Values,_variables,_and_literals)?).

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
Variables are symbolic names for values in your script. You can define variables using the keyword `var`; for example `var x=42` sets the value 42 into the variable `x`. Any time you want to refer to the value stored in a variable you can refer to the variable name instead. This can be extremely useful if you want to define a value at one point in your script and reuse it again and again (it has many other uses too of course...).

```js
// Define variable
var x = 17
console.log(x)		// prints 17

// change variable value
x = 343
console.log(x)		// prints 343
```

### Comments
Comments are a way to keep your code documented (here is a tip for free - you will probably not remember what you were trying to do a week after you write a piece of code. Document everything!!).

JavaScript has two types of comments; block comments and single line comments:

```js
// a short, single-line comment
console.log(123) // one line comments can come at the end of a line of script too

/* this is a long, multi-line comment
	 about my script. May it one day
	 be great. */
```


### Array literals
Arrays are ordered lists of values, their elements may be any value types (including other arrays). Note that the elements within an array are separated with commas (learn [more](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)!.

```js
// Define arr
var arr = [1,3,5,7,11]

// Access arr elements
console.log(arr[0])			// prints 1
console.log(arr[3])			// prints 7
```

### Object literals
Object literals are lists of zero or more pairs of property names and associated values of an object, enclosed in curly braces (`{}`). The property name and values are separated using a colon `:`, subsequent pairs are separated using a semicolon `;`. Object property names can be any string, and can be accessed either using brackets `obj['propertyName']` or using dot(.) notation `obj.propertyName`.

```js
// Define obj
var obj = {name: 'John Ridley', family:'Stroop'}

// Access obj properties
console.log(obj.name)			// prints 'John Ridley'
console.log(obj['family'])		// prints 'Stroop'
```

### Functions
Functions are one of the fundamental building blocks in JavaScript. A function is a JavaScript procedure—a set of statements that performs a task or calculates a value.

A function definition consists of the `function` keyword followed by:

* The name of the function (optional).
* A list of arguments to the function, enclosed in parentheses and separated by commas.
* The JavaScript statements that define the function, enclosed in curly braces, `{}`.

For example, the following code defines a simple function named square:

```js
function square(number) {
	return number * number;
}
```

Functions in JavaScript are a special type of object, this means that they can be stored as variables and passed as arguments. In order to activate the procedure stored within a function you use parenthesis notation `functionName(arguments)`, using the function previously defined:

```js
console.log(square)				// prints the square function
console.log(square(9))			// prints 81
```

(there is plenty [more](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Functions)!).

### Errors and debugging
When developing PIP scripts things don't always go as expected. Sometimes you might make an syntactical error, sometime you might misspell a PIP keyword. The browser always logs these errors and it can many times be useful to see them. All modern browsers have a console that allows you to see any errors that happens (if you are using firefox you should check out [firebug](https://getfirebug.com/)). Most browsers use `F12` as a shortcut that displays the console, if that doesn't work for you check out your browsers menus, you should be looking for a **Web Developer** or **Developer Tools** menu under tools or options.

In case your script does not load, or gets stuck in the middle, open your console and see if you have any errors.

The [local server](install.md) gives you an additional, extremely powerful, tool. It uses [jshint](http://jshint.com/) to evaluate your code and can many time point out syntax errors that are difficult to recognize.