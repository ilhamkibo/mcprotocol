const snap7 = require("node-snap7");

const s7client = new snap7.S7Client();

s7client.ConnectTo("192.168.245.218", 0, 1, function (err) {
  if (err) {
    console.log(
      " >> Connection failed. Code #" + err + " - " + s7client.ErrorText(err)
    );
    return;
  }

  console.log("Connected to PLC!");

  // Periodically read from M100 every 1 second
  setInterval(() => {
    readMemory(100, 2); // Read 2 bytes (16-bit integer)
  }, 1000);

  // Write the value 10 to M200
  writeMemory(200, 10); // Writing integer 10
});

function readMemory(start, size) {
  s7client.MBRead(start, size, function (err, res) {
    if (err) {
      console.log(
        ` >> MBRead failed for M${start}. Code #${err} - ${s7client.ErrorText(
          err
        )}`
      );
      return;
    }

    // Convert the buffer to an integer (16-bit)
    const value = res.readInt16BE(0); // Big-endian format
    console.log(`Value at M${start}:`, value);
  });
}

function writeMemory(start, intValue) {
  // Create a buffer to hold the 16-bit integer
  const buffer = Buffer.alloc(2);
  buffer.writeInt16BE(intValue, 0); // Big-endian format

  s7client.MBWrite(start, buffer.length, buffer, function (err) {
    if (err) {
      console.log(
        ` >> MBWrite failed for M${start}. Code #${err} - ${s7client.ErrorText(
          err
        )}`
      );
      return;
    }
    console.log(`Value written to M${start}:`, intValue);
  });
}
