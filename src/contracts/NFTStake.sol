// SPDX-License-Identifier: UNLICENSED


import "../lib/@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "../lib/@openzeppelin/contracts/access/Ownable.sol";
import "../lib/@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "../lib/@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "../lib/@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "../lib/@openzeppelin/contracts/utils/introspection/ERC165Storage.sol";
import "../lib/@openzeppelin/contracts/utils/Strings.sol";
import "../lib/@openzeppelin/contracts/utils/EnumerableSet.sol";
import "../lib/@openzeppelin/contracts/utils/math/SafeMath.sol";
import "../lib/@openzeppelin/contracts/access/Pausable.sol";


pragma solidity ^0.8.0;
// NFT Staking pools


/*
ESTE CONTRATO CREA PISCINAS DE ACUERDO NFT CON RECOMPENSAS FIJAS. LAS RECOMPENSAS SE BASAN EN CICLOS Y SE PUEDEN IMPLEMENTAR MULTIPLICADORES.
-CREAR PISCINA REQUIERE CONTRATO NFT Y CONTRATO TOKEN ERC20 COMO ARGUMENTOS
-EL CONTRATO NFT DEBE SER ERC721
-CADA PISCINA TIENE CICLO Y CICLO MÁXIMO. POR EJEMPLO, UNA PISCINA PUEDE RECOMPENSAR 20 TOKENS CADA 8 HORAS Y MÁXIMO 5 VECES.
-EL USUARIO PUEDE RECLAMAR UNO POR UNO O MÚLTIPLES NFTS A LA VEZ, SE GUARDARÁN LOS RECLAMOS RESANINADOS.
-NO SE PUEDE RETIRAR UN NFT DE NUEVO SI SE RECLAMA LA CANTIDAD MÁXIMA DEL CICLO, POR EJEMPLO, SI RECLAMAS TU RECOMPENSA DE 10 CICLOS Y EL PISCINA TIENE EL LÍMITE DE 10 CICLOS, NO PUEDES RECIBIR ESE NFT MÁS.
-Puede crearse una cantidad infinita de parejas.
-MULTIPLICADOR DE RECOMPENSAS POR PARTE DEL FIRMADOR DE LA PISCINA


implentar multiplicador 
*/

 contract NFTStake is Ownable, ERC165Storage,Pausable {
    using Strings for uint256;
    using EnumerableSet for EnumerableSet.UintSet;
    using SafeMath for uint256;

    ERC20 public rewardContract;
    IERC721 public nftContract;
 


    constructor(){
        _registerInterface(IERC721Receiver.onERC721Received.selector);

    }

    


    uint256 public currentPoolId = 0;
 
    // pool id => pool
    mapping(uint256 => NFTPool) public Pools;

    // recompensas restantes del grupo
    mapping(uint256 => uint256) public ClaimedPoolRewards;

    // pool id => tokenId => stake
    mapping(uint256 => mapping(uint256 => Stake)) public Stakes;

    // mapping of active staking count by wallet.
    //poolid => address =>  active stake count. will be used with pool parameter: maxStakePerWallet
    //poolid => address =>  active staked tokenids count.
    mapping(uint256 => mapping(address => uint256)) public ActiveStakes;
    mapping(uint256 => mapping(address => EnumerableSet.UintSet)) private CurrentStakedTokens;

    event PoolCreated(
        uint256 pid, 
        address nftContract,
        address rewardContract,
        uint256 rewardSupply,
        uint256 cycle,
        uint256 rewardPerCycle,
        uint256 maxCycles,
        uint256 endingDate,
        bool isActive,
        address multiplierSigner,
        uint256 maxStakePerWallet);

    event PoolEnded(uint256 pid);

    event Staked(uint256 pid,
        uint256[] tokenIds);

    event UnStaked(uint256 pid,
        uint256[] tokenIds);

    event Claimed(uint256 pid,
        uint256[] tokenIds,
        uint256 _total);

    struct NFTPool {
        IERC721 nftContract;
        ERC20 rewardContract;
        uint256 rewardSupply;
        uint256 cycle;
        uint256 rewardPerCycle;
        uint256 maxCycles;
        uint256 endingDate;
        bool isActive;
        address multiplierSigner;
        uint256 maxStakePerWallet;
    }

    struct Stake {
        uint256 poolId;
        address beneficiary;
        uint256 startTime;
        IERC721 nftContract;
        uint256 tokenId;
        uint256 claimedTokens;
        uint256 lastCycle;
        bool isActive;
    }


   

    function createPool(NFTPool memory _pool) external onlyOwner {
        uint256 currentId = currentPoolId;
        Pools[currentId] = _pool;

        emit PoolCreated(currentPoolId,
            address(_pool.nftContract),
            address(_pool.rewardContract),
            _pool.rewardSupply,
            _pool.cycle,
            _pool.rewardPerCycle,
            _pool.maxCycles,
            _pool.endingDate,
            _pool.isActive,
            _pool.multiplierSigner,
            _pool.maxStakePerWallet);
        currentPoolId += 1;
        

        require(_pool.rewardContract.transferFrom(msg.sender, address(this), _pool.rewardSupply));
    }

    function updatePool(uint256 pid, uint256 endingDate, uint256 maxCycles, uint256 rewardSupply) external onlyOwner {
        Pools[pid].endingDate = endingDate;
        Pools[pid].maxCycles = maxCycles;
        Pools[pid].rewardSupply = rewardSupply;
    }

    function endPool(uint256 pid) external onlyOwner {
        // transfer remaining funds to owner
        require(Pools[pid].endingDate < block.timestamp || Pools[pid].rewardSupply >= ClaimedPoolRewards[pid], "CANNOT END POOL.");
        uint256 remainingTokens = Pools[pid].rewardSupply - ClaimedPoolRewards[pid];
        Pools[pid].isActive = false;
        require(Pools[pid].rewardContract.transfer(owner(), remainingTokens));
        emit PoolEnded(pid);
    }

    function enterStaking(uint256 pid, uint256[] memory tokenIds) external whenNotPaused {
        require(Pools[pid].rewardSupply >= ClaimedPoolRewards[pid] && Pools[pid].endingDate > block.timestamp, "pool tenga dinero aun!!!!! q no esta vacio");
        require(ActiveStakes[pid][msg.sender] <= Pools[pid].maxStakePerWallet, "YA APUESTA MAX. CANTIDAD DE NFT EN ESTA PISCINA");
        require(tokenIds.length <= Pools[pid].maxStakePerWallet, "YA APUESTA MAX. CANTIDAD DE NFT EN ESTA PISCINA..");
        // transfer NFTs to contract
        uint256 poolMaxCycle = Pools[pid].maxCycles;
        for (uint256 i = 0; i < tokenIds.length; i++) {
            // comprobar si el token se aplicó antes
            require(Stakes[pid][tokenIds[i]].lastCycle < poolMaxCycle, "Ya no puedo apostar");
            require(Stakes[pid][tokenIds[i]].isActive == false, "NFT ya apostado. ?!?!?");
         

            Stake memory newStake = Stake(
                pid,
                msg.sender,
                block.timestamp,
                Pools[pid].nftContract,
                tokenIds[i],
                Stakes[pid][tokenIds[i]].claimedTokens,
                Stakes[pid][tokenIds[i]].lastCycle,
                true
            );

            Stakes[pid][tokenIds[i]] = newStake;
            ActiveStakes[pid][msg.sender] += 1;
            CurrentStakedTokens[pid][msg.sender].add(tokenIds[i]);
            // bytes32 method = keccak256("transferFrom");
            // bytes4(keccak256(bytes('transferFrom(address,address,uint256)')));
            (bool success,) = address(Pools[pid].nftContract).call(abi.encodeWithSelector(0x23b872dd, msg.sender, address(this), tokenIds[i]));
            require(success, "CANNOT TRANSFER NFT");
            // create stakes for each booltranfer=buscarerc721
            // pool id => tokenId => stake

        }

        emit Staked(pid, tokenIds);
    }
    // @param multiplierParams is array of uint256s, first param is multiplier, second one is timestamp, rest is token ids to claim.
    // @param multiplierParams hash must be signed by pool signer.
    function leaveStaking(uint256 pid, uint256[] memory tokenIds) external whenNotPausedStake {
       uint256 poolMaxCycle = Pools[pid].maxCycles;
        uint256 _total = 0;
        for (uint256 i = 0; i < tokenIds.length; i++) {
            require(Stakes[pid][tokenIds[i]].beneficiary == msg.sender, "Not the stake owner");
            require(Stakes[pid][tokenIds[i]].isActive, "Not staked");
            if (Stakes[pid][tokenIds[i]].lastCycle < poolMaxCycle) {
                (uint256 toBeClaimed, uint256 currentCycleCount) = _claimCalculate(pid, tokenIds[i]);
                _claim(pid, tokenIds[i], toBeClaimed, currentCycleCount);
                _total += toBeClaimed;
            }

            Stakes[pid][tokenIds[i]].isActive = false;
            CurrentStakedTokens[pid][msg.sender].remove(tokenIds[i]);
        }
        if (_total > 0) {
            Pools[pid].rewardContract.approve(address(this),type(uint128).max);
            require(Pools[pid].rewardContract.transferFrom(address(this), msg.sender, _total), "CANNOT GIVE REWARD!");
        }
        emit Claimed(pid, tokenIds, _total);
        
        for (uint256 i = 0; i < tokenIds.length; i++) {
            require(Stakes[pid][tokenIds[i]].beneficiary == msg.sender, "Not the stake owner");
            // transferFrom(address,address,uint256) = 0x23b872dd
            (bool success,) = address(Pools[pid].nftContract).call(abi.encodeWithSelector(0x23b872dd, address(this), msg.sender, tokenIds[i]));
            require(success, "CANNOT REFUND NFT? SOMETHING IS WRONG!!!!");
        }
        emit UnStaked(pid, tokenIds);
    }

    // rescata tus tokens, para casos de emergencia. no te preocupes por las recompensas, reinicia el temporizador de recompensas.
    function unStakeWithoutRewards(uint256 pid, uint256[] memory tokenIds) external {
        for (uint256 i = 0; i < tokenIds.length; i++) {
            require(Stakes[pid][tokenIds[i]].beneficiary == msg.sender, "Not the stake owner");
            Stakes[pid][tokenIds[i]].isActive = false; 
            CurrentStakedTokens[pid][msg.sender].remove(tokenIds[i]);
           
            (bool success,) = address(Pools[pid].nftContract).call(abi.encodeWithSelector(0x23b872dd, address(this), msg.sender, tokenIds[i]));
            require(success, "CANNOT REFUND NFT? SOMETHING IS WRONG!!!!");
      
        }
        emit UnStaked(pid, tokenIds);
    }


    function claimRewards(uint256 pid, uint256[] memory tokenIds) external {
        //        require(block.timestamp < Pools[pid].endingDate, "Pool is expired");
        uint256 poolMaxCycle = Pools[pid].maxCycles;
        uint256 _total = 0;
        for (uint256 i = 0; i < tokenIds.length; i++) {
            require(Stakes[pid][tokenIds[i]].beneficiary == msg.sender, "Not the stake owner");
            require(Stakes[pid][tokenIds[i]].isActive, "Not staked");
            if (Stakes[pid][tokenIds[i]].lastCycle < poolMaxCycle) {
                (uint256 toBeClaimed, uint256 currentCycleCount) = _claimCalculate(pid, tokenIds[i]);
                _claim(pid, tokenIds[i], toBeClaimed, currentCycleCount);
                _total += toBeClaimed;
            }

            Stakes[pid][tokenIds[i]].isActive = false;
            CurrentStakedTokens[pid][msg.sender].remove(tokenIds[i]);
        }
        if (_total > 0) {
            Pools[pid].rewardContract.approve(address(this),type(uint128).max);
            require(Pools[pid].rewardContract.transferFrom(address(this), msg.sender, _total), "CANNOT GIVE REWARD!");
        }
        emit Claimed(pid, tokenIds, _total);
    }

  

    

    function _claimCalculate(uint256 pid, uint256 tokenId) internal view returns (uint256, uint256){
        uint256 toBeClaimed = 0;
        uint256 poolMaxClaim = Pools[pid].maxCycles;
        uint256 cyclesSinceStart = (1 days / Pools[pid].cycle);
        if (cyclesSinceStart >= poolMaxClaim) {
            cyclesSinceStart = poolMaxClaim;
        }
        uint256 currentCycleCount = cyclesSinceStart - Stakes[pid][tokenId].lastCycle;
        require(currentCycleCount <= poolMaxClaim, "YOU CANNOT CLAIM THIS STAKE ANYMORE!");
        toBeClaimed += currentCycleCount * Pools[pid].rewardPerCycle;
        return (toBeClaimed, currentCycleCount);
    }

    function _claim(uint256 pid, uint256 tokenId, uint256 toBeClaimed, uint256 currentCycleCount) internal {
        // increase amount and cycle count for that nft, prevent someone else buying it and staking again
        Stakes[pid][tokenId].claimedTokens += toBeClaimed;
        Stakes[pid][tokenId].lastCycle = Stakes[pid][tokenId].lastCycle + currentCycleCount;
        ClaimedPoolRewards[pid] += toBeClaimed;
        ActiveStakes[pid][msg.sender] -= 1;
        CurrentStakedTokens[pid][msg.sender].add(tokenId);
    }


    function activeTokensOf(uint256 pid, address account) external view returns (uint256[] memory){
        uint256 tokenCount = ActiveStakes[pid][account];
        if (tokenCount == 0) {
            // Return an empty array
            return new uint256[](0);
        } else {
            uint256[] memory result = new uint256[](tokenCount);
            uint256 index;
            for (index = 0; index < tokenCount; index++) {
                result[index] = stakedTokenByIndex(pid, account, index);
            }
            return result;
        }
    }

  

    function calculateRewards(uint256 pid, uint256[] memory tokenIds) public view returns (uint256) {
        uint256 totalClaimable = 0;
        uint256 poolMaxClaim = Pools[pid].maxCycles;

        for (uint256 i = 0; i < tokenIds.length; i++) {
            uint256 timePassed = 2 hours; 
            if (timePassed > 0) {
                uint256 cyclesSinceStart = (timePassed / Pools[pid].cycle);
                if (cyclesSinceStart > poolMaxClaim) {
                    cyclesSinceStart = poolMaxClaim;
                }
                uint256 currentCycleCount = cyclesSinceStart.sub(Stakes[pid][tokenIds[i]].lastCycle);
                totalClaimable = totalClaimable.add(currentCycleCount * Pools[pid].rewardPerCycle);
            }
        }
        return totalClaimable;
    }

    function getStakes(uint256 pid, uint256[] memory tokenIds) external view returns (Stake[] memory) {
        Stake[] memory stakes = new Stake[](tokenIds.length);
        for (uint256 i = 0; i < tokenIds.length; i++) {
            stakes[i] = Stakes[pid][tokenIds[i]];
        }
        return stakes;
    }

    function stakedTokenByIndex(uint256 pid, address owner, uint256 idx) public view virtual returns (uint256) {
        return CurrentStakedTokens[pid][owner].at(idx);
    }




    function pause() external onlyOwner whenNotPaused virtual override returns (bool) {
    paused = true;
    emit Pause();
    return true;
  }

  /**
   * @dev called by the owner to unpause, returns to normal state
   */
  function unpause() external onlyOwner whenPaused virtual override returns (bool) {
    paused = false;
    emit Unpause();
    return true;
  }

    function pauseStake() external onlyOwner whenNotPausedStake override virtual returns (bool) {
    paused = true;
    emit Pause();
    return true;
  }

  /**
   * @dev called by the owner to unpause, returns to normal state
   */
  function unpauseStake() external onlyOwner whenPausedStake virtual override returns (bool) {
    paused = false;
    emit Unpause();
    return true;
  }






    
}