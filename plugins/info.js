let handler  = async (m, { conn, usedPrefix: _p }) => {
  conn.reply(m.chat, `
╠═〘 INFO BOT 〙 ═
╠➥ Dibuat dengan bahasa javascript via NodeJs
╠➥ Rec: F3RD Bot
╠➥ Script: @Ferdiardian
║
╠➥ Github: https://github.com/ferdboy/tes-Bot
╠➥ Instagram: @ferdi_ardian21
╠➥ YouTube: NOTHING
║
╠═〘 Thanks To 〙 ═
╠➥ Ahmad Sururi
╠➥ Abdul Jamil
╠➥ Mustapa Harun
╠➥ Dan kawan yang lain :)
║
╠═〘 DONASI 〙 ═
╠➥ SmartFren: Nothing
╠➥ Tsel: 0821-6936-9877
╠➥ M3: NOTHING
║
║>Request? Wa.me/6282169369877
║
╠═〘 F3RD BOT 〙 ═
`.trim(), m)
}
handler.command = /^(info)$/i
handler.owner = false
handler.mods = false
handler.premium = false
handler.group = false
handler.private = false

handler.admin = false
handler.botAdmin = false

handler.fail = null

module.exports = handler

