/*
 * Parser module
 *
 *   var parse = require('./parser')
 *
 *   var program = parse(tokens)
 */

var scanner = require('./scanner')
var error = require('./error')

var Program = require('./entities/program')
var Block = require('./entities/block')
var Type = require('./entities/type')
var VariableDeclaration = require('./entities/variabledeclaration')
var AssignmentStatement = require('./entities/assignmentstatement')
var WhileStatement = require('./entities/whilestatement')
var IntegerLiteral = require('./entities/integerliteral')
var BooleanLiteral = require('./entities/booleanliteral')
var VariableReference = require('./entities/variablereference')
var BinaryExpression = require('./entities/binaryexpression')
var UnaryExpression = require('./entities/unaryexpression')

var Blueprint = require('./entities/blueprintdeclaration')
var Params = require('./entities/parameters')
var Fn = require('./entities/function')
var ConditionalStatement = require('./entities/conditionalstatement')
var ForStatement = require('./entities/forstatement')
var ObjectLiteral = require('./entities/objectliteral')
var ArrayLiteral = require('./entities/arrayliteral')
var StringLiteral = require('./entities/stringliteral')

var tokens


module.exports = function (scanner_output) {
  tokens = scanner_output
  var program = at('blueprint') ? parseBlueprint() : parseProgram()
  match('EOF')
  return program
}

function parseProgram() {
  return new Program(parseBlock())
}

function parseBlock() {
  var statements = []
  do {
    statements.push(parseStatement())
  } while (at(['$','ID','for','while','if']))
  return new Block(statements)
}

function parseBlueprint() {
  match('blueprint')
  var blueid = new VariableReference(match('ID'))
  var params = new Params(parseParams())
  match(':')

  match('has')
  match(':')
  var has = []
  if (at('ID')) {
    has.push(parseAssignmentStatement(':'))
    while (at(',')) {
      match()
      has.push(parseAssignmentStatement(':'))
  }

  match('does')
  match(':')
  var does = []
  if (at('ID')) {
    does.push(parseAssignmentStatement(':'))
    while (at(',')) {
      match()
      does.push(parseAssignmentStatement(':'))
    }
  }
  
  var synget = synset = []
  if (at('synget')) {
    loadSynget()
    loadSynset()
  }
  else if (at('synset')) {
    loadSynset()
    loadSynget()
  }
  match('defcc')

  function loadSynget () {
    match('synget')
    match(':')
    if (at('ID')) {
      synget.push(new VariableReference(match('ID')))
      while (at(',')) {
        match()
        synget.push(new VariableReference(match('ID')))
      }
    }
  }

  function loadSynset () {
    match('synset')
    match(':')
    if (at('ID')) {
      synget.push(new VariableReference(match('ID')))
      while (at(',')) {
        match()
        synget.push(new VariableReference(match('ID')))
      }
    }
  }
  return new Blueprint(blueid, has, does, synget, synset)
}

function parseStatement() {
  if (at('$')) {
    return parseVariableDeclaration()
  } else if (at('ID')) {
    if (next('=')) {
      return parseAssignmentStatement('=')
    }
    else if (next(['[','.'])) {
      return parseName()
    }
  } else if (at('while')) {
    return parseWhileStatement()
  } else if (at('if')) {
    return parseConditionalStatement()
  } else if (at('for')) {
    return parseForStatement()
  } else {
    error('Statement expected', tokens[0])
  }
}

function parseVariableDeclaration() {
  match('$')
  var declarations = []
  declaration.push(parseAssignmentStatement())
  while (at(',')) {
    match()
    declaration.push(parseAssignmentStatement())
  }
  return new VariableDeclaration(declarations)
}

/* assignment token is '=' (general) or ':' (property declaration) */
function parseAssignmentStatement(assignmentToken) {
  var target = parseName()
  match(assignmentToken)
  var value
  if (at['fn','proc'])) {
    var fntype = match()
    var params = parseParams()
    match(':')
    var body = parseBlock()
    if (at['..', 'end']) {
      match()
      value = Fn(fntype, params, body)
    } else {
      error('Illegal end of function token', tokens[0])
    }
  } else {
    value = parseExpression()
  }
  return new AssignmentStatement(target, value)
}

function parseName() {
  var name = match()
  var dereferences = []
  while (at['[','.']) {
    if (at['[']) {
      match()
      gather()
      match(']')
    }
    else (at('.')) {
      gather()
    }
  }
  function gather() {
    if (at['STRLIT', 'INTLIT']) {
      dereferences.push(parseValue())
    } else {
      error('Illegal dereference', tokens[0])
    }
  }
  return VariableReference(name, dereference)
}

/*  This is anything that can be assigned to an id; RHS values */
function parseValue() {
  if (at('{')) {
    return parseObjectLiteral()
  } else if (at('[')) {
    return parseArrayLiteral()
  } else if (at('INTLIT')) {
    return new IntegerLiteral(match())
  } else if (at('BOOLIT')) {
    return new BooleanLiteral(match())
  } else if (at('STRLIT')) {
    return new StringLiteral(match())
  } else if (at('ID') && next('(')) {
    return new parseFnCall()
  } else if (at('ID')) {
    return new VariableReference(match())
  } else {
    return parseExpression()
  }
}

function parseFnCall() {
  var name = match('ID')
  var params = parseParams()
  return new FnCall(name, params)
}

function parseObjectLiteral() {
  var properties = []
  match('{')
  if (at('ID')) {
    properties.push(parseAssignmentStatement(':'))
  }
  while (at(',')) {
    match()
    properties.push(parseAssignmentStatement(':'))
  }
  match('}')
  return new Object(properties)
}

function parseArrayLiteral() {
  var elements = []
  match('[')
  while(!at[']']) {
    elements.push(parseValue())
  }
  match(']')
  return new ArrayLiteral(elements)
}

function parseParams() {
  match('(')
  var params = []
  if (!at(')')) {
    params.push(parseValue())
    while (at(',')) {
      match()
      params.push(parseValue())
    }
  }
  match(')')
  return params
}

function parseWhileStatement() {
  match('while')
  var condition = parseExpression()
  match('loop')
  var body = parseBlock()
  match('end')
  return new WhileStatement(condition, body)
}  

function parseForStatement() {
  match('for')
  match('(')
  var assignments = []
  assignments.push(parseAssignmentStatement())
  while (at(',')) {
    match()
    assignments.push(parseAssignmentStatement())    
  }
  match(';')
  var condition = parseExpression()
  match(';')
  var after = []
  after.push(parseStatement())
  while (at(',')) {
    match()
    assignments.push(parseStatement()) 
  }
  match(')')
  match(':')
  var body = parseBlock()
  match('end')
  return new ForStatement(assignments, condition, after, body)
}

function parseConditionalExpression() {
<<<<<<< HEAD
  var checklist = [],
      check, action, defaultAct,
      elseEncountered = false,
      conditional = function(check, action) {return {check: check, action: action}}
  
  match('if')
  match('(')
  check = parseExpression()
  match(')')
  match(':')
  action = parseBlock()
  checklist.push(conditional(check, action))
=======
  var conditionals = [],
      defaultAct,
      elseEncountered = false

  conditionals.push(parseIfThen())
>>>>>>> Work focusing on variable reference and defreferencing.
  while(at('..') && !elseEncountered) {
    match()
    match('else')
    if (at('if')) {
      conditionals.push(parseIfThen())
    } else if (at(':')) {
      match()
      defaultAct = parseBlock()
      elseEncountered = true
    } else {
      error('Illegal token in conditional statement', tokens[0])
    }
  }
  match('end')
  return new ConditionalStatement(conditionals, defaultAct)
}

function parseIfThen() {
  match('if')
  match('(')
  var condition = parseExpression()
  match(')')
  match(':')
  var action = parseBlock()
  return new Conditional(condition, action))
}

function parseExpression() {
  var left = parseExp1()
  while (at('or')) {
    var op = match()
    var right = parseExp1()
    left = new BinaryExpression(op, left, right)
  }
  return left
}

function parseExp1() {
  var left = parseExp2()
  while (at('and')) {
    var op = match()
    var right = parseExp2()
    left = new BinaryExpression(op, left, right)
  }
  return left
}

function parseExp2() {
  var left = parseExp3()
  if (at(['<','<=','==','!=','>=','>'])) {
    var op = match()
    var right = parseExp3()
    left = new BinaryExpression(op, left, right)
  }
  return left
}

function parseExp3() {
  var left = parseExp4()
  while (at(['+','-'])) {
    var op = match()
    var right = parseExp4()
    left = new BinaryExpression(op, left, right)
  }
  return left
}

function parseExp4() {
  var left = parseExp5()
  while (at(['*','/'])) {
    op = match()
    right = parseExp5()
    left = new BinaryExpression(op, left, right)
  }
  return left
}

function parseExp5() {
  if (at(['-','not'])) {
    op = match()
    operand = parseExp6()
    return new UnaryExpression(op, operand)
  } else {
    return parseExp6()
  }
}

function parseExp6() {
  if (at(['true','false'])) {
    return new BooleanLiteral.forName(match().lexeme)
  } else if (at('INTLIT')) {
    return new IntegerLiteral(match())
  } else if (at('ID')) {
    return new VariableReference(match())
  } else if (at('(')) {
    match()
    var expression = parseExpression()
    match(')')
    return expression
  } else {
    error('Illegal start of expression', tokens[0])
  }
}

function at(symbol) {
  if (tokens.length === 0) {
    return false
  } else if (Array.isArray(symbol)) {
    return symbol.some(function (s) {return at(s)})
  } else {
    return symbol === tokens[0].kind
  }  
}

function next(symbol) {
  if (tokens.length === 1) {
    return false
  } else if (Array.isArray(symbol)) {
    return symbol.some(function (s) {return next(s)})
  } else {
    return symbol === tokens[1].kind
  }  
}

function match(symbol) {
  if (tokens.length === 0) {
    error('Unexpected end of input')
  } else if (symbol === undefined || symbol === tokens[0].kind) {
    return tokens.shift()
  } else {
    error('Expected ' + symbol + ' but found ' + tokens[0].kind, tokens[0])
  }
}

