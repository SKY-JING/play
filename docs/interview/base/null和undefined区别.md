<div class="my_title" style="text-align: center; font-weight: 700; font-size: 2em;">null和undefined区别</div>

<table>
  <tr>
    <th></th>
    <th>null</th>
    <th>undefined</th>
  </tr>
  <tr>
    <td>相同点</td>
    <td colspan="2">
      1. 均表示无<br>
      2. 隐式转换均为false：null == undefined
    </td>
  </tr>
  <tr>
    <td>不同点</td>
    <td colspan="2">
      1. 定义不一样<br>
      undefined表示变量声明但未初始化时的值。<br>
      null表示准备用来保存对象，还没有真正保存对象的值。<br><br>
      2. 类型不一样<br>
      typeof null // object<br>
      typeof undefined // undefined<br>
      null === undefined // false<br><br>
      3. 转化为值不一样<br>
      Number(undefined) // NAN<br>
      Number(null) // 0<br>
      String(undefined) // undefined<br>
      String(null) // null<br>
    </td>
  </tr>
</table>

> undefined出现原因：<br>
  首先，null像在Java里一样，被当成一个对象。但是，JavaScript的数据类型分成原始类型（primitive）和合成类型（complex）两大类，Brendan Eich觉得表示"无"的值最好不是对象。<br>
  其次，JavaScript的最初版本没有包括错误处理机制，发生数据类型不匹配时，往往是自动转换类型或者默默地失败。Brendan Eich觉得，如果null自动转为0，很不容易发现错误。<br>
  因此，Brendan Eich又设计了一个undefined