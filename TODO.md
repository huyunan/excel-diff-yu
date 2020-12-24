# 将比较结果转成 html

参照 excel-diff-html
const diff = require('excel-diff-html');
diff('a.xlsx', 'b.xlsx', 'C:\\huyunan\\git\\excel-diff-yu\\a.html');
将 比较结果直观的显示出来，不必再自己打开文件去看了。
可以查看 excel 转成 html 的插件写一个更好的