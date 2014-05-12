**/
* This is regarded as the the most up to date specification of KS
* KobraScript Syntax v.1.6b
* 
*/

### Macrosyntax

    UNIT    ::=  PROGRAM
            |    BLUPRNT

    PROGRAM ::=  STMT+  (as BLOCK)

    BLOCK   ::=  FREEBLK
            |    SINGLE
    FREEBLK ::=  ':'  STMT+  ('end' | '..')
    SINGLE  ::=  '->'  STMT

    STMT    ::=  VARDEC
            |    FNDEC
            |    ASSIGN
            |    INCR
            |    'if'  '('  EXP  ')'  BLOCK
                 ('else'  'if'  '('  EXP  ')'  BLOCK)*
                 ('else'  '('  EXP  ')'  BLOCK)?
            |    'for'  '('  (VARDEC | ASSIGN (','))?  ';'  EXP  ';'  INCREMENT  ')'  OPENBLK  'end'
            |    'while'  '('  EXP  ')'  BLOCK
            |    'return'  EXP  BLOCK

    VARDEC  ::=  '$'  ASSIGN  (','  ASSIGN)*
    FNDEC   ::=  FNTYPE  ID  PARAMS  BLOCK
    FNTYPE  ::=  'proc' | 'fn'
    PARAMS  ::=  '('  ID  (','  ID)*  ')'

    ASSIGN  ::=  VAR  '=' EXP
            |    VAR  ':=:'  VAR
        
    INCR    ::=  VAR  "++" | "++"  VAR
            |    VAR  "--" | "--"  VAR
            |    VAR  "+="  INTLIT
            |    VAR  "-="  INTLIT
            |    VAR  "*="  INTLIT
            |    VAR  "%="  INTLIT

    EXP     ::=  EXP1 (('||' | '#') EXP1)*
    EXP1    ::=  EXP2 ('&&' EXP2)*
    EXP2    ::=  EXP3 (('<' | '<=' | '==' | '~=' '!=' | '>=' | '>' | 'is') EXP3)?
    EXP3    ::=  EXP4 ([+-] EXP4)*
    EXP4    ::=  EXP5 ([%*/] EXP5)*
    EXP5    ::=  EXP6 (('**' | '-**')  EXP6)
    EXP6    ::=  ('~!' | '~?')?  EXP7
    EXP7    ::=  ('!')?  EXP8
    EXP8    ::=  'undefined' | 'null' | BOOLIT | STRLIT | NUMLIT | VAR |
            |    MAKE | FNVAL | ARRAY | OBJECT | '('  EXP  ')'

    VAR     ::=  ID SUFFIX*
    SUFFIX  ::=  '[' EXP ']'
            |    '.' ID
            |    '(' ARGS ')'

    MAKE    ::=  'construct'  ID  '('  ((ID  '='  EXP  ',')*  ID  '='  EXP | (ID  ',')*  ID)  ')'
    FNVAL   ::=  FNTYPE  PARAMS  BLOCK
    FNCALL  ::=  VAR  ARGS
    ARGS    ::=  '('  EXP  (','  EXP)*  ')'

    ARRAY   ::=  '['  (EXP  (','  EXP)*)?  ']'
    OBJECT  ::=  '{'  (PRPRTY  (','  PRPTRY)*)?  '}'
    PRPRTY  ::=  ID  ':'  EXP

    BLUPRNT ::=  'blueprint'  ID  PARAMS  BLUBLK  'defcc'
    BLUBLK  ::=  ':'  HASBLK  DOESBLK  SYNCHILD*
    HASBLK  ::=  '@'  'has'  (PRPRTY  (','  PRPRTY)*)?
    DOESBLK ::=  '@'  'does'  (PRPRTY  (','  PRPRTY)*)?
    SYNCHLD ::=  '@'  'syn'  ':'  ID  (PRPRTY  (','  PRPRTY)*)?


### Microsyntax

    NUMLIT  ::=  -?(?:[1-9]\d*|0)(?:.\d+)?(?:[eE][+-]?\d+)?
    STR     ::=  (\"|\')(\\[bfnrtv0\"\']|\\c[a-zA-z]|\\u[a-fA-F0-9]{4}|\\x[a-fA-F0-9]{2}|.)*\1
    BOOL    ::=  'true' | 'false'
    ID      ::=  [_a-zA-Z]\w*
    COMMENT ::=  '>>'  TEXT  '\n'
            |    '>|'  TEXT  '|<'