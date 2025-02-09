/* eslint-disable no-unused-vars */
// const fins = require("../lib/index"); // << use this when running from src
const fins = require("omron-fins"); // << use this when running from npm

// Connecting to remote FINS client on port 9600 with timeout of 2s.
// PLC is expected to be at 192.168.1.120 and this PC is expected to be fins node 36 (adjust as required)
const client = fins.FinsClient(9700, "127.0.0.1", {
  protocol: "tcp",
  SA1: 36,
  DA1: 120,
  timeout: 2000,
});

// Setting up our error listener
client.on("error", function (error, msg) {
  console.log("Error: ", error, msg);
});
// Setting up our timeout listener
client.on("timeout", function (host, msg) {
  console.log("Timeout: ", host, msg);
});

// client.on("open", function (info) {
//   console.log("open: ", info);

//   // Setting up the general response listener showing a selection of properties from the `msg`
//   client.on("reply", function (msg) {
//     console.log("");
//     console.log("############# client.on('reply'...) #################");
//     console.log("Reply from           : ", msg.response.remoteHost);
//     console.log("Sequence ID (SID)    : ", msg.sid);
//     console.log("Requested command    : ", msg.request.command);
//     console.log("Response code        : ", msg.response.endCode);
//     console.log("Response desc        : ", msg.response.endCodeDescription);
//     if (msg.request.command.name == "cpu-unit-data-read") {
//       console.log("CPU model            : ", msg.response.CPUUnitModel || "");
//       console.log(
//         "CPU version          : ",
//         msg.response.CPUUnitInternalSystemVersion || ""
//       );
//     } else {
//       console.log("Data returned        : ", msg.response.values || "");
//     }
//     console.log("Round trip time      : ", msg.timeTaken + "ms");
//     console.log("Your tag             : ", msg.tag);
//     console.log("#####################################################");
//     console.log("");
//   });

//   console.log("Read CPU Unit Data ");
//   client.cpuUnitDataRead(null, { tagdata: "Calling cpuUnitDataRead" });

//   // Read 10 registers starting at DM register 0
//   // a "reply" will be emitted - check general client reply on reply handler
//   console.log("Read 10 WD from D0");
//   client.read("D0", 10, null, { tagdata: "I asked for 10 registers from D0" });
//   console.log("Read 32 bits from D0.0");
//   client.read("D0.0", 32, null, { tagdata: "I asked for 32 bits from D0.0" });

//   // Read multiple registers using CSV as the address list
//   // a "reply" will be emitted - check general client reply on reply handler
//   console.log(`Read multiple addresses "D0,D0.0,D0.1,D0.2,D0.3,W10,D1.15"`);
//   client.readMultiple(
//     "D0,D0.0,D0.1,D0.2,D0.3,W10,D1.15",
//     null,
//     "readMultiple 'D0,D0.0,D0.1,D0.2,D0.3,W10,D1.15'"
//   );

//   // Read multiple registers using an array as the address list
//   // a "reply" will be emitted - check general client reply on reply handler
//   console.log(
//     `Read multiple addresses ["D0","D0.0","D0.1","D0.2","W10","D1.15"]`
//   );
//   client.readMultiple(
//     ["D0", "D0.0", "D0.1", "D0.2", "W10", "D1.15"],
//     null,
//     'readMultiple ["D0","D0.0","D0.1","D0.2","W10","D1.15"]'
//   );

//   // direct callback is useful for getting direct responses to direct requests
//   var cb = function (err, msg) {
//     console.log("");
//     console.log("################ DIRECT CALLBACK ####################");
//     if (err) console.error(err);
//     else
//       console.log(
//         "SID: " + msg.request.sid,
//         msg.request.command.name,
//         msg.request.command.desc,
//         msg.request.command.descExtra,
//         msg.tag || "",
//         msg.response.endCodeDescription
//       );
//     console.log("#####################################################");
//     console.log("");
//   };

//   //example fill D700~D704 with randomInt. Callback `cb` with the response
//   let randomInt = parseInt(Math.random() * 1000) + 1;
//   console.log(
//     `Fill D700~D709 with random number '${randomInt}' - direct callback expected`
//   );
//   client.fill("D700", randomInt, 10, cb, `set D700~D709 to '${randomInt}'`);

//   //example Transfer D700~D709 to D710~D719. Callback `cb` with the response
//   console.log("Transfer D700~D709 to D710~D719 - direct callback expected");
//   client.transfer("D700", "D710", 10, cb, "Transfer D700~D709 to D710~D719");

//   //example Read D700~D719
//   console.log(`Read D700~D719 - expect ${randomInt}`);
//   client.read(
//     "D700",
//     20,
//     null,
//     `Read D700~D719 - expect all values to be '${randomInt}'`
//   );

//   //example Read from other PLC on FINS network (routed to NET:2, NODE:11) D700~D719
//   console.log(
//     `Read D700~D719 from DNA:2, DA1:11 with individual timeout setting`
//   );
//   const readRemotePLC_options = {
//     timeout: 400,
//     DNA: 2,
//     DA1: 11,
//     callback: function (err, msg) {
//       if (err) {
//         console.error(err, msg, "Read D700~D719 from DNA: 2, DA1:11");
//       } else {
//         console.log(msg, "Read D700~D719 from DNA: 2, DA1:11");
//       }
//     },
//   };
//   client.read(
//     "D700",
//     20,
//     readRemotePLC_options,
//     `Read D700~D719 from DNA:2, DA1:11`
//   );

//   //example write 1010 1111 0000 0101 to D700.0~D700.15 - response will be sent to client 'reply' handler
//   client.write(
//     "D700.0",
//     [
//       true,
//       false,
//       1,
//       0,
//       "true",
//       true,
//       1,
//       "1",
//       "false",
//       false,
//       0,
//       "0",
//       0,
//       1,
//       0,
//       1,
//     ],
//     null,
//     "write 1010 1111 0000 0101 to D700"
//   );
//   client.read(
//     "D700.0",
//     16,
//     null,
//     "read D700.0 ~ D700.15 - should contain 1010 1111 0000 0101"
//   );

//   //example tagged data for sending with a status request
//   const tag = { source: "system-a", sendto: "system-b" };
//   getStatus(tag);

//   function getStatus(_tag) {
//     console.log("Get PLC Status...");
//     client.status(function (err, msg) {
//       if (err) {
//         console.error(err, msg);
//       } else {
//         //use the tag for post reply routing or whatever you need
//         console.log("");
//         console.log("################ STATUS CALLBACK ####################");
//         console.log(msg.response.status, msg.response.mode, msg.response);
//         console.log("#####################################################");
//         console.log("");
//       }
//     }, _tag);
//   }

//   setTimeout(() => {
//     console.log("Request PLC change to STOP mode...");
//     client.stop((err, msg) => {
//       if (err) {
//         console.error(err);
//       } else {
//         console.log("* PLC should be stopped - check next STATUS CALLBACK");
//         setTimeout(() => {
//           getStatus();
//         }, 150);
//       }
//     });
//   }, 500);

//   setTimeout(() => {
//     console.log("Request PLC change to RUN mode...");
//     client.run((err, msg) => {
//       if (err) {
//         console.error(err);
//       } else {
//         console.log("* PLC should be running - check next STATUS CALLBACK");
//         setTimeout(() => {
//           getStatus();
//         }, 150);
//       }
//     });
//   }, 2000);
// });

/* Same as above with callback */
client.read("D00100", 1, function (err, msg) {
  if (err) console.error("err nic: ", err);
  else console.log("msg: ", msg);
});

client.write("D00000", [12, 34, 56], function (err, msg) {
  if (err) console.error("err nic: ", err);
  else console.log("msg: ", msg);
});

client.status();
