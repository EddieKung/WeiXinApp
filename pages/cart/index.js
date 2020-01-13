import { getSetting, chooseAddress, openSetting, showModal, showToast } from "../../utils/asyncWx.js"
import regeneratorRuntime from '../../lib/runtime';

Page({
  data: {
    address: {},
    cart: [],
    allChecked: false,
    totalPrice: 0,
    totalNum: 0
  },
  onShow() {
    //  获取缓存中的收货地址信息
    const address = wx.getStorageSync("address");
    // 获取缓存的购物车数据 
    const cart = wx.getStorageSync("cart") || []
    this.setData({ address })
    this.setCart(cart)
  },
  /*
  获取用户收获地址
  绑定点击事件
  调用小程序内置api 获取用户收货地址  wx.chooseAddress
  获取用户对小程序所授予 的获取地址权限状态 scope
  假设： 1、用户点击收货地址的提示框 确定 authSetting scope.address
        scope为true 直接调用收货地址
        2、用户从来没有调用获取收货地址的api
        scope为undefined 直接调用 获取收货地址
        3、用户点击获取收货地址的提示框 取消
        scope为false
        通过诱导用户打开 wx.openSetting授权页面 重新选择授权
        4、把获取到收货地址信息存储到本地存储
  */
  // 收货地址
  async handleChooseAddress() {
    try {
      //获取权限状态
      const res = await getSetting()
      const scopeAddress = res.authSetting["scope.address"]
      //判断权限状态
      if (scopeAddress === false) {
        await openSetting()
      }
      //调用收货地址api
      let address = await chooseAddress();
      address.all = address.provinceName + address.cityName + address.countyName + address.detailInfo;
      //数据存入缓存
      wx.setStorageSync("address", address);
    } catch (error) {
      console.log(error);
    }
  },
  //全选
  /**
   * 
   * 全选复选框绑定时按change
   * 获取data中的全选变量allcheaked
   * 直接取反allchecked
   * 遍历购物车数据 让里面的checked状态变为allchecked的值
   * 然后把购物车数据和allchecked重新设置回去data中 并且存在缓存中
   */
  changeAllChecked() {
    // 获取data数据
    let { cart, allChecked } = this.data
    allChecked = !allChecked
    cart.forEach(v => v.checked = allChecked)
    // 确认修改值
    this.setCart(cart)
  },
  // 商品单选
  changeCheck(e) {
    // 1 获取被修改的商品的id
    const goods_id = e.currentTarget.dataset.id;
    // 2 获取购物车数组 
    let { cart } = this.data;
    // 3 找到被修改的商品对象
    let index = cart.findIndex(v => v.goods_id === goods_id);
    // 4 选中状态取反
    cart[index].checked = !cart[index].checked;

    this.setCart(cart);
  },
  //商品选中 数量增减
  setCart(cart) {
    // 计算全选
    let allChecked = true
    // 总价格 总数量
    let totalPrice = 0
    let totalNum = 0
    cart.forEach(v => {
      if (v.checked) {
        totalPrice += v.num * v.goods_price
        totalNum += v.num
      } else {
        allChecked = false
      }
    })
    // 判断数组是否为空
    allChecked = cart.length != 0 ? allChecked : false;
    this.setData({
      cart,
      totalPrice, totalNum, allChecked
    });
    wx.setStorageSync("cart", cart)
  },
  /**
 * 商品数量的编辑
 * 加号减号同时绑定一个点击事件 区分关键 自定义属性
 * 传递被点击的商品id goods_id
 * 
 * 获取data中的购物车数组 来获取需要被修改的商品对象
 * 
 * 直接修改商品对象的属性 num
 * 
 * 把cart数组重新设置回去data和缓存中
 */
  // 商品数量的编辑功能
  async handleItemNumEdit(e) {
    const { opertion, id } = e.currentTarget.dataset
    let { cart } = this.data
    const index = cart.findIndex(v => v.goods_id === id)
    if (cart[index].num === 1 && opertion === -1) {
      const res = await showModal({ content: "是否确定删除？" })
      if (res.confirm) {
        cart.splice(index, 1)
        this.setCart(cart)
      }
    } else {
      cart[index].num += opertion
      this.setCart(cart)
    }
  },
  // 结算功能
  async handlePay() {
    const { address, totalNum } = this.data
    if (!address.userName) {
      await showToast({ title: "您还没有选择收货地址！" })
      return
    }
    if (totalNum === 0) {
      await showToast({ title: "您还没有选购商品！" })
      return
    }
    wx.navigateTo({
      url: '/pages/pay/index',
    });
  }
})