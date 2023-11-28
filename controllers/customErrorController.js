const utilities = require("../utilities")
const errorCont = {}

errorCont.buildErrorPage = async function(req, res, next){
    const erro = new Error('Something went wrong...');
    erro.status = 500;
    next(erro);
}

module.exports = errorCont

