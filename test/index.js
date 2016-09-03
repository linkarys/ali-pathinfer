'use strict';

const expect = require('expect');
const sinon = require('sinon');
const requireNoCache = require('require-no-cache');

describe('_getPathByGitUrl', () => {

	let pathInfer = requireNoCache('../index');

	it('getPathFrom valid url show equal to group/reposity', () => {

		expect(
			pathInfer._getPathByGitUrl('git@gitlab.alibaba-inc.com:group/reposity.git')
		).toEqual('group/reposity');

		expect(
			pathInfer._getPathByGitUrl('http://gitlab.alibaba-inc.com/group/reposity.git')
		).toEqual('group/reposity');

	});

});

describe('getPath', () => {

	let pathInfer = requireNoCache('../index');

	before(() => {
		sinon.stub(pathInfer, '_getOriginUrl').returns('git@gitlab.alibaba-inc.com:group/reposity.git');
	});

	it('should equal group/reposity', () => {
		expect(
			pathInfer.getPath()
		).toEqual('group/reposity');
	});
});


describe('getVersionByBranch', () => {

	let pathInfer = requireNoCache('../index');

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

describe('getVersion', () => {

	let pathInfer = requireNoCache('../index');

	before(() => {
		sinon.stub(pathInfer, 'getCurrentBranch').returns('daily/5.0.0');
	});

	it('should equal 5.0.0', () => {
		expect(
			pathInfer.getVersion()
		).toEqual('5.0.0');
	});

});

describe('getFullPath', () => {

	let pathInfer;

	beforeEach(() => {
		pathInfer = requireNoCache('../index');
		sinon.stub(pathInfer, '_getOriginUrl').returns('git@gitlab.alibaba-inc.com:group/reposity.git');
		sinon.stub(pathInfer, 'getCurrentBranch').returns('daily/5.0.0');
	});

	it('should equal //g-assets.daily.taobao.net/group/reposity/5.0.0 when env is pre', () => {

		pathInfer.setEnv('pre');

		expect(
			pathInfer.getFullPath()
		).toEqual('//g-assets.daily.taobao.net/group/reposity/5.0.0');
	});

	it('should equal //g.alicdn.com/group/reposity/5.0.0 when env is prod', () => {

		pathInfer.setEnv('prod');

		expect(
			pathInfer.getFullPath()
		).toEqual('//g.alicdn.com/group/reposity/5.0.0');
	});

	it('should equal ./ when env is dev', () => {

		pathInfer.setEnv('dev');

		expect(
			pathInfer.getFullPath()
		).toEqual('./');
	});

	it('should equal //g-assets.daily.taobao.net/group/reposity/5.0.0 by default', () => {
		expect(
			pathInfer.getFullPath()
		).toEqual('//g-assets.daily.taobao.net/group/reposity/5.0.0');
	});


	it('should equal https://mytestdoamin/group/reposity/5.0.0 when set domain explictily', () => {

		pathInfer.setDomain('https://mytestdoamin');

		expect(
			pathInfer.getFullPath()
		).toEqual('https://mytestdoamin/group/reposity/5.0.0');
	});

});

describe('event', () => {

	let pathInfer = requireNoCache('../index');

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

		pathInfer._getPathByGitUrl('http://www.alibaba-inc.com');

	});

});


