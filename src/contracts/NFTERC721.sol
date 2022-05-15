// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
pragma experimental ABIEncoderV2;

import "../lib/@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "../lib/@openzeppelin/contracts/access/Ownable.sol";
import "../lib/@openzeppelin/contracts/access/Pausable.sol";
import "../lib/@openzeppelin/contracts/utils/Counters.sol";
import "../lib/@openzeppelin/contracts/utils/Context.sol";
import "../lib/@openzeppelin/contracts/utils/Address.sol";
import "../lib/@openzeppelin/contracts/utils/EnumerableSet.sol";
import "../lib/@openzeppelin/contracts/utils/Strings.sol";

interface IERC20 {
    function balanceOf(address owner) external view returns (uint);
    function allowance(address owner, address spender) external view returns (uint);

    function approve(address spender, uint value) external returns (bool);
    function transfer(address to, uint value) external returns (bool);
    function transferFrom(address from, address to, uint value) external returns (bool);
}


contract NFTERC721 is ERC721, Ownable, Pausable {

    using EnumerableSet for EnumerableSet.UintSet;
    using Strings for uint256;


    string public baseURI;

    mapping(uint256 => NFTId) public nftID;

    mapping(address => EnumerableSet.UintSet) private _tokenId;
    
    
    uint256 public MAX_SUPPLY = 399;
    uint256 public MAX_SUPPLY_BALANCE = 3;
    uint256 public maxNumero = 3;


    
    uint256 []  robot0;
    uint256 []  robot1;
    uint256 []  robot2;
    uint256 []  robot3;

    address public tokenReward;

    uint256  public robot0Max = 0;
    uint256  public robot1Max = 0;
    uint256  public robot2Max = 0;
    uint256  public robot3Max = 399;


    struct NFTId {
        uint256 id;
        uint256 numero;
        uint256 pool;
    }

    uint256 public PRICE = 0.02 ether ;

    uint256 public PRICE1 = 0.04 ether;

    uint256 public PRICE2 = 0.06 ether;

    uint256 public PRICE3 = 0.12 ether;

    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdTracker;




  

    constructor(string memory _name, string memory _symbol, address _tokenReward)
        ERC721(_name, _symbol)  {  
             baseURI = "https://ipfs.io/ipfs/";
             tokenReward = _tokenReward;
    }



  
//BALANCE 
    function balanceOf(address owner) public view virtual override returns (uint256) {
        require(owner != address(0), "ERC721: balance query for the zero address");
        return _tokenId[owner].length();
    }

//ID NFT
    function tokenOfOwner(address owner) public view  returns (uint256[] memory) {
        uint256[] memory tokens = new uint256[](_tokenId[owner].length());
        for(uint i=0; i<_tokenId[owner].length(); i++) {
            tokens[i] = _tokenId[owner].at(i);
        }
        return tokens;
    }

//ID NFT
   function tokenOfOwnerByIndex(address owner, uint256 index) public view  returns (uint256) {
        return _tokenId[owner].at(index);
    }

    


//PAGO TOKEN
    function _pagoTOken (uint256 amount ) internal  {
        uint256 allowance = IERC20(tokenReward).allowance(msg.sender, address(this));
        require(amount > 0, "You need to sell at least some tokens");
        require(allowance >= amount, "Check the token allowance");
        IERC20(tokenReward).transferFrom(msg.sender, address(this), amount);
    }




//GUARDAR ROBOTS!!!
    function _guardarRobots(uint256 _numero) internal {
        if(_numero == 0){
            robot0.push(_numero);
        }else if(_numero == 1){
            robot1.push(_numero);
        }else if(_numero == 2){
            robot2.push(_numero);
        }else if(_numero == 3){
            robot3.push(_numero);
        }

    }

//MINT PAGO EN BNB
    function mint2(address _to,  uint256 _numero, uint256 _pool) public whenNotPaused payable {
        uint balance = balanceOf(_to);
        uint256 id = _totalSupply();
        require(id <= MAX_SUPPLY, "hay mas de 10000");
        require(balance <= MAX_SUPPLY_BALANCE, "hay mas de 5");
        require(_numero <= maxNumero, "no se puede mintt");
        require(robot0.length <= robot0Max ,"ya noseee puede mintear robot0!!!");
        require(robot1.length <= robot1Max ,"ya noseee puede mintear robot01!!!");
        require(robot2.length <= robot2Max ,"ya noseee puede mintear robot02!!");
        require(robot3.length <= robot3Max ,"ya noseee puede mintear robot03!!!");
        require(msg.value >= PRICE, "Value below price");

        _guardarRobots(_numero);
        
       

            //se guardan los ID
            _tokenId[_to].add(id);

            //se guardan los numeros

            NFTId memory newNFT = NFTId(
                id,
                _numero,
                _pool
            );

            nftID[id] = newNFT;
 

         _mintAnElement(_to);
    }

    function balanceToken (address _to) public view returns(uint256) {
        uint balanceTokenErc = IERC20(tokenReward).balanceOf(_to);
        return balanceTokenErc;
    }

 //MINT       
    function mint(address _to,  uint256 _numero, uint256 _pool ) public whenNotPaused  {
        _pagoTOken(PRICE);
        uint balance = balanceOf(_to);
        uint256 id = _totalSupply();
        require(id <= MAX_SUPPLY, "hay mas de 10000");
        require(balance <= MAX_SUPPLY_BALANCE, "hay mas de 5");
        require(_numero <= maxNumero, "no se puede mintt");
        require(robot0.length <= robot0Max ,"ya noseee puede mintear robot0!!!");
        require(robot1.length <= robot1Max ,"ya noseee puede mintear robot01!!!");
        require(robot2.length <= robot2Max ,"ya noseee puede mintear robot02!!");
        require(robot3.length <= robot3Max ,"ya noseee puede mintear robot03!!!");
       // uint256 balanceToken = IERC20(tokenReward).balanceOf(_to);
        //require(balanceToken <= PRICE, "no te alcanzaaaaa rataaaa!!!");
       // require(IERC20(tokenReward).transferFrom(msg.sender, address(this), PRICE));

        _guardarRobots(_numero);
        
       

            //se guardan los ID
            _tokenId[_to].add(id);

            //se guardan los numeros

            NFTId memory newNFT = NFTId(
                id,
                _numero,
                _pool
            );

            nftID[id] = newNFT;
 

         _mintAnElement(_to);
    }



//URL COMPLETA DEL API DEL NFT
        function tokenURI(uint256 tokenId) public view virtual override  returns (string memory) {
        require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");
        string memory currentBaseURI = _baseURI();
        string memory apiUri = nftID[tokenId].id.toString();
        return
            (bytes(currentBaseURI).length > 0 &&
                bytes(apiUri).length > 0)
                ? string(abi.encodePacked(currentBaseURI,apiUri))
                : "";
    }

//CANTIDAD MINT ROBOT 0
    function returnRobot0() public view returns(uint256){
        uint256 x = robot0.length;
        return x ;
    }
//CANTIDAD MINT ROBOT 1
    function returnRobot1() public view returns(uint256){
        uint256 x = robot1.length;
        return x ;
    }
//CANTIDAD MINT ROBOT 2
    function returnRobot2() public view returns(uint256){
        uint256 x = robot2.length;
        return x ;
    }
//CANTIDAD MINT ROBOT 3
    function returnRobot3() public view returns(uint256){
        uint256 x = robot3.length;
        return x ;
    } 

//SET DE ROBOT 0
  function setRobot0(uint _robot) public onlyOwner {
         robot0Max = _robot; 
    }

//SET DE ROBOT 1
    function setRobot1(uint _robot) public onlyOwner {
         robot1Max = _robot; 
    }
//SET DE ROBOT 2
    function setRobot2(uint _robot) public onlyOwner {
         robot2Max = _robot; 
    }
//SET DE ROBOT 3
   function setRobot3(uint _robot) public onlyOwner {
         robot3Max = _robot; 
    }  

//RETURN ROBOT 0

    function  robot0Supply() public view returns (uint256) {
        return robot0Max;
    }
//RETURN ROBOT 1
    function  robot1Supply() public view returns (uint256) {
        return robot1Max;
    }  

//RETURN ROBOT 2   
    function  robot2Supply() public view returns (uint256) {
        return robot2Max;
    }
//RETURN ROBOT 3    
    function  robot3Supply() public view returns (uint256) {
        return robot3Max;
    }

//SET DE PRECIO  
    function setPrice(uint _precio) public onlyOwner {
         PRICE = _precio; 
    }

//SET DE SUPPLY MAXIMO
    function setSupply(uint _supply) public onlyOwner {
         MAX_SUPPLY = _supply; 
    }

//SET DE SUPPLY DE BALANCE
    function setSupplyBalance(uint _supply) public onlyOwner {
         MAX_SUPPLY_BALANCE = _supply; 
    }

//SETO DE NUMERO DE MINT HASH
    function setNumero(uint numero) public onlyOwner {
         maxNumero = numero; 
    }

//RETURN MAXIMO DE MINTEO 
    function  maxSupply() public view returns (uint256) {
        return MAX_SUPPLY;
    }

//RETURN MAXIMO DE NFT POR CUENTA
    function  maxBalance() public view returns (uint256) {
        return MAX_SUPPLY_BALANCE;
    }

//RETURN NUMERO DE HASH
    function  maxNumeros() public view returns (uint256) {
        return maxNumero;
    }

//TOTAL SUPPLY PUBLIC 
    function totalMint() public view returns (uint256) {
        return _totalSupply();
    }

//TOTAL SUPPLY INTERNAL 
    function _totalSupply() internal view returns (uint) {
        return _tokenIdTracker.current();
    }



//MINT ELEMENT
    function _mintAnElement(address _to) private {
        uint id = _totalSupply();
        _tokenIdTracker.increment();
        _safeMint(_to, id);
    }

//RETURN BASE URI
    function _baseURI() internal view virtual override returns (string memory) {
        return baseURI;
    }

//SET BASE URI
    function setBaseURI(string memory _newBaseURI) public onlyOwner {
        baseURI = _newBaseURI;
    }

//RETIRAR FONDOS
    function withdrawAll() external  onlyOwner {
        uint256 balance = IERC20(tokenReward).balanceOf(address(this));
         IERC20(tokenReward).transferFrom(msg.sender, address(this), balance);

    }   
    function withdrawAllBNB() external  onlyOwner {
        (bool success, ) = msg.sender.call{value:address(this).balance}("");
        require(success, "Transfer failed.");

    }   

//PAUSE

    function pause() external onlyOwner whenNotPaused  override returns (bool) {
        paused = true;
        emit Pause();
        return true;
     }

//UN PAUSE
    function unpause() external onlyOwner whenPaused override returns (bool) {
        paused = false;
        emit Unpause();
        return true;
  }

//TRANSFER INTERNO
function _transfer(address from, address to, uint256 tokenId ) internal virtual override {
        require(ERC721.ownerOf(tokenId) == from, "ERC721: transfer from incorrect owner");
        require(to != address(0), "ERC721: transfer to the zero address");

        _beforeTokenTransfer(from, to, tokenId);

        // Clear approvals from the previous owner
        _approve(address(0), tokenId);

        _tokenId[from].remove(tokenId);
        _tokenId[to].add(tokenId);

        super._transfer(from, to, tokenId);

        emit Transfer(from, to, tokenId);
    }

 

}
