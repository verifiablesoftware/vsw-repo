import { Router } from 'express'
import PG from 'pg';
const Pool = PG.Pool;

const DEFAULT_INTERNAL_HOST = `${process.env.DOCKERHOST}` || hostname.docker.internal;

const pool = new Pool({
    user: 'postgres',
    host: DEFAULT_INTERNAL_HOST,
    database: 'wallet',
    password: 'postgres',
    port: 5432,
  });
/*
const getWallets = async (request, response) => {
    pool.query('SELECT wallet_id, value FROM public.metadata', (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).json(results.rows)
    })
}
*/
let dpRoutes = Router()
    .get("/wallets", async (request, response) => {
        console.log("db wallets")
        pool.query('SELECT wallet_id, value FROM public.metadata', (error, results) => {
          if (error) {
            throw error
          }
          response.status(200).json(results.rows)
        })
    });

export default dpRoutes  ;

