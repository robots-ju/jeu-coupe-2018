const net = require('net');
const events = require('events');

function createMailboxBuffer(mailboxName, payload) {
    // add null bytes if necessary
    if (mailboxName.charCodeAt(mailboxName.length - 1) !== 0) {
        mailboxName += '\0';
    }

    const mailboxLength = mailboxName.length;

    let payloadLength = 0;
    switch (typeof payload) {
        case 'string':
            if (payload.charCodeAt(payload.length - 1) !== 0) {
                payload += '\0';
            }

            payloadLength = payload.length;
            break;
        case 'number':
            payloadLength = 4;
            break;
        case 'boolean':
            payloadLength = 1;
            break;
        default:
            throw 'Unhandled payload type ' + (typeof payload);
    }

    const bufferLength = 9 + mailboxLength + payloadLength;

    const buffer = Buffer.alloc(bufferLength);

    // length
    buffer.writeUIntLE(bufferLength - 2, 0, 2); // Do not count the two length bytes
    // counter
    buffer.writeUIntLE(1, 2, 2);
    // tt
    buffer.writeUIntLE(0x81, 4, 1);
    // ss
    buffer.writeUIntLE(0x9E, 5, 1);
    // mailbox length
    buffer.writeUIntLE(mailboxLength, 6, 1);
    // mailbox
    buffer.write(mailboxName, 7, mailboxLength);
    // payload length
    buffer.writeUIntLE(payloadLength, 7 + mailboxLength, 2);
    // payload
    const payloadIndexStart = 9 + mailboxLength;
    switch (typeof payload) {
        case 'string':
            buffer.write(payload, payloadIndexStart, payloadLength);
            break;
        case 'number':
            buffer.writeFloatLE(payload, payloadIndexStart);
            break;
        case 'boolean':
            buffer.writeUIntLE(payload ? 1 : 0, payloadIndexStart, 1);
            break;
    }

    return buffer;
}

function readMailboxBuffer(buffer) {
    const messageBytes = buffer.readUIntLE(0, 2);
    const messageCounter = buffer.readUIntLE(2, 2);
    const tt = buffer.readUIntLE(4, 1);
    const ss = buffer.readUIntLE(5, 1);
    const mailBoxNameLength = buffer.readUIntLE(6, 1);
    const mailBoxName = buffer.toString('ascii', 7, 6 + mailBoxNameLength); // without null byte
    const payloadLength = buffer.readUIntLE(7 + mailBoxNameLength, 2);

    const payloadIndexStart = 9 + mailBoxNameLength;
    let payload = null;

    if (payloadLength === 1) {
        // type boolean is a single byte, 1=true, 0=false
        payload = !!buffer.readUIntLE(payloadIndexStart, 1);
    } else if (payloadLength === 4 && buffer.toString()) {
        // type number is a float on 4 bytes
        payload = buffer.readFloatLE(payloadIndexStart);
    } else {
        // default type is string
        payload = buffer.toString('ascii', payloadIndexStart, payloadIndexStart + payloadLength);

        // remove ending null byte
        if (payload.chatCodeAt(payload.length - 1) === 0) {
            payload = payload.substr(0, payload.length - 1);
        }
    }

    return {
        messageBytes,
        messageCounter,
        tt,
        ss,
        mailBoxName,
        payload,
    };
}

class Brick extends events.EventEmitter {
    constructor({
        serialNumber,
        port,
        name,
        protocol,
        ip,
    }) {
        super();

        this.serialNumber = serialNumber;
        this.port = port;
        this.name = name;
        this.protocol = protocol;
        this.ip = ip;

        this.socket = null;
        this.ready = false;
    }

    connect() {
        const socket  = net.createConnection(this.port, this.ip);

        socket.on('connect', () => {
            this.emit('connect');

            this.sendUnlockMessage();
        });

        socket.on('end', () => {
            console.log('EV3 Brick socket ended');

            this.ready = false;
        });

        socket.on('error', error => {
            console.log(`EV3 Brick socket error:\n${error.stack}`);
        });

        socket.on('data', buffer => {
            console.log('EV3 Brick data', buffer, buffer.toString());

            if (buffer.toString().indexOf('Accept:EV340') === 0) {
                console.log('EV3 Brick unlocked');

                this.ready = true;

                this.emit('ready');
            } else if (buffer.length > 5 && buffer.readUIntLE(4, 1) === 0x81 && buffer.readUIntLE(5, 1) === 0x9E) {
                console.log('Got mailbox message');

                const message = readMailboxBuffer(buffer);

                this.emit('receiveMailbox', message);
            }
        });

        this.socket = socket;
    }

    sendUnlockMessage() {
        // based on http://www.monobrick.dk/guides/how-to-establish-a-wifi-connection-with-the-ev3-brick/
        console.log('EV3 Brick: sending unlock message');
        this.socket.write(Buffer.from('GET /target?sn=' + this.serialNumber + ' VMTP1.0\r\nProtocol: EV3'));
    }

    sendMailboxMessage(mailboxName, payload) {
        console.log('Sending mailbox message', mailboxName, payload);
        this.socket.write(createMailboxBuffer(mailboxName, payload));
    }
}

module.exports = Brick;
