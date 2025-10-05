import { config } from '../config/env';
import { Pool } from 'pg'; 

const getPool = ()=>{
    try {
        return new Pool({
        connectionString : config.dburl,
        ssl : {
            rejectUnauthorized : false
        }
    })
    } catch (error) {
        console.log(error)
    }
}
const pool:any =  getPool();
export default pool;