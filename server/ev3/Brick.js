const net = require('net');
const dgram = require('dgram');
const events = require('events');
const Command = require('./Command');
const CommandManager = require('./CommandManager');

class Brick extends events.EventEmitter {
    constructor({
        serialNumber,
        port,
        udpPort,
        name,
        protocol,
        ip,
    }) {
        super();

        this.serialNumber = serialNumber;
        this.port = port;
        this.udpPort = udpPort;
        this.name = name;
        this.protocol = protocol;
        this.ip = ip;

        this.socket = null;
        this.ready = false;

        this.commands = new CommandManager();
    }

    connect() {
        const socket = net.createConnection(this.port, this.ip);

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
                const response = this.commands.parseResponse(buffer);

                if (response.systemCommand() === Command.WRITEMAILBOX) {
                    const message = this.commands.readMailboxResponse(response);

                    console.log('Got mailbox message');

                    this.emit('receiveMailbox', message);
                } else {
                    this.error('Unhandled response', response);
                }
            } else {
                this.error('Invalid buffer size', buffer);
            }
        });

        this.socket = socket;
    }

    sendUnlockMessage() {
        // based on http://www.monobrick.dk/guides/how-to-establish-a-wifi-connection-with-the-ev3-brick/
        console.log('EV3 Brick: sending wakeup message');
        const client = dgram.createSocket('udp4');

        client.send('1', this.udpPort, this.ip, () => {
            console.log('EV3 Brick: sending unlock message');
            this.socket.write(Buffer.from('GET /target?sn=' + this.serialNumber + ' VMTP1.0\r\nProtocol: EV3'));
        });
    }

    sendCommand(command) {
        this.socket.write(command.buffer);
    }

    sendMailboxMessage(mailboxName, payload) {
        console.log('Sending mailbox message', mailboxName, payload);

        this.sendCommand(this.commands.createMailboxCommand(mailboxName, payload));
    }
}

module.exports = Brick;
