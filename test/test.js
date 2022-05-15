
const NFTStake = artifacts.require("./NFTStake.sol")
const NFTERC721 = artifacts.require("./NFTERC721.sol")
const TestERC20 = artifacts.require("./TestERC20.sol")

contract ("NFTStake", async()=>{
    let nftStake 
    let tokenReward;
    let nftToken;


    before(async()=>{

        tokenReward = await TestERC20.deployed("asWAR", "WAR", "60000000")
        nftToken = await NFTERC721.deployed("nftwar", "nftwar")
        nftStake = await NFTStake.deployed(nftToken.address,tokenReward.address )

    })

    
    describe("deployed", async()=>{

        it("cuenta del dueño", async()=>{
            const owner = await nftStake.owner()
            assert.equal(owner , "0x45E97F94074AdCF0A599f77C2cB7DAEFe7f4Dd30")

        })
        it("otros tokens", async()=>{
          
            const nft = await nftToken.address
            assert.equal(nft , nftToken.address)

            const owner = await nftStake.owner()

            const erc20 = await tokenReward.address
            assert.equal(erc20 , tokenReward.address)

            await tokenReward.approve(NFTStake.address, 100000000);

           const balanceof = await tokenReward.balanceOf(tokenReward.address);
           console.log(balanceof)

            const nftMint = await nftToken.mint(owner, [1])
            const nftsss = await nftToken.mint(owner, [2])
            const prueba = await nftToken.mint("0xe7e531217D99b47b8d2B8e38d37603B2e3F441D2", [3])
         
          
            const nftTranfer = nftToken.approve(nftStake.address, [1])

            const nftTranfer2 = nftToken.approve(nftStake.address, [2])

          /**   const address = "0xe7e531217D99b47b8d2B8e38d37603B2e3F441D2"

            const nftTranfer3 = nftToken.transferFrom(address,nftStake.address, [3])
        
         */





        })

    })  

        

    describe("NFTStake", async()=>{
        it("armando stake y pool", async()=>{
            const owner = await nftStake.owner()
            const currentTimeStamp = Math.floor(Date.now() / 1000);
            const startTime = currentTimeStamp 
            const endingDate = startTime + 30 * 24 * 60 * 60;

            const _pool = {
                "nftContract" :nftToken.address , 
                "rewardContract": tokenReward.address, 
                 "rewardSupply": 1000000,
                "cycle": 3,
                "rewardPerCycle": 20000,
                "maxCycles": 52,
                "endingDate": endingDate,
                "isActive": true,
                "multiplierSigner": owner,
                "maxStakePerWallet": 3


            }
  

           const nftpoll = await nftStake.createPool(_pool)
         
           const pool = await nftStake.Pools(0)

           const stake = await nftStake.enterStaking(0, [1])

           const stake2 = await nftStake.enterStaking(0, [2])


           const calculateRewards = await nftStake.calculateRewards(0, [1])



           const ClaimedPoolRewards = await nftStake.ClaimedPoolRewards(0)
           console.log(ClaimedPoolRewards)


          /** const stake3 = await nftStake.enterStaking(0, [3])

           const unStakeWithoutRewards = await nftStake.unStakeWithoutRewards(0, [1])
           console.log(unStakeWithoutRewards)*/


           const leaveStaking = await nftStake.leaveStaking(0, [1])
           console.log(leaveStaking)


            
      

       
        })


        


    })
   

    


})