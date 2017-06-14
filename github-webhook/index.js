var Client = require('azure-iothub').Client;
var Message = require('azure-iot-common').Message;

module.exports = function (context, data) {
    if (data.issue) {
        var serviceClient = Client.fromConnectionString(process.env['connectionString']);
        serviceClient.open(function (err) {
            if (err) {
                context.log('Could not connect: ' + err.message);
            } else {
                context.log('Service client connected');
                var message = new Message(`Issue '${data.issue.title}' was ${data.action} at ${data.issue.updated_at}`);
                context.log('Sending message: ' + message.getData());
                serviceClient.send(process.env['targetDevice'], message, printResultFor('send', context));
            }
        });
    }

    context.done();
};

function printResultFor(op, context) {
  return function printResult(err, res) {
    if (err) context.log(op + ' error: ' + err.toString());
    if (res) context.log(op + ' status: ' + res.constructor.name);
  };
}