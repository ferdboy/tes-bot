let { WAConnection: _WAConnection, WA_MESSAGE_STUB_TYPES } = require('@adiwajshing/baileys')
let { generate } = require('qrcode-terminal')
let simple = require('./lib/simple')
let yargs = require('yargs/yargs')
let syntaxerror = require('syntax-error')
let chalk = require('chalk')
let fs = require('fs')
let path = require('path')
let util = require('util')
let WAConnection = simple.WAConnection(_WAConnection)
global.conn = new WAConnection()
global.timestamp = {
  start: new Date
}

let opts = yargs(process.argv.slice(2)).exitProcess(false).parse()
global.prefix = new RegExp('^[' + (opts['prefix'] || '\\/i!#$%\\-+£¢€¥^°=¶∆×÷π√✓©®:;?&.') + ']')

global.DATABASE = new (require('./lib/database'))(opts._[0] ? opts._[0] + '_' : '' + 'database.json', null, 2)
if (!global.DATABASE.data.users) global.DATABASE.data = {
  users: {},
  groups: {}
}

let authFile = `${opts._[0] || 'session'}.data.json`
fs.existsSync(authFile) && conn.loadAuthInfo(authFile)
opts['big-qr'] && conn.on('qr', qr => generate(qr, { small: false }))
conn.on('credentials-updated', () => fs.writeFileSync(authFile, JSON.stringify(conn.base64EncodedAuthInfo())))

conn.handler = async function (m) {
  try {
  	simple.smsg(this, m)
    m.exp = 1
    if (!m.fromMe && opts['self']) return
    if (!m.text) return
    if (m.isBaileys) return
    try {
      global.DATABASE.load()
      if (global.DATABASE._data.users[m.sender]) {
        if (typeof global.DATABASE._data.users[m.sender].exp == 'number' &&
          !isNaN(global.DATABASE._data.users[m.sender].exp)
        ) global.DATABASE._data.users[m.sender].exp++
        else global.DATABASE._data.users[m.sender].exp = 1
      } else global.DATABASE._data.users[m.sender] = {
        exp: 1
      }
    } catch (e) {
      console.log(e, global.DATABASE.data)
    } finally {
      global.DATABASE.save()
    }
  	let usedPrefix
  	for (let name in global.plugins) {
  	  let plugin = global.plugins[name]
      if (!plugin) continue
      let _prefix = plugin.customPrefix ? plugin.customPrefix : conn.prefix ? conn.prefix : global.prefix
  	  if ((usedPrefix = (_prefix.exec(m.text) || '')[0])) {
  		  let args = m.text.replace(usedPrefix, '').split` `.filter(v=>v)
  		  let command = (args.shift() || '').toLowerCase()
        let isOwner = m.fromMe
  			let isAccept = plugin.command instanceof RegExp ? plugin.command.test(command) :
        plugin.command instanceof Array ? plugin.command.includes(command) :
        plugin.command instanceof String ? plugin.command == command : false
  			if (!isAccept) continue
        let isMods = isOwner || global.mods.includes(m.sender)
        let isPrems = isMods || global.prems.includes(m.sender)
        let participants = m.isGroup ? (await this.groupMetadata(m.chat)).participants : []
        let user = m.isGroup ? participants.filter(u => u.jid == m.sender)[0] : {}
        let bot = m.isGroup ? participants.filter(u => u.jid == this.user.jid)[0] : {}
        let isAdmin = user.isAdmin || user.isSuperAdmin || false
        let isBotAdmin = bot.isAdmin || bot.isSuperAdmin || false
        let fail = plugin.fail || global.dfail
        if (plugin.owner && !isOwner) {
          fail('owner', m, this)
          continue
        }
        if (plugin.mods && !isMods) {
          fail('mods', m, this)
          continue
        }
        if (plugin.premium && !isPrems) {
          fail('premium', m, this)
          continue
        }
  			if (plugin.group && !m.isGroup) {
          fail('group', m, this)
          continue
        } else if (plugin.botAdmin && !isBotAdmin) {
          fail('botAdmin', m, this)
          continue
        } else if (plugin.admin && !isAdmin) {
          fail('admin', m, this)
          continue
        }
  			if (plugin.private && m.isGroup) {
          fail('private', m, this)
          continue
        }

        m.isCommand = true
        m.exp += 'exp' in plugin ? parseInt(plugin.exp) : 10
        await plugin(m, { usedPrefix, args, command, conn: this }).catch(e => this.reply(m.chat, util.format(e), m))
  			break
  		}
  	}
  } finally {
    //console.log(global.DATABASE._data.users[m.sender])
    if (m && m.sender && global.DATABASE._data.users[m.sender]) {
      global.DATABASE._data.users[m.sender].exp += m.exp
    }
    try {
      await global.DATABASE.save()
      require('./lib/print')(m, this)
    } catch (e) {
      console.log(m, e)
    }
  }
}

conn.on('message-new', conn.handler) 
conn.on('error', conn.logger.error)
global.mods = []
global.prems = []

global.dfail = (type, m, conn) => {
  let msg = {
    owner: 'Perintah ini hanya dapat digunakan oleh Owner Nomor!',
    mods: 'Perintah ini hanya dapat digunakan oleh Moderator!',
    premium: 'Perintah ini hanya untuk member Premium!',
    group: 'Perintah ini hanya dapat digunakan di Grup!',
    private: 'Perintah ini hanya dapat digunakan di Chat Pribadi!',
    admin: 'Perintah ini hanya untuk admin grup!',
    botAdmin: 'Jadikan bot sebagai admin untuk menggunakan perintah ini!'
}
else if (text == 'assalamualaikum'){
conn.sendMessage(id, ' _Waalaikumsalam, _Iyah aku disini kak...ada yang bisa kami bantu? Ketik *#menu* untuk melihat fitur bot kami🙏_ ' ,MessageType.text);
}
else if (text == 'salam'){
conn.sendMessage(id, ' _Waalaikumsalam, Iyah aku disini kak...ada yang bisa kami bantu? Ketik *#menu* untuk melihat fitur bot kami🙏_ ' ,MessageType.text);
}
else if (text == 'asalamualaikum'){
conn.sendMessage(id, ' _Waalaikumsalam, Iyah aku disini kak...ada yang bisa kami bantu? Ketik *#menu* untuk melihat fitur bot kami🙏_ ' ,MessageType.text);
}
else if (text == 'Assalamualaikum'){
conn.sendMessage(id, ' _Waalaikumsalam, Iyah aku disini kak...ada yang bisa kami bantu? Ketik *#menu* untuk melihat fitur bot kami🙏_ ' ,MessageType.text);
}
else if (text == 'p'){
conn.sendMessage(id, ' _Iyah aku disini kak...ada yang bisa kami bantu? Ketik *#menu* untuk melihat fitur bot kami🙏_ ' ,MessageType.text);
}
else if (text == 'P'){
conn.sendMessage(id, ' _Iyah aku disini kak...ada yang bisa kami bantu? Ketik *#menu* untuk melihat fitur bot kami🙏_ ' ,MessageType.text);
}
else if (text == 'Halo'){
conn.sendMessage(id, ' _Iyah aku disini kak...ada yang bisa kami bantu? Ketik *#menu* untuk melihat fitur bot kami🙏_ ' ,MessageType.text);
}
else if (text == 'Asu'){
conn.sendMessage(id, 'Lu Asw' ,MessageType.text);
}
else if (text == '#owner'){
conn.sendMessage(id, ' *Owner FERDI wa.me/+6282169369877* ' ,MessageType.text);
}
else if (text == '#creator'){
conn.sendMessage(id, ' *Creator FERDI wa.me/+6282169369877* ' ,MessageType.text);
}
else if (text == 'Pagi'){
conn.sendMessage(id, ' _Pagi juga, Iyah aku disini kak...ada yang bisa kami bantu? Ketik *#menu* untuk melihat fitur bot kami🙏_ ' ,MessageType.text);
}
else if (text == 'Siang'){
conn.sendMessage(id, ' _Siang juga, Iyah aku disini kak...ada yang bisa kami bantu? Ketik *#menu* untuk melihat fitur bot kami🙏_ ' ,MessageType.text);
}
else if (text == 'Sore'){
conn.sendMessage(id, ' _Sore juga, Iyah aku disini kak...ada yang bisa kami bantu? Ketik *#menu* untuk melihat fitur bot kami🙏_ ' ,MessageType.text);
}
else if (text == 'Malam'){
conn.sendMessage(id, ' _Malam juga, Iyah aku disini kak...ada yang bisa kami bantu? Ketik *#menu* untuk melihat fitur bot kami🙏_ ' ,MessageType.text);
}
else if (text == 'Ngentod'){
conn.sendMessage(id, 'Pengin ngentod? babi looo' ,MessageType.text);
}
else if (text == 'Anjing'){
conn.sendMessage(id, 'Jangan toxic anjing,kntl,babi,monyet' ,MessageType.text);
}
else if (text == 'Bacot'){
conn.sendMessage(id, ' *lu bacot_-* ' ,MessageType.text);
}
else if (text == 'Test'){
conn.sendMessage(id, ' _Iyah aku disini kak...ada yang bisa kami bantu? Ketik *#menu* untuk melihat fitur bot kami🙏_ ' ,MessageType.text);
}
else if (text == 'Hai'){
conn.sendMessage(id, ' _Iyah aku disini kak...ada yang bisa kami bantu? Ketik *#menu* untuk melihat fitur bot kami🙏_ ' ,MessageType.text);
}
else if (text == 'Woi'){
conn.sendMessage(id, ' _Iyah aku disini kak...ada yang bisa kami bantu? Ketik *#menu* untuk melihat fitur bot kami🙏_ ' ,MessageType.text);
}
else if (text == 'bot'){
conn.sendMessage(id, ' _bat bot bat bot apaan gw di sini Knpa? ga suka Heheheh Canda untuk fitur? Ketik *#menu* untuk melihat fitur bot kami🙏_ ' ,MessageType.text);
}
else if (text == 'Hi'){
conn.sendMessage(id, ' _Iyah aku disini kak...ada yang bisa kami bantu? Ketik *#menu* untuk melihat fitur bot kami🙏_ ' ,MessageType.text);
}
else if (text == 'Gan'){
conn.sendMessage(id, ' _Iyah aku disini kak...ada yang bisa kami bantu? Ketik *#menu* untuk melihat fitur bot kami🙏_ ' ,MessageType.text);
}
else if (text == 'Sis'){
conn.sendMessage(id, ' _Iyah aku disini kak...ada yang bisa kami bantu? Ketik *#menu* untuk melihat fitur bot kami🙏_ ' ,MessageType.text);
}
else if (text == 'Bro'){
conn.sendMessage(id, ' _Iyah aku disini kak...ada yang bisa kami bantu? Ketik *#menu* untuk melihat fitur bot kami🙏_ ' ,MessageType.text);
}
else if (text == 'Min'){
conn.sendMessage(id, ' _Iyah aku disini kak...ada yang bisa kami bantu? Ketik *#menu* untuk melihat fitur bot kami🙏_ ' ,MessageType.text);
}
else if (text == 'Sayang'){
conn.sendMessage(id, ' _Iyah aku disini kak...ada yang bisa kami bantu? Ketik *#menu* untuk melihat fitur bot kami🙏_ ' ,MessageType.text);
}
else if (text == 'I love u'){
conn.sendMessage(id, ' _love you too😻_ ' ,MessageType.text);
}
else if (text == 'Mas'){
conn.sendMessage(id, ' _Iyah aku disini kak...ada yang bisa kami bantu? Ketik *#menu* untuk melihat fitur bot kami🙏_ ' ,MessageType.text);
}
else if (text == 'Mba'){
conn.sendMessage(id, ' _Iyah aku disini kak...ada yang bisa kami bantu? Ketik *#menu* untuk melihat fitur bot kami🙏_ ' ,MessageType.text);
}
else if (text == 'Bre'){
conn.sendMessage(id, ' _Iyah aku disini kak...ada yang bisa kami bantu? Ketik *#menu* untuk melihat fitur bot kami🙏_ ' ,MessageType.text);
}
else if (text == 'Cuy'){
conn.sendMessage(id, ' _Iyah aku disini kak...ada yang bisa kami bantu? Ketik *#menu* untuk melihat fitur bot kami🙏_ ' ,MessageType.text);
}
else if (text == 'Euy'){
conn.sendMessage(id, ' _Iyah aku disini kak...ada yang bisa kami bantu? Ketik *#menu* untuk melihat fitur bot kami🙏_ ' ,MessageType.text);
}
else if (text == 'makasi'){
conn.sendMessage(id, ' _Sama sama, semoga harimu menyenangkan :)_ ' ,MessageType.text);
}
else if (text == 'Makasi'){
conn.sendMessage(id, ' _Sama sama, semoga harimu menyenangkan :)_ ' ,MessageType.text);
}
else if (text == 'makasih'){
conn.sendMessage(id, ' _Sama sama, semoga harimu menyenangkan :)_ ' ,MessageType.text);
}
else if (text == 'Makasih'){
conn.sendMessage(id, ' _Sama sama, semoga harimu menyenangkan :)_ ' ,MessageType.text);
}
else if (text == 'thank'){
conn.sendMessage(id, ' _Sama sama, semoga harimu menyenangkan :)_ ' ,MessageType.text);
}
else if (text == 'Thank'){
conn.sendMessage(id, ' _Sama sama, semoga harimu menyenangkan :)_ ' ,MessageType.text);
}
else if (text == 'thanks'){
conn.sendMessage(id, ' _Sama sama, semoga harimu menyenangkan :)_ ' ,MessageType.text);
}
else if (text == 'Thanks'){
conn.sendMessage(id, ' _Sama sama, semoga harimu menyenangkan :)_ ' ,MessageType.text);
}
  }[type]
  msg && conn.reply(m.chat, msg, m)
}

!opts['test'] && conn.connect().then(() => {
  global.timestamp.connect = new Date
})
opts['test'] && process.stdin.on('data', chunk => conn.emit('message-new', { text: chunk.toString() }))
process.on('uncaughtException', console.error)
// let strQuot = /(["'])(?:(?=(\\?))\2.)*?\1/

let pluginFilter = filename => /\.js$/.test(filename)
global.plugins = Object.fromEntries(
  fs.readdirSync(path.join(__dirname, 'plugins'))
    .filter(pluginFilter)
    .map(filename => [filename, {}])
)
for (let filename in global.plugins) {
  try {
    global.plugins[filename] = require('./plugins/' + filename)
  } catch (e) {
    conn.logger.error(e)
    delete global.plugins[filename]
  }
}
console.log(global.plugins)
fs.watch(path.join(__dirname, 'plugins'), (event, filename) => {
  if (pluginFilter(filename)) {
    let dir = './plugins/' + filename
    if (delete require.cache[require.resolve(dir)]) {
      if (fs.existsSync(require.resolve(dir))) conn.logger.info(`re - require plugin '${dir}'`)
      else {
        conn.logger.warn(`deleted plugin '${dir}'`)
        return delete global.plugins[filename]
      }
    } else conn.logger.info(`requiring new plugin '${dir}'`)
    let err = syntaxerror(fs.readFileSync(dir))
    if (err) conn.logger.error(`syntax error while loading '${dir}'\n${err}`)
    else try {
      global.plugins[filename] = require(dir)
    } catch (e) {
      conn.logger.error(e)
    }
  }
})
