import regeneratorRuntime from '../../lib/runtime';
import { request } from "../../request/index"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodslist: [],
    totalPages: 1,
    tabs: [
      {
        id: 0,
        value: "综合",
        isActive: true
      },
      {
        id: 0,
        value: "销量",
        isActive: false
      },
      {
        id: 0,
        value: "价格",
        isActive: false
      }
    ]
  },
  QueryParams: {
    query: "",
    cid: "",
    pagenum: 1,
    pagesize: 10
  },
  onLoad: function (options) {
    console.log(options);
    this.QueryParams.cid = options.cid || "";
    this.QueryParams.query = options.query || "";
    this.getGoodsList()
  },
  //获取商品数据
  async getGoodsList() {
    const res = await request({ url: "/goods/search", data: this.QueryParams });
    //获取数据总条数
    const total = res.total
    //计算总页数
    this.data.totalPages = Math.ceil(total / this.QueryParams.pagesize)
    this.setData({
      goodslist: [...this.data.goodslist, ...res.goods]
    })
  },
  //tab切换
  handleTabsItemChange(e) {
    const { index } = e.detail
    let { tabs } = this.data
    tabs.forEach((v, i) => i === index ? v.isActive = true : v.isActive = false)
    this.setData({
      tabs
    })
  },
  // 往下滑动加载
  onReachBottom() {
    if (this.QueryParams.pagenum >= this.data.totalPages) {
      wx.showToast({
        title: '已经加载到底了',
      });
    } else {
      this.QueryParams.pagenum++;
      this.getGoodsList();
    }
  },
  // 下拉刷新事件 
  onPullDownRefresh() {
    // 1 重置数组
    this.setData({
      goodsList: []
    })
    // 2 重置页码
    this.QueryParams.pagenum = 1;
    // 3 发送请求
    this.getGoodsList();
  }
})