const pathInfer = require('../index');
const expect = require('expect');

/**
 * ------------------------------------------------------------------------
 * 因不好模拟当前的git环境, 因此改为测试内部方法
 * ------------------------------------------------------------------------
 */
describe('isReady', () => {

	// 当前非git环境，因此返回false
	it('show be false', () => {
		expect(
			pathInfer.isReady()
		).toEqual(true);
	});

});

describe('_getPathByGitUrl', () => {

	it('getPathFrom valid url show equal to group/reposity', () => {

		expect(
			pathInfer._getPathByGitUrl('git@gitlab.alibaba-inc.com:group/reposity.git')
		).toEqual('group/reposity');

		expect(
			pathInfer._getPathByGitUrl('http://gitlab.alibaba-inc.com/group/reposity.git')
		).toEqual('group/reposity');

	});

});


describe('getVersionByBranch', () => {

	it('should equal version split form valid branch', () => {
		expect(
			pathInfer.getVersionByBranch('daily/1.3.0')
		).toEqual('1.3.0');
	});

	it('should equal default version(1.0.0) when input an invalid valid branch', () => {
		expect(
			pathInfer.getVersionByBranch('master')
		).toEqual('1.0.0');
	});

	it('should equal default version(2.0.0) when input an invalid valid branch', () => {

		pathInfer.setDefaultVersion('2.0.0');

		expect(
			pathInfer.getVersionByBranch('master')
		).toEqual('2.0.0');
	});

});

describe('event', () => {

	it('should catch an warning', (done) => {

		pathInfer.emitter.on('warning', (msg) => {
			expect(msg).toExist();
			done();
		});

		pathInfer.getVersionByBranch('unkownbranch');
	});

	it('should catch an error', (done) => {

		pathInfer.emitter.on('error', (msg) => {
			expect(msg).toEqual('当前仓库不合法');
			done();
		});

		pathInfer._getPathByGitUrl('http://www.alibaba-inc.com')

	});

});


