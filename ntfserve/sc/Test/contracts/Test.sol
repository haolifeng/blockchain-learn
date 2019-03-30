pragma solidity ^0.4.24;
contract Test {
	event ecrecoveEvent(address  a);
	function k_ecrecover(bytes32 msgHash, uint8 v, bytes32 r, bytes32 s) public  returns(address) {
	    address ret =  ecrecover(msgHash,v,r,s);
        emit ecrecoveEvent(ret);
        return ret;
    }
}
