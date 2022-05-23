const CmdLineParser = class {
  constructor(aamp = true, gt = true, ppipe = true, pipe = true, ggt = true, lt = true, llt = true) {
    this.tokens = [];
    if (aamp)
      this.tokens.push('&&')
    if (ppipe)
      this.tokens.push('||')
    if (pipe)
      this.tokens.push('|')
    if (ggt)
      this.tokens.push('>>')
    if (gt)
      this.tokens.push('>')
    if (llt)
      this.tokens.push('<<')
    if (lt)
      this.tokens.push('<')

    this.utils = require('./utils')
    this.Command = class {
      constructor() {
        this.invalid = false;
        this.invalidReason = null;
        this.args = [];
        this['>'] = [];
        this['&&'] = null;
        this['||'] = null;
        this['|'] = null;
        this['>>'] = [];
        this['<'] = [];
        this['<<'] = [];
        this.name = null;
        this.text = null;
      }
    }

    this.parseCommands = (commands) => {
      let parsedCommands = [];
      commands.forEach(command => parsedCommands.push(this.parseCommand(command)));
      return parsedCommands;
    }
    this.parse = (commandLine) => {

      // Parse different commands
      let semicolonIndexes = this.utils.getAllOccurrencesOf(';', commandLine);
      semicolonIndexes = semicolonIndexes.filter(index => !this.utils.isBetweenQuotes(commandLine, index));


      return this.parseCommands(this.utils.splitAt(semicolonIndexes, commandLine))
    }
    this.parseCommand = (string) => {
      string = string.trim();
      let commandObject = new this.Command();
      let command = '';
      let writeTo = 'command'
      let ignoreNextChar = false;
      let gtIndex = -1
      let gtgtIndex = -1
      let ltIndex = -1
      let ltltIndex = -1

      commandObject.text = string;

      for (let i = 0; i < string.length; i++) {
        if (ignoreNextChar) {
          ignoreNextChar = false;
          continue
        }
        let char = string[i];

        if (this.tokens.some(token => string.substring(i).startsWith(token)) && !this.utils.isBetweenQuotes(string, i)) {
          let token = this.tokens.find(token => string.substring(i).startsWith(token));
          if (token === '>') {
            writeTo = '>';
            gtIndex++
            commandObject['>'][gtIndex] = '';
            continue
          }

          if (token === '>>') {
            ignoreNextChar = true;
            writeTo = '>>';
            gtgtIndex++
            commandObject['>>'][gtgtIndex] = '';
            continue
          }

          if (token === '<') {
            writeTo = '<';
            ltIndex++
            commandObject['<'][ltIndex] = '';
            continue
          }

          if (token === '<<') {
            ignoreNextChar = true;
            writeTo = '<<';
            ltltIndex++
            commandObject['<<'][ltltIndex] = '';
            continue
          }

          if (token === '|') {
            commandObject['|'] = this.parseCommand(string.substring(i + 1));
            break
          }

          if (token === '&&') {
            commandObject['&&'] = this.parseCommand(string.substring(i + 2));
            break
          }

          if (token === '||') {
            commandObject['||'] = this.parseCommand(string.substring(i + 2));
            break
          }
        } else {

          if (writeTo === 'command')
            command += char;

          if (writeTo === '>') {
            if (char === ' ' && commandObject['>'][gtIndex].length > 0 && !this.utils.isBetweenQuotes(string, i)) {
              writeTo = 'command';
              continue;
            }

            if (!/["']/.test(char))
              commandObject['>'][gtIndex] += char;
          }

          if (writeTo === '>>') {
            if (char === ' ' && commandObject['>>'][gtgtIndex].length > 0 && !this.utils.isBetweenQuotes(string, i)) {
              writeTo = 'command';
              continue;
            }

            if (!/["']/.test(char))
              commandObject['>>'][gtgtIndex] += char;
          }

          if (writeTo === '<') {
            if (char === ' ' && commandObject['<'][ltIndex].length > 0 && !this.utils.isBetweenQuotes(string, i)) {
              writeTo = 'command';
              continue;
            }

            if (!/["']/.test(char))
              commandObject['<'][ltIndex] += char;
          }

          if (writeTo === '<<') {
            if (char === ' ' && commandObject['<<'][ltltIndex].length > 0 && !this.utils.isBetweenQuotes(string, i)) {
              writeTo = 'command';
              continue;
            }

            if (!/["']/.test(char))
              commandObject['<<'][ltltIndex] += char;
          }

        }
      }

      command = command.split(' ')
      commandObject.name = command.shift();
      commandObject.args = this.parseArgs(command.join(' '))

      if (commandObject.args === -1) {
        commandObject.invalid = true;
        commandObject.invalidReason = 'Unclosed Quote';
      } else {
        commandObject.args = commandObject.args.filter(x => x.trim().length > 0);
      }

      commandObject['>'] = commandObject['>'].map(str => str.trim()).filter(x => x.trim().length > 0);
      commandObject['>>'] = commandObject['>>'].map(str => str.trim()).filter(x => x.trim().length > 0);
      commandObject['<'] = commandObject['<'].map(str => str.trim()).filter(x => x.trim().length > 0);
      commandObject['<<'] = commandObject['<<'].map(str => str.trim()).filter(x => x.trim().length > 0);
      return commandObject;
    }
    this.parseArgs = (str) => {
      str = str.trim()
      let args = [];
      let currentArg = '';

      let doubleQuote = false;
      let singleQuote = false;

      for (let i = 0; i < str.length; i++) {
        let char = str[i];
        if (char === '"') {
          if (!singleQuote) {
            doubleQuote = !doubleQuote;
            continue;
          }
        }
        if (char === '\'') {
          if (!doubleQuote) {
            singleQuote = !singleQuote;
            continue;
          }
        }

        if (char === ' ' && !doubleQuote && !singleQuote) {
          args.push(currentArg);
          currentArg = '';
          continue;
        }

        currentArg += char;
      }

      args.push(currentArg);

      if (doubleQuote || singleQuote)
        return -1

      return args;
    }
  }
}

if (typeof module !== 'undefined') {
  module.exports = CmdLineParser
}
