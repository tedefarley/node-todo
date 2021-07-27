const Koa = require('koa')
const Router = require('@koa/router')
const logger = require('koa-logger')
const koaBody = require('koa-body')
const json = require('koa-json')
const cors = require('@koa/cors')
const https = require('https')
const dotenv = require('dotenv')
const sb = require('@supabase/supabase-js')

const app = new Koa()
const router = new Router()

dotenv.config()

const supabase = sb.createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY
)

// Set up koa middleware for JSON
app.use(logger())
app.use(koaBody({urlencoded: true}))
app.use(json())
app.use(cors({
    allowMethods: ['HEAD', 'GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS']
}))


router.get('/todos', async (ctx) => {
    const {data, error} = await supabase
        .from('todos')
        .select('*')
        .order('id', { ascending: true })
    if(error) throw error
    else ctx.body = data
})

router.post('/todos', async (ctx) => {
    const {data, error} = await supabase
        .from('todos')
        .insert(ctx.request.body)
    if(error) throw error
    else ctx.body = data
})

router.get('/todos/:id', async (ctx) => {
    const {data, error} = await supabase
        .from('todos')
        .select('*')
        .eq('id', ctx.request.params.id)
    if(error) throw error
    else ctx.body = data

})

router.patch('/todos/:id', async (ctx) => {
    const {data, error} = await supabase
        .from('todos')
        .upsert(ctx.request.body)
        .eq('id', ctx.request.params.id)
    if(error) throw error
    else ctx.body = data
})

router.delete('/todos/:id', async (ctx) => {
    const {data, error} = await supabase
        .from('todos')
        .delete()
        .eq('id', ctx.request.params.id)
    if(error) throw error
    else ctx.body = data
})

app.use(router.routes())

// const todo = require('./src/routes/todo')

// router.use('/todos', todo.routes())
// app.use(todo.routes())

app.listen(8888)