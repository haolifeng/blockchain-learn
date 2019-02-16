pragma solidity >=0.4.21 <0.6.0;

contract TwoNumber{
    uint256  Num1;
    uint256  Num2;
    event eventSetNum(uint256 n1, uint256 n2);
    function SetNum(uint256 _n1, uint256 _n2) public returns(bool){
        Num1 = _n1;
        Num2 = _n2;
        emit eventSetNum(Num1, Num2);
    }
    function GetNum1() public view returns(uint256 ret){
        ret = Num1;
    }
    function GetNum2() public view returns(uint256 ret){
        ret = Num2;
    }
}