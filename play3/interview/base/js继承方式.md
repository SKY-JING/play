<div style="text-align: center; font-weight: 700; font-size: 2em;">js继承方式</div>

## 一、原型链继承

|label|content|
|:--:|:--|
|原理|让新实例的原型等于父类的实例|
|特点|实例可继承的属性有：实例的构造函数的属性/方法，父类构造函数属性/方法，父类原型的属性/方法。（新实例不会继承父类实例的属性！）|
|缺点|1、引用类型的属性被所有实例共享<br>2、在创建 Child 的实例时，不能向Parent传参|

```js
function Parent () {
  this.name = 'merlion'; // 构造函数属性
}

Parent.prototype.getName = function () { // 原型的方法
  console.log(this.name);
}

function Child () {}

Child.prototype = new Parent(); // 核心

var child1 = new Child(); // 创建实例

console.log(child1.getName()); // merlion
```

## 二、借用构造函数(经典继承)

|label|content|
|:--:|:--|
|原理|用.call()和.apply()将父类构造函数引入子类函数（在子类函数中做了父类函数的自执行（复制））|
|优点|1、避免了引用类型的属性被所有实例共享<br>2、可以在 Child 中向 Parent 传参|
|缺点|1、方法都在构造函数中定义，每次创建实例都会创建一遍方法（构造函数无法复用）。<br>2、只继承了父类构造函数的属性，没有继承父类原型的属性|

```js
function Parent () {
  this.names = ['merlion', 'jon'];
}

function Child () {
  Parent.call(this); // 核心
}

var child1 = new Child();

child1.names.push('yoyo');

console.log(child1.names); // ['merlion', 'jon', 'yoyo']

var child2 = new Child();

console.log(child2.names); // ['merlion', 'jon']
```

## 三、组合继承

|label|content|
|:--:|:--|
|原理|原型链继承和经典继承双剑合璧|
|优点|1、可以继承父类原型上的属性，可以传参，可复用。<br>2、每个新实例引入的构造函数属性是私有的。|
|缺点|调用了两次父类构造函数（耗内存），子类的构造函数会代替原型上的那个父类构造函数|

```js
function Parent (name) {
  this.name = name;
  this.colors = ['red', 'blue', 'green'];
}
 
Parent.prototype.getName = function () {
  console.log(this.name)
}
 
function Child (name, age) {
  Parent.call(this, name);
  this.age = age;
}
 
Child.prototype = new Parent();

var child1 = new Child('merlion', '18');

child1.colors.push('black');

console.log(child1.name); // merlion
console.log(child1.age); // 18
console.log(child1.colors); // ["red", "blue", "green", "black"]

var child2 = new Child('jon', '20');

console.log(child2.name); // jon
console.log(child2.age); // 20
console.log(child2.colors); // ["red", "blue", "green"]
```


## 四、原型式继承

|label|content|
|:--:|:--|
|原理|用一个函数包装一个对象，然后返回这个函数的调用，这个函数就变成了个可以随意增添属性的实例或对象。就是 ES5 Object.create 的模拟实现，将传入的对象作为创建的对象的原型。|
|特点|类似于复制一个对象，用函数来包装|
|缺点|1、所有实例都会继承原型上的属性。<br>2、无法实现复用。（新实例属性都是后面添加的）<br>3、包含引用类型的属性值始终都会共享相应的值，这点跟原型链继承一样。|

```js
function createObj (o) { // 核心
  function F () {}
  F.prototype = o;
  return new F();
}

var person = {
  name: 'merlion',
  friends: ['lili', 'jon']
}
 
var person1 = createObj(person);
var person2 = createObj(person);
 
person1.name = 'person1'; // 此处是给person1添加了 name 值，并非修改了原型上的 name 值。
console.log(person2.name); // merlion
 
person1.firends.push('haha'); // 引用类型属性
console.log(person2.friends); // ["lili", "jon", "haha"]
```

## 五、寄生式继承

|label|content|
|:--:|:--|
|原理|创建一个仅用于封装继承过程的函数，该函数在内部以某种形式来做增强对象，最后返回对象（就是给原型式继承外面套了个壳子）。|
|优点|没有创建自定义类型，因为只是套了个壳子返回对象，这个函数顺理成章就成了创建的新对象。|
|缺点|1、没用到原型，无法复用<br>2、跟借用构造函数模式一样，每次创建对象都会创建一遍方法。|

```js
function createObj (o) {
  var clone = object.create(o);
  clone.sayName = function () {
    console.log('hi');
  }
  return clone;
}
```

## 六、寄生组合式继承

|label|content|
|:--:|:--|
|原理|通过寄生式继承解决组合继承不足|
|优点|避免两次调用父类构造函数，引用类型最理想的继承范式。|

实现：
```js
function Parent (name) {
  this.name = name;
  this.colors = ['red', 'blue', 'green'];
}

Parent.prototype.getName = function () {
  console.log(this.name)
}

function Child (name, age) {
  Parent.call(this, name);
  this.age = age;
}

// 关键的三步
var F = function () {};

F.prototype = Parent.prototype;

Child.prototype = new F();

var child1 = new Child('kevin', '18');

console.log(child1);
```

封装：
```js
function object(o) {
  function F() {}
  F.prototype = o;
  return new F();
}

function prototype(child, parent) {
  var prototype = object(parent.prototype);
  prototype.constructor = child;
  child.prototype = prototype;
}

// 当我们使用的时候：
prototype(Child, Parent);
```