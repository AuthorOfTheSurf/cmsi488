var util = require('util')
var HashMap = require('hashmap').HashMap

module.exports = function (program) {
  gen(program)  
}

var indentPadding = 4
var indentLevel = 0

function emit(line) {
  var pad = indentPadding * indentLevel;
  console.log(Array(pad+1).join(' ') + line)
}

function makeOp(op) {
  //return {not: '!', and: '&&', or: '||'}[op] || op
  return {'~?': 'typeof', '==': '===', }[op] || op
}

var makeVariable = (function () {
  // No need to synchronize because Node is single-threaded
  var lastId = 0;
  var map = new HashMap()
  return function (v) {
    if (!map.has(v)) map.set(v, ++lastId)
    return '_v' + map.get(v)
  }
}())

function gen(e) {
  return generator[e.constructor.name](e)
}

var generator = {

  'Program': function (ent) {
    indentLevel = 0
    emit('(function () {')
    gen(ent.block)
    emit('}());')
  },

  'Blueprint': function (ent) {
    // TODO
  },

  'Block': function (ent) {
    indentLevel++
    ent.statements.forEach(function (statement) {
      gen(statement)
    })
    indentLevel--
  },

  'Fn': function (ent) {
    emit('function (' + ent.params.join(', ') + ') {')
    gen(ent.body)
    emit('};')
  },

  'Declaration': function (ent) {
    emit(util.format('var %s = %s;', makeVariable(ent), initializer))
  },

  'AssignmentStatement': function (ent) {
    emit(util.format('%s = %s;', gen(ent.target), gen(ent.source)))
  },

  'IncrementStatement': function (ent) {
    if (ent.isIncrement && ent.post) {
      return ent.target + '++'
    } else if (!ent.isIncrement && ent.post){
      return ent.target + '--'
    } else if (ent.isIncrement && !ent.post) {
      return '++' + ent.target
    } else {
      return '--' + ent.target
    }
  },

  'ConditionalStatement': function (ent) {
    for (var i = 0; i < ent.conditionals.length; i++) {
      if (i === 0) {
        emit(conditionalPrint('if', ent.conditionals[0]))
      }
      else {
        emit(conditionalPrint('else if', ent.conditionals[i]))
      }
    }
    if (ent.defaultAct) {
      emit(conditionalPrint('else', ent.defaultAct))
    }

    function conditionalPrint(kind, c) {
      var result = ''
      result = result.concat(kind + ' ')
      result = result.concat('(' + gen(c.condition) + ') {\n')
      result = result.concat(gen(c.block))
      result = result.concat('\n}')
      return result
    }
  },

  'ForStatement': function (ent) {
    emit(util.format('for (%s; %s; %s) {',
      gen(ent.assignments),
      gen(ent.condition),
      gen(ent.after)))
    gen(ent.body)
    emit('}')
  },

  'WhileStatement': function (ent) {
    emit('while (' + gen(ent.condition) + ') {')
    gen(ent.body)
    emit('}')
  },

  'SayStatement': function (ent) {
    emit(util.format('console.log(%s);', gen(ent)))
  },

  'ReturnStatement': function (ent) {
    emit('return ' + gen(ent.expression) + ';')
  },

  'ContinueStatement': function(ent) {
    emit('continue;')
  },

  'Construction': function(ent) {
    // TODO
  },

  'ExchangeStatement': function (ent) {
    var a = gen(ent.left)
    var b = get(ent.right)
    emit(util.format('(function() {var _ = %s; var %s = %s; var %s = _}())', a, a, b, b))
  },

  'UnaryExpression': function (ent) {
    if (ent.op.lexeme == '~!') {
      var factorialFunction = 'function __factorial(n){var f=[];function factorialHelper(value){if(value==0||value==1){return 1;}if(f[value]>0){return f[value];}return f[value]=factorial(value-1)*value;}return factorialHelper(n);}'
      emit(util.format('%s', factorialFunction))
      emit(util.format("__factorial(%s)"), gen(ent.operand))
    } else {
      return util.format('(%s %s)', makeOp(ent.op.lexeme), gen(ent.operand))
    }
  },

  'BinaryExpression': function (ent) {
    return util.format('(%s %s %s)', gen(ent.left), makeOp(ent.op.lexeme), gen(ent.right))
  },

  'BasicVar': function (ent) {
    // TODO
  },

  'IndexVar': function (ent) {
    // TODO
  },

  'DottedVar': function (ent) {
    // TODO
  },

  'Call': function (ent) {
    // TODO
  },

  'ArrayLiteral': function (ent) {
    emit(util.format('[%s];', ent.join(', ')))
  },

  'ObjectLiteral': function (ent) {
    var result = '{'
    var length = ent.properties.length
    if (ent.properties) {
      result = result.concat(ent.properties[0])
      if (length > 1) {
        for (var i = 0; i < length; i++) {
          result = result.concat(',\n' + ent.properties[i])
        }
      }
    }
    return result + '\n}'
  },

  'NumericLiteral': function (ent) {
    return ent.toString()
  },

  'BooleanLiteral': function (ent) {
    return ent.toString()
  },

  'StringLiteral': function (ent) {
    return ent.toString()
  },

  'UndefinedLiteral': function(ent) {
    return ent.toString()
  },

  'NullLiteral': function(ent) {
    return ent.toString()
  },

  'BasicVar': function (ent) {
    return makeVariable(ent.referent)
  }
}
