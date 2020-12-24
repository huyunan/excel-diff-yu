# excel-diff-yu

excel-diff-yu

## Install

```
npm istall excel-diff-yu
```

## Usage

```javascript
const { ExcelDiffYu } = require("excel-diff-yu");

ExcelDiffYu({ pathA: "test_a.xlsx", pathB: "test_b.xlsx" });
```

## options
key|type|default|summary
---|---|---|---
**pathA**|`string`|`null`|A excel path.
**pathB**|`string`|`null`|B excel path.
**outputPath**|`string`|A excel path|Excel compares the result path.
