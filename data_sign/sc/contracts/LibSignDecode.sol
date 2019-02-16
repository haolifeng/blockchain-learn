pragma solidity >=0.4.21 <0.6.0;
contract LibSignDecode {
    //signedStr
    //HashValue
    function signdecode(bytes memory signature, bytes32 hashdata) public pure returns (address signature_address){
        require(signature.length == 65);

        bytes32 r;
        bytes32 s;
        uint8 v;


        assembly {
            r := mload(add(signature, 32))
            s := mload(add(signature, 64))
            v := and(mload(add(signature, 65)), 255)
        }

        // Version of signature should be 27 or 28, but 0 and 1 are also possible
        if (v < 27) {
            v += 27;
        }

        require(v == 27 || v == 28);

        /* prefix is needed for geth only
        * https://github.com/ethereum/go-ethereum/issues/3731
        */
        bytes memory prefix = "\x19Ethereum Signed Message:\n32";

        signature_address = ecrecover(keccak256(abi.encodePacked(prefix, hashdata)), v, r, s);
    }
    function signdecodeVRS(bytes32 _hashdata,uint8 _v, bytes32 _r, bytes32 _s) public pure returns(address retaddr){
        retaddr = ecrecover(_hashdata,_v,_r,_s);
    }


}
