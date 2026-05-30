// Pola Segitga
// NIM : 053147164

let tinggi: number = 4;

for (let i = 1; i <= tinggi; i++) {
    let baris: string = "";

    for (let j = 1; j <= i; j++) {
        baris += j + " ";
    }

    console.log(baris.trim());
}