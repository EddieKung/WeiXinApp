import regeneratorRuntime from '../../lib/runtime';
import { request } from "../../request/index"

Page({
  data: {
    goodsDetailData: [],
    isCollect: false
  },
  // 商品对象
  goodsInfo: {},

  onLoad: function (options) {
    const { goods_id } = options
    this.getGoodsDetailData(goods_id)
  },
  //获取商品详细数据
  async getGoodsDetailData(goods_id) {
    const res = await request({ url: "/goods/detail", data: { goods_id } })
    this.goodsInfo = res
    //  获取缓存中的商品收藏的数组f
    let collect = wx.getStorageSync("collect") || [];
    //  判断当前商品是否被收藏
    let isCollect = collect.some(v => v.goods_id === this.goodsInfo.goods_id);
    this.setData({
      goodsDetailData: {
        goods_name: res.goods_name,
        goods_price: res.goods_price,
        // iphone部分手机 不识别 webp图片格式 
        // 最好找到后台 让他进行修改 
        // 临时自己改 确保后台存在 1.webp => 1.jpg 
        goods_introduce: res.goods_introduce.replace(/\.webp/g, '.jpg'),
        pics: res.pics
      },
      isCollect
    })
  },
  //收藏商品
  changeCollect() {
    let isCollect = false;
    let collect = wx.getStorageSync("collect") || [];
    let index = collect.findIndex(v => v.goods_id === this.goodsInfo.goods_id)
    if (index !== -1) {
      collect.splice(index, 1);
      isCollect = false
      wx.showToast({
        title: '取消成功',
        icon: 'success',
        mask: true,
      });
    } else {
      collect.push(this.goodsInfo)
      isCollect = true
      wx.showToast({
        title: '收藏成功',
        icon: 'success',
        mask: true
      })
    }
    // 把数组存入到缓存中
    wx.setStorageSync("collect", collect);
    // 修改data中的属性  isCollect
    this.setData({
      isCollect
    })
  },
  handlePrevewImage(e) {
    //构造预览图片数组
    const urls = this.goodsInfo.pics.map(v => v.pics_mid)
    //
    const current = e.currentTarget.dataset.url;
    wx.previewImage({
      current,
      urls
    });
  },
  //加入购物车
  // 点击事件后，进入处理函数
  // 先获取本地存储的购物车信息
  // 判断购物车缓存数据是否有数据
  // 有数据的话，修改数据信息
  // 没有数据的话，新增数据
  handleCartAdd() {
    let cart = wx.getStorageSync("cart") || [];
    let index = cart.findIndex(v => v.goods_id === this.goodsInfo.goods_id)
    if (index === -1) {
      this.goodsInfo.num = 1
      this.goodsInfo.checked = true
      cart.push(this.goodsInfo)
    } else {
      cart[index].num++
    }
    // 将数据存储到本地存储
    wx.setStorageSync("cart", cart)
    wx.showToast({
      title: '加入成功',
      icon: 'success',
      mask: true,
    });
  }
})