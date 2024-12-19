const request = require('supertest');
const app = require('../index');
const pool = require('../src/config/db'); 

describe('User Routes', () => {
    let uid;
    let token; 

    afterAll(async () => {
        await deleteUser(uid);
    });

    it('should register user', async() => {
        const response = await request(app)
            .post('/api/user/register')
            .send({
                email: 'testuser@gmail.com',
                username: 'testuser',
                password: '2024',
                role_id: 1
            });
        expect(response.status).toBe(200);
        expect(response.body.user).toHaveProperty('user_id');
        uid = response.body.user.user_id; 
    });

    it('should login an existing user', async() => {
        const loginResponse = await request(app)
            .post('/api/user/login')
            .send({
                email: 'testuser@gmail.com',
                password: '2024'
            });
        expect(loginResponse.status).toBe(200);
        expect(loginResponse.body.token).toBeDefined();
        token = loginResponse.body.token; 
    });

    it('should logout the user', async() => {
        const logoutResponse = await request(app)
            .post('/api/user/logout')
            .set('Authorization', `Bearer ${token}`); 

        expect(logoutResponse.status).toBe(200);
        expect(logoutResponse.body.message).toBe("Logout successful");
    });

    it('should not return address without valid token', async() => {
        const profileResponse = await request(app)
            .get(`/api/user/${uid}/address`);

        expect(profileResponse.status).toBe(401);
        expect(profileResponse.body.message).toBe("Not logged in or unauthorized");
    });

});

async function deleteUser(id) {
    await pool.query("DELETE FROM users WHERE user_id = $1", [id]);
}
