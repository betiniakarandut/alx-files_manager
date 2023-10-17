/* eslint-disable jest/valid-expect */
/* eslint-disable jest/prefer-expect-assertions */
/* eslint-disable no-unused-expressions */
/* eslint-disable jest/no-test-callback */
/* eslint-disable func-names */
/* eslint-disable prefer-arrow-callback */
import { expect } from 'chai';
import sinon from 'sinon';
import { describe, it, before, after } from 'mocha';
import redisClient from '../../utils/redis';

describe('redisClient', function () {
  before(function (done) {
    if (redisClient.client.connected) {
      done();
    } else {
      redisClient.client.on('connect', () => {
        done();
      });
    }
  });

  it('should connect to Redis', function () {
    expect(redisClient.isAlive()).to.equal(true);
  });

  it('should set and get a value from Redis', async function () {
    const key = 'testKey';
    const value = 'testValue';

    await redisClient.set(key, value, 3600);

    const result = await redisClient.get(key);
    expect(result).to.equal(value);
  });

  it('should delete a value from Redis', async function () {
    const key = 'testKey';

    // Delete the key and check if it's deleted
    await redisClient.del(key);
    const result = await redisClient.get(key);
    expect(result).to.be.null;
  });
  after(function (done) {
    redisClient.client.quit(() => {
      done();
    });
  });
});
