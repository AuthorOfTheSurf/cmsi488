
[![KobraScript Logo](https://raw.githubusercontent.com/AuthorOfTheSurf/KobraScript/master/ks-logo.jpg)](https://github.com/AuthorOfTheSurf/KobraScript)
![Travis.CI build status](https://travis-ci.org/AuthorOfTheSurf/KobraScript.svg?branch=development)

KobraScript is a language that harvests the power of JavaScript with an incredibly intuitive syntax.

## Install
You can install KobraScript into your global environment so that you can execute KobraScript programs from anywhere. To do so, run this command:

    npm install -g kobrascript

You can execute KobraScript programs like so:

    kobra <name_of_program.ks>

You can also see the transpiled version of your code by running `kobrac`:

    kobrac <name_of_program.ks>

To see a list of commands available, type `kobra` or `kobrac` with no arguments.


#### Kobra Demands Respect (Hello, world!)
Say my name...

    say "Kobra!"                                            console.log("Kobra!");

#### Variable Declarations
In KobraScript, variable declarations are simplified to one character: `$`. Declare multiple variables at the same time with `,` or the slick `..` "dot-dot". KobraScript knows no semi-colons.

    $ name = "Samson"                                       var name = "Samson";

    $ likesMusic = true,                                    var likesMusic = true,
      likesJazz                                                 likesJazz = undefined;

    $ isRed = true                                          var isRed = true,
    .. isFood = false                                           isFood = false,
    .. isMine = true                                            isMine = true;

Variables with uninitialized values are set to undefined.

    $ total                                                 var total = undefined;

#### Functions
Declare a function easily with `fn`. Open the block with `:`, and close using `end`, or `..`.  Also note that the `return` statement always expects an expression–use the `leave` statement to return early from a function without an expression.

    fn average_intake(x):                                   function averageIntake(x) {
        $ total = 0                                             var total = 0;
        for ($ i = 0; i < x.length; i++):                       for (var i = 0; i < x.length; i++) {
            total = total + x[i]                                    total = total + x[i];
        end                                                     }
        say total                                               console.log(total);
        return total / x.length                                 return total / x.length;
    end                                                     }

    $  getSoup = fn (): return Res.soupOfTheDay() ..        var getSoup = function () {return Res.soupOfTheDay()},
    .. getDrink = fn (): return Res.specdrinks ..               getDrink = function () {return Res.spacdrinks},
    .. placeOrder = fn (item, quantity):                        placeOrder = function (item, quantity) {
         Kitchen.addOrder(item, quantity)                           Kitchen.addOrder(item, quantity);
       end                                                      };

    fn bomb(code):                                          function bomb(code) {
      if (code == "Password1"):                                 if (code === "Password1") {
        leave                                                       return;
      .. else:                                                  } else {
        say "Boom!"                                                 console.log("Boom!")
      end                                                       }
    end                                                     }

Similar to Javascript, anonymous self-calling functions are in KobraScript. These are typically used to create a private scope. In KobraScript, a closure literal may be constructed with `close`, followed by the inteded arguments as parameters enclosed in curly braces. One never has to worry about whether ones functions are being invoked on the fly. _Closed to the world, KobraScript may evaluate._

    close{}:                                                (function() {
      $ x = 10                                                  var x = 10;
      say x                                                     console.log(x);
    end                                                     }());

    $ x = [1, 2, 3]                                         var x = [1, 2, 3];
    close{x}:                                               (function(x) {
      print "I am " + x[1] + " good"                            console.log("I am " + x[1] + " good");
    end                                                     }(x));

#### Blocks
Blocks in KobraScript are beautiful. Start a multiline block with `:` and terminate it with the clear `end`, or the elegantly-flowing `..`  
Fearlessly create a single-statement block by pointing `->` to it. Nice.

    while (i--):                                            while (i--) {
        say "Countdown ... " + i                                console.log("Countdown ... " + i);
    end                                                     }

    fn numResponse (x):                                     function numResponse (x) {
      if (x == 1):                                              if (x === 1) {
        say "that's one!"                                           console.log("that's one!");
      .. else if (x == 2):                                      } else if (x === 2) {
        say "that's two!"                                           console.log("that's two!");
      .. else:                                                  } else {
        say "that's somthin' else!"                                 console.log("that's somthin' else!");
      end                                                       }
    end                                                     }

    for ($ i = 0; i < nums["length"]; i++):                 for (var i = 0; i < nums.length; i++) {
      $ p = nums[i]                                             var p = nums[i];
      if (p) -> primes.push(p)                                  if (p) { primes.push(p) }
    end                                                     }

    if (socket)                                             if (socket) {
      -> this.active[socket] = i++                              this.active[socket] = i++;
                                                            }

#### Conditional Statement
In KobraScript the `if` statement is written with a preference to `..` between conditional blocks. An `end` after the final block signals the conclusion of the statement. Kobra is cold as ice.

    if (is_red && is_food):                                 if (is_red && is_food) {
        eat()                                                   eat ();
    .. else if (is_food && is_mine):                        } else if (is_food && is_mine) {
        add_butter()                                            add_butter ();
    .. else:                                                } else {
        keep()                                                  keep();
    end                                                     }

#### Only If Statement
Bite first, ask for booleans later. Kobrascript allows a lightning-quick, conditional alternative to the garden-variety `if` statement.

    only:                                                   if (feelingLucky) {
      rollDice() .. if (feelingLucky)                           rollDice();
                                                            }
    only:
      abandonShip() .. if (sinking) else:                   if (sinking) {
      justKeepSwiming() ..                                    abandonShip();
                                                            } else {
                                                              justKeepSwimming();
                                                            }

#### Exchange Statement
KobraScript utilizes a Go/Python-inspired statement in order to exchange `:=:` the values of two variables.

    $ a = 2,                                                var a = 2,
      b = 3                                                     b = 3;
    a :=: b                                                 var swap = a; a = b; b = swap; // Awful.
    say a   // 3                                            console.log(a);  // 3
    say b   // 2                                            console.log(b);  // 2

#### `for` and `while` loops
For and while loops look beautiful as expected; keyword, condition, block, nice.

    $ a = 0 // A test variable for loops.                   var a = 0; // A test variable for loops.

    for ($ i = 0; i < 4; i++):                              for (var i = 0; i < 4; i++) {
        a++                                                     a++;
    end                                                     }

    while (a < 10):                                         while (a < 10) {
        a++                                                     a++;
    end                                                     }

#### Objects
Objects are easily specified and finely readable in KobraScript. Braces are used specifically for objects in this language, `{}` is an object (the one with no properties).

    $ bicycle = {                                           var bicycle = {
        frame: "aluminum",                                          frame: "aluminum",
        year: 2009,                                                 year: 2009,
        gears: 10,                                                  gears: 10,
        speed: 12.7,                                                speed: 12.7,
        move: fn ():                                                move: function () {
            Transform.translate(FORWARD * this.speed)                   Transform.translate(FORWARD * this.speed);
        ..,                                                         },
        upgrade_speed: fn ():                                       upgradeSpeed: function () {
            return this.speed = this.speed * 1.1                        return this.speed = this.speed * 1.1;
        ..,                                                         },
        get_frame: fn (): return this.frame end                     getFrame: function () {return this.frame;}
    }                                                       }

#### Arrays
Arrays in KobraScript follow normal scripting language convention.

    $ protein_intake = [12, 21.3, 7.2, 20]                  var protein_intake = [12.0, 21.3, 7.2, 20.0];
    $ enigma = [{code: '8878'}, [], false]                  var enigma = [{code: '8878'}, [], false];

### Macrosyntax

This is regarded as the the most up-to-date specification of KS.
*Except for the compiler itself of course.*

KobraScript Syntax `v.2.2.0`

    UNIT    ::=  PROGRAM

    PROGRAM ::=  STMT+  (as BLOCK)

    BLOCK   ::=  FREEBLK
            |    SINGLE
    FREEBLK ::=  ':'  STMT+  ('end' | '..')
    SINGLE  ::=  '->'  STMT

    STMT    ::=  VARDEC
            |    FNDEC
            |    'if'  '('  EXP  ')'  BLOCK
                 ('else'  'if'  '('  EXP  ')'  BLOCK)*
                 ('else'  '('  EXP  ')'  BLOCK)?
            |    'only'  BLOCK  'if'  '('  EXP  ')'
                 ('else'  BLOCK)?
            |    'for'  '('  (VARDEC | ASSIGN (','))?  ';'  EXP  ';'  INCREMENT  ')'  BLOCK
            |    'while'  '('  EXP  ')'  BLOCK
            |    'break'
            |    'continue'
            |    'return'  EXP
            |    'leave'
            |    EXP

    VARDEC  ::=  '$'  ID  '='  EXP  ((',' | '..')  ID  '='  EXP)*
    FNDEC   ::=  'fn'  ID  PARAMS  BLOCK

    PARAMS  ::=  '('  ID  (','  ID)*  ')'

    EXP     ::=  EXP0 (('=' | '+=' | '-=' | '*=' | '/=' | '%=' | ':=:') EXP0)?
    EXP0    ::=  EXP1 (('||' | '#') EXP1)*
    EXP1    ::=  EXP2 ('&&' EXP2)*
    EXP2    ::=  EXP3 (('==' | '~=' | '!=' | 'is')  EXP3)?
    EXP3    ::=  EXP4 (('<' | '<=' | '>=' | '>')  EXP4)?
    EXP4    ::=  EXP5 ([+-] EXP5)*
    EXP5    ::=  EXP6 ([%*/] EXP6)*
    EXP6    ::=  EXP7 (('**' | '-**')  EXP7)
    EXP7    ::=  ('~!' | '~?')?  EXP8
    EXP8    ::=  ('!' | '++' | '--' | 'new')?  EXP9
    EXP9    ::=  EXPRT ('++' | '--' | '.' ID | '[' EXP ']' | '(' EXP (',' EXP)* ')')*
    EXPRT   ::=  UNDEFLIT | NULLLIT | BOOLIT | STRLIT | NUMLIT
            |    | ID | CLOSLIT | FNLIT | ARRAY | OBJECT
            |    '(' EXP ')'

    FNLIT   ::=  'fn'  (ID)? PARAMS  BLOCK
    CLOSLIT ::=  'close'  '{'  (ID  (','  ID)*)?  '}'  BLOCK
    ARRAYLIT::=  '['  (EXP  (','  EXP)*)?  ']'
    OBJLIT  ::=  '{'  (PROP  (','  PROP)*)?  '}'
    PROP    ::=  ID  ':'  EXP
            |    STRLIT ':' EXP
            |    NUMLIT ':' EXP
            |    BOOLIT ':' EXP

### Microsyntax

    NUMLIT  ::=  -?(?:[1-9]\d*|0)(?:.\d+)?(?:[eE][+-]?\d+)?
    STRLIT  ::=  (\"|\')(\\[bfnrtv0\"\']|\\c[a-zA-z]|\\u[a-fA-F0-9]{4}|\\x[a-fA-F0-9]{2}|.)*\1
    BOOLIT  ::=  'true' | 'false'
    UNDEFLIT::=  'undefined'
    NULLLIT ::=  'null'
    ID      ::=  [_a-zA-Z]\w*
    COMMENT ::=  '//'  TEXT  '\n'
