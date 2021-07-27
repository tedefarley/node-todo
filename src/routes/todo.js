const Koa = require('koa')
const Router = require('@koa/router')
const koaBody = require('koa-body')
const cors = require('@koa/cors')
const {supabase} = require('../services/supabase')

const app = new Koa()
const router = new Router()

app.use(koaBody({'urlencoded': true}))
app.use(cors({
    allowMethods: ['HEAD', 'GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS']
}))

router
    .get('/', async (ctx) => {
        const {data, error} = await supabase
            .from('todos')
            .select('*')
        if(error) throw error
        else ctx.body = data
    })

    .post('/', async (ctx) => {
        const {data, error} = await supabase
            .from('todos')
            .upsert({ 
                id: ctx.request.body.id,
                text: ctx.request.body.text,
                isCompleted: ctx.request.body.isCompleted
            })
        if(error) throw error
        else ctx.body = data
    })

    .get('/:id', async (ctx) => {
        const {data, error} = await supabase
            .from('todos')
            .select('*')
            .eq('id', ctx.request.params.id)
            .order('id', { ascending: true })
        if(error) throw error
        else ctx.body = data

    })

    .patch('/:id', async (ctx) => {
        const {data, error} = await supabase
            .from('todos')
            .upsert({
                id: ctx.request.body.id,
                text: ctx.request.body.text,
                isCompleted: ctx.request.body.isCompleted
            })
            .eq('id', ctx.request.body.id)
        if(error) throw error
        else ctx.body = data
    })

    .delete('/:id', async (ctx) => {
        const {data, error} = await supabase
            .from('todos')
            .delete()
            .eq('id', ctx.request.params.id)
        if(error) throw error
        else ctx.body = data
    })

module.exports = router