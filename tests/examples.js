var chakram = require('chakram');
expect = chakram.expect;
var assert = require('chai').assert;
var should = require('chai').should();
var testlogin = {username: "homecuser@fake.hc", password: 'homec4life'};
var expectedSchema = {
    type: "object",
    properties: {
        args: {type: "object"},
        data: {type: "string"},
        files: {type: "object"},
        headers: {
            type: "object",
            properties: {
                Host: {type: "string"},
                Connection: {type: "string"}
            },
            required: ["Host", "Connection"]
        }
    },
    required: ["data", "headers"]
};


describe("Chakram", function() {

    it("Test 1", function () {
        var response = chakram.get("http://httpbin.org/get");
        expect(response).to.have.status(200);
        expect(response).not.to.have.header('non-existing-header');
        expect(response.body).to.be.lengthOf(1);
        return chakram.wait();
    });


    it("Test 2", function () {
        var response = chakram.post("http://httpbin.org/post", testlogin);
        expect(response).to.have.status(200);
        expect(response).not.to.have.header('non-existing-header');
        expect(response).to.comprise.of.json({"json": {"password": "homec4life","username": "homecuser@fake.hc"}});
        expect(response).to.include.json({ username: 'homecuser@fake.hc' });
        expect(response).to.not.include.json({ email: 'test@gmail.com' });
        return chakram.wait();
    });

    it("Test 3", function () {
      return chakram.post("http://httpbin.org/post",{"score":5,"regexTest":"sinan"}).then(function(response){
      //console.log(response.body);
       expect(response).to.have.schema(expectedSchema);
       expect(response.body).to.have.property('headers');
       expect(response.body.headers).to.have.property('Host');
       expect(response.body.json.score).to.be.above(4);
       expect(response.body.json.score).to.be.below(6);
       expect(response.body.json.score).to.be.equal(5,"Beklenen sayı 5 değil.");
       expect(response.body.args).to.be.empty;
       expect(response.body.json.regexTest).to.match(/^.inan/);
       expect(response.body.json.regexTest).to.not.match(/^taco/);
       expect(response.body.json.regexTest).to.have.string('sin');
       expect(response.body.json.regexTest).to.not.have.string('taco');

       expect(response.body.json).to.have.all.keys('score', 'regexTest');
       expect(response.body.json).to.be.an('object').to.have.all.keys('score', 'regexTest');

      })
    });

    it("Test 4", function () {
      return chakram.post("http://httpbin.org/post",{"score":5,"regexTest":"sinan"}).then(function(response){
      //console.log(response.body);

       expect(response.body.json.score).to.be.below(6);
       expect(1).to.satisfy(function(num) {
          return num > 0;
        }, 'nooo why fail??');

       expect(1.5).to.be.closeTo(2, 0.5, 'nooo why fail??');

      })
    });

    it("Test 5 - Assert testleri.", function () {
        var response = chakram.get("http://httpbin.org/get");
        expect(response).to.have.status(200);
        assert("1" == "1"," İki değer eşit değil.")
        assert.equal("sinan", 'sinan', 'sinan = sinan mı?');
        assert.typeOf("foo", 'string');
        assert.lengthOf("foo", 3, 'uzunluk 3 mü');
        "sinan".should.be.a('string');
        "sinan".should.equal('sinan');
        "sinan".should.have.lengthOf(5);


        return chakram.wait();

    });
})
