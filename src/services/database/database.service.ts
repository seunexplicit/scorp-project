import { Injectable, OnModuleInit } from '@nestjs/common';
import {  Connection, createConnection  } from 'mysql2';
import mysql_import from 'mysql-import'
import path from 'path';

@Injectable()
export class DatabaseService implements OnModuleInit {
    connection:Connection

    constructor(
    ){
       
    }

    onModuleInit() {
        this.initDB()
    }

    async execute(query_string:string, values?:any){
        try{
            const [result, fields] = await this.connection.promise().query(query_string, values)
            return result;
        }
        catch(err){
            throw err
        }
    }

    async initDB(){
        const dumpurl = path.resolve(__dirname, '../../../dump.sql');
        const importer = new mysql_import(this.connectionObject());
        await importer.import(dumpurl);
        this.connection = createConnection(this.connectionObject())
    }

    connectionObject(){
        return {
            host:'',
            user:'',
            databse:'',
        }
    }

    
}
