import Taro from '@tarojs/taro';

export function showAlert(content: string): void {
  Taro.showModal({
    title: '提示',
    content,
    showCancel: false,
  });
}
