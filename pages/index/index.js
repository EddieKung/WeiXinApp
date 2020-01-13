import { request } from "../../request/index"
Page({
	data: {
		swiperList: [],
		catesList: [],
		floorList: []
	},
	onLoad: function () {
		this.getSwiperList();
		this.getCatesList();
		this.getFloorList();
	},
	//获取轮播图数据
	getSwiperList() {
		request({
			url: '/home/swiperdata'
		}).then(res => {
			this.setData({
				swiperList: res
			})
		})
	},
	//获取分类数据
	getCatesList() {
		request({
			url: '/home/catitems'
		}).then(res => {
			this.setData({
				catesList: res
			})
		})
	},
	//获取楼层推广数据
	getFloorList() {
		request({
			url: '/home/floordata'
		}).then(res => {
			this.setData({
				floorList: res
			})
		})
	}
})
