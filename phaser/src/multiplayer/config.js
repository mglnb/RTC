export const peerConfig = {'iceServers': [{'url': 'stun:stun.l.google.com:19302'}]}
export const connectionConfig = {
  'optional':
    [{'DtlsSrtpKeyAgreement': true}, {'RtpDataChannels': true}]
}
export const sdpConstraints = {
  'mandatory':
    {
      'OfferToReceiveAudio': false,
      'OfferToReceiveVideo': false
    }
}
