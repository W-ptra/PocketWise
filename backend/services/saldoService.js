const { getSaldoByUserId } = require("../database/postgres/saldoDatabase");

async function getSaldo(request,h){
    try{
        const user = request.user;
    
        const saldo = await getSaldoByUserId(user.id);
        return h
            .response({
            message: "successfully retrive saldo",
            data: saldo,
            })
            .code(200);
    } catch(err){
        console.error(err);
        return h
            .response({
                error: "something went wrong, please contact pocketwise support",
            })
            .code(500);
    }
}

module.exports = {
    getSaldo
}