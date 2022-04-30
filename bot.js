const {
    Client,
    RichEmbed,
    Discord,
    Message
} = require('discord.js');
const client = new Client;
const settings = require('./settings.json');
const ytdl = require('ytdl-core');
const queue = new Map();


client.on('ready', () => {
    console.log(`${client.user.tag} 啟動！`);
});

client.on('message', async message => {
    if (message.author.bot || !message.content.startsWith(settings.prefix)) return
    const arg = message.content.slice(settings.prefix.length).trim().split(/ +/);
    const commands = arg.shift().toLowerCase();

    const serverQueue = queue.get(message.guild.id);

    if (commands === 'help') {
        return message.channel.send(`!9ay--甲文產生器\n!play--播歌(只能播YT的歌)\n!stop--停止\n!skip--就是skip阿\n!queue--查看queuelist`)
    } else if (commands === '9ay') {
        mention = message.mentions.users.first();
        var rng = Rdm(8, 1);
        switch (rng) {
            case 1:
                message.channel.send(`我朋友<@${mention.id}>曾在日本留學過有豐富的9ay片拍攝經驗 壓縮深喉、無痛馬眼穿當、極限雙頭龍也有與知名男優比利海靈頓加藤鷹清水健等多位進行多人運動，並且有著不錯的成績`);
                break;
            case 2:
                message.channel.send(`抱歉我的甲朋友<@${mention.id}>造成大家的困擾 在全聯螢光門市旁的公廁從事不雅行為 不僅讓大家免費申裝aids 還當防疫破口散播病毒 已將他的不良行徑告訴他媽媽 請大家不要擔心`);
                break;
            case 3:
                message.channel.send(`我朋友很早就有這個了<@${mention.id}>但是他卻一直不肯說為什麼只有他可以用。直到有一天我無意間在他的手機上看到同志約炮軟體Hornet 一切才真相大白 原來連臉書都知道他是放蕩的臭甲`);
                break;
            case 4:
                message.channel.send(`我朋友<@${mention.id}>的菜單都是先去健身房裝水然後洗澡 洗完澡等甲甲進來後相揪去浴室做愛 這樣算一組 一天大概3到4組`);
                break;
            case 5:
                message.channel.send(`我朋友<@${mention.id}>是在做男生的 記得他以前是個認真上進的好學生 直到有一天被一個學長開發了 想要的話歡迎私訊他 自備套子 可1可0`);
                break;
            case 6:
                message.channel.send(`我早就叫我同學<@${mention.id}>不要拍這個影片了，他就是講不停，一直想要玩學弟的屁股，現在好啦，現在大家都知道他是跟學長做愛了。`);
                break;
            case 7:
                message.channel.send(`我有一個朋友<@${mention.id}>，原本是個開朗活潑的大學生，直到他認識了一位社團的學長後，他就變了。開始會跟學長勾肩搭背,兩人看似一副好哥們的樣子，但他卻越來越得寸進尺，對學長毛手毛腳。這不是我當初認識的你啊，記得當初你口口聲聲說你喜歡女生，怎麼現在卻著了魔似的巴著學長不放，為什麼?到底是什麼改變了當初那個單純的你?`);
                break;
            case 8:
                message.channel.send(`我朋友<@${mention.id}>的性癖就是跟學長肛交 就跟他說不要一直玩 好啦現在被學長裝了AIDS了`);
                break;
        }
    } else if (commands === 'play') {

        if (message.content.includes(`https://www.youtube.com`) || message.content.includes(`https://youtube.com`)) {
            execute(message, serverQueue);
            return;
        } else {
            return message.channel.send("你後面要加YT網址阿");
        }

    } else if (commands === 'skip') {
        skip(message, serverQueue);
        return;
    } else if (commands === 'stop') {
        stop(message, serverQueue);
        return;
    } else if (commands === 'queue') {
        Queue(message, serverQueue);
        return;
    } else {
        message.channel.send("NT你是不是打錯指令");
    }

});

function Rdm(max, min) {
    var rng = Math.floor(Math.random() * max) + min;
    return rng;
}


async function execute(message, serverQueue) {
    const args = message.content.slice(settings.prefix.length).trim().split(/ +/);

    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel)
        return message.channel.send(
            "阿叫機器人的要加語音頻道阿"
        );
    const permissions = voiceChannel.permissionsFor(message.client.user);
    if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
        return message.channel.send(
            "哭啊我沒權限"
        );
    }
    const songInfo = await ytdl.getInfo(args[1]);
    const song = {
        title: songInfo.videoDetails.title,
        url: songInfo.videoDetails.video_url,
    };
    if (!serverQueue) {
        const queueContruct = {
            textChannel: message.channel,
            voiceChannel: voiceChannel,
            connection: null,
            songs: [],
            volume: 5,
            playing: true
        };
        queue.set(message.guild.id, queueContruct);
        queueContruct.songs.push(song);
        try {
            var connection = await voiceChannel.join();
            queueContruct.connection = connection;
            play(message.guild, queueContruct.songs[0], message);
        } catch (err) {
            console.log(err);
            queue.delete(message.guild.id);
            return message.channel.send(err);
        }
    } else {
        serverQueue.songs.push(song);
        return message.channel.send(`${song.title} 加到queue啦!`);
    }
}

function skip(message, serverQueue) {
    if (!message.member.voice.channel)
        return message.channel.send(
            "加到語音頻道才能用指令啦NT"
        );
    if (!serverQueue)
        return message.channel.send("沒歌可以跳了");

    return serverQueue.connection.dispatcher.end();
}

function stop(message, serverQueue) {
    if (!message.member.voice.channel)
        return message.channel.send(
            "加到語音頻道才能用指令啦NT"
        );

    if (!serverQueue)
        return message.channel.send("沒歌可以停了");

    serverQueue.songs = [];
    serverQueue.connection.dispatcher.end();
}

function play(guild, song, message) {
    const serverQueue = queue.get(guild.id);
    if (!song) {
        message.channel.send("高歌離席");
        serverQueue.voiceChannel.leave();
        queue.delete(guild.id);
        return;
      }

    const dispatcher = serverQueue.connection
        .play(ytdl(song.url))
        .on("finish", () => {
            serverQueue.songs.shift();
            play(guild, serverQueue.songs[0], message);
        })
        .on("error", error => console.error(error));
    dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
    serverQueue.textChannel.send(`正在播放: **${song.title}**`);
}

function Queue(message, serverQueue) {
    if (!serverQueue)
        return message.channel.send("沒歌播了啦")
    if (!message.member.voice.channel)
        return message.channel.send("你沒在頻道裡阿")

    let nowplaying = serverQueue.songs[0];
    let queuemessage = `正在播放:${nowplaying.title}\n==============================================\n`


    for (var i = 1; i < serverQueue.songs.length; i++) {
        queuemessage += `${i}.${serverQueue.songs[i].title}\n`
    }
    message.channel.send(queuemessage);
}


client.login(settings.token);