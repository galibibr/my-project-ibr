import { encoded, translations } from "./data.js";

// Функцию для расшифровки полей
const decoding = (encoded, translations) => {
   // Проходим по всем элементам (объектам) шифрованного массива
   return encoded.map((obj) => {
      // Внутренний цикл: проходим по всем ключам объекта
      for (const key in obj) {
         // Исключаем некоторые поля и оставим в изначальном виде
         if (
            key === "groupId" ||
            key === "service" ||
            key === "formatSize" ||
            key === "ca"
         ) {
            continue;
         }
         /* Если находим ключ обходяемого объекта из объекта для 
         перевода, то меняем значение обходяемого объекта на значение
         найденного из объекта для перевода */
         else if (obj[key] in translations) {
            obj[key] = translations[obj[key]];
         }
      }
      /* После того как расшифровали все нужные значения пройденного 
      объекта, возвращаем расшифрованный обеъкт в массив */
      return obj;
   });
};
// Присваеваем расшифрованный массив к новой перемнной decoded
const decoded = decoding(encoded, translations);

console.log("Let's rock");
console.log(encoded, translations);

console.log(decoded);
