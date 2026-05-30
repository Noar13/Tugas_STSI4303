// Bilangan Prima
// NIM : 053147164

let batas: number = 64 + 10;

console.log("Bilangan prima dari 1 sampai " , batas);

for (let i = 2; i <= batas; i++) {
    let prima: boolean = true;

    for (let j = 2; j < i; j++) {
        if (i % j === 0) {
            prima = false;
            break;
        }
    }

    if (prima) {
        console.log(i);
    }
}