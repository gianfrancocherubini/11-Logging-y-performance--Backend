import {fileURLToPath} from 'url';
import { dirname } from 'path';
import bcrypt from 'bcrypt'
import winston from 'winston';
import { mode } from './config/config.commander.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default __dirname;

export const creaHash=(password)=>bcrypt.hashSync(password, bcrypt.genSaltSync(10));
export const validaPassword=(usuario, password)=>bcrypt.compareSync(password, usuario.password);



const niveles = {
    fatal: 0,
    error: 1,
    warning: 2,
    info: 3,
    http: 4,
    debug: 5
  };
  
  const loggerDesarrollo = winston.createLogger({
    levels: niveles,
    format: winston.format.simple(),
    transports: [
      new winston.transports.Console({ level: 'debug' })
    ],
    
  });
  
  const loggerProduccion = winston.createLogger({
    levels: niveles,
    format: winston.format.combine(
        winston.format.timestamp(), 
        winston.format.simple()
      ),
    transports: [
      new winston.transports.Console({ level: 'info' }),
      new winston.transports.File({ filename: './src/logs/errorLogs.log', level: 'error' })
    ],
    
  });
  
  export const middLogg = (req, res, next) => {
    let logger;
    if (mode === 'prod') {
      logger = loggerProduccion;
    } else {
      logger = loggerDesarrollo;
    }
    req.logger = logger;
    next();
  };
