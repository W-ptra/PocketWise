function notFound(request,h){
    const response = request.response;
    if(response.isBoom && response.output.statusCode === 404)
        return h.response({
            error:`Path ${request.path} was not found`
        }).code(404);

    return h.continue;
}

module.exports = {
    notFound
}