// required koa middleware and node packages
const Koa = require('koa')
const Router = require('koa-router')
const koaBody = require('koa-body')
const json = require('koa-json')
const cors = require('koa-cors')
const fs = require('fs')
const sb = require('@supabase/supabase-js')

const app = new Koa()
const router = new Router()

// Set up koa middleware for JSON
app.use(koaBody({urlencoded: true}))
app.use(json())
app.use(cors({
    origin: true,
    methods: 'GET,HEAD,PUT,POST,DELETE,PATCH,OPTIONS'
}))

const todos = `${__dirname}/todos/todos.json`

try {
    if(!Array.isArray(JSON.parse(fs.readFileSync(todos)))) {
        fs.writeFileSync(todos, '[]')
    }
} catch {
    fs.writeFileSync(todos, '[]')
}

router.get('/todos', (ctx) => {
    ctx.body = JSON.parse(fs.readFileSync(todos))
})

router.post('/todos', (ctx) => {
    const buffer = JSON.parse(fs.readFileSync(todos))
    const exists = buffer.findIndex(todo => todo.id === ctx.request.body.id)
    if (exists === -1) {
        const data = [
            ...buffer,
            ctx.request.body
        ]

        fs.writeFileSync(todos, JSON.stringify(data))
        ctx.body = data
    } else {
        ctx.body = `Error: object with id: {${ctx.request.body.id}} already exists!`
    }


})

router.get('/todos/:id', (ctx) => {
    const buffer = JSON.parse(fs.readFileSync(todos))
    const data = buffer.filter(todo => todo.id === ctx.request.params.id)

    ctx.body = data
})

router.patch('/todos/:id', (ctx) => {
    const buffer = JSON.parse(fs.readFileSync(todos))
    const index = buffer.findIndex(todo => todo.id === ctx.request.params.id)

    for(const key in ctx.request.body) {
        buffer[index][key] = ctx.request.body[key]
    }

    fs.writeFileSync(todos, JSON.stringify(buffer))
    ctx.body = buffer
})

router.delete('/todos/:id', (ctx) => {
    const buffer = JSON.parse(fs.readFileSync(todos))
    const data = buffer.filter(todo => todo.id !== ctx.request.params.id)

    fs.writeFileSync(todos, JSON.stringify(data))
    ctx.body = data
})

app.use(router.routes()).use(router.allowedMethods())

app.listen(8888)