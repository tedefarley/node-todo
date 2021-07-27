const {createClient} = require('@supabase/supabase-js')
const dotenv = require('dotenv')

dotenv.config()

const supabaseURL = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_KEY

const supabase = createClient(supabaseURL, supabaseKey)

module.exports = supabase