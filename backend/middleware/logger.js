function logMiddleware(request, h) {
    const duration = Date.now() - request.app.startTime;
  
    const response = request.response;
    const statusCode = response?.isBoom ? response.output.statusCode : response.statusCode;
    const ip = request.info.remoteAddress;
  
    const logInfo = `[${new Date().toISOString()}] ${statusCode} ${request.method.toUpperCase()} ${request.path} ${duration}ms - IP: ${ip}`;
    console.log(logInfo);
  
    return h.continue;
  }
  

function requestTimeCounting(request,h){
    request.app.startTime = Date.now();
    return h.continue;
}

module.exports = {
    logMiddleware,
    requestTimeCounting
}