const { Telegraf } = require('telegraf');
const constants = require('./contants.json');
const keys = require('./apiKey.json');
const MarsPhotoService = require('./marsPhotoService');

const marsPhotoService = new MarsPhotoService;
const bot = new Telegraf(keys.bot);

const reg = new RegExp(/^\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])$/);

let rover;
let camera;
let roversList = constants.rovers.join(" ");
let timeOfWorkList = constants.errorMessages.timeOfWorkRovers;
let camerasNamesList = constants.errorMessages.camerasNames;
let curiosityCamerasList = constants.curiosityCameras.join(" ");
let opportunityCamerasList = constants.opportunityCameras.join(' ');
let spiritCamerasList = constants.spiritCameras.join(' ');
let selectCamera = constants.dialog.selectCamera;
let dateMessage = constants.errorMessages.dateMessage;
let noCameraMessage = constants.errorMessages.noCamera;
let opportunity = constants.rovers[1];
let curiosity = constants.rovers[0];
let spirit = constants.rovers[2];
let FHAZ = constants.curiosityCameras[0];

bot.start( ctx => ctx.reply(
    constants.dialog.hello + ctx.from.first_name + '!' +
    constants.dialog.greeting + roversList));

bot.help( ctx => ctx.reply(
    ctx.from.first_name + ' , ' + constants.dialog.selectRover + roversList + 
    timeOfWorkList + constants.dialog.decodingOfCameraNames + camerasNamesList
    ));

bot.hears(curiosity, ctx => {
    rover = curiosity;
    ctx.reply(selectCamera + curiosityCamerasList);
});

bot.hears(opportunity, ctx => {
    rover = opportunity;
    ctx.reply(selectCamera + opportunityCamerasList);   
});

bot.hears(spirit, ctx => {
    rover = spirit;
    ctx.reply(selectCamera + spiritCamerasList);   
});

bot.hears(constants.curiosityCameras[0], ctx => {
    if (rover === curiosity) {
        camera = constants.curiosityCameras[0].slice(1)
        ctx.reply(dateMessage + constants.errorMessages.timeOfWorkCuriosity)
    } else if (rover === opportunity)  {
        camera = constants.curiosityCameras[0].slice(1)
        ctx.reply(dateMessage + constants.errorMessages.timeOfWorkOpportunity) 
    } else if (rover === spirit)  {
        camera = constants.curiosityCameras[0].slice(1)
        ctx.reply(dateMessage + constants.errorMessages.timeOfWorkSpirit)
    } else {
        ctx.reply(noCameraMessage)
    } 
})
  
bot.hears(constants.curiosityCameras[1], ctx => {
    if (rover === curiosity) {
        camera = constants.curiosityCameras[1].slice(1)
        ctx.reply(dateMessage + constants.errorMessages.timeOfWorkCuriosity)
    } else if (rover === opportunity)  {
        camera = constants.curiosityCameras[1].slice(1)
        ctx.reply(dateMessage + constants.errorMessages.timeOfWorkOpportunity) 
    } else if (rover === spirit)  {
        camera = constants.curiosityCameras[1].slice(1)
        ctx.reply(dateMessage + constants.errorMessages.timeOfWorkSpirit)
    } else {
        ctx.reply(noCameraMessage)
    } 
})

bot.hears(constants.curiosityCameras[2], ctx => {
    if (rover === curiosity) {
        camera = constants.curiosityCameras[2].slice(1)
        ctx.reply(dateMessage + constants.errorMessages.timeOfWorkCuriosity)
    } else {
        ctx.reply(noCameraMessage)
    }
})
    
bot.hears(constants.curiosityCameras[3], ctx => {
    if (rover === curiosity) {
        camera = constants.curiosityCameras[3].slice(1)
        ctx.reply(dateMessage + constants.errorMessages.timeOfWorkCuriosity)
    } else {
        ctx.reply(noCameraMessage)
    }
})

bot.hears('/MAHLI', ctx => {
    if (rover === curiosity) {
        camera = ('/MAHLI').slice(1)
        ctx.reply(dateMessage + constants.errorMessages.timeOfWorkCuriosity)
    } else {
        ctx.reply(noCameraMessage)
    } 
})  
        
bot.hears('/MARDI', ctx => {
    if (rover === curiosity) {
        camera = ('/MARDI').slice(1)
        ctx.reply(dateMessage + constants.errorMessages.timeOfWorkCuriosity)
    } else {
        ctx.reply(noCameraMessage)
    } 
})

bot.hears('/NAVCAM', ctx => {
    if (rover === curiosity) {
        camera = ('/NAVCAM').slice(1)
        ctx.reply(dateMessage + constants.errorMessages.timeOfWorkCuriosity)
    } else if (rover === opportunity)  {
        camera = ('/NAVCAM').slice(1)
        ctx.reply(dateMessage + constants.errorMessages.timeOfWorkOpportunity) 
    } else if (rover === '/spirit')  {
        camera = ('/NAVCAM').slice(1)
        ctx.reply(dateMessage + constants.errorMessages.timeOfWorkSpirit)
    } else {
        ctx.reply(noCameraMessage)
    } 
})  

bot.hears('/PANCAM', ctx => {
    if (rover === curiosity) {
        camera = ('/PANCAM').slice(1)
        ctx.reply(dateMessage + constants.errorMessages.timeOfWorkCuriosity)
    } else if (rover === opportunity)  {
        camera = ('/MINITES').slice(1)
        ctx.reply(dateMessage + constants.errorMessages.timeOfWorkOpportunity) 
    } else {
        ctx.reply(noCameraMessage)
    } 
})

bot.hears('/MINITES', ctx => {
    if (rover === curiosity) {
        camera = ('/MINITES').slice(1)
        ctx.reply(dateMessage + constants.errorMessages.timeOfWorkCuriosity)
    } else if (rover === opportunity)  {
        camera = ('/MINITES').slice(1)
        ctx.reply(dateMessage + constants.errorMessages.timeOfWorkOpportunity) 
    } else {
        ctx.reply(noCameraMessage)
    } 
})      

bot.on('text', async (ctx) => {
    try {
        const dateForPhoto = ctx.message.text
        if (reg.test(dateForPhoto)) {
            const response = await marsPhotoService.getMarsPhoto(rover, dateForPhoto, camera)
                if (response.data.photos.length != 0) {
                    ctx.replyWithPhoto(
                        response.data.photos[0].img_src,
                        { caption: constants.errorMessages.newPhoto }
                        )
                } else {
                        ctx.reply(constants.errorMessages.noPhotoForThisDateStart)
                    }
        } else { 
            ctx.reply(dateMessage)
        }
    } catch(e) {
        ctx.reply(constants.errorMessages.noPhotoForThisDate) 
    }
})

bot.on('voice', ctx => {
    ctx.reply(constants.errorMessages.voiceError)
})
bot.on('sticker', ctx => {
    ctx.reply(constants.errorMessages.stickerError)
})

bot.on('photo', ctx => {
    ctx.reply(constants.errorMessages.photoError)
})

bot.on('document', ctx => {
    ctx.reply(constants.errorMessages.documentError)
})

bot.launch()
