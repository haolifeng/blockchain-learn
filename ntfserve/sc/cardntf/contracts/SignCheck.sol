pragma solidity >=0.4.21 <0.6.0;

contract SignCheck {

    address retAddr;
    bytes32 rethash;

    function check(bytes32 hash, uint8 v, bytes32 r, bytes32 s) public{
        retAddr = ecrecover(hash, v, r, s);
    }
    function GetAddr() public returns(address ret){
        ret = retAddr;
    }
    function kecshash(bytes str, uint256 d, address add1) public {
        rethash = keccak256(abi.encodePacked(str,d,add1));

    }
    function GetHash() public returns(bytes32 h) {
        h = rethash;
    }

    function scheck(bytes str, uint256 d, address add1, uint8 v, bytes32 r, bytes32 s) public returns(address ret){
        kecshash(str,d,add1);
        ret = check(rethash,v,r,s);
    }

}
