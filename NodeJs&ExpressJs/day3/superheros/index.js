const http = require('http')

const server = http.createServer((req,res)=>{
    console.log('Server is hit');
    res.end('Hello Client')
})
server.listen(8000,()=>{
    console.log('Server is running on port 8000');
})