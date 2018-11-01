pragma solidity ^ 0.4.6;

contract Authority {
    function isAccountActive(address addr) public constant returns(bool);
}

contract LegalAuthority is Authority {

    event NewAddressReg(address indexed addr);

    mapping(address => RegistryEntry) private companyRegistry;
    address public owner;

    address[] pendingRequests;

    uint8 public approved;
    uint8 public declined;
    uint8 public blocked;

    enum RegistryEntryStatus {
        EMPTY,
        PENDING,
        ACTIVE,
        BLOCKED
    }

    struct RegistryEntry {
        string name;
        string alias;
        RegistryEntryStatus status;
    }

    function LegalAuthority() {
        owner = msg.sender;
    }

    // Registration operations
    function register(string name_, string alias_) public {
        RegistryEntry iEntry = companyRegistry[msg.sender];
        if (iEntry.status == RegistryEntryStatus.EMPTY){
            companyRegistry[msg.sender] = RegistryEntry({
                name: name_,
                alias: alias_,
                status: owner == msg.sender ? RegistryEntryStatus.ACTIVE : RegistryEntryStatus.PENDING
            });
            //add Personal request
            if (msg.sender != owner) {
                pendingRequests.push(msg.sender);
                NewAddressReg(msg.sender);
            }
        }
    }

    function account(address addr) public constant returns(string name, string alias, uint8 status) {
      RegistryEntry iEntry = companyRegistry[addr];
      if (iEntry.status == RegistryEntryStatus.ACTIVE) {
          name = iEntry.name;
          alias = iEntry.alias;
          status = uint8(iEntry.status);
      }
    }

    function waitingRequests() public constant returns(address[]) {
        return pendingRequests;
    }

    function waitingRequestDetails(address addr) public constant returns(string name, string alias, uint8 status) {
        RegistryEntry iEntry = companyRegistry[addr];
        if (iEntry.status == RegistryEntryStatus.PENDING) {
            name = iEntry.name;
            alias = iEntry.alias;
            status = uint8(iEntry.status);
        } 
    }

    function approveRequest(address addr) public allowedTo(owner) {
        RegistryEntry iEntry = companyRegistry[addr];
        if (iEntry.status == RegistryEntryStatus.PENDING) {
            iEntry.status = RegistryEntryStatus.ACTIVE;
            removePendingRequest(addr);
            approved ++;
        } else {
            throw;
        }
    }

    function declineRequest(address addr) public allowedTo(owner) {
      RegistryEntry iEntry = companyRegistry[addr];
      if (iEntry.status == RegistryEntryStatus.PENDING) {
          delete companyRegistry[addr];
          removePendingRequest(addr);
          declined ++;
      } else {
          throw;
      }
    }

    function blockAccount(address addr) public allowedTo(owner) {
      RegistryEntry iEntry = companyRegistry[addr];
      if (iEntry.status == RegistryEntryStatus.ACTIVE) {
            iEntry.status = RegistryEntryStatus.BLOCKED;
            blocked ++;
        } else {
            throw;
        }
    }

    function unblockAccount(address addr) public allowedTo(owner) {
      RegistryEntry iEntry = companyRegistry[addr];
      if (iEntry.status == RegistryEntryStatus.BLOCKED) {
            iEntry.status = RegistryEntryStatus.ACTIVE;
            blocked --;
        } else {
            throw;
        }
    }

    function isAccountActive(address addr) public constant returns(bool){
      RegistryEntry iEntry = companyRegistry[addr];
      if (iEntry.status == RegistryEntryStatus.ACTIVE) {
          return true;
      } else {
          return false;
      }
    }

    function removePendingRequest(address addr) internal {
        int index = -1;
        for (uint8 i = 0; i < pendingRequests.length; i++) {
            if (pendingRequests[i] == addr) {
                index = i;
            }
        }
        if (index != -1) {
            for (uint8 j = uint8(index); j<pendingRequests.length-1; j++){
                pendingRequests[j] = pendingRequests[j+1];
            }
            delete pendingRequests[pendingRequests.length-1];
            pendingRequests.length--;
        }
    }

    modifier allowedTo(address addr) {
        if (msg.sender != addr) {
            throw;
        }
        _;
    }
}
