pragma solidity >=0.4.21 <0.6.0;
import "./ERC721.sol";
import "./LibSignDecode.sol";
contract CardBase is ERC721,LibSignDecode{
    address public nftmnger;
    struct Card {
        bytes24  cardObjid; // 直接使用mongodb自动生成的objectid,不是erc721 token ID
        uint256  cardtype;
        bool     activated; //是否是激活状态
    }
    Card[] cards; //卡数组， 下标即tokenid
    //a mpping from card IDs to the address the owns them. all cards have some valid owner address,
    //card[0] with a solid owner
    mapping(uint256=>address) public mapCardOwner; //tokenid => owner 卡的主人
    //objectid=>tokenid; 卡objectid 到tokenid的映射,objectid使用mongodb自动创建的id
    mapping(bytes24=>uint256) public mapObjectIdToTokenId;
    //a mapping from owner address to count of tokens that address owns
    //Used internally inside balanceOf() to resolve ownership count
    mapping(address=>uint256[]) public mapOwnerCardsAccount;

    // a mapping from cardid to an address that has been approved to call (transferFrom). each card
    //can only have one approved address for transfer at any time. a zero value means no approval is outstanding.
    mapping(uint256=>address) public cardIndexToApproved;


    event CreateCard(uint256 tokenid,bytes24 cardid,  uint256 cardtype, uint256 nerror);



    /////////////////////////////////////////////////////////////////////////
    //event SignEvent(bytes32 hashv, bytes singer, address owner, bytes24 cardid, uint256 cardtype); --测试使用

    ///////////////////////////////
//创建card, 参数:cardobjid, cardtype, 和签名字符串
    function createNtfCard(bytes24 _cardid, uint256 _cardtype,address _cardowner,uint8 v, bytes32 r, bytes32 s) public returns(bool){

        if(mapObjectIdToTokenId[_cardid] != uint256(0)){
            emit CreateCard(0,_cardid,_cardtype,20005); //重复提交
            return false;
        }

        //verify signer
       bytes32 hashval =  keccak256(abi.encodePacked(_cardid,_cardtype,_cardowner));

        //emit SignEvent(hashval,signer,msg.sender,_cardid, _cardtype);  -- 测试使用

        if(signdecodeVRS(hashval,v,r,s) != nftmnger){  //接收到的信息不是调用者的
            emit CreateCard(0,_cardid,_cardtype,20003);
            return false;
        }  //can prove me is me


        //tongg
        Card memory card = Card(_cardid, _cardtype, true);

        uint256 cardTokenId = cards.push(card)-1;
        mapObjectIdToTokenId[card.cardObjid] = cardTokenId;
        mapCardOwner[cardTokenId] = _cardowner;
        mapOwnerCardsAccount[_cardowner].push(cardTokenId);

        emit CreateCard(cardTokenId,card.cardObjid, card.cardtype,20000);


    }
    //
    function getCardInfo(bytes24 _cardid) public view returns(uint256 tokenid, uint256 _cardtype, bool _activated, address _owner){
        tokenid = mapObjectIdToTokenId[_cardid];
        Card storage card = cards[tokenid];
        _cardtype = card.cardtype;
        _activated = card.activated;
        _owner = mapCardOwner[tokenid];
    }
    function tokensOfOwner(address _owner) external view returns (uint256[] memory tokenIds){
        tokenIds = mapOwnerCardsAccount[_owner];
    }
    //
    function getCardInfoByTokenId(uint256 _tokenid) public view returns(uint256 _cardtype, bool _activated, address _owner){
        Card storage card = cards[_tokenid];
        _cardtype = card.cardtype;
        _activated = card.activated;
        _owner = mapCardOwner[_tokenid];
    }

    /*************stand erc721 sender operator*/
    function totalSupply() public view returns (uint256 total){
        return cards.length-1;
    }
    function balanceOf(address _owner) public view returns (uint256 balance){
        return mapOwnerCardsAccount[_owner].length;
    }
    function ownerOf(uint256 _tokenId) external view returns (address owner){
        return mapCardOwner[_tokenId];
    }
    function approve(address _to, uint256 _tokenId) external{
        require(mapCardOwner[_tokenId] == msg.sender);

        cardIndexToApproved[_tokenId] = _to;
        emit Approval(msg.sender, _to, _tokenId);
    }
    function transfer(address _to, uint256 _tokenId) external{
        require(_to != address(0));
        require(_to != address(this));
        require(mapCardOwner[_tokenId] == msg.sender);
        mapOwnerCardsAccount[_to].push(_tokenId);
        mapCardOwner[_tokenId] = _to;

        uint256[] storage TokenIdarray = mapOwnerCardsAccount[msg.sender];
        uint256 Index = 0;
        for(uint256 i = 0; i< TokenIdarray.length;i++ ){
            if(TokenIdarray[i] == _tokenId){
                delete TokenIdarray[i];
                Index = i;
                break;
            }
        }
        for(uint256 j = Index; j < TokenIdarray.length-1;j++){
            TokenIdarray[j]= TokenIdarray[j+1];
        }
        TokenIdarray.pop();

        emit Transfer(msg.sender, _to, _tokenId);
    }
    function transferFrom(address _from, address _to, uint256 _tokenId) external{
        require(_to != address(0));
        require(_to != address(this));

        require(cardIndexToApproved[_tokenId] == msg.sender);
        require(mapCardOwner[_tokenId] == _from);
        mapOwnerCardsAccount[_to].push(_tokenId);
        mapCardOwner[_tokenId] = _to;

        uint256[] storage TokenIdarray = mapOwnerCardsAccount[_from];
        uint256 Index = 0;
        for(uint256 i = 0; i< TokenIdarray.length;i++ ){
            if(TokenIdarray[i] == _tokenId){
                delete TokenIdarray[i];
                Index = i;
                break;
            }
        }
        for(uint256 j = Index; j < TokenIdarray.length-1;j++){
            TokenIdarray[j]= TokenIdarray[j+1];
        }
        TokenIdarray.pop();
        emit Transfer(_from, _to, _tokenId);

    }
    function supportsInterface(bytes4 ) external view returns (bool){
        return false;

    }

    /**/

    constructor() public {
        Card memory card = Card("0_index", 0, false);
        uint256 cardTokenId=cards.push(card)-1;
        mapObjectIdToTokenId[card.cardObjid] = cardTokenId;
        mapCardOwner[cardTokenId] = msg.sender;
        mapOwnerCardsAccount[msg.sender].push(cardTokenId);

        nftmnger = msg.sender; //deployman is the nftmnger;

    }
}
