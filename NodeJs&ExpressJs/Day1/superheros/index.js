let arr = [23, 45, 67, 54, 78, 90, 12]
chalk = require("chalk")

arr.forEach((num)=>{
    if(num%2===0){
        // console.log(`Number ${num} is even`)
        // console.log(new Date().toISOString(), `Number ${num} is even`)
        console.log(chalk.green(new Date().toISOString()), `Number ${num} is even`)


    }
})