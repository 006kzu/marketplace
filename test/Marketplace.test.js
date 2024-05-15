/* eslint-disable no-undef */
const Marketplace = artifacts.require('./Marketplace.sol')
require('chai')
    .use(require('chai-as-promised'))
    .should()

contract('Marketplace', ([deployer, seller, buyer]) => {
    let marketplace

    before(async () => {
        marketplace = await Marketplace.deployed()
    })

    describe('deployment', async () => {
        it('deploys successfully', async () => {
            const address = await marketplace.address
            assert.notEqual(address, 0x0)
            assert.notEqual(address, '')
            assert.notEqual(address, null)
            assert.notEqual(address, undefined)
        })
        it('has a name', async () => {
            const name = await marketplace.name()
            assert.equal(name, 'Dapp University Marketplace')
        })
    })



    describe('products', async () => {
        let result, productCount


        before(async () => {
            result = await marketplace.createProduct('Iphone X', web3.utils.toWei('1', 'Ether'), { from: seller })
            productCount = await marketplace.productCount();
        })

        it('creates products', async () => {
            //SUCCESS
            assert.equal(productCount, 1);
            const event = result.logs[0].args;
            assert.equal(event.id.toNumber(), productCount.toNumber(), 'id is correct');
            assert.equal(event.name, 'Iphone X', 'name is correct');
            assert.equal(event.price, '1000000000000000000' , 'price is correct');
            assert.equal(event.owner, seller, 'is correct');
            assert.equal(event.purchased, false , 'purchased is correct');

            //FAILURE product must have a name
            await marketplace.createProduct('', web3.utils.toWei('1', 'Ether'), { from: seller }).should.be.rejected;
            //FAILURE product must have a price
            await marketplace.createProduct('Iphone X', 0, { from: seller }).should.be.rejected;
        })

        it('Lists products', async () => {
            const product = await marketplace.products(productCount);
            assert.equal(product.id.toNumber(), productCount.toNumber(), 'id is correct');
            assert.equal(product.name, 'Iphone X', 'name is correct');
            assert.equal(product.price, '1000000000000000000' , 'price is correct');
            assert.equal(product.owner, seller, 'is correct');
            assert.equal(product.purchased, false , 'purchased is correct');
        })
    })
})