const McProtocolClient = require("node-mc_protocol");

let ipAddr = "192.168.245.218"; // Ganti dengan alamat IP PLC Keyence
let port = "6000"; // Port PLC
let options = {
  pcNo: 0xff, // Nomor PC default
  networkNo: 0x00, // Nomor jaringan default
  unitIoNo: [0xff, 0x03], // Unit IO default
  unitStationNo: 0x00, // Unit station default
  protocolFrame: "3E", // Frame protocol (hanya 3E)
  plcModel: "Q", // Model PLC (Q atau iQ-R)
};

let mcProtocolClient = new McProtocolClient(ipAddr, port, options); // Inisialisasi client dengan options.

let sampleFunc = async () => {
  try {
    await mcProtocolClient.open(); // Buka koneksi ke PLC.

    // Membaca 1 word dari DM100 (gunakan D100 untuk DM100)
    let value = await mcProtocolClient.getWord("D100");
    console.log("Nilai dari DM100:", value);

    // Menulis 1 word ke DM100 (gunakan D100 untuk DM100)
    await mcProtocolClient.setWord("D100", 1234);
    console.log("Berhasil menulis nilai 1234 ke DM100.");

    // Membaca 5 word mulai dari DM100
    let values = await mcProtocolClient.getWords("D100", 5);
    console.log("Nilai dari DM100 hingga DM104:", values);

    // Menulis array of words ke DM100
    await mcProtocolClient.setWords("D100", [100, 200, 300, 400, 500]);
    console.log("Berhasil menulis array ke DM100.");

    mcProtocolClient.close(); // Tutup koneksi.
  } catch (e) {
    console.error("Terjadi error:", e);
  }
};

// Jalankan fungsi setiap 3 detik
setInterval(() => {
  sampleFunc();
}, 3000);
