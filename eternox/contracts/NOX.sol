// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title Eternox Token (NOX)
 * @notice MIND20 standard token on Mindchain
 * @dev ERC-20 compatible with burn mechanism
 *
 * Token Details:
 *   Name:     Eternox
 *   Symbol:   NOX
 *   Supply:   1,000,000,000 (1 Billion)
 *   Decimals: 18
 *   Chain:    Mindchain (Chain ID: 9996)
 *   Standard: MIND20
 *
 * Features:
 *   - Fixed supply (no mint after deployment)
 *   - Burn function (deflationary)
 *   - DEX fee distribution compatible
 *   - Governance ready
 */

interface IMIND20 {
    function totalSupply() external view returns (uint256);
    function balanceOf(address account) external view returns (uint256);
    function transfer(address to, uint256 amount) external returns (bool);
    function allowance(address owner, address spender) external view returns (uint256);
    function approve(address spender, uint256 amount) external returns (bool);
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
}

contract EternoxToken is IMIND20 {

    // ── Token metadata ──
    string  public constant name     = "Eternox";
    string  public constant symbol   = "NOX";
    uint8   public constant decimals = 18;
    uint256 public constant TOTAL_SUPPLY = 1_000_000_000 * 10 ** 18;

    // ── State ──
    mapping(address => uint256)                     private _balances;
    mapping(address => mapping(address => uint256)) private _allowances;
    uint256 private _totalSupply;
    address public  owner;

    // ── Events ──
    event Burn(address indexed from, uint256 amount);
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    // ── Modifiers ──
    modifier onlyOwner() {
        require(msg.sender == owner, "NOX: caller is not owner");
        _;
    }

    constructor() {
        owner = msg.sender;
        _totalSupply = TOTAL_SUPPLY;
        _balances[msg.sender] = TOTAL_SUPPLY;
        emit Transfer(address(0), msg.sender, TOTAL_SUPPLY);
    }

    // ── IMIND20 Implementation ──
    function totalSupply() external view override returns (uint256) { return _totalSupply; }

    function balanceOf(address account) external view override returns (uint256) {
        return _balances[account];
    }

    function transfer(address to, uint256 amount) external override returns (bool) {
        _transfer(msg.sender, to, amount);
        return true;
    }

    function allowance(address _owner, address spender) external view override returns (uint256) {
        return _allowances[_owner][spender];
    }

    function approve(address spender, uint256 amount) external override returns (bool) {
        _approve(msg.sender, spender, amount);
        return true;
    }

    function transferFrom(address from, address to, uint256 amount) external override returns (bool) {
        uint256 currentAllowance = _allowances[from][msg.sender];
        require(currentAllowance >= amount, "NOX: insufficient allowance");
        unchecked { _approve(from, msg.sender, currentAllowance - amount); }
        _transfer(from, to, amount);
        return true;
    }

    // ── Burn ──
    function burn(uint256 amount) external {
        require(_balances[msg.sender] >= amount, "NOX: burn amount exceeds balance");
        _balances[msg.sender] -= amount;
        _totalSupply           -= amount;
        emit Transfer(msg.sender, address(0), amount);
        emit Burn(msg.sender, amount);
    }

    // ── Ownership ──
    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "NOX: new owner is zero address");
        emit OwnershipTransferred(owner, newOwner);
        owner = newOwner;
    }

    function renounceOwnership() external onlyOwner {
        emit OwnershipTransferred(owner, address(0));
        owner = address(0);
    }

    // ── Internal ──
    function _transfer(address from, address to, uint256 amount) internal {
        require(from != address(0), "NOX: transfer from zero address");
        require(to   != address(0), "NOX: transfer to zero address");
        require(_balances[from] >= amount, "NOX: insufficient balance");
        unchecked {
            _balances[from] -= amount;
            _balances[to]   += amount;
        }
        emit Transfer(from, to, amount);
    }

    function _approve(address _owner, address spender, uint256 amount) internal {
        require(_owner   != address(0), "NOX: approve from zero address");
        require(spender  != address(0), "NOX: approve to zero address");
        _allowances[_owner][spender] = amount;
        emit Approval(_owner, spender, amount);
    }
}
