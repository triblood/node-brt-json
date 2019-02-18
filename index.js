const axios = require('axios');
const restify = require('restify');
const corsMiddleware = require('restify-cors-middleware');

function listaLinha(req, res, next){
    axios.get('http://webapibrt.rio.rj.gov.br/api/v1/brt')
    .then(function(response){
        let busLista = [];
        console.log(req.params.linha)
        for (let y = 0; y < req.params.linha.split(';').length; y++) {
            
            for (let x = 0; x < response.data.veiculos.length; x++) {
                if((response.data.veiculos[x].linha == req.params.linha.split(';')[y]) && (response.data.veiculos[x].velocidade > 0)){
                    // console.log(response.data.veiculos[x]);
                    busLista.push(response.data.veiculos[x]);
                }
            }
        }
        
        // console.log(busLista)
        res.send(busLista);
        // console.log(busLista)
        next();
    })
    .catch(function(err){
        console.log(err)
    })
}

function onibusId(req, res, next){
    axios.get('http://webapibrt.rio.rj.gov.br/api/v1/brt')
    .then(function(response){
        let busLista = []; 
        for (let x = 0; x < response.data.veiculos.length; x++) {
            if((response.data.veiculos[x].codigo == req.params.busid) && (response.data.veiculos[x].velocidade > 0)){
                // console.log(response.data.veiculos[x]);
                busLista.push(response.data.veiculos[x]);
            }
        }
        
        // console.log(busLista)
        res.send(busLista);
        // console.log(busLista)
        next();
    })
    .catch(function(err){
        console.log(err)
    })
}

// axios.get('http://webapibrt.rio.rj.gov.br/api/v1/brt')
// .then(function(res){
//     console.log(listaLinha(res, '5801A1'))
// })
// .catch(function(err){
//     console.log(err)
// })



let server = restify.createServer();

const cors = corsMiddleware({
    preflightMaxAge: 5, //Optional
    origins: ['*']
})

server.pre(cors.preflight)
server.use(cors.actual)

server.get('/linha/:linha', listaLinha);
server.head('/linha/:linha', listaLinha);

server.get('/busid/:busid', onibusId);
// server.head('/busid/:busid', listaLinha);

server.listen(8080, function() {
    console.log('%s listening at %s', server.name, server.url);
});