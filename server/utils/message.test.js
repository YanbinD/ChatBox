var expect = require('expect'); //load in expect module 

// load in the module that is being tested, use ES6 Syntax to extract the variable  
var {generateMessage} = require('./message');

// describe block 
describe('generateMessage', () => {
  
  //it () is a test cases 
  it('should generate correct message object', () => {
    var from = 'Jen';
    var text = 'Some message';
    var message = generateMessage(from, text);

    expect(message.createdAt).toBeA('number');
    //expect(message).toInclude({from, text});
    expect(message.from).toMatch(from);
    expect(message.text).toMatch(text);
  });
});
