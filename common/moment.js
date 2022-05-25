/**
 * @link https://www.shopwind.net/
 * @copyright Copyright (c) 2018 ShopWind Inc. All Rights Reserved.
 *
 * This is not free software. Do not use it for commercial purposes. 
 * If you need commercial operation, please contact us to purchase a license.
 * @license https://www.shopwind.net/license/
 * ==========================================================================
 * 
 * @Id moment.js 2019.10.9 $
 * @author winder
 */

// 引入 moment 时间插件(也可以npm方式，但是考虑npm包太大，故直接引入)
import moment from "./moment/moment.js";
//获取今日/昨日/本周/上周/本月/上月 时间
export default {
	getMoment() {
		return moment()
	},
	// 获取今日的开始结束时间
	getToday() {
		let obj = {
			starttime: '',
			endtime: ''
		}
		obj.starttime = moment(moment().startOf("day").valueOf()).format("YYYY-MM-DD HH:mm:ss");
		obj.endtime = moment(moment().valueOf()).format("YYYY-MM-DD HH:mm:ss");
		return obj
	},
	// 获取昨日的开始结束时间
	getYesterday() {
		let obj = {
			starttime: '',
			endtime: ''
		}
		obj.starttime = moment(moment().add(-1, 'days').startOf("day").valueOf()).format("YYYY-MM-DD HH:mm:ss");
		obj.endtime = moment(moment().add(-1, 'days').endOf('day').valueOf()).format('YYYY-MM-DD HH:mm:ss');
		return obj
	},
	// 获取当前周的开始结束时间
	getCurrWeekDays() {
		let obj = {
			starttime: '',
			endtime: ''
		}
		obj.starttime = moment(moment().week(moment().week()).startOf('week').add(1, 'days').valueOf()).format(
			'YYYY-MM-DD HH:mm:ss')
		obj.endtime = moment(moment().week(moment().week()).endOf('week').add(1, 'days').valueOf()).format(
			'YYYY-MM-DD HH:mm:ss');
		return obj
	},
	// 获取上一周的开始结束时间
	getLastWeekDays() {
		let obj = {
			starttime: '',
			endtime: ''
		}
		obj.starttime = moment(moment().week(moment().week() - 1).startOf('week').add(1, 'days').valueOf()).format(
			'YYYY-MM-DD HH:mm:ss')
		obj.endtime = moment(moment().week(moment().week() - 1).endOf('week').add(1, 'days').valueOf()).format(
			'YYYY-MM-DD HH:mm:ss');
		return obj
	},
	// 获取当前月的开始结束时间
	getCurrMonthDays() {
		let obj = {
			starttime: '',
			endtime: ''
		}
		obj.starttime = moment(moment().month(moment().month()).startOf('month').valueOf()).format(
			'YYYY-MM-DD HH:mm:ss');
		obj.endtime = moment(moment().month(moment().month()).endOf('month').valueOf()).format('YYYY-MM-DD HH:mm:ss');
		return obj
	},
	// 获取上一个月的开始结束时间
	getLastMonthDays() {
		let obj = {
			starttime: '',
			endtime: ''
		}
		obj.starttime = moment(moment().month(moment().month() - 1).startOf('month').valueOf()).format(
			'YYYY-MM-DD HH:mm:ss');
		obj.endtime = moment(moment().month(moment().month() - 1).endOf('month').valueOf()).format(
			'YYYY-MM-DD HH:mm:ss');
		return obj
	}
}
