export class Box {

    public block: number;
    public address: string;
    public sender: string;
    public recipient: string;

    constructor(block: number, address: string, sender: string, recipient: string) {
        this.address  = address;
        this.block = block;
        this.sender = sender;
        this.recipient = recipient;
    }

}
