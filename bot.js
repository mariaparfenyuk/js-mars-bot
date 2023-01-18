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

bot.start( ctx => ctx.reply(`
    Привет ${ctx.from.first_name}!
    Хочешь увидеть снимки Марса? Выбери марсоход ${roversList} и дату в земном времени. 
    `))

bot.help( ctx => ctx.reply(`
    ${ctx.from.first_name}, пожалуйста, выбери марсоход из списка ${roversList} и дату в земном времени. 
    ${timeOfWorkList}.` +
    constants.dialog.decodingOfCameraNames + camerasNamesList
    ))

bot.hears('/curiosity', ctx => {
    rover = '/curiosity'
    ctx.reply(selectCamera + curiosityCamerasList)
})

bot.hears('/opportunity', ctx => {
    rover = '/opportunity'
    ctx.reply(selectCamera + opportunityCamerasList)    
})

bot.hears('/spirit', ctx => {
    rover = '/spirit'
    ctx.reply(selectCamera + spiritCamerasList)    
}) 

bot.hears('/FHAZ', ctx => {
    if (rover === '/curiosity') {
        camera = ('/FHAZ').slice(1)
        ctx.reply(dateMessage + constants.errorMessages.timeOfWorkCuriosity)
    } else if (rover === '/opportunity')  {
        camera = ('/FHAZ').slice(1)
        ctx.reply(dateMessage + constants.errorMessages.timeOfWorkOpportunity) 
    } else if (rover === '/spirit')  {
        camera = ('/FHAZ').slice(1)
        ctx.reply(dateMessage + constants.errorMessages.timeOfWorkSpirit)
    } else {
        ctx.reply(noCameraMessage)
    } 
})
  
bot.hears('/RHAZ', ctx => {
    if (rover === '/curiosity') {
        camera = ('/RHAZ').slice(1)
        ctx.reply(dateMessage + constants.errorMessages.timeOfWorkCuriosity)
    } else if (rover === '/opportunity')  {
        camera = ('/RHAZ').slice(1)
        ctx.reply(dateMessage + constants.errorMessages.timeOfWorkOpportunity) 
    } else if (rover === '/spirit')  {
        camera = ('/RHAZ').slice(1)
        ctx.reply(dateMessage + constants.errorMessages.timeOfWorkSpirit)
    } else {
        ctx.reply(noCameraMessage)
    } 
})

bot.hears('/MAST', ctx => {
    if (rover === '/curiosity') {
        camera = ('/MAST').slice(1)
        ctx.reply(dateMessage + constants.errorMessages.timeOfWorkCuriosity)
    } else {
        ctx.reply(noCameraMessage)
    }
})
    
bot.hears('/CHEMCAM', ctx => {
    if (rover === '/curiosity') {
        camera = ('/CHEMCAM').slice(1)
        ctx.reply(dateMessage + constants.errorMessages.timeOfWorkCuriosity)
    } else {
        ctx.reply(noCameraMessage)
    }
})

bot.hears('/MAHLI', ctx => {
    if (rover === '/curiosity') {
        camera = ('/MAHLI').slice(1)
        ctx.reply(dateMessage + constants.errorMessages.timeOfWorkCuriosity)
    } else {
        ctx.reply(noCameraMessage)
    } 
})  
        
bot.hears('/MARDI', ctx => {
    if (rover === '/curiosity') {
        camera = ('/MARDI').slice(1)
        ctx.reply(dateMessage + constants.errorMessages.timeOfWorkCuriosity)
    } else {
        ctx.reply(noCameraMessage)
    } 
})

bot.hears('/NAVCAM', ctx => {
    if (rover === '/curiosity') {
        camera = ('/NAVCAM').slice(1)
        ctx.reply(dateMessage + constants.errorMessages.timeOfWorkCuriosity)
    } else if (rover === '/opportunity')  {
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
    if (rover === '/curiosity') {
        camera = ('/PANCAM').slice(1)
        ctx.reply(dateMessage + constants.errorMessages.timeOfWorkCuriosity)
    } else if (rover === '/opportunity')  {
        camera = ('/MINITES').slice(1)
        ctx.reply(dateMessage + constants.errorMessages.timeOfWorkOpportunity) 
    } else {
        ctx.reply(noCameraMessage)
    } 
})

bot.hears('/MINITES', ctx => {
    if (rover === '/curiosity') {
        camera = ('/MINITES').slice(1)
        ctx.reply(dateMessage + constants.errorMessages.timeOfWorkCuriosity)
    } else if (rover === '/opportunity')  {
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
