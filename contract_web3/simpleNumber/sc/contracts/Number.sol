pragma solidity >=0.4.21 <0.6.0;
contract Number{
    uint256 public Num1;
    event eventSetNum(uint256 n);
    function SetNum(uint256 _n) public returns(bool){
        Num1 = _n;
        emit eventSetNum(Num1);
        return true;
    }
    function GetNum() public view returns(uint256 ret){
        ret = Num1;
    }
}