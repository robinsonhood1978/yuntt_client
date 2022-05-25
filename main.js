/**
 * @link https://www.shopwind.net/
 * @copyright Copyright (c) 2018 ShopWind Inc. All Rights Reserved.
 *
 * This is not free software. Do not use it for commercial purposes. 
 * If you need commercial operation, please contact us to purchase a license.
 * @license https://www.shopwind.net/license/
 * ==========================================================================
 * 
 * @Id main.js 2019.10.2 $
 * @author winder
 */

import Vue from 'vue'
import App from './App'
import currency from 'common/currency.js'
import {translator, url} from 'common/translator.js'

Vue.filter('currency', currency)
Vue.filter('translator', translator)
Vue.filter('url', url)
Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
	...App
})
app.$mount()
