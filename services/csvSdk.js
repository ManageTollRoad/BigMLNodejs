module.exports= setToCsv = (set)=>{
    const array = typeof set !== 'object' ? JSON.parse(set) : set;
     let str = "";

     return array.reduce((str, next) => {
         str += `${Object.values(next).map(value => `${value}`).join(",")}` + '\r\n';
         return str;
        }, str);
}