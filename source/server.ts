/** source/server.ts */
import http from 'http';
import express, { Express } from 'express';
import morgan from 'morgan';
import pationRoutes from './routes/patientdata';
import medDataRoutes from './routes/MedData';
import personRoutes from './routes/personRoutes';
import {PatientData} from "./model/patientdata";
import {Sequelize} from 'sequelize';
import {MedData} from "./model/MedDataModel";
import {Person} from "./model/PersonModel";
import {Role} from "./model/RoleModel";


export const sequelize: Sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'db.sqlite',
    logging: false // can be set to true for debugging
});
const router: Express = express();

PatientData.initialize(sequelize);
MedData.initialize(sequelize);
Person.initialize(sequelize);
Role.initialize(sequelize);

/** Logging */
router.use(morgan('dev'));
/** Parse the request */
router.use(express.urlencoded({ extended: false }));
/** Takes care of JSON data */
router.use(express.json());

/** RULES OF OUR API */
router.use((req, res, next) => {
    // set the CORS policy
    res.header('Access-Control-Allow-Origin', '*');
    // set the CORS headers
    res.header('Access-Control-Allow-Headers', 'origin, X-Requested-With,Content-Type,Accept, Authorization');
    // set the CORS method headers
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'GET PATCH DELETE POST');
        return res.status(200).json({});
    }
    next();
});

/** Routes */
router.use('/', pationRoutes);
router.use('/', medDataRoutes)
router.use('/', personRoutes)

/** Error handling */
router.use((req, res, next) => {
    const error = new Error('not found');
    return res.status(404).json({
        message: error.message
    });
});

/** Server */
const httpServer = http.createServer(router);
const PORT: any = process.env.PORT ?? 6060;
httpServer.listen(PORT, () => console.log(`The server is running on port ${PORT}`));