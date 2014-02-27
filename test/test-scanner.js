//  To run this test make sure Mocha is installed.
//  Command (run in root directory):
//  sudo npm install -g mocha

var should = require('should');
var scan = require('../scanner')
var error = require('../error')
var i = require('util').inspect

describe('The scanner', function () {
    //  hello-world.ks
    it('scans the simplest program', function (done) {
        scan('test/kobra-code/good-programs/hello-world.ks', function (tokens) {
            tokens.length.should.equal(9)
            i(tokens[0]).should.equal(i({kind:'$',lexeme:'$',line:1,col:1}))
            i(tokens[1]).should.equal(i({kind:'ID',lexeme:'hello',line:1,col:3}))
            i(tokens[2]).should.equal(i({kind:'=',lexeme:'=',line:1,col:9}))
            i(tokens[3]).should.equal(i({kind:'STRLIT',lexeme:'Hello, world!',line:1,col:11}))
            i(tokens[4]).should.equal(i({kind:'say',lexeme:'say',line:2,col:1}))
            i(tokens[5]).should.equal(i({kind:'(',lexeme:'(',line:2,col:4}))
            i(tokens[6]).should.equal(i({kind:'ID',lexeme:'hello',line:2,col:5}))
            i(tokens[7]).should.equal(i({kind:')',lexeme:')',line:2,col:10}))
            i(tokens[8]).should.equal(i({kind:'EOF',lexeme:'EOF'}))
            done()
        })
    })

    //  Person.ksb
    it('properly processes a Blueprint file', function (done) {
        scan('test/kobra-code/good-programs/Person.ksb', function (tokens) {
            tokens.length.should.equal(62)
            //    First line.
            i(tokens[0]).should.equal(i({kind:'$',lexeme:'$',line:1,col:1}))
            i(tokens[1]).should.equal(i({kind:'blueprint',lexeme:'blueprint',line:1,col:3}))
            i(tokens[2]).should.equal(i({kind:'ID',lexeme:'Person',line:1,col:13}))
            i(tokens[3]).should.equal(i({kind:'(',lexeme:'(',line:1,col:20}))
            i(tokens[4]).should.equal(i({kind:'ID',lexeme:'name',line:1,col:21}))
            i(tokens[5]).should.equal(i({kind:',',lexeme:',',line:1,col:25}))
            i(tokens[6]).should.equal(i({kind:'ID',lexeme:'age',line:1,col:27}))
            i(tokens[7]).should.equal(i({kind:',',lexeme:',',line:1,col:30}))
            i(tokens[8]).should.equal(i({kind:'ID',lexeme:'hairColor',line:1,col:32}))
            i(tokens[9]).should.equal(i({kind:',',lexeme:',',line:1,col:41}))
            i(tokens[10]).should.equal(i({kind:'ID',lexeme:'exercise',line:1,col:43}))
            i(tokens[11]).should.equal(i({kind:')',lexeme:')',line:1,col:51}))
            //    End first line, has time.
            i(tokens[12]).should.equal(i({kind:'has',lexeme:'has',line:2,col:5}))
            i(tokens[13]).should.equal(i({kind:'{',lexeme:'{',line:2,col:9}))
            i(tokens[14]).should.equal(i({kind:'ID',lexeme:'name',line:3,col:9}))
            i(tokens[15]).should.equal(i({kind:'=',lexeme:'=',line:3,col:14}))
            i(tokens[16]).should.equal(i({kind:'ID',lexeme:'name',line:3,col:16}))
            i(tokens[17]).should.equal(i({kind:',',lexeme:',',line:3,col:20}))
            i(tokens[18]).should.equal(i({kind:'ID',lexeme:'age',line:4,col:9}))
            i(tokens[19]).should.equal(i({kind:'=',lexeme:'=',line:4,col:13}))
            i(tokens[20]).should.equal(i({kind:'ID',lexeme:'age',line:4,col:15}))
            i(tokens[21]).should.equal(i({kind:',',lexeme:',',line:4,col:18}))
            i(tokens[22]).should.equal(i({kind:'ID',lexeme:'hairColor',line:5,col:9}))
            i(tokens[23]).should.equal(i({kind:'=',lexeme:'=',line:5,col:19}))
            i(tokens[24]).should.equal(i({kind:'ID',lexeme:'hairColor',line:5,col:21}))
            i(tokens[25]).should.equal(i({kind:'#',lexeme:'#',line:5,col:31}))
            i(tokens[26]).should.equal(i({kind:'STRLIT',lexeme:'black',line:5,col:33}))
            i(tokens[27]).should.equal(i({kind:'}',lexeme:'}',line:6,col:5}))
            //    Has done, Does time.
            i(tokens[28]).should.equal(i({kind:'does',lexeme:'does',line:7,col:5}))
            i(tokens[29]).should.equal(i({kind:'{',lexeme:'{',line:7,col:10}))
            i(tokens[30]).should.equal(i({kind:'ID',lexeme:'do_exercise',line:8,col:9}))
            i(tokens[31]).should.equal(i({kind:'=',lexeme:'=',line:8,col:21}))
            i(tokens[32]).should.equal(i({kind:'ID',lexeme:'exercise',line:8,col:23}))
            i(tokens[33]).should.equal(i({kind:'#',lexeme:'#',line:8,col:32}))
            i(tokens[34]).should.equal(i({kind:'ID',lexeme:'running',line:8,col:34}))
            i(tokens[35]).should.equal(i({kind:',',lexeme:',',line:8,col:41}))
            i(tokens[36]).should.equal(i({kind:'ID',lexeme:'running',line:9,col:9}))
            i(tokens[37]).should.equal(i({kind:'=',lexeme:'=',line:9,col:17}))
            i(tokens[38]).should.equal(i({kind:'proc',lexeme:'proc',line:9,col:19}))
            i(tokens[39]).should.equal(i({kind:'(',lexeme:'(',line:9,col:24}))
            i(tokens[40]).should.equal(i({kind:')',lexeme:')',line:9,col:25}))
            i(tokens[41]).should.equal(i({kind:':',lexeme:':',line:9,col:26}))
            i(tokens[42]).should.equal(i({kind:'say',lexeme:'say',line:10,col:13}))
            i(tokens[43]).should.equal(i({kind:'(',lexeme:'(',line:10,col:16}))
            i(tokens[44]).should.equal(i({kind:'STRLIT',lexeme:'26.2 miles',line:10,col:17}))
            //  Where the issue is... has to do with STRLIT.
            i(tokens[45]).should.equal(i({kind:')',lexeme:')',line:10,col:29}))
            //  End issue.
            i(tokens[46]).should.equal(i({kind:'end',lexeme:'end',line:11,col:9}))
            i(tokens[47]).should.equal(i({kind:'}',lexeme:'}',line:12,col:5}))
            //    Begin synget.
            i(tokens[48]).should.equal(i({kind:'synget',lexeme:'synget',line:13,col:5}))
            i(tokens[49]).should.equal(i({kind:'{',lexeme:'{',line:13,col:12}))
            i(tokens[50]).should.equal(i({kind:'ID',lexeme:'name',line:14,col:9}))
            i(tokens[51]).should.equal(i({kind:',',lexeme:',',line:14,col:13}))
            i(tokens[52]).should.equal(i({kind:'ID',lexeme:'age',line:14,col:15}))
            i(tokens[53]).should.equal(i({kind:',',lexeme:',',line:14,col:18}))
            i(tokens[54]).should.equal(i({kind:'ID',lexeme:'hairColor',line:14,col:20}))
            i(tokens[55]).should.equal(i({kind:'}',lexeme:'}',line:15,col:5}))
            //    Begin synset.
            i(tokens[56]).should.equal(i({kind:'synset',lexeme:'synset',line:16,col:5}))
            i(tokens[57]).should.equal(i({kind:'{',lexeme:'{',line:16,col:12}))
            i(tokens[58]).should.equal(i({kind:'ID',lexeme:'hairColor',line:17,col:9}))
            i(tokens[59]).should.equal(i({kind:'}',lexeme:'}',line:18,col:5}))
            //    GG.
            i(tokens[60]).should.equal(i({kind:'defcc',lexeme:'defcc',line:19,col:5}))
            i(tokens[61]).should.equal(i({kind:'EOF',lexeme:'EOF'}))
            done()
        })
    })
    
    //  multioverload.ks
    it('reads ugly yet syntactically correct programs', function (done) {
        scan('test/kobra-code/bad-programs/multioverload.ks', function (tokens) {
            tokens.length.should.equal(13)
            i(tokens[0]).should.equal(i({kind:'$',lexeme:'$',line:1,col:1}))
            i(tokens[1]).should.equal(i({kind:'ID',lexeme:'x',line:1,col:3}))
            i(tokens[2]).should.equal(i({kind:'=',lexeme:'=',line:1,col:5}))
            i(tokens[3]).should.equal(i({kind:'NUMLIT',lexeme:'-27',line:1,col:7}))
            //  IGNORES COMMENTS, NEXT LINE
            i(tokens[4]).should.equal(i({kind:'ID',lexeme:'x',line:2,col:1}))
            i(tokens[5]).should.equal(i({kind:'**',lexeme:'**',line:2,col:3}))
            i(tokens[6]).should.equal(i({kind:'ID',lexeme:'y',line:2,col:6}))
            i(tokens[7]).should.equal(i({kind:'+',lexeme:'+',line:2,col:8}))
            i(tokens[8]).should.equal(i({kind:'ID',lexeme:'z',line:2,col:10}))
            i(tokens[9]).should.equal(i({kind:'**',lexeme:'**',line:2,col:12}))
            i(tokens[10]).should.equal(i({kind:'*',lexeme:'*',line:2,col:14}))
            i(tokens[11]).should.equal(i({kind:'NUMLIT',lexeme:'10',line:2,col:16}))
            i(tokens[12]).should.equal(i({kind:'EOF',lexeme:'EOF'}))
            done()
        })
    })

})
