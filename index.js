const TCP = require("libp2p-tcp");
const Websockets = require("libp2p-websockets");
const WebRTCStar = require("libp2p-webrtc-star");

//webrtc in node.js
const wrtc = require("wrtc");

//multiaddr
const multiaddr = require("multiaddr");

//stream Multiplexers
const Mplex = require("libp2p-mplex");

//connection encrtyption
const { NOISE } = require("libp2p-noise");
const Secio = require("libp2p-secio");
//const ChatProtoc0l = require("./chat-protocol");

//libp2p core
const libp2p = require("libp2p");

//main entrypoint of chat application
const main = async () => {
  const node = await Libp2p.create({
    addresses: {
      // add a listen address (localhost) to accept TCP connections on a random port
      listen: ["/ip4/127.0.0.1/tcp/0"],
    },
    modules: {
      transport: [TCP, Websockets, WebRTCStar],
      streamMuxer: [Mplex],
      connEncryption: [NOISE, Secio],
    },
    config: {
      transport: {
        [WebRTCStar.prototype[Symbol.toStringTag]]: { wrtc },
      },
    },
  });

  libp2p.connectionManager.on("peer:connect", (connection) => {
    console.log(`Connected to ${connection.remotePeer.toB58Sting()}!`);
  });
  await libp2p.start();
  console.info(`${libp2p.peerId.toB58Sting()} listenin on address:`);
  console.info(
    libp2p.multiaddrs.map((addr) => addr.toString()).join("\n"),
    "\n"
  );

  //chat modules lies here!
  const targetAddress = multiaddr(
    "/dnsaddr/nrt-1.bootstrap.libp2p.io/p2p/QmcZf59bWwK5XFi76CZX8cbJ4BhTzzA3gU1ZjYZcYW3dwt"
  );
  try {
    await libp2p.dial(targetAddress);
  } catch (err) {
    console.error(err);
  }
};
