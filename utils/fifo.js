class FIFOBuffer {
  constructor(maxSize) {
    this.buffer = [];
    this.maxSize = maxSize;
  }

  // 添加数据到缓冲区
  append(data) {
    if (this.buffer.length >= this.maxSize) {
      // 缓冲区已满，移除最旧的数据
      this.buffer.shift();
    }
    this.buffer.push(data);
  }

  // 获取缓冲区的所有数据
  getData() {
    return this.buffer.slice(); // 返回数据的副本
  }

  // 获取缓冲区的大小
  size() {
    return this.buffer.length;
  }

  // 检查缓冲区是否已满
  isFull() {
    return this.buffer.length === this.maxSize;
  }

   // 清空缓冲区
   clear() {
    this.buffer.length = 0; // 将数组长度设置为0，清空数组
    this.buffer = []; // 重新初始化数组
  }
}

module.exports = FIFOBuffer;