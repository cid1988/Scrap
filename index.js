const request = require('request');
const cheerio = require('cheerio');
const express = require('express');
const app = express();
var cronJob = require('cron').CronJob;

const fravega = function(direccion){
   request(direccion, (error, response, html)=>{
      if (error) return console.error(error);
      if(!error && response.statusCode == 200){
         const $ = cheerio.load(html)

         const productos = [];

         $('li').find('div > a').each(function (i, e) {
            let titulo = $(this).find('article div h4').text();
            let href = $(this).attr('href');
            let precioFinal = $(this).find('article div div span').text();

            productos.push({'titulo': titulo, 'Precio final': precioFinal, 'link': 'fravega.com' + href})
         });

         console.table(productos)
      }
   })
}

const garbarino = function(direccion){
   request(direccion, (error, response, html)=>{
      if (error) return console.error(error);
      if(!error && response.statusCode == 200){
         const $ = cheerio.load(html)
         const productos = [];

         $('.itemBox--info').each(function(i, e){
            let titulo = $(this).find('a h3').text();
            let precioFinal = $(this).find('a div .value-item').text();
            let link = $(this).find('a').attr('href');

            precioFinal = precioFinal.replace("$","")
            productos.push({'titulo': titulo, 'Precio final': precioFinal, 'link': 'garbarino.com' + link})
         })
         console.table(productos)
      }
   })
}

const direcciones = [
   'https://www.fravega.com/l/tv-y-video/tv/',
   'https://www.fravega.com/l/celulares/celulares-liberados/',
   "https://www.fravega.com/l/audio/radios-y-audio-portatil/",
   "https://www.fravega.com/l/?categorias=informatica%2Fgaming-pc"
]

const direccionesGarbarino = [
   "https://www.garbarino.com/productos/tv-led-y-smart-tv/4342"
]

app.use(express.static(__dirname + '/public/'));

app.listen('3000', function() {
   var job = new cronJob({ 
      cronTime:'0 15 * * * *', 
      onTick: function(){
         // for (let i = 0; i < direcciones.length; i++) {
         //    const element = direcciones[i];
         //    fravega(element)
         // }
         
         for (let i = 0; i < direccionesGarbarino.length; i++) {
            const element = direccionesGarbarino[i];
            garbarino(element)
         }
      },
      start:true,
      timeZone:'Asia/Kolkata'
   });
   job.start();
});