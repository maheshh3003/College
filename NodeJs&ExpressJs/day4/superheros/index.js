const http = require('http')
const fs = require('fs')
const url = require('url')
const {v4:uuidv4} = require('uuid')

// initial load of data
const filePath = "./superheroes.json"
const superheroes = JSON.parse(fs.readFileSync(filePath,{encoding:"utf8"}))
// console.log(superheroes)

const server = http.createServer((req,res)=>{

    // parsing the url with query printing
    const parsedURL = url.parse(req.url,true)

    res.setHeader("Access-Control-Allow-Origin","*")

    // get api endpoint to ger all superheroes
    if(parsedURL.pathname==='/superheroes' && req.method==='GET')
    {
        if(parsedURL.query.id!==undefined){
            const id = parsedURL.query.id;
            const superhero = superheroes.find((superhero)=>{ 
                return superhero.id === id
            })
        }
        else{
        res.end(JSON.stringify(superheroes))
        }
    }
    else if(parsedURL.pathname==='/superheroes' && req.method==='POST')
    {
        let body = ''
        req.on("data",(chunk)=>{
            // console.log(chunk)
            body+=chunk
        })
        req.on("end",()=>{
            // console.log(body)
            let superhero = JSON.parse(body)
            superhero.id = uuidv4()
            superheroes.push(superhero)
            fs.writeFile(filePath,JSON.stringify(superheroes),{encoding:"utf8"},(err)=>{
                if(!err){
                    res.end("Superhero created successfully")
                }
            })
        })
    }
    else if(parsedURL.pathname==='/superheroes' && req.method==='DELETE'){
        if(parsedURL.query.id!==undefined)
            {
                const id = parsedURL.query.id;
                const index = superheroes.findIndex((superhero)=>{
                    return superhero.id === id
                })
                superheroes.splice(index,1)
                fs.writeFile(filePath,JSON.stringify(superheroes),(err)=>{
                res.end("Superhero Deleted")
            })
        }
        else{
            res.end("Please provide id")
        }
    }
    else
    {
        res.end('Not Found')
    }
})
server.listen(8000,()=>{
    console.log('Server is running   on port 8000');
})