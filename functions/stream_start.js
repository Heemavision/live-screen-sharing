const twilio = require('twilio');

exports.handler = async function(context, event, callback) {
  //authentication
  if (event.password != context.HOST_PASSWORD) {
    const response = new Twilio.Response();
    response.setStatusCode(401);
    response.setBody('Invalid password');
    return callback(null, response);
  }

  const client = context.getTwilioClient();

  // create a player streamer
  const playerStreamer = await client.media.playerStreamer.create();
  console.log(playerStreamer);

  // create a media processor
  const mediaProcessor = await client.media.mediaProcessor.create({
    extension: 'video-composer-v1',
    extensionContext: JSON.stringify({
      room: {name: event.room},
      identity: 'twilio-live',
      outputs: [playerStreamer.sid],
      resolution: '1280x720',
    }),
  });
  console.log(mediaProcessor);

  // return a success response
  return callback();
}
