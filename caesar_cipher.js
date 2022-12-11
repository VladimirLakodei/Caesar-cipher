const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

fs.readFile('./test.txt', 'utf8', (err, text) => {
    if (err) {
        console.error(err);
        console.log('\nПомилка читання файлу!');
        return;
    }

    console.log(text);

    rl.question('Введіть ключ (Число) ', function (rawStep) {
        const step = parseInt(rawStep);
        if (isNaN(step)) { 
            console.log('\nНе число!');
            rl.close();
            return;
        }

        initEncrypt(step);

        rl.question('Щоб зашифрувати файл введіть 1, розшифрувати 0 ', function (code) {
            let result = null;

            if (code === '1') {
                result = encrypt(text);
            } else if (code === '0') {
                result = decrypt(text);
            } else {
                console.log('\nНеправильний ввід!');
            }

            if (result) {
                console.log(result)
                fs.writeFile('result.txt', result, { encoding: "utf8", flag: "w", mode: 0o666}, (err) => {
                    if (err) {
                        console.log(err);
                        rl.close();
                    } else {
                        console.log('Результат збережений!');
                        rl.close();
                    }
                });
            } else {
                console.log('Немає результату!');
                rl.close();
            }
        });
    });
});

rl.on('close', function () {
    console.log('Програма завершена!');
    process.exit(0);
});

let pos;

let OtherSymbols = [' ', ',', '.', ':', ';', '!', '?', '-', '_', '=', '+', '(', ')', '[', ']', '@', '`', "'", '"', '<', '>', '|', '/', '%', '$', '^', '&', '*', '~'];
let Numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
let RusAlfUp = ['А', 'Б', 'В', 'Г', 'Д', 'Е', 'Ё', 'Ж', 'З', 'И', 'Й', 'К', 'Л', 'М', 'Н', 'О', 'П', 'Р', 'С', 'Т', 'У', 'Ф', 'Х', 'Ц', 'Ч', 'Ш', 'Щ', 'Ъ', 'Ы', 'Ь', 'Э', 'Ю', 'Я'];
let RusAlfLower = ['а', 'б', 'в', 'г', 'д', 'е', 'ё', 'ж', 'з', 'и', 'й', 'к', 'л', 'м', 'н', 'о', 'п', 'р', 'с', 'т', 'у', 'ф', 'х', 'ц', 'ч', 'ш', 'щ', 'ъ', 'ы', 'ь', 'э', 'ю', 'я'];
let EngAlfUp = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
let EngAlfLower = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'm', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
let UkrAlfUp = ['А', 'Б', 'В', 'Г', 'Ґ', 'Д', 'Е', 'Є', 'Ж', 'З', 'И', 'І', 'Ї', 'Й', 'К', 'Л', 'М', 'Н', 'О', 'П', 'Р', 'С', 'Т', 'У', 'Ф', 'Х', 'Ц', 'Ч', 'Ш', 'Щ', 'Ь', 'Ю', 'Я'];
let UkrAlfLower = ['а', 'б', 'в', 'г', 'ґ', 'д', 'е', 'є', 'ж', 'з', 'и', 'і', 'ї', 'й', 'к', 'л', 'м', 'н', 'о', 'п', 'р', 'с', 'т', 'у', 'ф', 'х', 'ц', 'ч', 'ш', 'щ', 'ь', 'ю', 'я'];
let RusAlfUpEncrypt = Array(33);
let RusAlfLowerEncrypt = Array(33);
let EngAlfUpEncrypt = Array(26);
let EngAlfLowerEncrypt = Array(26);
let UkrAlfUpEncrypt = Array(33);
let UkrAlfLowerEncrypt = Array(33);
let NumbersEncrypt = Array(10);

function initEncrypt(UserStep) {
    RusAlfUpEncrypt = CezarEncrypt(UserStep, RusAlfUp);
    RusAlfLowerEncrypt = CezarEncrypt(UserStep, RusAlfLower);
    NumbersEncrypt = CezarEncrypt(UserStep, Numbers);
    EngAlfUpEncrypt = CezarEncrypt(UserStep, EngAlfUp);
    EngAlfLowerEncrypt = CezarEncrypt(UserStep, EngAlfLower);
    UkrAlfUpEncrypt = CezarEncrypt(UserStep, UkrAlfUp);
    UkrAlfLowerEncrypt = CezarEncrypt(UserStep, UkrAlfLower);
}

function CezarEncrypt(rawStep, arr) {
    let step = rawStep%arr.length
    let CopyAlf = arr.slice();
    let i = 0;

    while ((i + step) < (CopyAlf.length)) {
        let buff = CopyAlf[i];
        CopyAlf[i] = CopyAlf[i + step];
        CopyAlf[i + step] = buff;
        i++;
    }
    return CopyAlf;
}

function contains(symb, arr) {
    let letter = symb;
    pos = 0;
    for (let i = 0; i < arr.length; i++) {
        if (letter === arr[i]) {
            pos = i;
            return true;
            break;
        }
    }
}

function encrypt(text) {
    let result = '';
    for (let i = 0; i <= text.length; i++) {
        let symbol = text[i];
        if (contains(symbol, OtherSymbols)) {
            result += symbol;
        } else
        if (contains(symbol, Numbers)) {
            symbol = NumbersEncrypt[pos];
            result += symbol;
        } else
        if (contains(symbol, UkrAlfUp)) {
            symbol = UkrAlfUpEncrypt[pos];
            result += symbol;
        } else
        if ((contains(symbol, UkrAlfLower))) {
            symbol = UkrAlfLowerEncrypt[pos];
            result += symbol;
        } else
        if (contains(symbol, RusAlfUp)) {
            symbol = RusAlfUpEncrypt[pos];
            result += symbol;
        } else
        if ((contains(symbol, RusAlfLower))) {
            symbol = RusAlfLowerEncrypt[pos];
            result += symbol;
        } else
        if (contains(symbol, EngAlfUp)) {
            symbol = EngAlfUpEncrypt[pos];
            result += symbol;
        } else
        if ((contains(symbol, EngAlfLower))) {
            symbol = EngAlfLowerEncrypt[pos];
            result += symbol;
        }
    }
    return result;
}

function decrypt(text) {
    let result = '';
    for (let i = 0; i <= text.length; i++) {
        let symbol = text[i];
        if (contains(symbol, OtherSymbols)) {
            result += symbol;
        } else
        if (contains(symbol, NumbersEncrypt)) {
            symbol = Numbers[pos];
            result += symbol;
        } else
        if (contains(symbol, UkrAlfUpEncrypt)) {
            symbol = UkrAlfUp[pos];
            result += symbol;
        } else
        if ((contains(symbol, UkrAlfLowerEncrypt))) {
            symbol = UkrAlfLower[pos];
            result += symbol;
        } else
        if (contains(symbol, RusAlfUpEncrypt)) {
            symbol = RusAlfUp[pos];
            result += symbol;
        } else
        if ((contains(symbol, RusAlfLowerEncrypt))) {
            symbol = RusAlfLower[pos];
            result += symbol;
        } else
        if (contains(symbol, EngAlfUpEncrypt)) {
            symbol = EngAlfUp[pos];
            result += symbol;
        } else
        if ((contains(symbol, EngAlfLowerEncrypt))) {
            symbol = EngAlfLower[pos];
            result += symbol;
        }
    }
    return result;
}
