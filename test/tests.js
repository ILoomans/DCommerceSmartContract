const Boson = artifacts.require("Boson");

contract('Boson', function(accounts) {
  const price = 1000000000
const admin = accounts[0]
const buyer1 = accounts[1]
const buyer2 = accounts[2]
const seller1 = accounts[3]
const seller2 = accounts[4]

function adjustDecimals(x){
  return x * 10 ** 2
}

function toToken(x){
  return x / 10 **2;
}

const coffee = {id:1,name:'Coffee',price:adjustDecimals(3)}
const tshirt = {id:2,name:'T-Shirt',price:adjustDecimals(5)}
const tea = {id:3,name:'Tea',price:adjustDecimals(2.5)}
const cake = {id:4,name:'Cake',price:adjustDecimals(3.5)}
const shorts = {id:5,name:'Shorts',price:adjustDecimals(8)}
const hoody = {id:6,name:'Hoody',price:adjustDecimals(12)}




  it("Token price is set", function() {
    return Boson.deployed().then(function(instance) {
      return instance.price().then((function(res,err){
        assert.equal(res.toString(),toToken(price),"Price wasn't set correctly")
      }))
  })
})

// lets consider adding this functionality here to add decimals. mpt urhet
it("Buyer 1 buys 20 tokens", function() {
  return Boson.deployed().then(function(instance) {
    return instance.buyTokens(adjustDecimals(20),{from:buyer1,value:20*price}).then((function(res,err){
      return instance.balanceOf(buyer1).then(function(res,err){
        assert.equal(adjustDecimals(20),res,'Buyer 1 failed at buying 20 tokens')
      })
    }))
})
})


it("Buyer 2 buys 40 tokens", function() {
return Boson.deployed().then(function(instance) {
  return instance.buyTokens(adjustDecimals(40),{from:buyer2,value:40*price}).then((function(res,err){
    return instance.balanceOf(buyer2).then(function(res,err){
     assert.equal(adjustDecimals(40),res,'Buyer 2 failed at buying 40 tokens')
    })  
  }))
})
})

  it("Added seller 1", function() {
    return Boson.deployed().then(function(instance) {
      return instance.addSeller(seller1,{from:admin}).then((function(res,err){
        assert.equal(err,undefined,'Error adding seller 1')
      }))
  })
})


it("Added seller 2", function() {
  return Boson.deployed().then(function(instance) {
    return instance.addSeller(seller2,{from:admin}).then((function(res,err){
      assert.equal(err,undefined,'Error adding seller 2')
    }))
})
})



it("Seller 1 offers a coffee for 3 tokens", function() {
  return Boson.deployed().then(function(instance) {
    return instance.addItemForSale(coffee.id,coffee.name,coffee.price,{from:seller1}).then((function(res,err){
      assert.equal(err,undefined,'Failed to offer coffee')
      return instance.viewItem(coffee.id).then((function(res,err){
        assert.equal(res[0],coffee.name,'Failed to name the product')
        assert.equal(res[1].toString(),coffee.price,'Failed to price the product')
        assert.equal(res[2],seller1,'Failed to set the seller of the product')
      }))
    }))
})
})



it("Seller 2 offers a T-Shirt for 5 tokens", function() {
  return Boson.deployed().then(function(instance) {
    return instance.addItemForSale(tshirt.id,tshirt.name,tshirt.price,{from:seller2}).then((function(res,err){
      assert.equal(err,undefined,'Failed to offer T-Shirt')
      return instance.viewItem(tshirt.id).then((function(res,err){
        assert.equal(res[0],tshirt.name,'Failed to name the product')
        assert.equal(res[1].toString(),tshirt.price,'Failed to price the product')
        assert.equal(res[2],seller2,'Failed to set the seller of the product')
      }))
    }))
})
})


it("Seller 1 offers a tea for 2.5 tokens", function() {
  return Boson.deployed().then(function(instance) {
    return instance.addItemForSale(tea.id,tea.name,tea.price.toString(),{from:seller1}).then((function(res,err){
      assert.equal(err,undefined,'Failed to offer Tea')
      return instance.viewItem(tea.id).then((function(res,err){
        assert.equal(res[0],tea.name,'Failed to name the product')
        assert.equal(res[1].toString(),tea.price,'Failed to price the product')
        assert.equal(res[2],seller1,'Failed to set the seller of the product')
      }))
    }))
})
})


it("Seller 1 offers a cake for 3.5 tokens", function() {
  return Boson.deployed().then(function(instance) {
    return instance.addItemForSale(cake.id,cake.name,cake.price.toString(),{from:seller1}).then((function(res,err){
      assert.equal(err,undefined,'Failed to offer Cake')
      return instance.viewItem(cake.id).then((function(res,err){
        assert.equal(res[0],cake.name,'Failed to name the product')
        assert.equal(res[1].toString(),cake.price,'Failed to price the product')
        assert.equal(res[2],seller1,'Failed to set the seller of the product')
      }))
    }))
})
})


it("Seller 2 offers a cake for 8 tokens", function() {
  return Boson.deployed().then(function(instance) {
    return instance.addItemForSale(shorts.id,shorts.name,shorts.price.toString(),{from:seller2}).then((function(res,err){
      assert.equal(err,undefined,'Failed to offer Cake')
      return instance.viewItem(shorts.id).then((function(res,err){
        assert.equal(res[0],shorts.name,'Failed to name the product')
        assert.equal(res[1].toString(),shorts.price,'Failed to price the product')
        assert.equal(res[2],seller2,'Failed to set the seller of the product')
      }))
    }))
})
})



it("Seller 2 offers a hoody for 12 tokens", function() {
  return Boson.deployed().then(function(instance) {
    return instance.addItemForSale(hoody.id,hoody.name,hoody.price.toString(),{from:seller2}).then((function(res,err){
      assert.equal(err,undefined,'Failed to offer Cake')
      return instance.viewItem(hoody.id).then((function(res,err){
        assert.equal(res[0],hoody.name,'Failed to name the product')
        assert.equal(res[1].toString(),hoody.price,'Failed to price the product')
        assert.equal(res[2],seller2,'Failed to set the seller of the product')
      }))
    }))
})
})

it("Buyer 1 orders tshirt", function() {
  return Boson.deployed().then(function(instance) {
    return instance.purchaseItem(tshirt.id,tshirt.price,{from:buyer1}).then((function(res,err){
      assert.equal(err,undefined,'Failed to order t-shirt')
    }))
})
})


it("Buyer 1 buys 10 tokens", function() {
  return Boson.deployed().then(function(instance) {
    return instance.buyTokens(adjustDecimals(10),{from:buyer1,value:10*price}).then((function(res,err){
      assert.equal(err,undefined,'Failed to buy 10 tokens')
    }))
})
})


it("Buyer 2 orders hoody", function() {
  return Boson.deployed().then(function(instance) {
    return instance.purchaseItem(hoody.id,hoody.price,{from:buyer2}).then((function(res,err){
      assert.equal(err,undefined,'Failed to order hoody')
    }))
})
})


it("Buyer 1 completes order of tshirt", function() {
  return Boson.deployed().then(function(instance) {
    return instance.confirmReceived(tshirt.id,{from:buyer1}).then((function(res,err){
      assert.equal(err,undefined,'Failed to complete order of tshirt')
    }))
})
})

it("Buyer 1 orders coffee", function() {
  return Boson.deployed().then(function(instance) {
    return instance.purchaseItem(coffee.id,coffee.price,{from:buyer1}).then((function(res,err){
      assert.equal(err,undefined,'Failed to order coffee')
    }))
})
})

it("Buyer 1 orders cake", function() {
  return Boson.deployed().then(function(instance) {
    return instance.purchaseItem(cake.id,cake.price,{from:buyer1}).then((function(res,err){
      assert.equal(err,undefined,'Failed to order cake')
    }))
})
})

it("Buyer 2 complains about hoody", function() {
  return Boson.deployed().then(function(instance) {
    return instance.complaint(hoody.id,{from:buyer2}).then((function(res,err){
      assert.equal(err,undefined,'Failed to complain about order of hoody')
    }))
})
})

it("Buyer 2 orders tea", function() {
  return Boson.deployed().then(function(instance) {
    return instance.purchaseItem(tea.id,tea.price,{from:buyer2}).then((function(res,err){
      assert.equal(err,undefined,'Failed to order tea')
    }))
})
})

it("Buyer 1 completes order of coffee", function() {
  return Boson.deployed().then(function(instance) {
    return instance.confirmReceived(coffee.id,{from:buyer1}).then((function(res,err){
      assert.equal(err,undefined,'Failed to complete order of coffee')
    }))
})
})


it("getBalances", function() {
  return Boson.deployed().then(function(instance) {
    return instance.balanceOf(buyer1).then((function(res,err){
      console.log('balance of buyer 1: ',toToken(res))
      return instance.balanceOf(seller2).then((function(res,err){
        console.log('balance of seller 2: ',toToken(res))
        return instance.getContractBalance().then((function(res,err){
          console.log('Amount held in escrow ',toToken(res))
  
        }))
      }))
    }))
})
})


})


 