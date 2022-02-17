const Pool = require('pg').Pool

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'test',
  password: 'root',
  port: 5432,
})

class Model {
  constructor(table) {
    this.pool = pool;
    this.table = table;
    this.pool.on('error', (err, client) => `Error, ${err}, on idle client${client}`);
  }

  async select(columns, clause) {
    let query = `SELECT ${columns} FROM ${this.table}`;
    if (clause) query += clause;
    return this.pool.query(query);
  }
  async userNameCheck (username){
		return await this.pool.query(`SELECT count(username) as count FROM users WHERE LOWER(username) = $1`, `${username}`);
  }
  async registerUser(params){		
		try {
			const userexist = await this.pool.query(`SELECT "id","username" FROM "users" WHERE LOWER("username") = $1`, [params.username]);						
			if(userexist.rowCount)return 'User exists';			
			const result = await this.pool.query(`INSERT INTO "users" ("username","password","online") VALUES ($1,$2,$3)`, [params['username'],params['password'],'Y']);
			console.log(result);
			return result;
		} catch (error) {
			console.error(error);
			return null;
		}
	}
  async loginUser(params){
		try {
			return await this.pool.query(`SELECT id,username FROM users WHERE LOWER(username) = $1 AND password = $2`, [params.username,params.password]);
		} catch (error) {
			return null;
		}
	}

  async userSessionCheck(userId){
		try {
			const result = await this.pool.query(`SELECT online,username FROM users WHERE id = $1 AND online = $2`, [userId,'Y']);
			if(result !== null){
				return result[0]['username'];
			}else{
				return null;
			}
		} catch (error) {
			return null;
		}
	}


  async addSocketId(userId, userSocketId){
		try {      
      return await this.pool.query(`UPDATE "users" SET "socketid" = $1, "online" = $2 WHERE "id" = $3`, [userSocketId,'Y',userId]);
		} catch (error) {
			console.log(error);
			return null;
		}
	}
  async isUserLoggedOut(userSocketId){
		try {
			return await this.pool.query(`SELECT online FROM users WHERE socketid = $1`, [userSocketId]);
		} catch (error) {
			return null;
		}
	}

  async logoutUser(userSocketId){
		return await this.pool.query(`UPDATE users SET socketid = $1, online= $2 WHERE socketid = $3`, ['','N',userSocketId]);
	}



	getChatList(userId, userSocketId){
		try {
			return Promise.all([
				this.pool.query(`SELECT id,username,online,socketid FROM users WHERE id = $1`, [userId]),
				this.pool.query(`SELECT id,username,online,socketid FROM users WHERE online = $1 and socketid != $2`, ['Y',userSocketId])
			]).then( (response) => {
				return {
					userinfo : response[0].length > 0 ? response[0][0] : response[0],
					chatlist : response[1]
				};
			}).catch( (error) => {
				console.warn(error);
				return (null);
			});
		} catch (error) {
			console.warn(error);
			return null;
		}
	}



	a
	async insertMessages(params){
		try {
			return await this.db.query(
				"INSERT INTO message (`from_user_id`,`to_user_id`,`message`) values ($1,$2,$3)",
				[params.fromUserId, params.toUserId, params.message]
			);
		} catch (error) {
			console.warn(error);
			return null;
		}		
	}

	async getMessages(userId, toUserId){
		try {
			return await this.pool.query(
				`SELECT id,from_user_id as fromUserId,to_user_id as toUserId,message FROM message WHERE 
					(from_user_id = $1 AND to_user_id = $2 )
					OR
					(from_user_id = $1 AND to_user_id = $2 )	ORDER BY id ASC				
				`,
				[userId, toUserId, toUserId, userId]
			);
		} catch (error) {
			console.warn(error);
			return null;
		}
	}
}

module.exports = new Model();
