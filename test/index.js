const pathInfer = require('../index');
const expect = require('expect');

/**
 * ------------------------------------------------------------------------
 * 常规测试, 因不好模拟当前的git环境, 因此改为测试内部方法
 * ------------------------------------------------------------------------
 */

describe('isReady', () => {

	// 当前非git环境，因此返回false
	it('show be false', () => {
		expect(
			pathInfer.isReady()
		).toEqual(false);
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

	it('getPathFrom invalid url show equal to undefined', () => {

		expect(
			pathInfer._getPathByGitUrl('http://www.alibaba-inc.com')
		).toEqual(undefined);

		expect(
			pathInfer._getPathByGitUrl('https://github.com/gaearon/flux-react-router-example.git')
		).toEqual(undefined);

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
			expect(msg).toEqual('当前目录非git仓库, 或尚未关联远程分支');
			done();
		});

		pathInfer._getOriginUrl();

	});

});

/**
 * ------------------------------------------------------------------------
 * 非主流测试, 需要满足当前为git环境
 * ------------------------------------------------------------------------
 */
if (pathInfer.isReady()) {
	console.log(pathInfer.getPath());
	console.log(pathInfer.getCurrentBranch());
	console.log(pathInfer.getVersion());
	console.log(pathInfer.getFullPath());

	pathInfer.setEnv('prod');
	console.log(pathInfer.getFullPath());

	pathInfer.setDomain('http://www.alibaba-inc.com');
	console.log(pathInfer.getFullPath());
}

