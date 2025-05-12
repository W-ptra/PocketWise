const { getSaldoByUserId } = require("../database/postgres/saldoDatabase");

async function getSaldo(request,h){
    const user = request.user;

    const saldo = await getSaldoByUserId(user.id);
    return h
        .response({
        message: "successfully retrive saldo",
        data: saldo,
        })
        .code(200);
}

module.exports = {
    getSaldo
}