pragma solidity ^0.4.23;

contract CCGX
{
    function transfer(address receiver, uint amount) external;
    function balanceOf(address recipient) external returns (uint256);
}

contract Ownable
{

    address public owner;

    event OwnershipTransferred(
        address indexed previousOwner,
        address indexed newOwner
    );

    /**
     * @dev The Ownable constructor sets the original `owner` of the contract to the sender
     * account.
     */
    constructor() public {
        owner = msg.sender;
    }

    /**
     * @dev Throws if called by any account other than the owner.
     */
    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    /**
     * @dev Allows the current owner to transfer control of the contract to a newOwner.
     * @param _newOwner The address to transfer ownership to.
     */
    function transferOwnership(address _newOwner) public onlyOwner {
        _transferOwnership(_newOwner);
    }

    /**
     * @dev Transfers control of the contract to a newOwner.
     * @param _newOwner The address to transfer ownership to.
     */
    function _transferOwnership(address _newOwner) internal {
        require(_newOwner != address(0));
        emit OwnershipTransferred(owner, _newOwner);
        owner = _newOwner;
    }
}

contract CCGX_OTC_Trade_Desk is Ownable
{
    CCGX public tokenReward;
    address addressOfTokenUsedAsReward;
    trcToken trc10_tokenid  = 1000010;

    constructor() public {}

    function SwapToTRC10(address toAddress, uint256 tokenValue, trcToken id) payable public
    {
        toAddress.transferToken(tokenValue, id);
    }

    function SwapToTRC20(address TRC20_Address) public payable returns(trcToken, uint256){
    addressOfTokenUsedAsReward = TRC20_Address;
    tokenReward = CCGX(addressOfTokenUsedAsReward);
    trcToken id = msg.tokenid;
    uint256 value = msg.tokenvalue;
    if (id == trc10_tokenid){
    tokenReward.transfer(msg.sender, value * 100000000 / 10);
    }
    return (id, value);
    }

    function getTRC10TokenBalance(trcToken id) public view returns (uint256)
    {
        return address(this).tokenBalance(id);
    }

    function getTRC20TokenBalance(address TRC20_Address) external returns (uint256)
    {
    addressOfTokenUsedAsReward = TRC20_Address;
    tokenReward = CCGX(addressOfTokenUsedAsReward);
    uint256 balance = tokenReward.balanceOf(address(this));
    return balance;
    }

    // @dev Returns contract ETH balance
    function getBalance() public view returns (uint256)
    {
        return address(this).balance;
    }

    // @dev Transfers TRX from contract to specified address
    function withdrawTRX(address _address, uint256 _amount) onlyOwner public returns (uint256)
    {
        // transfer reward to account
        _address.transfer(_amount);
    }

    // @dev Transfers TRX from specified address to contract
    function depositTRX() public payable onlyOwner returns (bool)
    {
        return true;
    }

}
