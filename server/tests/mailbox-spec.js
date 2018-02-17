const Command = require('../ev3/Command');
const CommandManager = require('../ev3/CommandManager');

const manager = new CommandManager();

describe('Mindstorms mailbox', function () {
    it('Formats string message', function () {
        const command = manager.createMailboxCommand('test', 'Hello World');

        expect(command.commandType()).toEqual(Command.SYSTEM_COMMAND_NO_REPLY);
        expect(command.systemCommand()).toEqual(Command.WRITEMAILBOX);

        // name length
        // 5 with null ending
        expect(command.buffer.readUIntLE(6, 1)).toEqual(5);

        // name
        expect(command.buffer.toString('ascii', 6 + 1, 6 + 1 + 5)).toEqual('test\0');

        // payload length
        expect(command.buffer.readUIntLE(6 + 1 + 5, 2)).toEqual(12);

        // payload
        expect(command.buffer.toString('ascii', 6 + 1 + 5 + 2, 6 + 1 + 5 + 2 + 12)).toEqual('Hello World\0');
    });

    it('Formats string message', function () {
        const command = manager.createMailboxCommand('test', 42);

        // payload length
        expect(command.buffer.readUIntLE(12, 2)).toEqual(4);

        // payload
        expect(command.buffer.readFloatLE(14, 4)).toEqual(42);
    });

    it('Formats string message', function () {
        const command = manager.createMailboxCommand('test', true);

        // payload length
        expect(command.buffer.readUIntLE(12, 2)).toEqual(1);

        // payload
        expect(command.buffer.readUIntLE(14, 1)).toEqual(1);
    });
});
