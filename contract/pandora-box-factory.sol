pragma solidity ^ 0.4.6;

contract Authority {
    function isAccountActive(address addr) public constant returns(bool);
}
// TODO maybe add sender ecTag to an event for the purpose of file filtering
contract PandoraBoxFactory {
    address public owner;
    uint8 public boxCount = 0;
    Authority public authority;
    // Events
    event NewBoxCreatedEvent(address addr, uint number, address sender, address recipient);

    function PandoraBoxFactory(address authority_) {
        owner = msg.sender;
        authority = Authority(authority_);
    }

    function createNewBox(address sender, address recipient, uint256 senderEcTag, uint256 fingerprint) {
        if (authority.isAccountActive(msg.sender)) {
            boxCount++;
            address newBox = new PandoraBox(boxCount, sender, recipient, senderEcTag, fingerprint, address(authority));
            NewBoxCreatedEvent(newBox, boxCount, sender, recipient);
        }
    }
}

contract PandoraBox {

    //Enums
    enum BoxStatus {
        CLOSED,
        REQUESTED,
        OPENED
    }

    event BoxStatusChangedEvent(BoxStatus status, address author);

    uint8 public number;
    address public sender; //will be the owner of the contract
    address public recipient;
    uint256 public fingerprint;
    uint256 public senderEcTag;
    uint256 public recipientEcTag;
    BoxStatus public status;

    Authority authority;

    //Constructor
    function PandoraBox(uint8 _boxNumber, address _sender, address _recipient, uint256 _senderEcTag, uint256 _fingerprint, address _authority) {
        //better extract for using
        number = _boxNumber;
        sender = _sender;
        recipient = _recipient;
        senderEcTag = _senderEcTag;
        fingerprint = _fingerprint;
        authority = Authority(_authority);
    }

    function openRequest() allowedTo(recipient) public {
        if (authority.isAccountActive(msg.sender) && status == BoxStatus.CLOSED) {
            status = BoxStatus.REQUESTED;
            BoxStatusChangedEvent(status, msg.sender);
        }
    }

    function approveOpenRequest(uint256 _recipientEcTag) allowedTo(sender) public {
        if (authority.isAccountActive(msg.sender) && status == BoxStatus.REQUESTED) {
            status = BoxStatus.OPENED;
            recipientEcTag = _recipientEcTag;
            BoxStatusChangedEvent(status, msg.sender);
        }
    }

    /** Struct and modifiers **/

    modifier allowedTo(address addr) {
        if (msg.sender != addr) {
            throw;
        }
        _;
    }

}