import { request } from "../../request/index"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    leftList: [],
    rightList: [],
    currentIndex: 0,
    CateListData: []
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取本地缓存数据
    const CateListData = wx.getStorageSync("CateListData")
    if (!CateListData) {
      this.getCateListData()
    } else {
      if (Date.now() - CateListData.time > 1000 * 10) {
        this.getCateListData()
      } else {
        this.CateListData = CateListData.data
        let leftList = this.CateListData.map(val => val.cat_name)
        let rightList = this.CateListData[0].children;
        this.setData({
          leftList,
          rightList
        })
      }
    }
  },
  //获取购物分类数据
  getCateListData() {
    request({
      url: '/categories'
    }).then(res => {
      this.CateListData = res
      wx.setStorageSync("CateListData", { time: Date.now(), data: this.CateListData });
      let leftList = this.CateListData.map(val => val.cat_name)
      let rightList = this.CateListData[0].children;
      console.log(rightList);
      this.setData({
        leftList,
        rightList
      })
    })
  },
  //点击切换菜单事件
  changeTab(e) {
    const { index } = e.currentTarget.dataset;
    let rightList = this.CateListData[index].children;
    this.setData({
      currentIndex: index,
      rightList,
      // 重新设置 右侧内容的scroll-view标签的距离顶部的距离
      scrollTop: 0
    })
  }
})