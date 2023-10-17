/* eslint-disable jest/valid-expect */
/* eslint-disable jest/prefer-expect-assertions */
/* eslint-disable no-unused-expressions */
/* eslint-disable jest/no-test-callback */
/* eslint-disable func-names */
/* eslint-disable prefer-arrow-callback */
import chai, { expect } from 'chai';
import sinon from 'sinon';
import { describe, it } from 'mocha';
import chaiHttp from 'chai-http';
import request from 'request';
import app from '../../server';
import AppController from '../../controllers/AppController';
import redisClient from '../../utils/redis';
import dbClient from '../../utils/db';

chai.use(chaiHttp);

describe('appController', function () {
  describe('getStatus', function () {
    it('should return status with Redis and DB alive', function (done) {

      const redisStub = sinon.stub(redisClient, 'isAlive').returns(true);
      const dbStub = sinon.stub(dbClient, 'isAlive').returns(true);

      chai
        .request(app)
        .get('/status')
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.redis).to.equal(true);
          expect(res.body.db).to.equal(true);

          // Restore the original
          redisStub.restore();
          dbStub.restore();

          done();
        });
    });
  });

  describe('getStats', function () {
    it('should return user and file statistics', async function () {
      const usersStub = sinon.stub(dbClient, 'nbUsers').resolves(10);
      const filesStub = sinon.stub(dbClient, 'nbFiles').resolves(20);

      const res = await chai.request(app).get('/stats');

      expect(res).to.have.status(200);
      expect(res.body.users).to.equal(10);
      expect(res.body.files).to.equal(20);

      // Restore the original methods
      usersStub.restore();
      filesStub.restore();
    });

    it('should handle errors and return 500 status', async function () {

      sinon.stub(dbClient, 'nbUsers').rejects(new Error('Database error'));

      const res = await chai.request(app).get('/stats');

      expect(res).to.have.status(500);
      expect(res.body.error).to.equal('Database error');

      // Restore the original method
      dbClient.nbUsers.restore();
    });
  });
});
