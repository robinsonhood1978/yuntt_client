/**
 * @link https://www.shopwind.net/
 * @copyright Copyright (c) 2018 ShopWind Inc. All Rights Reserved.
 *
 * This is not free software. Do not use it for commercial purposes. 
 * If you need commercial operation, please contact us to purchase a license.
 * @license https://www.shopwind.net/license/
 * ==========================================================================
 * 
 * @Id util.js 2019.10.7 $
 * @author winder
 */

// https://github.com/vuejs/vuex/blob/dev/examples/shopping-cart/currency.js

const digitsRE = /(\d{3})(?=\d)/g
/**
 * [currency 金额格式化函数]
 * @param  {[type]} value    [传进来的值]
 * @param  {[type]} currency [货币符号]
 * @param  {[type]} decimals [小数位数]
 * @return {[type]}          [description]
 */
function currency (value, currency, decimals) {
  value = value ? parseFloat(value) : 0
  if (!isFinite(value) || (!value && value !== 0)) return ''
  
  let default_currency = uni.getStorageSync('default_currency') || '￥'
  // console.log('default currency', default_currency)
  currency = currency != null ? currency : default_currency // 默认货币符号
  decimals = decimals != null ? decimals : 2
  var stringified = Math.abs(value).toFixed(decimals)
  var _int = decimals
    ? stringified.slice(0, -1 - decimals)
    : stringified
  var i = _int.length % 3
  var head = i > 0
    ? (_int.slice(0, i) + (_int.length > 3 ? ',' : ''))
    : ''
  var _float = decimals
    ? stringified.slice(-1 - decimals)
    : ''
  var sign = value < 0 ? '-' : ''
  return sign + currency + head +
    _int.slice(i).replace(digitsRE, '$1,') +
    _float
}
export default currency