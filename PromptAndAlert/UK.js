const fs = require('fs'); // підключення модулю fs
const fd = (process.platform === 'win32') ? process.stdin.fd : fs.openSync('/dev/tty', 'rs'); // конфігурація для ОС
const basicEnd = (process.platform === 'win32') ? '\r\n' : '\n'; // конфігурація базовго символу кінця рядка залежно від ОС
const StringDecoder = require('string_decoder').StringDecoder; // підключення класу StringDecoder із модуля string_decoder
const decoder = new StringDecoder('utf8'); // створення об'єкту StringDecoder

function write(text = "", end = "") { // функція для запису
    fs.writeSync(process.stdout.fd, text.toString() + end); // запис
}

function writeWord(text = "", end = " ") { // функція для запису слова
    write(text, end); // виклик звичайного write із закінченням end (за замовченням пробіл)
}

function writeLine(text = "") { // функція для запису рядка
    write(text, basicEnd); // виклик звичайного write із закінченням basicEnd
}

function alert(msg = "") { // функція для запису повідомлення
    writeLine(msg); // виклик фцнкції запису рядка
}

function getChar() { // функція для читання коду символа
    const buf = new Buffer.alloc(1, 0, 'utf8'); // створення об'єкту Buffer
    let bytesRead = 0;
    try { // пробуємо прочитати
        bytesRead = fs.readSync(fd, buf, 0, 1); // читання та збереження довжини прочитаних байтів
    }
    catch(error) { // якщо з'являються якісь помилки
        return -1; // повернення якщо символ не прочитаний
    }
    finally { // якщо не з'явилися
        if (bytesRead > 0) return decoder.write(buf).charCodeAt(0); // перевірка чи прочитаний символ та повернення символа якщо так
        else return -1; // повернення якщо символ не прочитаний
    }
}

function read(end = ` ${basicEnd}`) { // функція для читання до закінчення end
    let s = "", char, c;
    while ((c = getChar()) != -1 && end.indexOf(char = String.fromCharCode(c)) != -1); // рух початку читання до першого не символа кінця
    if (c != -1) s = char; // перший символ
    while ((c = getChar()) != -1 && end.indexOf(char = String.fromCharCode(c)) == -1) { // читання симовлім поки символ кінця не хнайжений
        s += char; // додання символів в один рядок поки вони не закінчаться
    }
    return s; // повернути результат
}

function readWord(end = ` ${basicEnd}`) { // функція для читання слова до закінчення end
    return read(end); // повернення та виклик звичайної функції read із кінцем end
}

function readLine(sep = "") { // функція для читання рядка із можливістю розділення його символом sep
    return sep != "" ? read(basicEnd).split(sep).filter(x => x != "") : read(basicEnd); // повернення прочитаного рядка із розідленням якщо є розділювач
}

function readAll() { // функця для читання усього потоку
    return read(""); //  повернення та виклик звичайної функції read без кінця
}

function prompt(msg = "") { // функція для читання тексту
    write(msg); // вивід повідомлення
    return readLine(); // читання рядка
}