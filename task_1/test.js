const encoded = [{
   id: 124,
   mediaId: "676",
   serviceTypeId: "124",
   formatTypeId: "0",
}];
const translations = {
   0: "",
   124: "Размещение",
   676: "Диджитал",
};
console.log('areaId' in encoded);
console.log(111 in translations);

function decoding(arr, trans) {
   return arr.map((obj) => {
      for (const key in obj) {
         if (key === 'id') continue;
         if (obj[key] in trans) {
            obj[key] = trans[obj[key]]
         }
      }
      return obj
   })
}

console.log(decoding(encoded, translations));


// for (const key in encoded) {
//    if (encoded[key] in translations) {
//       encoded[key] = translations[encoded[key]]
//    }
// }
// console.log(encoded);