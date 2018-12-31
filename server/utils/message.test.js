const expect = require('expect'); //load in expect module 

// load in the module that is being tested, use ES6 Syntax to extract the letiable  
const {generateMessage} = require('./message');

// describe block 
describe('generateMessage', () => {
  
  //it () is a test cases 
  it('should generate correct message object', () => {
    let from = 'Jen';
    let text = 'Some message';
    let message = generateMessage(from, text);

    expect(message.createdAt).toBeA('number');
    //expect(message).toInclude({from, text});
    expect(message.from).toMatch(from);
    expect(message.text).toMatch(text);
  });
});

describe('generateLocationMessage', () => {
  it('should generate correct location object', () => {
    let from = 'Deb';
    let latitude = 15;
    let longitude = 19;
    let url = 'https://www.google.com/maps?q=15,19';
    let message = generateLocationMessage(from, latitude, longitude);

    expect(message.createdAt).toBeA('number');
    expect(message).toInclude({from, url});
  });
});
