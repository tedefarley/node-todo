// required koa middleware and node packages
const Koa = require('koa')
const Router = require('koa-router')
const Logger = require('koa-logger')
const koaBody = require('koa-body')
const json = require('koa-json')
const cors = require('koa-cors')
const fs = require('fs')
const {pool, Pool} = require('pg')

const app = new Koa()
const router = new Router()

// Set up koa middleware for JSON
app.use(koaBody({urlencoded: true}))
app.use(json())
app.use(cors({
    origin: true,
    methods: 'GET,HEAD,PUT,POST,DELETE,PATCH,OPTIONS'
}))

app.pool =  new Pool({
    user: 'user',
    host: 'localhost',
    database: 'todos',
    password: 'root',
    port: 5432
})

router.get('/todos', (ctx) => {
    ctx.app.pool.query('SELECT * FROM todos;', (err, res) => {
        if (err) console.log(err)
        else {
            console.log(res.rows)
            ctx.response.body = res.rows
        }
    })
})

router.post('/todos', (ctx) => {
    const text = 'INSERT INTO todos(id, text, isCompleted) VALUES ($1, $2, $3) RETURNING *;'
    const values = [
        ctx.request.body.id,
        ctx.request.body.text,
        ctx.request.body.isCompleted
    ]
    ctx.app.pool.query(text, values, (err, res) => {
        if (err) console.log(err)
        else {
            const index = res.rows.findIndex(todo => todo.id === values[0])
            console.log(res.rows[index])
        }
    })
})

router.get('/todos/:id', (ctx) => {
    const text = 'SELECT * FROM todos WHERE id = $1;'
    const values = [ctx.request.params.id]

    ctx.app.pool.query(text, values, (err, res) => {
        if (err) console.log('Error!', err)
        else console.log(res.rows)
    })
})

router.patch('/todos/:id', (ctx) => {
    const text = 'UPDATE todos SET text = $2, isCompleted = $3 WHERE id = $1;'
    const values = [
        ctx.request.params.id,
        ctx.request.body.text,
        ctx.request.body.isCompleted
    ]

    ctx.app.pool.query(text, values, (err) => {
        if (err) console.log(err)
    })
})

router.delete('/todos/:id', (ctx) => {
    const text = 'DELETE FROM todos WHERE id = $1 RETURNING *;'
    const values = [ctx.request.params.id]

    ctx.app.pool.query(text, values, (err, res) => {
        if (err) console.log(err)
        else console.log(res.rows)
    })
})

app.use(Logger())

app.use(router.routes()).use(router.allowedMethods())

app.listen(8888)