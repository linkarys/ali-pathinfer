'use strict';

const childProcess = require('child_process');
const EventEmitter = require('events');
const execSync = childProcess.execSync;

const pathInfer = (() => {

	let domains = {
		dev: './',
		daily: '//g-assets.daily.taobao.net',
		pre: '//g-assets.daily.taobao.net',
		prod: '//g.alicdn.com',
	};

	let domain = domains.daily;
	let defaultVersion = '1.0.0';
	let emitter = new EventEmitter();

	let pathInfer = {};

	pathInfer.emitter = emitter;


	/**
	 * ------------------------------------------------------------------------
	 * 根据所给git url获取资源path
	 * 入参可能为:
	 *    git@gitlab.alibaba-inc.com:group/reposity.git
	 *    http://gitlab.alibaba-inc.com/group/reposity.git
	 * ------------------------------------------------------------------------
	 */
	pathInfer._getPathByGitUrl = originUrl => {

		let match = (/gitlab\.alibaba-inc\.com(?:\:|\/)([A-Za-z0-9\-\._ ~:\/?#\[\]@!$&'\(\)*\+,;=]+)\.git$/.exec(originUrl)) || [];

		if (!match.length || !match[1]) {
			emitter.emit('error', '当前仓库不合法');
		}

		return match[1] || '';

	};

	/**
	 * ------------------------------------------------------------------------
	 * 获取remote.origin.url
	 * ------------------------------------------------------------------------
	 */
	pathInfer._getOriginUrl = () => {

		try {
			let result = execSync('git config --get remote.origin.url').toString().trim();

			if (!result) throw new Error('NO_REMOTE_URL');

			return result;

		} catch(err) {

			if (err === 'NO_REMOTE_URL') emitter.emit('error', '请确保当前git设置了remote.origin.url');
			else emitter.emit('error', '当前目录非git仓库, 或尚未关联远程分支');

			return '';
		}
	};

	/**
	 * ------------------------------------------------------------------------
	 * 检查当前环境是否适用pathInfer
	 * ------------------------------------------------------------------------
	 */
	pathInfer.isReady = () => {
		try {
			let result = execSync('git config --get remote.origin.url').toString().trim();

			return !!result;

		} catch(err) {

			return false;
		}
	};

	/**
	 * ------------------------------------------------------------------------
	 * 获取资源路径
	 * ------------------------------------------------------------------------
	 */
	pathInfer.getPath = () => pathInfer._getPathByGitUrl(pathInfer._getOriginUrl());

	/**
	 * ------------------------------------------------------------------------
	 * 获取当前git分支
	 * ------------------------------------------------------------------------
	 */
	pathInfer.getCurrentBranch = () => {

		try {
			return (execSync('git branch').toString().split('\n').filter(item => /^\*/.test(item))[0] || '').replace(/^\*\s*/, '');

		} catch (err) {

			emitter.emit('error', '当前目录非git仓库');
			return '';
		}
	};


	/**
	 * ------------------------------------------------------------------------
	 * 根据输入分支获取当前版本号
	 * ------------------------------------------------------------------------
	 */
	pathInfer.getVersionByBranch = (branch) => {
		if (/daily\/[\d\.]+/.test(branch)) return branch.split('\/')[1];

		emitter.emit('warning', `分支不满足daily/x.y.z的命名规范, 将返回默认版本: ${defaultVersion}`);
		return defaultVersion;
	};

	/**
	 * ------------------------------------------------------------------------
	 * 根据当前分支获取版本号
	 * ------------------------------------------------------------------------
	 */
	pathInfer.getVersion = () => pathInfer.getVersionByBranch(pathInfer.getCurrentBranch());


	/**
	 * ------------------------------------------------------------------------
	 * 获取完整路径
	 * ------------------------------------------------------------------------
	 */
	pathInfer.getFullPath = () => {

		if (domain === './') return domain;

		return domain + '/' + pathInfer.getPath() + '/' + pathInfer.getVersion();
	};

	/**
	 * ------------------------------------------------------------------------
	 * 设置当前环境
	 * ------------------------------------------------------------------------
	 */
	pathInfer.setEnv = env => {
		if (env && domains[env]) domain = domains[env];
	};

	/**
	 * ------------------------------------------------------------------------
	 * 设置资源域名
	 * ------------------------------------------------------------------------
	 */
	pathInfer.setDomain = newDomain => {
		if (newDomain) domain = newDomain;
	};

	/**
	 * ------------------------------------------------------------------------
	 * 设置当当前分支无法正确解析出版本号时, 默认使用的版本号
	 * ------------------------------------------------------------------------
	 */
	pathInfer.setDefaultVersion = version => {
		defaultVersion = version;
	};

	return pathInfer;

})();

module.exports = pathInfer;

