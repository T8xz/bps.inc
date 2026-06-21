const nama = document.getElementById("nama");
const bangunan = document.getElementById("bangunan");
const keluarga = document.getElementById("keluarga");
const summary = document.getElementById("summary");

const harian = document.getElementById("harian");
const periode = document.getElementById("periode");
const bulanan = document.getElementById("bulanan");

const panjang = document.getElementById("panjang");
const lebar = document.getElementById("lebar");
const luasRumah = document.getElementById("luasRumah");

const referensiPendapatan =
document.getElementById("referensiPendapatan");
const persenMakan =
document.getElementById("persenMakan");
const pengeluaranMakan =
document.getElementById("pengeluaranMakan");


const listrik = document.getElementById("listrik");
const internet = document.getElementById("internet");

const pajakMotor = document.getElementById("pajakMotor");
const pbb = document.getElementById("pbb");
const ukt = document.getElementById("ukt");
const acara = document.getElementById("acara");

const jumlahKendaraan =
document.getElementById("jumlahKendaraan");
const kendaraanContainer =
document.getElementById("kendaraanContainer");
const totalTransport =
document.getElementById("totalTransport");

function rupiah(angka){
    return "Rp " + Number(angka).toLocaleString("id-ID");
}

function openModal(){

    document
    .getElementById("resetModal")
    .classList.add("show");
}

function closeModal(){

    document
    .getElementById("resetModal")
    .classList.remove("show");
}

function formatNumber(value){

    value = value.replace(/\D/g, '');

    return value.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

function generateKendaraan(){

    kendaraanContainer.innerHTML = "";

    const jumlah =
    Number(jumlahKendaraan.value);

    for(let i=1;i<=jumlah;i++){

        kendaraanContainer.innerHTML += `

        <div class="sub-card">

            <h3>Kendaraan #${i}</h3>

            <div class="input-group">
                <label>Jenis</label>

                <select class="jenisTransport">
                    <option>Motor</option>
                    <option>Mobil</option>
                    <option>Sepeda Listrik</option>
                </select>
            </div>

            <div class="input-group">
                <label>Harga Aset</label>

                <input
                    type="tel"
                    inputmode="numeric"
                    class="hargaTransport">
            </div>

            <div class="input-group">
                <label>Kondisi</label>

                <select class="kondisiTransport">

                    <option value="90">
                        Sangat Baik (90%)
                    </option>

                    <option value="75">
                        Baik (75%)
                    </option>

                    <option value="60" selected>
                        Normal (60%)
                    </option>

                    <option value="40">
                        Kurang Baik (40%)
                    </option>

                    <option value="25">
                        Rusak Ringan (25%)
                    </option>

                </select>
            </div>

            <div class="input-group">
                <label>Nilai Aset Saat Ini</label>

                <input
                    type="text"
                    class="nilaiTransport"
                    readonly>
            </div>

        </div>
        `;
    }

    attachTransportListeners();

    updateSummary();
}

function attachTransportListeners(){

    document
    .querySelectorAll(".hargaTransport")
    .forEach(input=>{

        input.addEventListener(
            "input",
            function(){

                this.value =
                formatNumber(
                    this.value
                );

                updateSummary();
            }
        );

    });

    document
    .querySelectorAll(".kondisiTransport")
    .forEach(select=>{

        select.addEventListener(
            "change",
            updateSummary
        );

    });

}

function hitungTransport(){

    let total = 0;

    const hargaList =
    document.querySelectorAll(".hargaTransport");

    const kondisiList =
    document.querySelectorAll(".kondisiTransport");

    const nilaiList =
    document.querySelectorAll(".nilaiTransport");

    hargaList.forEach((harga,index)=>{

        const nilaiHarga =
        Number(
            harga.value.replace(/\./g,'')
        ) || 0;

        const kondisi =
        Number(
            kondisiList[index].value
        );

        const nilaiAset =
        nilaiHarga *
        (kondisi / 100);

        nilaiList[index].value =
        rupiah(nilaiAset);

        total += nilaiAset;

    });

    totalTransport.value =
    rupiah(total);

    return total;
}

function row(label, value){

    return `${label.padEnd(32," ")} : ${value}`;
}

function updateSummary(){

    localStorage.setItem("nama", nama.value);
    localStorage.setItem("bangunan", bangunan.value);
    localStorage.setItem("keluarga", keluarga.value);

    localStorage.setItem("harian", harian.value);
    localStorage.setItem(
        "periode",
        periode.value
    );

    localStorage.setItem(
        "panjang",
        panjang.value
    );

    localStorage.setItem(
        "lebar",
        lebar.value
    );

    localStorage.setItem(
        "persenMakan",
        persenMakan.value
    );

    localStorage.setItem("listrik", listrik.value);
    localStorage.setItem("internet", internet.value);

    localStorage.setItem("pajakMotor", pajakMotor.value);
    localStorage.setItem("pbb", pbb.value);
    localStorage.setItem("ukt", ukt.value);
    localStorage.setItem("acara", acara.value);

    const nominal =
    Number(
        harian.value.replace(/\./g,'')
    ) || 0;

    let multiplier = 1;

    switch(periode.value){

        case "harian":
            multiplier = 30;
            break;

        case "mingguan":
            multiplier = 4;
            break;

        case "bulanan":
            multiplier = 1;
            break;
    }

    const totalBulanan =
    nominal * multiplier;

    bulanan.value =
    rupiah(totalBulanan);

    referensiPendapatan.value =
    `${rupiah(totalBulanan)} - ${persenMakan.value}%`;

    const makanBulanan =
    totalBulanan *
    (Number(persenMakan.value) / 100);

    pengeluaranMakan.value =
    rupiah(makanBulanan);

    const totalAsetTransport =
    hitungTransport();

    const luas =
    (
        (Number(panjang.value) || 0) *
        (Number(lebar.value) || 0)
    ).toFixed(1);

    luasRumah.value =
    luas > 0
    ? luas + " m²"
    : "";

summary.textContent =
`
${row("Nama", nama.value || "-")}
${row("No Urut Bangunan", bangunan.value || "-")}
${row("No Urut Keluarga", keluarga.value || "-")}

${row(
    "Pendapatan",
    `${rupiah(nominal)} / ${periode.options[periode.selectedIndex].text.replace("Per ","")}`)}
${row(
    "Pendapatan Bulanan",
    rupiah(totalBulanan)
)}

${row(
    "Luas Rumah",
    `${luas} m²`
)}

${row(
    "Estimasi Pengeluaran Makan",
    rupiah(makanBulanan)
)}

PENGELUARAN LAINNYA
${row("Listrik / Bulan",`Rp ${listrik.value || "0"}`)}
${row("Internet / Bulan",`Rp ${internet.value || "0"}`)}

PENGELUARAN TAHUNAN
${row("Pajak Motor / Tahun",`Rp ${pajakMotor.value || "0"}`)}
${row("Pajak PBB / Tahun",`Rp ${pbb.value || "0"}`)}
${row(
    "UKT / SPP / Tahun",
    `Rp ${ukt.value || "0"}`)}
${row(
    "Acara Keluarga / Tahun",
    `Rp ${acara.value || "0"}`
)}

${row(
    "Total Aset Transportasi",
    rupiah(totalAsetTransport)
)}
`;


}

function showToast(text){

    const toast = document.getElementById("toast");

    toast.textContent = text;

    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 2500);
}

function copySummary(){

    const formattedText =
`\
\`\`\`
${summary.textContent}
\`\`\`
`;

    navigator.clipboard.writeText(formattedText);

    showToast("Berhasil dicopy");
}

function resetForm(){

    openModal();
}

function confirmReset(){

    localStorage.clear();

    nama.value = "";
    bangunan.value = "";
    keluarga.value = "";

    harian.value = "";

    bulanan.value = "";

    panjang.value = "";
    lebar.value = "";

    luasRumah.value = "";

    persenMakan.value = "40";

    pengeluaranMakan.value = "";

    closeModal();

    updateSummary();

    showToast("Data direset");
}

function loadData(){

    nama.value =
    localStorage.getItem("nama") || "";

    bangunan.value =
    localStorage.getItem("bangunan") || "";

    keluarga.value =
    localStorage.getItem("keluarga") || "";

    harian.value =
    localStorage.getItem("harian") || "";


    periode.value =
    localStorage.getItem("periode")
    || "bulanan";


    panjang.value =
    localStorage.getItem("panjang") || "";

    lebar.value =
    localStorage.getItem("lebar") || "";

    persenMakan.value =
    localStorage.getItem("persenMakan")
    || "40";

    listrik.value =
    localStorage.getItem("listrik") || "";

    internet.value =
    localStorage.getItem("internet") || "";

    pajakMotor.value =
    localStorage.getItem("pajakMotor") || "";

    pbb.value =
    localStorage.getItem("pbb") || "";

    ukt.value =
    localStorage.getItem("ukt") || "";

    acara.value =
    localStorage.getItem("acara") || "";


    updateSummary();
}

nama.addEventListener("input", updateSummary);
bangunan.addEventListener("input", updateSummary);
keluarga.addEventListener("input", updateSummary);

harian.addEventListener("input", function(){

    this.value = formatNumber(this.value);

    updateSummary();
});
periode.addEventListener("change", updateSummary);

panjang.addEventListener(
    "input",
    updateSummary
);

lebar.addEventListener(
    "input",
    updateSummary
);

persenMakan.addEventListener(
    "change",
    updateSummary
);

[
    listrik,
    internet,
    pajakMotor,
    pbb,
    ukt,
    acara
].forEach(field => {

    field.addEventListener("input", function(){

        this.value =
        formatNumber(this.value);

        updateSummary();
    });

});

jumlahKendaraan.addEventListener(
    "change",
    generateKendaraan
);

const bpsInc =
document.getElementById("bpsInc");

let clickCount = 0;
let clickTimer;

bpsInc.addEventListener("click", () => {

    clickCount++;

    clearTimeout(clickTimer);

    clickTimer = setTimeout(() => {
        clickCount = 0;
    }, 2000);

    if(clickCount === 3){

        window.open(
            "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            "_blank"
        );

        clickCount = 0;
    }

});

generateKendaraan();

loadData();