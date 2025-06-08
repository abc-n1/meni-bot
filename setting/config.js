const fs = require('fs')
global.prefa = ['','!','.',',','/','#','^','+'] 

/** info id **/
global.owner = "94741185866@s.whatsapp.net"
global.idch = "120363398452475846@newsletter"

/** jika bernilai "true" berarti aktif, dan sebaliknya kalau "false" **/
global.status = false
global.welcome = false
global.antispam = true
global.autoread = false

/** sticker watermark **/
global.packname = 't.me/RaldzzXyz'
global.author = 'nadu'

/** link group atau link channel WhatsApp **/
global.linkch = 'https://whatsapp.com/channel/0029Vb69IgXBqbrGn2PrF43M'

/** limit user premium dan bukan premium **/
global.gcount = {
    prem : 500,
    user: 15
}

/** limit **/
global.limitCount = 10,

/** message **/
global.mess = {
    group: "𝙊𝙣𝙡𝙮 𝙂𝙧𝙤𝙪𝙥 🎗",
    admin: "𝙊𝙣𝙡𝙮 𝘼𝙙𝙢𝙞𝙣 🎗",
    owner: "𝙊𝙣𝙡𝙮 𝙊𝙬𝙣𝙚𝙧 𝘼𝙘𝙘𝙚𝙨𝙨 🎗",
    premium: "𝙊𝙣𝙡𝙮 𝙋𝙧𝙚𝙢𝙞𝙪𝙢 𝘼𝙘𝙘𝙚𝙨𝙨 🎗",
    botadmin: "𝙊𝙣𝙡𝙮 𝘽𝙤𝙩 𝘼𝙙𝙢𝙞𝙣 🎗",
    limited: "𝙇𝙞𝙢𝙞𝙩𝙚𝙙, 𝘽𝙖𝙘𝙠 𝙏𝙤𝙙𝙖𝙮 🎗",
    private: "𝙊𝙣𝙡𝙮 𝙋𝙧𝙞𝙫𝙖𝙩𝙚 𝘾𝙝𝙖𝙩 🎗",
    s: "𝙎𝙪𝙘𝙘𝙚𝙨𝙨 🎗"
}

let file = require.resolve(__filename)
require('fs').watchFile(file, () => {
  require('fs').unwatchFile(file)
  console.log('\x1b[0;32m'+__filename+' \x1b[1;32mupdated!\x1b[0m')
  delete require.cache[file]
  require(file)
})
