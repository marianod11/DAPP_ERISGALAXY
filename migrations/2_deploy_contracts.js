const NFTStake = artifacts.require("NFTStake")
const TestERC20 = artifacts.require("TestERC20")
const NFTERC721 = artifacts.require("NFTERC721")


module.exports = function (deployer) {
    deployer.deploy(NFTStake).then(function () {
        console.log('Stake Contract Deployed: ', NFTStake.address)
        return deployer.deploy(TestERC20, "ERC20","er20", "1000000000000000000").then(() => {
            console.log("ERC20 Contract Deployed",TestERC20.address)
            return deployer.deploy(NFTERC721, "nft21","nft22").then(() => {
                console.log("NFT Contract Deployed",NFTERC721.address)
            })
        })
    })
};
